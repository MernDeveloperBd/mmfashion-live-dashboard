import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Pending seller requests
export const get_seller_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_seller_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue,getState }) => {
         const token = getState().auth.token
        const config = {
            headers: {
                'authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(
                `/seller/get-dashboard-index-data`,
                config
            );
            return fulfillWithValue(data);
        } catch (err) {
            return rejectWithValue(err.response?.data || { error: err.message || 'Network error' });
        }
    }
);

export const get_admin_dashboard_index_data = createAsyncThunk(
    'dashboardIndex/get_admin_dashboard_index_data',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        const token = getState().auth.token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const { data } = await api.get(`/admin/get-dashboard-index-data`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)





export const dashboardIndexReducer = createSlice({
    name: "dashboardIndex",
    initialState: {
        totalSale: 0,
        totalOrder: 0,
        totalProduct: 0,
        totalPendingOrder: 0,
        totalSeller: 0,
        recentOrders: [],
        recentMessage: [],
        // Chart data fields
        chartOrders: [],
        chartRevenue: [],
        chartSellers: []
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
 .addCase(get_seller_dashboard_index_data.fulfilled, (state, { payload }) => {
                state.totalSale = payload.totalSale;
                state.totalOrder = payload.totalOrder;
                state.totalProduct = payload.totalProduct;
                state.totalPendingOrder = payload.totalPendingOrder;
                state.recentOrders = payload.recentOrders;
                state.recentMessage = payload.messages;
                // Add chart data
                state.chartOrders = payload.chartOrders || [];
                state.chartRevenue = payload.chartRevenue || [];
                state.chartSellers = payload.chartSellers || [];
            })
            .addCase(get_admin_dashboard_index_data.fulfilled, (state, { payload }) => {
                state.totalSale = payload.totalSale;
                state.totalOrder = payload.totalOrder;
                state.totalProduct = payload.totalProduct;
                state.totalSeller = payload.totalSeller;
                state.recentOrders = payload.recentOrders;
                state.recentMessage = payload.messages;
                // Add chart data
                state.chartOrders = payload.chartOrders || [];
                state.chartRevenue = payload.chartRevenue || [];
                state.chartSellers = payload.chartSellers || [];
            })
            // Error handling cases
            .addCase(get_seller_dashboard_index_data.rejected, (state, action) => {
                console.error("Failed to fetch seller dashboard data:", action.payload);
            })
            .addCase(get_admin_dashboard_index_data.rejected, (state, action) => {
                console.error("Failed to fetch admin dashboard data:", action.payload);
            });
    



    },
});

export const { messageClear } = dashboardIndexReducer.actions;
export default dashboardIndexReducer.reducer;