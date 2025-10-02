import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// product-add (FormData expected)
export const add_product = createAsyncThunk(
  'product/add_product',
  async (formData, { rejectWithValue }) => {
    try {
      // formData should be FormData instance
      const { data } = await api.post('/product-add', formData, {
        withCredentials: true
        // do NOT set Content-Type header manually
      });

      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);


// product-update (FormData expected)
export const update_product = createAsyncThunk(
  'product/update_product',
  async (product, { fulfillWithValue, rejectWithValue }) => {
    try {
      // formData should be FormData instance
      const { data } = await api.post('/product-update', product, {
        withCredentials: true
        // do NOT set Content-Type header manually
      });
      console.log("update data", data);
      

      if (data?.error) return rejectWithValue(data);
       return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// products-get
export const get_products = createAsyncThunk(
  'product/get_products',
  async ({ page = 1, searchValue = '', perPage = 10 }, { rejectWithValue }) => {
       console.log(page, perPage, searchValue);
    try {
      const { data } = await api.get(`/product-get?page=${page}&&searchValue=${encodeURIComponent(searchValue)}&&perPage=${perPage}`, {
        withCredentials: true
      });
      console.log("data", data);
      
      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
// product-get
export const get_product = createAsyncThunk(
  'product/get_product',
  async (productId, { fulfillWithValue, rejectWithValue }) => {  
    console.log(productId);    
    try {
      const { data } = await api.get(`/single-product-get/${productId}`, {
        withCredentials: true
      });
      console.log("data", data);
      
      if (data?.error) return rejectWithValue(data);
       return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// delete thunk
export const delete_product = createAsyncThunk(
  'product/delete_product',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/product-delete/${id}`, { withCredentials: true });
      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const productReducer = createSlice({
  name: "product",
  initialState: {
    successmessage: "",
    errorMessage: "",
    loader: false,
    products: [],
    product:'',
    totalProduct: 0
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successmessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_product.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successmessage = "";
      })
      .addCase(add_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message || "Product added";
        if (action.payload?.product) {
          state.products.unshift(action.payload.product);
          state.totalProduct += 1;
        }
      })
      .addCase(add_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || "Failed";
      })
      .addCase(get_products.fulfilled, (state, action) => {
        state.totalProduct = action.payload?.totalProduct || 0;
        state.products = action.payload?.products || [];
      })
      .addCase(get_product.fulfilled, (state, action) => {
        state.product = action.payload?.product || [];
      });
  },
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;