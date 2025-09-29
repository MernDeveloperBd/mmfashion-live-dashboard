  import { MdDashboard } from "react-icons/md";

import { lazy } from "react";

const Home = lazy(() => import('../../views/Home'));
const SellerDashboard = lazy(() => import('../../views/seller/SellerDashboard'));
const AddProduct = lazy(() => import('../../views/seller/AddProduct'));

const SellerRoutes = [
    {
        path: '/',
        element: <Home />,
        ability: ['admin', 'seller']
    },
    {
        path: '/seller/dashboard',
        element: <SellerDashboard />,
        ability: ['seller']
    },
    {
        path: '/seller/add-product',
        element: <AddProduct />,
        ability: ['seller']
    },
     
];

export default SellerRoutes;