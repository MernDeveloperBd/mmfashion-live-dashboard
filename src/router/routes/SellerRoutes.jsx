  import { MdDashboard } from "react-icons/md";

import { lazy } from "react";

const Home = lazy(() => import('../../views/Home'));
const SellerDashboard = lazy(() => import('../../views/seller/SellerDashboard'));
const AddProduct = lazy(() => import('../../views/seller/AddProduct'));
const Products = lazy(() => import('../../views/seller/Products'));
const Discountproduct = lazy(() => import('../../views/seller/Discountproduct'));
const Orders = lazy(() => import('../../views/seller/Orders'));
const Payments = lazy(() => import('../../views/seller/Payments'));
const SellerToCustomer = lazy(() => import('../../views/seller/SellerToCustomer'));
const SellerToAdmin = lazy(() => import('../../views/seller/SellerToAdmin'));
const Profile = lazy(() => import('../../views/seller/Profile'));
const EditProduct = lazy(() => import('../../views/seller/EditProduct'));
const OrderDetails = lazy(() => import('../../views/seller/OrderDetails'));

const SellerRoutes = [
    {
        path: '/',
        element: <Home />,
        ability: ['admin', 'seller']
    },
    {
        path: '/seller/dashboard',
        element: <SellerDashboard />,
        role:'seller',
        status:'active'
    },
    {
        path: '/seller/add-product',
        element: <AddProduct />,
        role:'seller',
        status:'active'
    },
    {
        path: '/seller/edit-product/:productId',
        element: <EditProduct />,
        role:'seller',
        status:'active'
    },
    {
        path: '/seller/products',
        element: <Products />,
        role:'seller',
        status:'active'
    },
    {
        path: '/seller/discount-product',
        element: <Discountproduct />,
        role:'seller',
        status:'active'
    },
    {
        path: '/seller/orders',
        element: <Orders />,
        role:'seller',
         ability: ['active', 'deactive']
    },
    {
        path: '/seller/order/details/:orderId',
        element: <OrderDetails />,
        role:'seller',
         ability: ['active', 'deactive']
    },
    {
        path: '/seller/payment',
        element: <Payments />,
          role:'seller',
        status:'active'
    },   
    {
        path: '/seller/dashboard/chat-support',
        element: <SellerToAdmin />,
         ability: ['active', 'deactive','pending']
    },
      {
        path: '/seller/dashboard/chat-customer/:customerId',
        element: <SellerToCustomer />,
        role:'seller',
        status:'active'
    },
      {
        path: '/seller/dashboard/chat-customer',
        element: <SellerToCustomer />,
        role:'seller',
        status:'active'
    },
      {
        path: '/seller/dashboard/profile',
        element: <Profile />,
        role:'seller',
        status:'active'
    }
];

export default SellerRoutes;