

import { lazy } from "react";

const Home = lazy(() => import('../../views/Home'));

const SellerRoutes = [
    {
        path: '/',
        element: <Home />,
        ability: ['admin', 'seller']
    }
];

export default SellerRoutes;