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
// update_product (FormData expected)
export const update_product = createAsyncThunk('product/update_product', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/product-update', formData, {
      withCredentials: true
    });
    if (data?.error) return rejectWithValue(data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
  }
});


// products-get
export const get_products = createAsyncThunk(
  'product/get_products',
  async ({ page = 1, searchValue = '', perPage = 10 }, { rejectWithValue }) => {
    
    try {
      const { data } = await api.get(`/product-get?page=${page}&&searchValue=${encodeURIComponent(searchValue)}&&perPage=${perPage}`, {
        withCredentials: true
      });
      

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
   
    try {
      const { data } = await api.get(`/single-product-get/${productId}`, {
        withCredentials: true
      });
      

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


export const get_all_products = createAsyncThunk(
  'product/get_all_products',
  async ({ page = 1, searchValue = '', perPage = 10, discount = false }, { rejectWithValue }) => {  // ✅ discount param
    try {
      const { data } = await api.get(
        `/product-get-all?page=${page}&perPage=${perPage}&searchValue=${encodeURIComponent(searchValue)}&discount=${discount}`,  // ✅ Add discount=true
        { withCredentials: true }
      );
      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export const productReducer = createSlice({
  name: "product",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    products: [],
    product: '',
    totalProduct: 0,
    allProducts: [],
    allTotalProduct: 0
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_product.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(add_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || "Product added";
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
      })
      // update_product
      .addCase(update_product.pending, (state) => { state.loader = true; })
      .addCase(update_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Product updated';
        const p = action.payload?.product;
        if (p) {
          const idx = state.products.findIndex(x => x._id === p._id);
          if (idx > -1) state.products[idx] = p;
          else state.products.unshift(p);
        }
      })
      .addCase(update_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message;
      })
      .addCase(get_all_products.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(get_all_products.fulfilled, (state, action) => {
        state.loader = false;
        state.allProducts = action.payload?.products || [];
        state.allTotalProduct = action.payload?.totalProduct || 0;
      })
      .addCase(get_all_products.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed to load all products';
      })
       .addCase(delete_product.pending, (state) => {
    state.loader = true;
    state.errorMessage = "";
    state.successMessage = "";
  })
  .addCase(delete_product.fulfilled, (state, action) => {
    state.loader = false;
    state.successMessage = action.payload?.message || 'Product deleted successfully';
    // ✅ Local update: Remove from list & decrement total
    const deletedId = action.meta.arg;  // id from thunk arg
    state.products = state.products.filter(p => p._id !== deletedId);
    state.totalProduct = Math.max(0, state.totalProduct - 1);  // Avoid negative
  })
  .addCase(delete_product.rejected, (state, action) => {
    state.loader = false;
    state.errorMessage = action.payload?.error || action.error?.message || 'Delete failed';
  })
  },
});

export const { messageClear } = productReducer.actions;
export default productReducer.reducer;