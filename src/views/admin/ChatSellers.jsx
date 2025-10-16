import { useEffect, useState, useRef } from "react";
import { FaList } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { BsEmojiSmile } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { socket } from '../../utils/utils';
import { get_admin_message, get_sellers, messageClear, send_message_seller_admin, updateAdminMessage } from "../../store/Reducers/chatReducer";


const ChatSellers = () => {
  const scrollRef = useRef();
  const { sellerId } = useParams();
  const dispatch = useDispatch();
  const { sellers, activeSellers, currentSeller, seller_admin_message, successMessage } = useSelector(state => state.chat);
  const {token, userInfo } = useSelector(state => state.auth);
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  // sellers list লোড
useEffect(() => {
  if (token) {
    dispatch(get_sellers());
  }
}, [dispatch, token]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !sellerId) return;
    dispatch(send_message_seller_admin({
      // senderId ব্যাকএন্ড req.id থেকেই নেবে
      receverId: sellerId,
      message: text.trim(),
      senderName: userInfo?.name || 'MM Fashion world support',
    }));
    setText('');
  };

 
 // নির্দিষ্ট seller chat লোড
useEffect(() => {
  if (sellerId && token) {
    dispatch(get_admin_message(sellerId));
  }
}, [dispatch, sellerId, token]);

  // after DB insert success -> push realtime to seller
  useEffect(() => {
    if (successMessage && seller_admin_message.length > 0) {
      socket.emit('send_message_admin_to_seller', seller_admin_message[seller_admin_message.length - 1]);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage, seller_admin_message]);

  // receive realtime from seller
  useEffect(() => {
    const handleSellerMsg = (msg) => {
      // only append if current opened chat matches
      if (msg?.senderId === sellerId || msg?.receverId === sellerId) {
        dispatch(updateAdminMessage(msg));
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    socket.on('receved_seller_message', handleSellerMsg);
    return () => socket.off('receved_seller_message', handleSellerMsg);
  }, [dispatch, sellerId]);

  // always scroll to bottom on list change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [seller_admin_message]);

  // register as admin for socket routing
  useEffect(() => {
    if (userInfo?._id) {
      socket.emit('add_admin', {
        id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email
      });
    }
  }, [userInfo?._id, userInfo?.name, userInfo?.email]);

  return (
    <div className="px-2 md:px-7 md:py-5 ">
      <div className="w-full bg-[#283046] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
        <div className="flex w-full h-full relative">
          <div className={`w-[280px] h-full absolute z-10 ${show ? '-left-[16px]' : '-left-[336px]'} md:left-0 md:relative transition-all`}>
            <div className="w-full h-[calc(100vh-177px)] bg-[#252b3b] md:bg-transparent overflow-y-auto p-1">
              <div className="flex text-xl justify-between items-center p-4 md:px-3 md:pb-3 text-white">
                <h2>Sellers</h2>
                <span onClick={() => setShow(false)} className="block cursor-pointer md:hidden bg-[#108062] hover:bg-[#108062d0] rounded-full p-[2px]"><IoCloseSharp /></span>
              </div>
              {sellers?.map((s, i) => (
                <Link to={`/admin/dashboard/chat-seller/${s._id}`} key={i} className={`h-[60px] flex justify-start items-center gap-2 text-white  px-2 py-2 rounded-sm cursor-pointer mb-1 ${sellerId === s._id ? 'bg-slate-700' : ''}`}>
                  <div className="relative">
                    <img className='w-[38px] h-[38px] border-white border-2 max-w-[38px] p-[2px] rounded-full' src={s.image || "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png"} alt="seller_image" />
                    {activeSellers.some(a => a.sellerId === s._id) && <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0" />}
                  </div>
                  <div className="flex justify-center items-start flex-col w-full">
                    <div className="flex justify-between items-center w-full ">
                      <h2 className="text-base font-semibold">{s.name}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
            <div className="flex justify-between items-center">
              {sellerId && (
                <div className='flex justify-start items-center gap-3'>
                  <div className='relative'>
                    <img className='w-[42px] h-[42px] border-green-500 border-2  p-[2px] rounded-full' src={currentSeller?.image || "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png"} alt="current_seller" />
                     {activeSellers.some(a => a.sellerId === currentSeller._id) && <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0" />}
                  </div>
                  <span className='text-white'>{currentSeller?.name}</span>
                </div>
              )}
              <div onClick={() => setShow(!show)} className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-[#108062] shadow-lg hover:shadow-blue-500/50 justify-center cursor-pointer items-center text-white">
                <span><FaList /></span>
              </div>
            </div>

            <div className="py-4">
              <div className='bg-slate-800 h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto'>
                {sellerId ? seller_admin_message.map((m, i) => {
                  if (m.senderId === sellerId) {
                    return (
                      <div key={i} className='w-full flex justify-start items-center'>
                        <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                          <div>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src={currentSeller?.image || "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png"} alt="current_seller_image" />
                          </div>
                          <div className='flex justify-center items-start flex-col w-full bg-orange-500 shadow-lg shadow-orange-500/50 text-white py-1 px-2 rounded-sm'>
                            <span>{m.message}</span>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={i} className='w-full flex justify-end items-center'>
                        <div className='flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]'>
                          <div className='flex justify-center items-start flex-col w-full bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm'>
                            <span>{m.message}</span>
                          </div>
                          <div>
                            <img className='w-[38px] h-[38px] border-2 border-white rounded-full max-w-[38px] p-[3px]' src={userInfo?.image || "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png"} alt="user_info_image" />
                          </div>
                        </div>
                      </div>
                    )
                  }
                }) : (
                  <div className='w-full h-full flex justify-center items-center flex-col gap-2 text-white'>
                    <span><BsEmojiSmile /></span>
                    <span>Select seller</span>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </div>

            <form onSubmit={send} className="flex gap-3 ">
              <input required value={text} onChange={(e) => setText(e.target.value)} readOnly={!sellerId} className="w-full justify-between items-center px-2 border border-slate-700 focus:border-[#108062] rounded-md outline-none py-[5px] bg-transparent text-[#d0d2d6]" type="text" placeholder="type your message" />
              <button disabled={!sellerId} className={`bg-cyan-500 shadow-lg hover:shadow-cyan-500/50 font-semibold w-[85px] h-[35px] flex items-center gap-1 px-3 ${sellerId ? 'cursor-pointer' : ''}`}>Send <IoIosSend /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSellers;