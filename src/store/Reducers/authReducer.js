import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async Thunk
// admin login
export const admin_login = createAsyncThunk(
 'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/admin-login', info, {
                withCredentials: true });
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

// admin login
export const seller_register = createAsyncThunk(
 'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
          console.log("seller_register",info);
          
            const { data } = await api.post('/seller-register', info, {
                withCredentials: true });                
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

// admin login
export const seller_login = createAsyncThunk(
 'auth/seller_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-login', info, {
                withCredentials: true });
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

// Slice
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successmessage: "",
    errorMessage: "",
    loader: false,
    userInfo: "",
  },
  reducers: {
    // আপনার synchronous reducers (যদি থাকে)
    messageClear: (state) => {
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
        state.userInfo = action.payload.user; // ✅ API থেকে আসা user ডেটা
      })
      .addCase(admin_login.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Login failed"; // ✅ Error হ্যান্ডল
      })
      .addCase(seller_login.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_login.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message;
        state.userInfo = action.payload.user; // ✅ API থেকে আসা user ডেটা
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
        state.userInfo = action.payload.user; // ✅ API থেকে আসা user ডেটা
      })
      .addCase(seller_register.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || "Resistration failed"; // ✅ Error হ্যান্ডল
      })
  
  },
});
export const {messageClear} = authReducer.actions;
export default authReducer.reducer;