import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import api from "../../api/api";

// Async Thunk
// admin login
export const admin_login = createAsyncThunk(
  'auth/admin_login',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/admin-login', info, {
        withCredentials: true
      });
      console.log(data);

      localStorage.setItem('accessToken', data.token)

      // এরর চেক
      if (data.error) {
        return rejectWithValue(data);
      }

      return fulfillWithValue(data);

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Seller register
export const seller_register = createAsyncThunk(
  'auth/seller_register',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log("seller_register", info);

      const { data } = await api.post('/seller-register', info, {
        withCredentials: true
      });
      localStorage.setItem('accessToken', data.token)
      // এরর চেক
      if (data.error) {
        return rejectWithValue(data);
      }

      return fulfillWithValue(data);

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const profile_image_upload = createAsyncThunk(
  'auth/profile_image_upload',
  async (formData, {fulfillWithValue, rejectWithValue }) => {
    try {
      // formData should be a FormData instance containing key 'image'
      const { data } = await api.post('/profile-image-upload', formData, {
        withCredentials: true
      });
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// admin login
export const seller_login = createAsyncThunk(
  'auth/seller_login',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/seller-login', info, {
        withCredentials: true
      });
      console.log(data);

      localStorage.setItem('accessToken', data.token)

      // এরর চেক
      if (data.error) {
        return rejectWithValue(data);
      }

      return fulfillWithValue(data);

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get user infor
export const get_user_info = createAsyncThunk(
  'auth/get_user_info',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/get-user', {
        withCredentials: true
      });
      // এরর চেক
      if (data.error) {
        return rejectWithValue(data);
      }

      return fulfillWithValue(data);

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const returnRole = (token) => {
  if (token) {
    const decodeToken = jwtDecode(token)
    const expireTime = new Date(decodeToken.exp * 1000)
    console.log(decodeToken);
    console.log(expireTime);
    if (new Date() > expireTime) {
      localStorage.removeItem('accessToken')
      return ''
    }else{
      return decodeToken.role
    }
  } else {
    return ''
  }
}

//business info
export const profile_info_add = createAsyncThunk(
  'auth/profile_info_add',
  async (info, {fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await api.post('/profile-info-add', info, {
        withCredentials: true
      });
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
// Slice
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successmessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
    role: returnRole(localStorage.getItem('accessToken')),
    token: localStorage.getItem('accessToken')
  },
  reducers: {
    // আপনার synchronous reducers (যদি থাকে)
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successmessage = "";
    },
  },
  extraReducers: (builder) => { // ✅ Builder Callback
    builder
      .addCase(admin_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(admin_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message;
        state.token=action.payload?.token;
        state.role=returnRole(action.payload?.token)        
      })
      .addCase(admin_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Login failed";
      })
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message;
         state.token=action.payload?.token;
        state.role=returnRole(action.payload?.token)
      })
      .addCase(seller_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Login failed"; // ✅ Error হ্যান্ডল
      })
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_register.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message;
         state.token=action.payload?.token;
        state.role=returnRole(action.payload?.token)
        // state.userInfo = action.payload.user; 
      })
      .addCase(seller_register.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Resistration failed"; // ✅ Error হ্যান্ডল
      })
      .addCase(get_user_info.fulfilled, (state, action) => {
        state.loader = false;
        state.userInfo = action.payload.userInfo; // ✅ API থেকে আসা user ডেটা
      })
      .addCase(profile_image_upload.pending, (state) => {
        state.loader = true;
      }) 
       .addCase(profile_image_upload.fulfilled, (state, action) => {
        state.loader = false;
        // state.userInfo = action.payload.userInfo;
         state.successmessage = action.payload?.message;
      }) 
       .addCase(profile_info_add.pending, (state) => {
        state.loader = true;
      }) 
       .addCase(profile_info_add.fulfilled, (state, action) => {
        state.loader = false;
        state.userInfo = action.payload.userInfo;
         state.successmessage = action.payload?.message;
      }) 

  },
});
export const { messageClear } = authReducer.actions;
export default authReducer.reducer;