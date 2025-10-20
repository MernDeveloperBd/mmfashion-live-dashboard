import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { socket } from '../utils/utils';
import { activeStatus_update, updateCustomer, updateSellers } from '../store/Reducers/chatReducer';
import { get_user_info } from '../store/Reducers/authReducer';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo, token, userLoaded } = useSelector((state) => state.auth);

  // prop নামটা আগের মতোই রাখলাম যাতে Header/Sidebar-এ mismatch না হয়
  const [shoeSidebar, setShowSidebar] = useState(false);

  // 1) Token থাকলে এবং userLoaded false হলে user info ফেচ করুন
  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [token, userLoaded, dispatch]);

  // 2) User ready হলে socket identify (seller/admin)
  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.role === 'seller') {
      socket.emit('add_seller', userInfo._id || userInfo.id, userInfo);
    } else if (userInfo.role === 'admin') {
      socket.emit('add_admin', userInfo);
    }
  }, [userInfo]);

  // 3) Socket listeners (mount এ add, unmount এ cleanup)
  useEffect(() => {
    const onActiveCustomer = (customers) => dispatch(updateCustomer(customers));
    const onActiveSeller = (sellers) => dispatch(updateSellers(sellers));
    const onActiveAdmin = (data) => dispatch(activeStatus_update(data));

    socket.on('activeCustomer', onActiveCustomer);
    socket.on('activeSeller', onActiveSeller);
    socket.on('activeAdmin', onActiveAdmin);

    return () => {
      socket.off('activeCustomer', onActiveCustomer);
      socket.off('activeSeller', onActiveSeller);
      socket.off('activeAdmin', onActiveAdmin);
    };
  }, [dispatch]);

  // এখন থেকে যে কোন early return (hooks গুলো ওপরে কল হয়ে গেছে বলে আর সমস্যা নেই)
  if (token && !userLoaded) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#161d31]">
        <div className="animate-pulse text-gray-300">Loading…</div>
      </div>
    );
  }

  // Private layout: লগইন/ইউজার না থাকলে login এ পাঠাই
  if (!token || !userInfo) {
    return <Navigate to="/login" replace />;
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