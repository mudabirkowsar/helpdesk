import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
import { LoginUser } from '../helper/LocalStorage';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }) {
    const { t, i18n } = useTranslation();

    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showError, setShowError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Supported languages
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

    // Simple email validation
    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Handle Login button click
    const handleLogin = async () => {
        // Basic validations
        if (!email || !password) {
            return showErrorMessage(t("login.error-empty"));
        }

        if (!isValidEmail(email)) {
            return showErrorMessage("Enter a valid email");
        }

        setLoading(true);

        try {
            await LoginUser(email, password);
            navigation.reset({ index: 0, routes: [{ name: 'Drawer' }] });
        } catch (error) {
            showErrorMessage(t("login.error-invalid"));
        } finally {
            setLoading(false);
        }
    };

    const showErrorMessage = (msg) => {
        setErrorMsg(msg);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
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
            {/* Language Selector Button */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.languageButton}>
                <Text style={styles.languageButtonText}>🌐</Text>
            </TouchableOpacity>

            {/* Heading */}
            <Text style={styles.heading}>{t("login.title")} 👋</Text>
            <Text style={styles.subheading}>{t("login.subtitle")}</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Icon name="email" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder={t("login.email")}
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Icon name="lock" size={22} color="#888" style={styles.icon} />
                <TextInput
                    placeholder={t("login.password")}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <EyeIcon name={showPassword ? 'eye' : 'eye-off'} size={20} color="#888" />
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {showError && (
                <View style={styles.errContainer}>
                    <Text style={styles.errText}>⚠️ {errorMsg}</Text>
                </View>
            )}

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={styles.forgotText}>{t("login.forgot")}</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.buttonText}>{t("login.button")}</Text>
                )}
            </TouchableOpacity>

            {/* Signup Redirect */}
            <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Signup' }] })}>
                <Text style={styles.signupText}>
                    {t("login.no-account")} <Text style={styles.signupLink}>{t("login.signup")}</Text>
                </Text>
            </TouchableOpacity>

            {/* Language Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>🌐 Select Language</Text>
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
                            <Text style={styles.cancelText}>✖ Cancel</Text>
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
        paddingHorizontal: 25,
        justifyContent: 'center',
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
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#222',
        textAlign: 'center',
        marginBottom: 8,
    },
    subheading: {
        fontSize: 16,
        color: '#666',
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
    forgotText: {
        textAlign: 'right',
        color: '#4a90e2',
        marginBottom: 25,
        fontSize: 14,
    },
    button: {
        backgroundColor: '#4a90e2',
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
    signupText: {
        textAlign: 'center',
        marginTop: 25,
        fontSize: 14,
        color: '#333',
    },
    signupLink: {
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
        fontWeight: '500' 
    },
});
