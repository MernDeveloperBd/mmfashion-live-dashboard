
import { useState, useEffect } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes/index";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

export default function App() {
  const{token} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

    useEffect(() => {
        const privateRoute = getRoutes();        
        setAllRoutes([...publicRoutes, privateRoute]);
    }, []);
useEffect(() =>{
  if(token){
    dispatch(get_user_info())
  }
},[dispatch, token])

    return <Routers allRoutes={allRoutes} />;
}
