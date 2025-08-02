import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
    Platform, ScrollView, Modal, FlatList,ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
import { registerUser } from '../helper/LocalStorage';
import { useTranslation } from 'react-i18next';

export default function CreateUser({ navigation }) {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false)


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

    setLoading(true);

    try {
        const response = await registerUser(firstName, lastName, email, password);

        if (response.status === 200 || response.status === 201) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else {
            setErrMessage(response.data.message || t("signup.error-failed"));
            setShowError(true);
        }
    } catch (error) {
        if (error.response) {
            setErrMessage(error.response.data.message || t("signup.error-failed"));
        } else {
            setErrMessage(t("signup.error-network"));
        }
        setShowError(true);
    } finally {
        setLoading(false);
    }
};

const {t} = useTranslation();


    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* <Text style={styles.heading}>{t("signup.title")}</Text> */}
                <Text style={styles.heading} >Create New User</Text>

                {[
                    {
                        icon: "person", placeholder: t("signup.first-name"),
                        value: firstName, onChangeText: setFirstName
                    },
                    {
                        icon: "person-outline", placeholder: t("signup.last-name"),
                        value: lastName, onChangeText: setLastName
                    },
                    {
                        icon: "email", placeholder: t("signup.email"), keyboardType: "email-address",
                        value: email, onChangeText: setEmail
                    }
                ].map((item, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <Icon name={item.icon} size={22} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={item.placeholder}
                            value={item.value}
                            onChangeText={item.onChangeText}
                            keyboardType={item.keyboardType || 'default'}
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                    </View>
                ))}

                {/* Password */}
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
                    {
                        loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>{t("signup.button")}</Text>
                        )
                    }
                </TouchableOpacity>
            </ScrollView>

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
