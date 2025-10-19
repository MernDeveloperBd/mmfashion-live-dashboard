import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {base_url} from '../../utils/config'

// Async Thunks
export const admin_login = createAsyncThunk(
  'auth/admin_login',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${base_url}/api/admin-login`, info);
      localStorage.setItem('accessToken', data.token);
      if (data.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
      
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

export const seller_register = createAsyncThunk(
  'auth/seller_register',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(info);
      const { data } = await axios.post(`${base_url}/api/seller-register`, info);
      localStorage.setItem('accessToken', data.token);
      if (data.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || { error: 'Registration failed' });
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  'auth/profile_image_upload',
  async (formData, { fulfillWithValue, rejectWithValue,getState }) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.post(`${base_url}/api/profile-image-upload`, formData,config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const seller_login = createAsyncThunk(
  'auth/seller_login',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.post(`${base_url}/api/seller-login`, info);
      localStorage.setItem('accessToken', data.token);
      if (data.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async ({ navigate, role }, { rejectWithValue }) => {
    try {
      localStorage.removeItem('accessToken');
      navigate(role === 'admin' ? '/admin-login' : '/login', { replace: true });
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Logout failed' });
    }
  }
);

export const get_user_info = createAsyncThunk(
  'auth/get_user_info',
  async (_, { rejectWithValue, fulfillWithValue,getState }) => {
      const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/get-user`,config);
      if (data.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to load user' });
    }
  }
);

const returnRole = (token) => {
  if (token) {
    try {
      const decodeToken = jwtDecode(token);
      const expireTime = new Date(decodeToken.exp * 1000);
      if (new Date() > expireTime) {
        localStorage.removeItem('accessToken');
        return '';
      } else {
        return decodeToken.role;
      }
    } catch {
      localStorage.removeItem('accessToken');
      return '';
    }
  } else {
    return '';
  }
};

export const profile_info_add = createAsyncThunk(
  'auth/profile_info_add',
  async (info, { fulfillWithValue, rejectWithValue ,getState }) => {
      const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.post(`${base_url}/api/profile-info-add`, info, config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const change_password = createAsyncThunk(
  'auth/change_password',
  async ({ oldPassword, newPassword }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await axios.put(`${base_url}/api/change-password`, { oldPassword, newPassword });
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Change failed' });
    }
  }
);

export const profile_basic_update = createAsyncThunk(
  'auth/profile_basic_update',
  async (info, { fulfillWithValue, rejectWithValue,getState }) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.put(`${base_url}/api/profile-basic`, info, config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Update failed' });
    }
  }
);

// Slice
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: null,
    role: returnRole(localStorage.getItem('accessToken')),
    token: localStorage.getItem('accessToken'),
    userLoaded: false // NEW: user info fetched/computed flag
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(admin_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message;
        state.token = action.payload?.token;
        state.role = returnRole(action.payload?.token);
        state.userLoaded = false; // force refetch user
      })
      .addCase(admin_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Login failed";
      })

      // Seller login
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message;
        state.token = action.payload?.token;
        state.role = returnRole(action.payload?.token);
        state.userLoaded = false; // force refetch user
      })
      .addCase(seller_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Login failed";
      })

      // Seller register
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_register.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message;
        state.token = action.payload?.token;
        state.role = returnRole(action.payload?.token);
        state.userLoaded = false; // force refetch user
      })
      .addCase(seller_register.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Resistration failed";
      })

      // Get user info
      .addCase(get_user_info.pending, (state) => {
        state.loader = true;
        state.userLoaded = false;
      })
      .addCase(get_user_info.fulfilled, (state, action) => {
        state.loader = false;
        state.userInfo = action.payload.userInfo || null;
        state.userLoaded = true;
      })
      .addCase(get_user_info.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Failed to load user";
        state.userLoaded = true; // prevent guard dead-loop
      })

      // Profile image upload (merge)
      .addCase(profile_image_upload.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_image_upload.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message;
        if (action.payload?.image) {
          state.userInfo = {
            ...(state.userInfo || {}),
            image: action.payload.image
          };
        }
      })
      .addCase(profile_image_upload.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || 'Upload failed';
      })

      // Business info add/update (merge)
      .addCase(profile_info_add.pending, (state) => {
        state.loader = true;
      })
      .addCase(profile_info_add.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message;
        const incoming = action.payload?.userInfo || {};
        state.userInfo = {
          ...(state.userInfo || {}),
          ...incoming,
          shopInfo: {
            ...((state.userInfo && state.userInfo.shopInfo) || {}),
            ...(incoming.shopInfo || {})
          }
        };
      })
      .addCase(profile_info_add.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || 'Update failed';
      })

      // Change password
      .addCase(change_password.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
      })
      .addCase(change_password.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Password changed!';
        localStorage.removeItem('accessToken');
        state.token = null;
        state.userInfo = null;
        state.role = '';
        state.userLoaded = true;
      })
      .addCase(change_password.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || 'Change failed';
      })

      // Basic profile update (merge)
      .addCase(profile_basic_update.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
      })
      .addCase(profile_basic_update.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Profile updated';
        const incoming = action.payload?.userInfo || {};
        state.userInfo = {
          ...(state.userInfo || {}),
          ...incoming
        };
      })
      .addCase(profile_basic_update.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || 'Update failed';
      });
  },
});

export const { messageClear } = authReducer.actions;
export default authReducer.reducer;