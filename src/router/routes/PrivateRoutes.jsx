/* import { lazy } from "react";

const AdminRoutes = lazy(()=>import('./AdminRoutes'))
const SellerRoutes = lazy(()=>import('./SellerRoutes'))

const PrivateRoutes =[
   
    ...AdminRoutes, ...SellerRoutes
    
]

export default PrivateRoutes;
 */

import AdminRoutes from './AdminRoutes';
import SellerRoutes from './SellerRoutes';

const PrivateRoutes = [
    ...AdminRoutes,
    ...SellerRoutes
];

export default PrivateRoutes;