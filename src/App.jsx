import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes/index";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";
import { PropagateLoader } from "react-spinners";

export default function App() {
  const{token,userInfo, userLoaded} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

    useEffect(() => {
        const privateRoute = getRoutes();        
        setAllRoutes([...publicRoutes, privateRoute]);
    }, []);
   
  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [token, userLoaded, dispatch]);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (token && !userLoaded) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#161d31]">
        <PropagateLoader color="#00E396" size={8} />
      </div>
    );
  }
    if (userLoaded && !userInfo) {
    return <Navigate to="/login" replace />;
  }

    return <Routers allRoutes={allRoutes} />;
}
