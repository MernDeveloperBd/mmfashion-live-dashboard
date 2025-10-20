import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useEffect } from "react";
import { socket } from "../utils/utils";
import { useSelector, useDispatch } from "react-redux";
import {
  activeStatus_update,
  updateCustomer,
  updateSellers,
} from "../store/Reducers/chatReducer";
import { get_user_info } from "../store/Reducers/authReducer";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo, token, userLoaded } = useSelector((state) => state.auth);
  const [shoeSidebar, setShowSidebar] = useState(false);

  // ✅ Token থাকলে user info পুনরায় ফেচ
  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [token, userLoaded, dispatch]);

  // ✅ ইউজার লোড হলে Socket এ রেজিস্টার করানো
  useEffect(() => {
    if (!userLoaded || !userInfo) return;

    if (userInfo.role === "seller") {
      socket.emit("add_seller", userInfo._id || userInfo.id, userInfo);
    } else if (userInfo.role === "admin") {
      socket.emit("add_admin", userInfo);
    }
  }, [userLoaded, userInfo]);

  // ✅ Socket listeners
  useEffect(() => {
    socket.on("activeCustomer", (customers) => {
      dispatch(updateCustomer(customers));
    });
    socket.on("activeSeller", (sellers) => {
      dispatch(updateSellers(sellers));
    });
    socket.on("activeAdmin", (data) => {
      dispatch(activeStatus_update(data));
    });

    return () => {
      socket.off("activeCustomer");
      socket.off("activeSeller");
      socket.off("activeAdmin");
    };
  }, [dispatch]);

  // ✅ ইউজার না লোড হলে নিরাপদ fallback
  if (token && !userLoaded) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#161d31] text-slate-300">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <Header shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
      <main className="lg:ml-[260px] pt-[75px] transition-all min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;