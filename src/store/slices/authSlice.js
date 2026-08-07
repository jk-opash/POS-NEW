import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/api/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const performLogin = createAsyncThunk(
  'auth/performLogin',
  async ({ email, password, loginType }, { rejectWithValue }) => {
    try {
      const endpoint = loginType === 'admin' ? '/auth/login/admin' : '/auth/login/team';
      const response = await authApi.login(endpoint, { email, password });
      
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        const userData = response.data.user || { email, role: loginType };
        
        const decoded = decodeJWT(response.data.token);
        if (decoded?.branchId) {
          userData.branch_id = decoded.branchId;
        }

        if (userData.branch_id) {
          await AsyncStorage.setItem('branch_id', userData.branch_id);
        }

        return { token: response.data.token, user: userData, loginType };
      }
      return rejectWithValue('Invalid response from server.');
    } catch (err) {
      return rejectWithValue(err?.response?.data?.error || err.message || 'Invalid credentials.');
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
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      AsyncStorage.removeItem('auth_token');
      AsyncStorage.removeItem('branch_id');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(performLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(performLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
