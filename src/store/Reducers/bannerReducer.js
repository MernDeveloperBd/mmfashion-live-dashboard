import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import axios from "axios";
import { base_url } from "../../utils/config";

export const add_banner = createAsyncThunk(
  'banner/add_banner',
  async (info, { fulfillWithValue, rejectWithValue,getState}) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.post(`${base_url}/api/banner/add`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const update_banner = createAsyncThunk(
  'banner/update_banner',
  async ({ bannerId, info }, { fulfillWithValue, rejectWithValue,getState }) => {
    const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.put(`${base_url}/api/banner/update/${bannerId}`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const get_banner = createAsyncThunk(
  'banner/get_banner',
  async (productId, { fulfillWithValue, rejectWithValue ,getState}) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/banner/get/${productId}`,config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const get_banners = createAsyncThunk(
  'banner/get_banners',
  async (_, { fulfillWithValue, rejectWithValue,getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await api.get(`${base_url}/api/banner/get-all`,config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const bannerReducer = createSlice({
  name: "banner",
  initialState: {
    successMessage: '',
    errorMessage: '',
    loader: false,
    banners: [],
    banner: null
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_banner.pending, (state) => { state.loader = true; })
      .addCase(add_banner.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.banner = payload.banner || null;
        state.successMessage = payload.message || 'Added';
      })
      .addCase(add_banner.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed';
      })

      .addCase(get_banner.fulfilled, (state, { payload }) => {
        state.banner = payload?.banner || null;
      })
      .addCase(get_banner.rejected, (state, { payload }) => {
        state.banner = null;
        state.errorMessage = payload?.message || '';
      })

      .addCase(update_banner.pending, (state) => { state.loader = true; })
      .addCase(update_banner.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.banner = payload?.banner || null;
        state.successMessage = payload?.message || 'Updated';
      })
      .addCase(update_banner.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || 'Failed';
      })

      .addCase(get_banners.fulfilled, (state, { payload }) => {
        state.banners = payload?.banners || [];
      });
  },
});

export const { messageClear } = bannerReducer.actions;
export default bannerReducer.reducer;