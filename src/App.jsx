// src/App.js

import { useState, useEffect } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes/index"; // Assume this takes role
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";
// NOTE: get_user_info is now primarily handled in MainLayout

export default function App() {
    // Make sure you select userInfo and userLoaded here too, for routing logic
    const { token, userInfo, userLoaded } = useSelector(state => state.auth); 
    const dispatch = useDispatch()
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

    // OPTIONAL: If you keep get_user_info here, ensure it runs correctly
    useEffect(() => {
        if (token && !userLoaded) {
            dispatch(get_user_info())
        }
    }, [dispatch, token, userLoaded])


    // CRITICAL FIX: Load dynamic routes only when userInfo is confirmed available
    useEffect(() => {
        // If userInfo is present (meaning user is logged in and data loaded)
        if (userInfo && userInfo.role) {
            // getRoutes must return an array of route objects based on role
            const privateRoute = getRoutes(userInfo.role); 
            
            // Check if privateRoute is an array (to safely spread)
            if (Array.isArray(privateRoute)) {
                setAllRoutes([...publicRoutes, ...privateRoute]);
            } else {
                 // Handle case where getRoutes returns a single object (less common in v6)
                setAllRoutes([...publicRoutes, privateRoute]);
            }
        } else {
            // Keep only public routes if not logged in or data loading
            setAllRoutes([...publicRoutes]);
        }
    }, [userInfo]); // Re-run when userInfo changes

    return <Routers allRoutes={allRoutes} />;
}