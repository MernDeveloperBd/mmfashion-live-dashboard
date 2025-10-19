import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../utils/config";

export const categoryAdd = createAsyncThunk(
  'category/categoryAdd',
  async ({ name, image }, { rejectWithValue, fulfillWithValue,getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const { data } = await axios.post(`${base_url}/api/category-add`, formData, config);
      if (data?.error) return rejectWithValue(data);
        return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
export const get_category = createAsyncThunk(
  'category/get_category',
  async ({ page, searchValue, perPage }, { rejectWithValue, fulfillWithValue, getState }) => {
      const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {    
      const { data } = await axios.get(`${base_url}/api/category-get?page=${page}&&searchValue=${searchValue}&&perPage=${perPage}`, config);   
      
      // if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const categoryUpdate = createAsyncThunk(
  'category/categoryUpdate',
  async ({ id, name, image }, { fulfillWithValue,rejectWithValue, getState }) => {
      const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const formData = new FormData();
      if (typeof name !== 'undefined') formData.append("name", name);
      if (image) formData.append("image", image);

      const { data } = await axios.put(`${base_url}/api/category-edit/${id}`, formData, config);

      if (data?.error) return rejectWithValue(data);
        return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const categoryDelete = createAsyncThunk(
  'category/categoryDelete',
  async (id, { fulfillWithValue,rejectWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.delete(`${base_url}/api/category-delete/${id}`, config);

      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue({ id, ...data }); // { id, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// SUB CATEGORY
export const subCategoryAdd = createAsyncThunk(
  'category/subCategoryAdd',
  async ({ categoryId, name, image }, { fulfillWithValue,rejectWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const fd = new FormData();
      fd.append("categoryId", categoryId);
      fd.append("name", name);
      fd.append("image", image);
      const { data } = await axios.post(`${base_url}/api/sub-category-add`, fd, config);
      if (data?.error) return rejectWithValue(data);
        return fulfillWithValue(data); // { subCategory, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_sub_category = createAsyncThunk(
  'category/get_sub_category',
  async ({ categoryId, page, perPage, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/sub-category-get?categoryId=${categoryId}&&page=${page}&&perPage=${perPage}&&searchValue=${searchValue || ''}`, config);
      return fulfillWithValue({ ...data, categoryId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const delete_sub_category = createAsyncThunk(
  'category/delete_sub_category',
  async (id, {fulfillWithValue, rejectWithValue, getState}) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.delete(`${base_url}/api/sub-category-delete/${id}`, config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data); // { id, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// CHILD CATEGORY
export const childCategoryAdd = createAsyncThunk(
  'category/childCategoryAdd',
  async ({ categoryId, subcategoryId, name, image }, { fulfillWithValue,rejectWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const fd = new FormData();
      fd.append("categoryId", categoryId);
      fd.append("subcategoryId", subcategoryId);
      fd.append("name", name);
      fd.append("image", image);
      const { data } = await axios.post(`${base_url}/api/child-category-add`, fd, config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data); // { childCategory, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const get_child_category = createAsyncThunk(
  'category/get_child_category',
  async ({ subcategoryId, page, perPage, searchValue }, { rejectWithValue, fulfillWithValue,getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/child-category-get?subcategoryId=${subcategoryId}&&page=${page}&&perPage=${perPage}&&searchValue=${searchValue || ''}`,config);
      return fulfillWithValue({ ...data, subcategoryId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

export const delete_child_category = createAsyncThunk(
  'category/delete_child_category',
  async (id, {fulfillWithValue, rejectWithValue,getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.delete(`${base_url}/api/child-category-delete/${id}`, config);
      if (data?.error) return rejectWithValue(data);
      return fulfillWithValue(data); // { id, message }
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