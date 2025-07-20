import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddUserInCrud({ navigation }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [smallDescription, setSmallDescription] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [updatedUserr, setUpdatedUserr] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    (async () => {
      const storedUsers = await loadData('users');
      if (storedUsers) setUpdatedUserr(storedUsers);
    })();
  }, []);

  async function saveUser(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Error in adding user', error);
      Alert.alert('Error', 'Failed to save user');
    }
  }

  async function loadData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Error loading data', e);
      return null;
    }
  }

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleSubmit = () => {
    if (!name || !username || !imageLink || !backgroundImage || !smallDescription) {
      setShowError(true);
      return;
    }

    const followers = Math.floor(Math.random() * 1500) + 1;
    const following = Math.floor(Math.random() * 100) + 1;

    const newUser = {
      id: Date.now(),
      name,
      username,
      imageLink,
      backgroundImage,
      followers,
      following,
      smallDescription,
    };

    setUpdatedUserr((prev) => [...prev, newUser]);
    setModalVisible(true);
  };

  const handleConfirmAdd = async () => {
    await saveUser('users', updatedUserr);
    setModalVisible(false);
    setName('');
    setUsername('');
    setImageLink('');
    setBackgroundImage('');
    setSmallDescription('');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mainContainer}
    >
      {showError && (
        <View style={styles.errContainer}>
          <Text style={styles.errText}>⚠️ Please fill in all fields</Text>
        </View>
      )}

      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add User</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to add{' '}
              <Text style={{ fontWeight: 'bold' }}>{name}</Text>?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#adb5bd' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#51cf66' }]}
                onPress={handleConfirmAdd}
              >
                <Text style={[styles.modalBtnText, { color: '#000' }]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Text style={styles.UserDetailText}>Add New User</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.TextBoxView}>
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholderTextColor="#999"
          />
          <TextInput
            placeholder="Username"
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Profile Image Link"
            style={styles.input}
            onChangeText={setImageLink}
            value={imageLink}
            placeholderTextColor="#999"
            multiline
          />
          <TextInput
            placeholder="Background Image Link"
            style={styles.input}
            onChangeText={setBackgroundImage}
            value={backgroundImage}
            placeholderTextColor="#999"
            multiline
          />
          <TextInput
            placeholder="Short Description"
            style={[styles.input, { height: 100 }]}
            onChangeText={setSmallDescription}
            value={smallDescription}
            placeholderTextColor="#999"
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.btnsView}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.textBtn}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafc',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  UserDetailText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2f3640',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  TextBoxView: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  btnsView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
  },
  submitButton: {
    width: '90%',
    backgroundColor: '#20c997',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textBtn: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errContainer: {
    backgroundColor: '#fff0f0',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  errText: {
    color: '#d90429',
    fontSize: 15,
    fontWeight: '500',
  },
});
