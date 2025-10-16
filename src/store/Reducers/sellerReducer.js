import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Pending seller requests
export const get_seller_request = createAsyncThunk(
  'seller/get_seller_request',
  async ({ page, searchValue, perPage }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/request-seller-get?page=${page}&searchValue=${encodeURIComponent(searchValue || '')}&perPage=${perPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// Single seller
export const get_seller = createAsyncThunk(
  'seller/get_seller',
  async (sellerId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-seller/${sellerId}`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// Update status
export const seller_status_update = createAsyncThunk(
  'seller/seller_status_update',
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/seller-status-update`, info, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// Active sellers (protected; using cookie)
export const get_active_sellers = createAsyncThunk(
  'seller/get_active_sellers',
  async ({ perPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/get-sellers?page=${page}&searchValue=${encodeURIComponent(searchValue || '')}&perPage=${perPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: error.message || 'Network error' });
    }
  }
);

// Deactive sellers (protected; using cookie)
export const get_deactive_sellers = createAsyncThunk(
  'seller/get_deactive_sellers',
  async ({ perPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/get-deactive-sellers?page=${page}&searchValue=${encodeURIComponent(searchValue || '')}&perPage=${perPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error?.response?.data || { error: error.message || 'Network error' });
    }
  }
);

// create stripe connect account
export const create_stripe_connect_account = createAsyncThunk(
  'seller/create_stripe_connect_account',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get('/payment/create-stripe-connect-account', { withCredentials: true });
      // data.url এ রিডাইরেক্ট করুন
      window.location.href = data.url;
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: 'Network error' });
    }
  }
);
// create stripe connect account
export const active_stripe_connect_account = createAsyncThunk(
  'seller/active_stripe_connect_account',
  async (activeCode, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(`/payment/active-stripe-connect-account/${activeCode}`, {}, {
        withCredentials: true
      })
      return fulfillWithValue(data)
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const sellerReducer = createSlice({
  name: "seller",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    sellers: [],
    totalSellers: 0, // renamed to plural
    seller: null
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // pending seller requests
      .addCase(get_seller_request.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(get_seller_request.fulfilled, (state, action) => {
        state.loader = false;
        state.sellers = action.payload?.sellers || [];
        state.totalSellers = action.payload?.totalSeller || 0;
      })
      .addCase(get_seller_request.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })

      // single seller
      .addCase(get_seller.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_seller.fulfilled, (state, action) => {
        state.loader = false;
        state.seller = action.payload?.seller || null;
      })
      .addCase(get_seller.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })

      // update status
      .addCase(seller_status_update.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(seller_status_update.fulfilled, (state, action) => {
        state.loader = false;
        state.seller = action.payload?.seller || null;
        state.successMessage = action.payload?.message || 'Updated';
      })
      .addCase(seller_status_update.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })

      // active sellers
      .addCase(get_active_sellers.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_active_sellers.fulfilled, (state, action) => {
        state.loader = false;
        state.sellers = action.payload?.sellers || [];
        state.totalSellers = action.payload?.totalSeller || 0; // API returns totalSeller
      })
      .addCase(get_active_sellers.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })

      // deactive sellers
      .addCase(get_deactive_sellers.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_deactive_sellers.fulfilled, (state, action) => {
        state.loader = false;
        state.sellers = action.payload?.sellers || [];
        state.totalSellers = action.payload?.totalSeller || 0;
      })
      .addCase(get_deactive_sellers.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })
      .addCase(active_stripe_connect_account.pending, (state) => {
        state.loader = true
      })
      .addCase(active_stripe_connect_account.rejected, (state, action) => {
        state.loader = false
            state.errorMessage = action.payload.message
      })
      .addCase(active_stripe_connect_account.fulfilled, (state, action) => {
        state.loader = false
        state.successMessage = action.payload.message
      })
  },
});

export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;