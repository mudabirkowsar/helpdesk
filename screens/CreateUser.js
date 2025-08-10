import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { createAccount } from '../services/redux/slices/authSlice';

export default function CreateUser({ navigation }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showErrorMsg = (msg) => {
        setErrMessage(msg);
        setShowError(true);
    };

    const handleSignup = async () => {
        if (!firstName || !lastName || !email) {
            return showErrorMsg("Please fill all fields");
        }
        if (!isValidEmail(email)) {
            return showErrorMsg("Enter a valid email");
        }

        setLoading(true);
        try {
            const data = await dispatch(
                createAccount({
                    first_name: firstName,
                    last_name: lastName,
                    email
                })
            ).unwrap();

            navigation.navigate("Drawer");

            if (data?.token) {
                await AsyncStorage.setItem('auth_token', data.token);
            }
        } catch (err) {
            showErrorMsg(err?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (iconName, placeholder, value, onChangeText, keyboardType = "default") => (
        <View style={styles.inputContainer}>
            <Icon name={iconName} size={22} color="#888" style={styles.icon} />
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize="none"
                style={styles.input}
                placeholderTextColor="#aaa"
            />
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.heading}>Create New User</Text>

                {renderInput("person", "First Name", firstName, setFirstName)}
                {renderInput("person-outline", "Last Name", lastName, setLastName)}
                {renderInput("email", "Email", email, setEmail, "email-address")}

                {showError && (
                    <View style={styles.errContainer}>
                        <Text style={styles.errText}>⚠️ {errMessage}</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.fullButton} onPress={handleSignup}>
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Create User</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f8fc' },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 25, paddingBottom: 50 },
    heading: { fontSize: 28, fontWeight: '700', color: '#222', textAlign: 'center', marginBottom: 30 },
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
    icon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: '#333' },
    fullButton: {
        backgroundColor: '#4a90e2',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    errContainer: {
        backgroundColor: '#fdecea',
        padding: 12,
        marginVertical: 10,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#f44336',
    },
    errText: { color: '#b71c1c', fontSize: 15, fontWeight: '500' },
});
