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
      
      
      // if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const categoryUpdate = createAsyncThunk(
  'category/categoryUpdate',
  async ({ id, name, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (typeof name !== 'undefined') formData.append("name", name);
      if (image) formData.append("image", image);

      const { data } = await api.put(`/category-edit/${id}`, formData, {
        withCredentials: true
      });

      if (data?.error) return rejectWithValue(data);
      return data; // { category, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const categoryDelete = createAsyncThunk(
  'category/categoryDelete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/category-delete/${id}`, {
        withCredentials: true
      });

      if (data?.error) return rejectWithValue(data);
      return { id, ...data }; // { id, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// SUB CATEGORY
export const subCategoryAdd = createAsyncThunk(
  'category/subCategoryAdd',
  async ({ categoryId, name, image }, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("categoryId", categoryId);
      fd.append("name", name);
      fd.append("image", image);
      const { data } = await api.post('/sub-category-add', fd, { withCredentials: true });
      if (data?.error) return rejectWithValue(data);
      return data; // { subCategory, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_sub_category = createAsyncThunk(
  'category/get_sub_category',
  async ({ categoryId, page, perPage, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/sub-category-get?categoryId=${categoryId}&&page=${page}&&perPage=${perPage}&&searchValue=${searchValue || ''}`, { withCredentials: true });
      return fulfillWithValue({ ...data, categoryId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const delete_sub_category = createAsyncThunk(
  'category/delete_sub_category',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/sub-category-delete/${id}`, { withCredentials: true });
      if (data?.error) return rejectWithValue(data);
      return data; // { id, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// CHILD CATEGORY
export const childCategoryAdd = createAsyncThunk(
  'category/childCategoryAdd',
  async ({ categoryId, subcategoryId, name, image }, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("categoryId", categoryId);
      fd.append("subcategoryId", subcategoryId);
      fd.append("name", name);
      fd.append("image", image);
      const { data } = await api.post('/child-category-add', fd, { withCredentials: true });
      if (data?.error) return rejectWithValue(data);
      return data; // { childCategory, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_child_category = createAsyncThunk(
  'category/get_child_category',
  async ({ subcategoryId, page, perPage, searchValue }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/child-category-get?subcategoryId=${subcategoryId}&&page=${page}&&perPage=${perPage}&&searchValue=${searchValue || ''}`, { withCredentials: true });
      return fulfillWithValue({ ...data, subcategoryId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const delete_child_category = createAsyncThunk(
  'category/delete_child_category',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/child-category-delete/${id}`, { withCredentials: true });
      if (data?.error) return rejectWithValue(data);
      return data; // { id, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);



export const categoryReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    categories: [],
    totalCategory: 0,
    
    // sub categories
    subCategories: [],
    totalSubCategory: 0,
    activeCategoryId: null,

    // child categories
    childCategories: [],
    totalChildCategory: 0,
    activeSubCategoryId: null,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryAdd.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(categoryAdd.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Category added';
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
       // NEW: update
      .addCase(categoryUpdate.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(categoryUpdate.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Category updated';
        const updated = action.payload?.category;
        if (updated?._id) {
          const idx = state.categories.findIndex(c => c._id === updated._id);
          if (idx !== -1) state.categories[idx] = updated;
        }
      })
      .addCase(categoryUpdate.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })

      // NEW: delete
      .addCase(categoryDelete.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
        state.successMessage = "";
      })
      .addCase(categoryDelete.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Category deleted';
        const id = action.payload?.id;
        if (id) {
          state.categories = state.categories.filter(c => c._id !== id);
          state.totalCategory = Math.max(0, (state.totalCategory || 0) - 1);
        }
      })
      .addCase(categoryDelete.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed';
      })
       // SUB
      .addCase(subCategoryAdd.pending, (state) => {
        state.loader = true; state.errorMessage = ""; state.successMessage = "";
      })
      .addCase(subCategoryAdd.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Sub category added';
        if (action.payload?.subCategory) {
          state.subCategories.unshift(action.payload.subCategory);
          state.totalSubCategory += 1;
        }
      })
      .addCase(subCategoryAdd.rejected, (state, action) => {
        state.loader = false; state.errorMessage = action.payload?.error || 'Failed';
      })
      .addCase(get_sub_category.fulfilled, (state, action) => {
        state.subCategories = action.payload?.subCategories || [];
        state.totalSubCategory = action.payload?.totalSubCategory || 0;
        state.activeCategoryId = action.payload?.categoryId || null;
      })
      .addCase(delete_sub_category.pending, (state) => {
        state.loader = true; state.errorMessage = ""; state.successMessage = "";
      })
      .addCase(delete_sub_category.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Sub category deleted';
        const id = action.payload?.id;
        if (id) {
          state.subCategories = state.subCategories.filter(s => s._id !== id);
          state.totalSubCategory = Math.max(0, state.totalSubCategory - 1);
        }
      })
      .addCase(delete_sub_category.rejected, (state, action) => {
        state.loader = false; state.errorMessage = action.payload?.error || 'Failed';
      })

      // CHILD
      .addCase(childCategoryAdd.pending, (state) => {
        state.loader = true; state.errorMessage = ""; state.successMessage = "";
      })
      .addCase(childCategoryAdd.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Child category added';
        if (action.payload?.childCategory) {
          state.childCategories.unshift(action.payload.childCategory);
          state.totalChildCategory += 1;
        }
      })
      .addCase(childCategoryAdd.rejected, (state, action) => {
        state.loader = false; state.errorMessage = action.payload?.error || 'Failed';
      })
      .addCase(get_child_category.fulfilled, (state, action) => {
        state.childCategories = action.payload?.childCategories || [];
        state.totalChildCategory = action.payload?.totalChildCategory || 0;
        state.activeSubCategoryId = action.payload?.subcategoryId || null;
      })
      .addCase(delete_child_category.pending, (state) => {
        state.loader = true; state.errorMessage = ""; state.successMessage = "";
      })
      .addCase(delete_child_category.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload?.message || 'Child category deleted';
        const id = action.payload?.id;
        if (id) {
          state.childCategories = state.childCategories.filter(s => s._id !== id);
          state.totalChildCategory = Math.max(0, state.totalChildCategory - 1);
        }
      })
      .addCase(delete_child_category.rejected, (state, action) => {
        state.loader = false; state.errorMessage = action.payload?.error || 'Failed';
      });
  },
});

export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;