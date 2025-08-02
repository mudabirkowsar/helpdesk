
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const BASE_URL = 'https://mobile.faveodemo.com/mudabir/public';

export const LoginUser = async (email, password) => {
  try {
    const url = `${BASE_URL}/v3/api/login`;
    const response = await axios.post(url, null, {
      params: {
        email,
        password,
      },
    })

    const token = response.data.data.token;
    await AsyncStorage.setItem('auth_token', token);
    return response.data;

  } catch (error) {
    console.log(error)
    throw error;
  }
}


export const registerUser = async (firstName, lastName, email, password) => {
  const url = 'https://mobile.faveodemo.com/mudabir/public/v3/user/create/api';

  try {
    const response = await axios.post(url, null, {
      params: {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        scenario: 'create',
        category: 'requester',
        panel: 'client',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};


export const forgotPassword = async () => {
  try {
    const url = `${BASE_URL}/api/password/email`
    const response = await axios.post(url, null, {
      params: { email }
    })
    return response;
  } catch (error) {
    console.log("Error", error);
  }
}