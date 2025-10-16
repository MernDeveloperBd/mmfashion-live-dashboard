import authReducer from "./Reducers/authReducer"; // ✅ Default Import
import categoryReducer from "./Reducers/categoryReducer";
import chatReducer from "./Reducers/chatReducer";
import orderReducer from "./Reducers/orderReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import userReducer from "./Reducers/userReducer";
import PaymentReducer from "./Reducers/PaymentReducer";
import  dashboardIndexReducer  from "./Reducers/dashboardIndexReducer";
import  bannerReducer  from "./Reducers/bannerReducer";




const rootReducers = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  chat: chatReducer,
  user: userReducer,
  order: orderReducer,
  payment: PaymentReducer,
  dashboardIndex: dashboardIndexReducer,
  banner: bannerReducer
  
};

export default rootReducers;