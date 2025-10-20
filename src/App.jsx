// src/App.js
import { useEffect, useMemo } from "react";
import Routers from "./router/Routers";
import publicRoutes from "./router/routes/publicRoutes";
import getRoutes from "./router/routes/index";
import { useDispatch, useSelector } from "react-redux";
import { get_user_info } from "./store/Reducers/authReducer";

export default function App() {
  const { token, userLoaded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // token থাকলে user info এনে নিন
  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [dispatch, token, userLoaded]);

  // সবসময় একই রাউট ট্রি ব্যবহার করুন (reload-safe)
  const allRoutes = useMemo(() => {
    const privateTree = getRoutes(); // MainLayout + guarded children
    return [...publicRoutes, privateTree];
  }, []);

  // লোডিং স্ক্রিন (token থাকলে কিন্তু userLoaded হয়নি)
  if (token && !userLoaded) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <span className="animate-pulse text-gray-500">Loading…</span>
      </div>
    );
  }

  return <Routers allRoutes={allRoutes} />;
}