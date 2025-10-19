import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { base_url } from '../../utils/config';
import axios from 'axios';

export const get_users = createAsyncThunk(
  'user/get_users',
  async ({ perPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
      const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(
        `${base_url}/api/get-users?page=${page}&perPage=${perPage}&searchValue=${encodeURIComponent(searchValue || '')}`,
        config
      );
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);



const userReducer = createSlice({
  name: 'user',
  initialState: {
    users: [],
    totalUsers: 0,
    loader: false,
    errorMessage: '',
  },
  reducers: {
    clearUserMessage: (state) => {
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_users.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
      })
      .addCase(get_users.fulfilled, (state, action) => {
        state.loader = false;
        state.users = action.payload?.users || [];
        state.totalUsers = action.payload?.totalUser || 0;
      })
      .addCase(get_users.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      });
  },
});

export const { clearUserMessage } = userReducer.actions;
export default userReducer.reducer;