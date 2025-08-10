import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://mobile.faveodemo.com/mudabir/public';

// Fetch all users (with optional search query)
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ token, page = 1, searchQuery = '' }, { rejectWithValue }) => {
    try {
      const params = {
        'roles[0]': 'user',
        'roles[1]': 'agent',
        'sort-order': 'desc',
        limit: 10,
        page,
      };

      if (searchQuery.trim()) {
        params['search-query'] = searchQuery.trim();
      }

      const response = await axios.get(`${BASE_URL}/v3/user-export-data`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      return {
        users: response.data?.data?.data || [],
        page,
        searchQuery,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/v3/api/get-user/view/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data?.data || null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    list: [],
    selectedUser: null,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    searchQuery: '',
  },
  reducers: {
    resetUsers: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { users, page, searchQuery } = action.payload;
        state.page = page;
        state.searchQuery = searchQuery;

        if (page === 1) {
          state.list = users;
        } else {
          state.list = [...state.list, ...users];
        }

        state.hasMore = users.length === 10;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single User
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload ? [action.payload] : [];
        state.hasMore = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.list = [];
      });
  },
});

export const { resetUsers } = userSlice.actions;
export default userSlice.reducer;
