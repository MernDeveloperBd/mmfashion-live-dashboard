import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import api from '../../Api/api'

export const get_customers = createAsyncThunk(
    'chat/get_customers',
    async (sellerId, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.get(`/chat/seller/get-customers/${sellerId}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_customer_message = createAsyncThunk(
    'chat/get_customer_message',
    async (customerId, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.get(`/chat/seller/get-customer-message/${customerId}`, {
                withCredentials: true
            })

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.post(`/chat/seller/send-message-to-customer`, info, {
                withCredentials: true
            })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_sellers = createAsyncThunk(
  'chat/get_sellers',
  // payload প্রথম আর্গুমেন্ট, thunkAPI দ্বিতীয় আর্গুমেন্ট
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = getState().auth.token; // Redux থেকে টোকেন
      const { data } = await api.get('/chat/admin/get-sellers', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}` // Bearer টোকেন পাঠান
        }
      });
      return fulfillWithValue(data); // { sellers }
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message || 'Network error' });
    }
  }
);

// store/Reducers/chatReducer.js
export const send_message_seller_admin = createAsyncThunk(
  'chat/send_message_seller_admin',
  async (info, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const { data } = await api.post(
        '/chat/message-send-seller-admin',
        info,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message || 'Network error' });
    }
  }
);

export const get_admin_message = createAsyncThunk(
    'chat/get_admin_message',
    async (receverId, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/chat/get-admin-messages/${receverId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_seller_message = createAsyncThunk(
    'chat/get_seller_message',
    async (receverId, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/chat/get-seller-messages`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



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
            state.errorMessage = ""
            state.successMessage = ""
        },
        updateMessage: (state, action) => {
            state.messages = [...state.messages, action.payload]
        },
        updateCustomer: (state, { payload }) => {
            state.activeCustomer = payload
        },
        updateSellers: (state, action) => {
            state.activeSellers = action.payload
        },
        activeStatus_update: (state, action) => {
            state.activeAdmin = action.payload.status
        },
           updateAdminMessage: (state, { payload }) => {
            state.seller_admin_message = [...state.seller_admin_message, payload]
        },
        updateSellerMessage: (state, { payload }) => {
            state.seller_admin_message = [...state.seller_admin_message, payload]
        },
      
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_customers.fulfilled, (state, action) => {
                state.customers = action.payload.customers
            })
            .addCase(get_customer_message.fulfilled, (state, action) => {
                state.messages = action.payload.messages
                state.currentCustomer = action.payload.currentCustomer
            })
            .addCase(send_message.fulfilled, (state, action) => {
                let tempFriends = state.customers
                let index = tempFriends.findIndex(f => f.fdId === action.payload.message.receverId)
                while (index > 0) {
                    let temp = tempFriends[index]
                    tempFriends[index] = tempFriends[index - 1]
                    tempFriends[index - 1] = temp
                    index--
                }
                state.customers = tempFriends
                state.messages = [...state.messages, action.payload.message]
                state.successMessage = ' message send success'
            })
            .addCase(get_sellers.pending, (state) => {
                state.errorMessage = '';
            })
            .addCase(get_sellers.fulfilled, (state, action) => {
                state.sellers = action.payload?.sellers || [];
            })
            .addCase(get_sellers.rejected, (state, action) => {
                state.errorMessage = action.payload?.error || action.error?.message || 'Failed to load sellers';
            })
             .addCase(send_message_seller_admin.fulfilled, (state, action) => {
                state.seller_admin_message = [...state.seller_admin_message, action.payload.message]
            state.successMessage = 'message send success'
            })
             .addCase(get_admin_message.fulfilled, (state, action) => {
                state.seller_admin_message = action.payload.messages
            state.currentSeller = action.payload.currentSeller
            })
             .addCase(get_seller_message.fulfilled, (state, action) => {
               state.seller_admin_message = action.payload.messages
            })
            


    },

})

export const { messageClear, updateMessage, updateCustomer, updateSellers, activeStatus_update,updateSellerMessage,updateAdminMessage } = chatReducer.actions
export default chatReducer.reducer