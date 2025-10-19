import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import axios from 'axios'
import { base_url } from '../../utils/config';
// NB: api instance যদি baseURL = '/api' হয়, তাহলে সব পাথ '/chat/...' রাখুন, '/api/chat/...' নয়।

export const get_customers = createAsyncThunk(
  'chat/get_customers',
  async (sellerId, { rejectWithValue, fulfillWithValue,getState }) => {
       const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/chat/seller/get-customers/${sellerId}`,config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error' });
    }
  }
);

export const get_customer_message = createAsyncThunk(
  'chat/get_customer_message',
  async (customerId, { rejectWithValue, fulfillWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.get(`${base_url}/api/chat/seller/get-customer-message/${customerId}`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error' });
    }
  }
);

export const send_message = createAsyncThunk(
  'chat/send_message',
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.post(`${base_url}/api/chat/seller/send-message-to-customer`, info, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error' });
    }
  }
);

export const get_sellers = createAsyncThunk(
  'chat/get_sellers',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
     const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {     
      const { data } = await axios.get(`${base_url}/api/chat/admin/get-sellers`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message || 'Network error' });
    }
  }
);

export const send_message_seller_admin = createAsyncThunk(
  'chat/send_message_seller_admin',
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
     const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      const { data } = await axios.post(`${base_url}/api/chat/message-send-seller-admin`, info,config );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message || 'Network error' });
    }
  }
);

// Admin side: read chat with a seller (sellerId as receverId)
export const get_admin_message = createAsyncThunk(
  'chat/get_admin_message',
  async (receverId, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
      
      const { data } = await axios.get(`${base_url}/api/chat/get-admin-messages/${receverId}`,config );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error' });
    }
  }
);

// Seller side: read chat with admin
export const get_seller_message = createAsyncThunk(
  'chat/get_seller_message',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    const token = getState().auth.token;
    const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    try {
     
      const { data } = await axios.get(`${base_url}/api/chat/get-seller-messages`, config);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Network error' });
    }
  }
);

export const chatReducer = createSlice({
  name: 'seller',
  initialState: {
    successMessage: '',
    errorMessage: '',
    customers: [],
    messages: [],
    activeCustomer: [],
    activeSellers: [],
    messageNotification: [],
    activeAdmin: "",
    friends: [],
    seller_admin_message: [],
    currentSeller: {},
    currentCustomer: {},
    sellers: []
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    updateMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    updateCustomer: (state, { payload }) => {
      state.activeCustomer = payload;
    },
    updateSellers: (state, action) => {
      state.activeSellers = action.payload;
    },
    activeStatus_update: (state, action) => {
      state.activeAdmin = action.payload.status;
    },
    updateAdminMessage: (state, { payload }) => {
      state.seller_admin_message = [...state.seller_admin_message, payload];
    },
    updateSellerMessage: (state, { payload }) => {
      state.seller_admin_message = [...state.seller_admin_message, payload];
    },
     // NEW: Notifications
    addNotification: (state, { payload }) => {
      // payload: { _id?, type: 'customer'|'admin', senderId, name, message, createdAt }
      const id = payload._id || `${payload.type}:${payload.senderId}:${payload.createdAt || Date.now()}`;
      const exists = state.messageNotification.some(n => (n._id && payload._id && n._id === payload._id) || n.id === id);
      if (!exists) {
        state.messageNotification.unshift({ id, ...payload, read: false });
      }
    },
    markAsReadByConversation: (state, { payload }) => {
      // payload: { type, senderId }
      state.messageNotification = state.messageNotification.map(n => {
        if (n.type === payload.type && n.senderId === payload.senderId) {
          return { ...n, read: true };
        }
        return n;
      });
    },
    clearAllNotifications: (state) => {
      state.messageNotification = [];
    },
    removeNotificationById: (state, { payload }) => {
      state.messageNotification = state.messageNotification.filter(n => (n._id || n.id) !== payload);
    }
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(get_customers.fulfilled, (state, action) => {
        state.customers = action.payload.customers;
      })
      .addCase(get_customer_message.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.currentCustomer = action.payload.currentCustomer;
      })
      .addCase(send_message.fulfilled, (state, action) => {
        let tempFriends = state.customers.slice();
        let index = tempFriends.findIndex(f => f.fdId === action.payload.message.receverId);
        while (index > 0) {
          let temp = tempFriends[index];
          tempFriends[index] = tempFriends[index - 1];
          tempFriends[index - 1] = temp;
          index--;
        }
        state.customers = tempFriends;
        state.messages = [...state.messages, action.payload.message];
        state.successMessage = 'message send success';
      })
      .addCase(get_sellers.pending, (state) => { state.errorMessage = ''; })
      .addCase(get_sellers.fulfilled, (state, action) => {
        state.sellers = action.payload?.sellers || [];
      })
      .addCase(get_sellers.rejected, (state, action) => {
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed to load sellers';
      })
      .addCase(send_message_seller_admin.fulfilled, (state, action) => {
        state.seller_admin_message = [...state.seller_admin_message, action.payload.message];
        state.successMessage = 'message send success';
      })
      .addCase(get_admin_message.fulfilled, (state, action) => {
        state.seller_admin_message = action.payload.messages;
        state.currentSeller = action.payload.currentSeller;
      })
      .addCase(get_seller_message.fulfilled, (state, action) => {
        state.seller_admin_message = action.payload.messages;
      })
      
  },
});

export const {
  messageClear,
  updateMessage,
  updateCustomer,
  updateSellers,
  activeStatus_update,
  updateSellerMessage,
  updateAdminMessage,
  addNotification,
  markAsReadByConversation,
  clearAllNotifications,
  removeNotificationById
} = chatReducer.actions;

export default chatReducer.reducer;