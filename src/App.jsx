// src/App.js
import { useState, useEffect } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes/index"; 
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

export default function App() {
  const { token, userInfo, userLoaded } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [dispatch, token, userLoaded]);

  useEffect(() => {
    // private routes সবসময় define করাই ভালো; তবে আপনি আগের মতোই রাখতে চাইলে রাখুন
    const privateRoute = getRoutes(); // এখানে role পাস করার দরকার নেই
    setAllRoutes([...publicRoutes, privateRoute]);
  }, [userInfo]); // চাইলে dependency [] দিলেও হবে, কারণ Guard নিজেই access কন্ট্রোল করছে

  // token আছে কিন্তু userLoaded false ⇒ Router render বন্ধ রাখুন
  if (token && !userLoaded) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Loading…</span>
      </div>
    );
  }

  return <Routers allRoutes={allRoutes} />;
}