import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async(info)=>{
        console.log(info);
        
        try {
            const {data} = await axios.post('/admin-login', info, {
                withCredentials:true
            });
            console.log(data);
            
        } catch (error) {
            console.log(error);
            
        }
    }
)
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successmessage: '',
    errorMessage: '',
    loader: false,
    userInfo: ''
  },
  reducers: {}
});

export default authReducer.reducer;