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

const MainLayout = lazy(() => import('../../layout/MainLayout'));

export const getRoutes = () => {
    return {
        path: '/',
        element: <MainLayout />,
        children: PrivateRoutes
    };
};
