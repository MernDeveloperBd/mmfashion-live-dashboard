import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import Header from './Header';
import { socket } from '../utils/utils';
import { useSelector, useDispatch } from 'react-redux';
import { activeStatus_update, updateCustomer, updateSellers } from '../store/Reducers/chatReducer';
import { get_user_info } from '../store/Reducers/authReducer';

const MainLayout = () => {
  const dispatch = useDispatch();
  const { userInfo, token, userLoaded } = useSelector(state => state.auth);
  const [shoeSidebar, setShowSidebar] = useState(false);

  // Ensure user info is loaded when token exists
  useEffect(() => {
    if (token && !userLoaded) {
      dispatch(get_user_info());
    }
  }, [token, userLoaded, dispatch]);
  useEffect(() => {
    if (!token || !userInfo) {
      // Note: If you don't have a /login route, change this path.
      return <Navigate to="/login" replace />;
    }
  }, [token, userInfo])

  // Socket add user/admin only after user info is available
  useEffect(() => {
    if (!userLoaded || !userInfo) return;
    if (userInfo.role === 'seller') {
      socket.emit('add_seller', userInfo._id || userInfo.id, userInfo);
    } else if (userInfo.role === 'admin') {
      socket.emit('add_admin', userInfo);
    }
  }, [userLoaded, userInfo]);
  useEffect(() => {
    if (token && !userLoaded) {
      return (
        <div className='w-full min-h-screen flex justify-center items-center bg-[#161d31]'>
          <PropagateLoader color='#00E396' size={15} />
        </div>
      );
    }
  }, [token, userLoaded])
  useEffect(() => {
    socket.on('activeCustomer', (customers) => {
      dispatch(updateCustomer(customers));
    });
    socket.on('activeSeller', (sellers) => {
      dispatch(updateSellers(sellers));
    });
    socket.on('activeAdmin', (data) => {
      dispatch(activeStatus_update(data));
    });

    return () => {
      socket.off('activeCustomer');
      socket.off('activeSeller');
      socket.off('activeAdmin');
    };
  }, [dispatch]);

  return (
    <div className='w-full min-h-screen'>
      <Header shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
      <Sidebar shoeSidebar={shoeSidebar} setShowSidebar={setShowSidebar} />
      <main className="lg:ml-[260px] pt-[75px] transition-all min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;