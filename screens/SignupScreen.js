import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
    Modal, FlatList, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { registerUser } from '../helper/LocalStorage';

export default function SignupScreen({ navigation }) {
    const { t, i18n } = useTranslation();

    // Form states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const handleSignup = async () => {
        // Basic checks
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showErrorMessage(t("signup.error-fill"));
            return;
        }

        if (!isValidEmail(email)) {
            showErrorMessage(t("signup.error-email"));
            return;
        }

        if (password !== confirmPassword) {
            showErrorMessage(t("signup.error-match"));
            return;
        }

        setLoading(true);
        try {
            const response = await registerUser(firstName, lastName, email, password);
            if (response.status === 200 || response.status === 201) {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } else {
                showErrorMessage(response.data.message || t("signup.error-failed"));
            }
        } catch (err) {
            showErrorMessage(t("signup.error-network"));
        } finally {
            setLoading(false);
        }
    };

    const showErrorMessage = (message) => {
        setErrorMessage(message);
        setShowError(true);
    };

    const selectLanguage = (code) => {
        i18n.changeLanguage(code);
        setModalVisible(false);
    };

    const renderInput = (icon, placeholder, value, onChangeText, secure = false, show = false, toggle = () => { }) => (
        <View style={styles.inputContainer}>
            <Icon name={icon} size={22} color="#888" />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secure && !show}
                placeholderTextColor="#aaa"
            />
            {secure && (
                <TouchableOpacity onPress={toggle}>
                    <EyeIcon name={show ? 'eye' : 'eye-off'} size={20} color="#888" />
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Language button */}
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.languageButton}>
                    <Text style={styles.languageButtonText}>🌐</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>{t("signup.title")}</Text>

                {renderInput('person', t("signup.first-name"), firstName, setFirstName)}
                {renderInput('person-outline', t("signup.last-name"), lastName, setLastName)}
                {renderInput('email', t("signup.email"), email, setEmail)}

                {renderInput('lock', t("signup.password"), password, setPassword, true, showPassword, () => setShowPassword(!showPassword))}
                {renderInput('lock-outline', t("signup.confirm-password"), confirmPassword, setConfirmPassword, true, showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}

                {showError && <Text style={styles.errorText}>⚠️ {errorMessage}</Text>}

                <TouchableOpacity style={styles.fullButton} onPress={handleSignup}>
                    {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.buttonText}>{t("signup.button")}</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>{t("signup.have-account")} <Text style={styles.loginLink}>{t("signup.login")}</Text></Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Language Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>🌐 {t("signup.select-language")}</Text>
                        <FlatList
                            data={LANGUAGES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.languageItem, i18n.language === item.code && styles.selectedLanguage]}
                                    onPress={() => selectLanguage(item.code)}
                                >
                                    <Text style={[styles.languageTextItem, i18n.language === item.code && styles.selectedLanguageText]}>
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

// Basic styling (unchanged for simplicity)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f8fc' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 25 },
    heading: { fontSize: 28, fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: 30 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
        paddingHorizontal: 15, marginBottom: 20, height: 55, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    },
    input: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10 },
    fullButton: {
        backgroundColor: '#4a90e2', paddingVertical: 16, borderRadius: 12,
        alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    loginText: { textAlign: 'center', marginTop: 20, fontSize: 15, color: '#666' },
    loginLink: { color: '#4a90e2', fontWeight: '600' },
    errorText: { backgroundColor: '#fdecea', color: '#b71c1c', padding: 10, borderRadius: 8, marginBottom: 10 },
    languageButton: { position: 'absolute', top: 45, right: 20, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 4 },
    languageButtonText: { fontSize: 20 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25 },
    modalTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
    languageItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#f0f0f0', marginBottom: 10 },
    languageTextItem: { fontSize: 16, color: '#333' },
    selectedLanguage: { backgroundColor: '#4a90e2' },
    selectedLanguageText: { color: '#fff', fontWeight: 'bold' },
    cancelButton: { marginTop: 10, alignSelf: 'center' },
    cancelText: { fontSize: 15, color: '#888', fontWeight: '600' },
});
