import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";


export const get_seller_request = createAsyncThunk(
  'seller/get_seller_request',
  async ({ page, searchValue, perPage }, { rejectWithValue, fulfillWithValue }) => {
    try {    
      const { data } = await api.get(`/request-seller-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,  {
        withCredentials: true
      });      
      // if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_seller = createAsyncThunk(
  'seller/get_seller',
  async (sellerId , { rejectWithValue, fulfillWithValue }) => {
    try {    
      const { data } = await api.get(`/get-seller/${sellerId}`,  {
        withCredentials: true
      });
      
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
export const seller_status_update = createAsyncThunk(
  'seller/seller_status_update',
  async (info , { rejectWithValue, fulfillWithValue }) => {
    try {    
      const { data } = await api.post(`/seller-status-update`, info, {
        withCredentials: true
      });
      
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers',
    async ({ perPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/get-sellers?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers',
    async ({ perPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`, config)
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
    totalSeller: 0,
    seller:''
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_seller_request.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(get_seller_request.fulfilled, (state, action) => {
        state.sellers = action.payload?.sellers;
        state.totalSeller = action.payload?.totalSeller;       
        
      })
      .addCase(get_seller_request.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })
      .addCase(get_seller.fulfilled, (state, action) => {
        state.seller = action.payload?.seller;  
      })
      .addCase(seller_status_update.fulfilled, (state, action) => {
        state.seller = action.payload?.seller;  
        state.successMessage = action.payload?.message;  
      })
      .addCase(get_active_sellers.fulfilled, (state, action) => {
        state.sellers = action.payload.sellers
            state.totalSeller = action.payload.totalSeller 
      })       
      .addCase(get_deactive_sellers.fulfilled, (state, action) => {
        state.sellers = action.payload.sellers
            state.totalSeller = action.payload.totalSeller 
      })       
      
       
  },
});

export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;