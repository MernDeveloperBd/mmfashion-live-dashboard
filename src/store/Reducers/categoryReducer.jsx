import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const categoryAdd = createAsyncThunk(
  'category/categoryAdd',
  async ({ name, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const { data } = await api.post('/category-add', formData, {
        withCredentials: true
      });

      if (data?.error) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
export const get_category = createAsyncThunk(
  'category/get_category',
  async ({ page, searchValue, perPage }, { rejectWithValue, fulfillWithValue }) => {
    try {    
      const { data } = await api.get(`/category-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`,  {
        withCredentials: true
      });
      console.log(data);
      
      // if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const categoryReducer = createSlice({
  name: "category",
  initialState: {
    successmessage: "",
    errorMessage: "",
    loader: false,
    categories: [],
    totalCategory: 0
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successmessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryAdd.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successmessage = "";
      })
      .addCase(categoryAdd.fulfilled, (state, action) => {
        state.loader = false;
        state.successmessage = action.payload?.message || 'Category added';
        if (action.payload?.category) {
          state.categories.unshift(action.payload.category);
        }
      })
      .addCase(categoryAdd.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })
       .addCase(get_category.fulfilled, (state, action) => {
        state.totalCategory = action.payload?.totalCategory;
        state.categories = action.payload?.categories;
        
      })
  },
});

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;