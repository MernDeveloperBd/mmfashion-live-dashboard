import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Pending seller requests
export const get_admin_orders = createAsyncThunk(
  'order/get_admin_orders',
  async ({ page, searchValue, perPage } = {}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/admin/orders?page=${page || 1}&perPage=${perPage || 10}&searchValue=${encodeURIComponent(searchValue || '')}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);
export const get_seller_orders = createAsyncThunk(
  'order/get_seller_orders',
  async ({ perPage, page, searchValue, sellerId } = {}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(
        `/seller/orders/${sellerId}?page=${page}&searchValue=${searchValue}&perPage=${perPage}`,
        { withCredentials: true }
      );
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
    }
  }
);

// Single
export const get_admin_order = createAsyncThunk(
  'order/get_admin_order',
  async (orderId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin/order/details/${orderId}`, { withCredentials: true });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: error.message || 'Network error' });
    }
  }
);
export const get_seller_order = createAsyncThunk(
    'order/get_seller_order',
    async (orderId, { rejectWithValue, fulfillWithValue, getState }) => {

        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/seller/order/details/${orderId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const admin_order_status_update = createAsyncThunk(
    'order/admin_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await api.put(`/admin/order-status/update/${orderId}`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
    
)

export const seller_order_status_update = createAsyncThunk(
    'order/seller_order_status_update',
    async ({ orderId, info }, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        try {
            const { data } = await api.put(`/seller/order-status/update/${orderId}`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
    
)
export const get_bkash_by_order = createAsyncThunk(
  'order/get_bkash_by_order',
  async (orderId, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.get(`/payment/bkash/by-order/${orderId}`, config);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const approve_bkash_payment = createAsyncThunk(
  'order/approve_bkash_payment',
  async ({ paymentId, orderId, note }, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.post(`/payment/bkash/approve`, { paymentId, note }, config);
      return fulfillWithValue({ ...data, paymentId, orderId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const reject_bkash_payment = createAsyncThunk(
  'order/reject_bkash_payment',
  async ({ paymentId, reason }, { getState, rejectWithValue, fulfillWithValue }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.post(`/payment/bkash/reject`, { paymentId, reason }, config);
      return fulfillWithValue({ ...data, paymentId });
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

export const get_bkash_config = createAsyncThunk(
  'order/get_bkash_config',
  async (_, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.get(`/payment/bkash/config`, config);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to load bKash config' });
    }
  }
);

// Customer submit
export const submit_bkash_payment = createAsyncThunk(
  'order/submit_bkash_payment',
  async ({ orderId, amount, senderNumber, trxId }, { rejectWithValue, fulfillWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const { data } = await api.post(`/payment/bkash/submit`, { orderId, amount, senderNumber, trxId }, config);
      return fulfillWithValue(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Submit failed' });
    }
  }
);



export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        totalOrder: 0,
        order: {},
        myOrders: [],
         bkashPayments: [],
         merchantNumber: null,      // add
  verifyLoading: false,
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
      .addCase(get_admin_orders.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
      })
      .addCase(get_admin_orders.fulfilled, (state, action) => {
        state.loader = false;
        state.myOrders = action.payload?.orders || [];
        state.totalOrder = action.payload?.totalOrder || 0;
      })
      .addCase(get_admin_orders.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed to fetch orders';
      })
       .addCase(get_admin_order.pending, (state) => {
        state.loader = true;
        state.errorMessage = '';
      })
      .addCase(get_admin_order.fulfilled, (state, action) => {
        state.loader = false;
        state.order = action.payload?.order || null;
      })
      .addCase(get_admin_order.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload?.error || action.error?.message || 'Failed to fetch order';
      })
      .addCase(admin_order_status_update.fulfilled, (state, action) => {
       state.successMessage = action.payload.message
      })
      .addCase(admin_order_status_update.rejected, (state, action) => {        
        state.errorMessage =action.payload.message
      })
      .addCase(get_seller_orders.fulfilled, (state, action) => {
         state.myOrders = action.payload.orders
            state.totalOrder = action.payload.totalOrder
      })
       .addCase(seller_order_status_update.fulfilled, (state, action) => {
        state.successMessage = action.payload.message
      })
      .addCase(seller_order_status_update.rejected, (state, action) => {        
        state.errorMessage = action.payload.message
      })
      .addCase(get_seller_order.pending, (state) => {
     state.loader = true;
       state.errorMessage = '';
     })
     .addCase(get_seller_order.fulfilled, (state, action) => {
       state.loader = false;
       state.order = action.payload?.order || null;
     })
    .addCase(get_seller_order.rejected, (state, action) => {
      state.loader = false;
       state.errorMessage = action.payload?.error || action.error?.message || 'Failed to fetch seller order';
     })
      .addCase(approve_bkash_payment.pending, (state) => {
        state.verifyLoading = true;
      })
      .addCase(approve_bkash_payment.rejected, (state, { payload }) => {
        state.verifyLoading = false;
        state.errorMessage = payload?.message || 'Approve failed';
      })
      .addCase(approve_bkash_payment.fulfilled, (state, { payload }) => {
        state.verifyLoading = false;
        state.successMessage = payload?.message || 'Approved';
        state.bkashPayments = state.bkashPayments.map(p =>
          p._id === payload.paymentId ? { ...p, status: 'approved' } : p
        );
        if (state.order) {
          state.order.payment_status = 'paid';
          state.order.payment_method = 'bkash';
        }
        
      })

      // BKASH: reject
      .addCase(reject_bkash_payment.pending, (state) => {
        state.verifyLoading = true;
      })
      .addCase(reject_bkash_payment.rejected, (state, { payload }) => {
        state.verifyLoading = false;
        state.errorMessage = payload?.message || 'Reject failed';
      })
      .addCase(reject_bkash_payment.fulfilled, (state, { payload }) => {
        state.verifyLoading = false;
        state.successMessage = payload?.message || 'Rejected';
        state.bkashPayments = state.bkashPayments.map(p =>
          p._id === payload.paymentId ? { ...p, status: 'rejected' } : p
        );
      })
      .addCase(get_bkash_config.fulfilled, (state, { payload }) => {
    state.merchantNumber = payload?.merchantNumber || null;
  })
  .addCase(get_bkash_config.rejected, (state, { payload }) => {
    state.errorMessage = payload?.message || 'Failed to load bKash config';
  })

  // bKash submit
  .addCase(submit_bkash_payment.pending, (state) => {
    state.loader = true;
  })
  .addCase(submit_bkash_payment.fulfilled, (state, { payload }) => {
    state.loader = false;
    state.successMessage = payload?.message || 'Submitted';
  })
  .addCase(submit_bkash_payment.rejected, (state, { payload }) => {
    state.loader = false;
    state.errorMessage = payload?.message || 'Submit failed';
  })

  // list submissions by order
  .addCase(get_bkash_by_order.fulfilled, (state, { payload }) => {
    state.bkashPayments = payload?.payments || [];
  })
  .addCase(get_bkash_by_order.rejected, (state, { payload }) => {
    state.errorMessage = payload?.message || 'Failed to load bKash payments';
  })
  
     

      
  },
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;