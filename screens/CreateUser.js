import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EyeIcon from 'react-native-vector-icons/Feather';
import { registerUser } from '../helper/LocalStorage';
import { useTranslation } from 'react-i18next';

export default function CreateUser({ navigation }) {
    const { t } = useTranslation();

    // Form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hide error after 5 seconds
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            showErrorMsg("Please fill all fields");
            return;
        }

        if (!isValidEmail(email)) {
            showErrorMsg("Enter a valid email");
            return;
        }

        if (password !== confirmPassword) {
            showErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser(firstName, lastName, email, password);
            if (response.status === 200 || response.status === 201) {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            } else {
                showErrorMsg(response.data.message || "Signup failed");
            }
        } catch (error) {
            showErrorMsg(error?.response?.data?.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    const showErrorMsg = (msg) => {
        setErrMessage(msg);
        setShowError(true);
    };

    // Reusable Input Field
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

                {/* Password input */}
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <EyeIcon name={showPassword ? "eye" : "eye-off"} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                {/* Confirm Password input */}
                <View style={styles.inputContainer}>
                    <Icon name="lock-outline" size={22} color="#888" style={styles.icon} />
                    <TextInput
                        placeholder="Confirm Password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.input}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <EyeIcon name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                {/* Error Message */}
                {showError && (
                    <View style={styles.errContainer}>
                        <Text style={styles.errText}>⚠️ {errMessage}</Text>
                    </View>
                )}

                {/* Signup Button */}
                <TouchableOpacity style={styles.fullButton} onPress={handleSignup}>
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// 💅 Styles (same as before)
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f8fc' 
    },
    scrollContent: { 
        flexGrow: 1, 
        justifyContent: 'center', 
        padding: 25, 
        paddingBottom: 50 
    },
    heading: { 
        fontSize: 28, 
        fontWeight: '700', 
        color: '#222', textAlign: 'center', 
        marginBottom: 30 
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
        marginRight: 10 
    },
    input: { 
        flex: 1, 
        fontSize: 16, 
        color: '#333' 
    },
    fullButton: {
        backgroundColor: '#4a90e2', 
        paddingVertical: 16, 
        borderRadius: 12,
        alignItems: 'center', 
        elevation: 3
    },
    buttonText: { 
        color: '#fff', 
        fontWeight: '600', 
        fontSize: 16 
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
