import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Modal,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function SignupScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const { t, i18n } = useTranslation();

    const LANGUAGES = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'fr', label: 'Français' },
        { code: 'ar', label: 'العربية' },
        { code: 'it', label: 'Italiano' },
        { code: 'ja', label: '日本語' },
        { code: 'ru', label: 'Русский' },
        { code: 'sv', label: 'Svenska' },
        { code: 'ur', label: 'اردو' },
    ];

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setErrMessage(t("signup.error-fill"));
            setShowError(true);
            return;
        }

        if (password !== confirmPassword) {
            setErrMessage(t("signup.error-match"));
            setShowError(true);
            return;
        }

        try {
            const url = 'https://mobile.faveodemo.com/mudabir/public/v3/user/create/api';

            const response = await axios.post(url, null, {
                params: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    scenario: 'create',
                    category: 'requester',
                    panel: 'client',
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } else {
                setErrMessage(response.data.message?.toString() || t("signup.error-failed"));
                setShowError(true);
            }
        } catch (error) {
            if (error.response) {
                setErrMessage(error.response.data.message?.toString() || t("signup.error-failed"));
            } else {
                setErrMessage(t("signup.error-network"));
            }
            setShowError(true);
        }
    };

    const selectLanguage = (code) => {
        i18n.changeLanguage(code);
        setModalVisible(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.languageButton}>
                    <Text style={styles.languageButtonText}>🌐</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>{t("signup.title")}</Text>

                <View style={styles.inputContainer}>
                    <Icon name="person" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder={t("signup.first-name")}
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor="#aaa"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="person-outline" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder={t("signup.last-name")}
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholderTextColor="#aaa"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder={t("signup.email")}
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize='none'
                        placeholderTextColor="#aaa"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder={t("signup.password")}
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <EyeIcon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder={t("signup.confirm-password")}
                        style={styles.input}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <EyeIcon name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                {showError && (
                    <View style={styles.errContainer}>
                        <Text style={styles.errText}>⚠️ {errMessage}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.fullButton} onPress={handleSignup}>
                    <Text style={styles.buttonText}>{t("signup.button")}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>
                        {t("signup.have-account")} <Text style={styles.loginLink}>{t("signup.login")}</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Language Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>🌐 {t("signup.select-language")}</Text>

                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.languageItem,
                                        i18n.language === item.code && styles.selectedLanguage,
                                    ]}
                                    onPress={() => selectLanguage(item.code)}
                                >
                                    <Text
                                        style={[
                                            styles.languageTextItem,
                                            i18n.language === item.code && styles.selectedLanguageText,
                                        ]}
                                    >
                                        {item.label} ({item.code.toUpperCase()})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>✖ {t("signup.cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f8fc',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingBottom: 50,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 55,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    fullButton: {
        backgroundColor: '#4a90e2',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loginText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 15,
        color: '#666',
    },
    loginLink: {
        color: '#4a90e2',
        fontWeight: '600',
    },
    errContainer: {
        backgroundColor: '#fdecea',
        padding: 12,
        marginVertical: 10,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#f44336',
    },
    errText: {
        color: '#b71c1c',
        fontSize: 15,
        fontWeight: '500',
    },
    languageButton: {
        position: 'absolute',
        top: 45,
        right: 20,
        zIndex: 999,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 20,
        elevation: 4,
    },
    languageButtonText: {
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        paddingBottom: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
        color: '#2c3e50',
    },
    languageItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    languageTextItem: {
        fontSize: 16,
        color: '#333',
    },
    selectedLanguage: {
        backgroundColor: '#4a90e2',
    },
    selectedLanguageText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 10,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    cancelText: {
        fontSize: 15,
        color: '#888',
        fontWeight: '600',
    },
});
