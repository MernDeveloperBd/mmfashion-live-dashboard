


import { lazy } from "react";
import PrivateRoutes from './PrivateRoutes';
import ProtectRoute from "./ProtectRoute";
// const MainLayout = lazy(() => import('../../layout/MainLayout'));
const MainLayout = lazy(() => import('../../layout/Mainlayout'));

export const getRoutes = () => {
    const allRoute = [];
    PrivateRoutes.map((r)=> {
        r.element = <ProtectRoute route={r}>{r.element}</ProtectRoute>
    }
    )
    return {
        path: '/',
        element: <MainLayout />,
        children: PrivateRoutes
    };
};
