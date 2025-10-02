/* import { PrivateRoutes } from './PrivateRoutes'
import { lazy } from "react";

const Mainlayout = lazy(()=>import('../../layout/Mainlayout'))
export const getRoutes = () => {
    return {
         path: '/',
        element:<Mainlayout/>,
        children: PrivateRoutes
    }     
    
} */


import { lazy } from "react";
import PrivateRoutes from './PrivateRoutes';
import ProtectRoute from "./ProtectRoute";
const MainLayout = lazy(() => import('../../layout/MainLayout'));

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
