import { FaList } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// সঠিক রিলেটিভ ইমপোর্ট ব্যবহার করুন (../../src/... ব্যবহার করবেন না)
import { socket } from '../utils/utils';
import { addNotification, markAsReadByConversation } from '../store/Reducers/chatReducer';

const Header = ({ shoeSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector(state => state.auth);
  // notifications null হলে [] নেব
  const notifications = useSelector(state => state.chat.messageNotification) || [];

  const [openNoti, setOpenNoti] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const timeAgo = (ts) => {
    const t = ts ? new Date(ts).getTime() : Date.now();
    const diff = Math.floor((Date.now() - t) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 7 * 86400) return `${Math.floor(diff / 86400)}d`;
    return new Date(t).toLocaleDateString();
  };

  // বর্তমান রাউট কাস্টমার চ্যাট কি না
  const isOnCustomerChat = useCallback((customerId) => {
    return location.pathname.startsWith('/seller/dashboard/chat-customer/')
      && location.pathname.endsWith(`/${customerId}`);
  }, [location.pathname]);

  // বর্তমান রাউট অ্যাডমিন/সাপোর্ট চ্যাট কি না (তোমার রাউট: /seller/dashboard/chat-support)
  const isOnAdminChat = useMemo(() => {
    return location.pathname.includes('/seller/dashboard/chat-support');
  }, [location.pathname]);

  // ইনকামিং মেসেজ লিসেনার
  useEffect(() => {
    if (!socket) return;

    const onCustomerMessage = (msg) => {
      if (isOnCustomerChat(msg?.senderId)) return;
      dispatch(addNotification({
        _id: msg?._id,
        type: 'customer',
        senderId: msg?.senderId,
        name: msg?.senderName || 'Customer',
        message: msg?.message,
        createdAt: msg?.createdAt
      }));
    };

    const onAdminMessage = (msg) => {
      // সাপোর্ট চ্যাটে থাকলে নোটিফিকেশন না
      if (isOnAdminChat) return;
      dispatch(addNotification({
        _id: msg?._id,
        type: 'admin',
        senderId: 'admin',
        name: msg?.senderName || 'Support',
        message: msg?.message,
        createdAt: msg?.createdAt
      }));
    };

    socket.on('customer_message', onCustomerMessage);
    socket.on('receved_admin_message', onAdminMessage);

    return () => {
      socket.off('customer_message', onCustomerMessage);
      socket.off('receved_admin_message', onAdminMessage);
    };
  }, [dispatch, isOnCustomerChat, isOnAdminChat]);

  const goToConversation = (n) => {
    if (n.type === 'customer') {
      navigate(`/seller/dashboard/chat-customer/${n.senderId}`);
      dispatch(markAsReadByConversation({ type: 'customer', senderId: n.senderId }));
    } else if (n.type === 'admin') {
      navigate(`/seller/dashboard/chat-support`);
      dispatch(markAsReadByConversation({ type: 'admin', senderId: 'admin' }));
    }
    setOpenNoti(false);
  };

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#header-noti-root')) {
        setOpenNoti(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // প্রোফাইল নাম + ইমেজ fallback
  const displayName = userInfo?.name || userInfo?.shop?.name || '';
  const profileImage = userInfo?.image
    || userInfo?.shop?.image
    || "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png";

  return (
    <div className="fixed top-0 left-0 w-full py-1 px-2 lg:px-7 z-40">
      <div className="ml0 lg:ml-[260px] rounded-md h-[65px] flex justify-between items-center bg-[#283046] text-[#d0d2d6] px-5 transition-all">
        <div onClick={() => setShowSidebar(!shoeSidebar)} className="w-[35px] flex lg:hidden h-[35px] rounded-sm bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer">
          <span><FaList /></span>
        </div>

        <div className="hidden md:block">
          <input className="px-3 py-2 outline-none border bg-transparent border-slate-700 rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden" type="text" name="search" placeholder="search" />
        </div>

        <div id="header-noti-root" className="flex justify-center items-center gap-6 relative">
          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setOpenNoti(v => !v)}
              className="w-[38px] h-[38px] rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-xl cursor-pointer"
              aria-label="Notifications"
            >
              <IoNotificationsOutline />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[12px] leading-none rounded-full px-1.5 py-0.5">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}

            {openNoti && (
              <div className="absolute right-0 mt-2 w-[320px] max-h-[380px] overflow-y-auto bg-[#252b3b] border border-slate-700 rounded-md shadow-xl">
                <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  {unreadCount > 0 ? (
                    <span className="text-xs text-slate-300">{unreadCount} new</span>
                  ) : (
                    <span className="text-xs text-slate-400">No new</span>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="px-3 py-6 text-slate-400 text-sm flex items-center justify-center">
                    No notifications
                  </div>
                ) : (
                  <ul className="py-1">
                    {notifications.slice(0, 10).map((n) => (
                      <li
                        key={n._id || n.id}
                        onClick={() => goToConversation(n)}
                        className={`px-3 py-2 cursor-pointer hover:bg-slate-700 ${!n.read ? 'bg-slate-800/60' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-[13px] font-semibold">
                              {n.type === 'admin' ? 'Support' : (n.name || 'Customer')}
                            </div>
                            <div className="text-[12px] text-slate-300 truncate">
                              {n.message}
                            </div>
                          </div>
                          <div className="text-[11px] text-slate-400 whitespace-nowrap">
                            {timeAgo(n.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex justify-center items-center gap-x-2">
            <div className="flex justify-center items-center flex-col text-end">
              <h2 className="text-sm font-bold">{displayName}</h2>
              <span className="text-[14px] w-full font-normal">{userInfo?.role || ''}</span>
            </div>
            {(userInfo?.role === 'admin' || userInfo?.role === 'seller') ? (
              <img
                className='w-[45px] h-[45px] rounded-full overflow-hidden object-cover'
                src={profileImage}
                alt="admin_image"
                onError={(e) => { e.currentTarget.src = "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png"; }}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;