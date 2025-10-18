import { useState, useRef, useEffect, useMemo } from "react";
import { FaList } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/utils';
import userImage from '../../assets/seller.png';
import {
  get_customers,
  get_customer_message,
  updateAdminMessage,
  markAsReadByConversation,
  addNotification,
  messageClear,
  send_message,
  updateMessage
} from "../../store/Reducers/chatReducer";

const SellerToCustomer = () => {
  const scrollRef = useRef();
  const { userInfo } = useSelector(state => state.auth);
  const { customers, currentCustomer, messages, successMessage, activeCustomer } = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const [receverMessage, setReceverMessage] = useState('');
  const { customerId } = useParams();
  const [text, setText] = useState('');
  const [show, setShow] = useState(false);

  const customerFallback = "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png";

  // 1) seller-এর customers লিস্ট লোড
  useEffect(() => {
    if (userInfo?._id) dispatch(get_customers(userInfo._id));
  }, [dispatch, userInfo]);

  // 2) কনভারসেশন + unread->read
  useEffect(() => {
    if (customerId) {
      dispatch(get_customer_message(customerId));
      dispatch(markAsReadByConversation({ type: 'customer', senderId: customerId }));
    }
  }, [dispatch, customerId]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(send_message({
      senderId: userInfo._id,
      receverId: customerId,
      text: text.trim(),
      name: userInfo?.shopInfo?.shopName
    }));
    setText('');
  };

  // 3) আমার মেসেজ গেলে সকেটে পুশ
  useEffect(() => {
    if (successMessage) {
      socket.emit('send_seller_message', messages[messages.length - 1]);
      dispatch(messageClear());
    }
  }, [dispatch, messages, successMessage]);

  // 4) কাস্টমার থেকে মেসেজ রিসিভ
  useEffect(() => {
    const handler = (msg) => setReceverMessage(msg);
    socket.on('customer_message', handler);
    return () => socket.off('customer_message', handler);
  }, []);

  useEffect(() => {
    if (receverMessage) {
      if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
        dispatch(updateMessage(receverMessage));
      } else {
        dispatch(addNotification({
          _id: receverMessage._id,
          type: 'customer',
          senderId: receverMessage.senderId,
          name: receverMessage.senderName || 'Customer',
          message: receverMessage.message,
          createdAt: receverMessage.createdAt
        }));
        dispatch(messageClear());
      }
    }
  }, [dispatch, customerId, receverMessage, userInfo]);

  // Admin notification handling
  useEffect(() => {
    dispatch(markAsReadByConversation({ type: 'admin', senderId: 'admin' }));
  }, [dispatch]);

  useEffect(() => {
    const handler = (msg) => {
      dispatch(updateAdminMessage(msg));
      dispatch(addNotification({
        _id: msg._id,
        type: 'admin',
        senderId: 'admin',
        name: msg.senderName || 'Support',
        message: msg.message,
        createdAt: msg.createdAt
      }));
      dispatch(messageClear());
    };
    socket.on('receved_admin_message', handler);
    return () => socket.off('receved_admin_message', handler);
  }, [dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // NEW: customers লিস্ট থেকে active customer বের করি (image/name ফিক্সের জন্য)
  const activeFromList = useMemo(() => {
    const id = customerId?.toString();
    if (!id || !Array.isArray(customers)) return null;
    return customers.find(c => String(c.fdId) === id || String(c._id) === id) || null;
  }, [customers, customerId]);

  // Image/Name priority: from list -> from currentCustomer -> fallback
  const customerImg = activeFromList?.image || currentCustomer?.image || customerFallback;
  const customerName = activeFromList?.name || currentCustomer?.name || 'Customer';
  const activeCustomerIdForOnline = activeFromList?.fdId || currentCustomer?._id || customerId;

  return (
    <div className="px-2 md:px-7 md:py-2 ">
      <div className="w-full bg-[#283046] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
        <div className="flex w-full h-full relative">
          {/* left list */}
          <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all`}>
            <div className="w-full h-[calc(100vh-177px)] bg-[#252b3b] md:bg-transparent overflow-y-auto p-1">
              <div className="flex text-xl justify-between items-center p-4 md:px-3 md:pb-3 text-white">
                <h2>Customers</h2>
                <span onClick={() => setShow(false)} className="block cursor-pointer md:hidden bg-[#108062] hover:bg-[#108062d0] rounded-full p-[2px]">
                  <IoCloseSharp />
                </span>
              </div>

              {customers?.map((c, i) => (
                <Link
                  key={i}
                  to={`/seller/dashboard/chat-customer/${c.fdId}`}
                  className="h-[60px] flex justify-start items-center gap-2 text-white bg-slate-700 px-2 py-2 rounded-sm cursor-pointer mb-1"
                >
                  <div className="relative">
                    <img
                      className="w-[38px] h-[38px] border-white border-2 max-w-[38px] p-[2px] rounded-full object-cover"
                      src={c?.image || customerFallback}
                      alt={c.name}
                      onError={(e) => { e.currentTarget.src = customerFallback; }}
                    />
                    {
                      activeCustomer.some(ac => String(ac.customerId) === String(c.fdId))
                        ? <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-green-500 ring-2 ring-slate-800" />
                        : <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-gray-300 ring-2 ring-slate-800" />
                    }
                  </div>
                  <div className="flex justify-center items-start flex-col w-full">
                    <div className="flex justify-between items-center w-full ">
                      <h2 className="text-[14px] font-semibold">{c.name}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* right chat */}
          <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
            <div className="flex justify-between items-center">
              {customerId && (
                <div className="flex justify-start items-center gap-3">
                  <div className="relative">
                    <img
                      className="w-[42px] h-[42px] max-w-[42px] border-green-500 border-2 p-[2px] rounded-full object-cover"
                      src={customerImg}
                      alt={customerName}
                      onError={(e) => { e.currentTarget.src = customerFallback; }}
                    />
                    {
                      activeCustomer.some(ac => String(ac.customerId) === String(activeCustomerIdForOnline))
                        ? <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-green-500 ring-2 ring-slate-800" />
                        : <span className="absolute right-0 bottom-0 w-[10px] h-[10px] rounded-full bg-gray-300 ring-2 ring-slate-800" />
                    }
                  </div>
                  <h2 className="text-base font-semibold text-white">{customerName}</h2>
                </div>
              )}
              <div onClick={() => setShow(!show)} className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-[#108062] shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white">
                <span><FaList /></span>
              </div>
            </div>

            <div className="py-4">
              <div className="bg-slate-800 h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                {customerId ? messages.map((m, i) => {
                  const isCustomer = m.senderId === customerId;
                  return isCustomer ? (
                    <div ref={scrollRef} key={i} className="w-full flex justify-start items-center">
                      <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                        <div>
                          <img
                            className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full object-cover"
                            src={customerImg}
                            alt="customer"
                            onError={(e) => { e.currentTarget.src = customerFallback; }}
                          />
                        </div>
                        <div className="flex justify-center items-start flex-col bg-orange-500 shadow-lg shadow-orange-500/50 text-white py-1 px-2 rounded-sm">
                          <span>{m.message}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div ref={scrollRef} key={i} className="w-full flex justify-end items-center">
                      <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                        <div className="flex justify-center items-start flex-col bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm">
                          <span>{m.message}</span>
                        </div>
                        <div>
                          <img
                            className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full object-cover"
                            src={userInfo?.image || userImage}
                            alt="seller"
                            onError={(e) => { e.currentTarget.src = userImage; }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }) : null}
                <div ref={scrollRef} />
              </div>
            </div>

            <form onSubmit={send} className="flex gap-3 ">
              <input
                onChange={(e) => setText(e.target.value)}
                value={text}
                className="w-full justify-between items-center px-2 border border-slate-700 focus:border-[#108062] rounded-md outline-none py-[5px] bg-transparent text-[#d0d2d6]"
                type="text"
                placeholder="type your message"
              />
              <button className="bg-cyan-500 shadow-lg hover:shadow-cyan-500/50 font-semibold w-[85px] h-[35px] flex items-center gap-1 px-3 ">
                Send <IoIosSend />
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerToCustomer;