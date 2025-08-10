import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL
const BASE_URL = 'https://mobile.faveodemo.com/mudabir/public';

// Async Thunks
export const createAccount = createAsyncThunk(
  'auth/createAccount',
  async (payload, { rejectWithValue }) => {
    try {
      const { first_name, last_name, email } = payload;
      const response = await axios.post(
        `${BASE_URL}/v3/user/create/api`,
        null,
        {
          params: {
            first_name,
            last_name,
            email,
            scenario: 'create',
            category: 'requester',
            panel: 'client',
          },
        }
      );

      // Store token if returned
      if (response.data.data.token) {
        await AsyncStorage.setItem('auth_token',response.data.data.token);
      }

      console.log("Token: ")
      console.log(response.data.data.token)


      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/v3/api/login`, null, {
        params: { email, password },
      });

      // Store token in AsyncStorage
      if (response.data.data.token) {
        await AsyncStorage.setItem('auth_token',response.data.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/password/email`, null, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('auth_token'); // Remove token from storage
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Account
      .addCase(createAccount.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.token || null;
        state.user = action.payload?.user || null;
      })
      .addCase(createAccount.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login User
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(forgotPassword.fulfilled, (state) => { state.loading = false; })
      .addCase(forgotPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
