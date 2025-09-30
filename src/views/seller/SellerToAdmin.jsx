import { IoIosSend } from "react-icons/io";

const SellerToAdmin = () => {
  
    return (
        <div className="px-2 md:px-7 md:py-5 ">
            <div className="w-full bg-[#283046] px-4 py-4 rounded-md h-[calc(100vh-140px)]">
                <div className="flex w-full h-full relative">
                    
                    {/* right */}
                    <div className="w-full  md:pl-4">
                        <div className="flex justify-between items-center">
                             <div className="flex justify-start items-center gap-3">
                                    <div className="relative">
                                        <img className="w-[42px] h-[42px] max-w-[42px] border-green-500 border-2 p-[2px] rounded-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png" alt="" />
                                        <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0">
                                        </div>
                                    </div>
                                        <h2 className="text-base font-semibold text-white">Support</h2>
                                </div>                        
                        </div>
                        {/* chat text area */}
                        <div className="py-4">
                            <div className="bg-slate-800 h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                                {/* first */}
                                <div className="w-full flex justify-start items-center">
                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                        <div>
                                            <img className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png" alt="" />
                                        </div>
                                        <div className="flex justify-center items-start flex-col bg-orange-500 shadow-lg shadow-orange-500/50 text-white py-1 px-2 rounded-sm">
                                            <span>Hi, How are you?</span>
                                        </div>
                                    </div>
                                </div>
                                {/* 2nd */}
                                 <div className="w-full flex justify-end items-center">
                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">                                        
                                        <div className="flex justify-center items-start flex-col bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm">
                                            <span>Hi, How are you?</span>
                                        </div>
                                        <div>
                                            <img className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                                {/* first */}
                                <div className="w-full flex justify-start items-center">
                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                                        <div>
                                            <img className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png" alt="" />
                                        </div>
                                        <div className="flex justify-center items-start flex-col bg-orange-500 shadow-lg shadow-orange-500/50 text-white py-1 px-2 rounded-sm">
                                            <span>Hi, How are you?</span>
                                        </div>
                                    </div>
                                </div>
                                {/* 2nd */}
                                 <div className="w-full flex justify-end items-center">
                                    <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">                                        
                                        <div className="flex justify-center items-start flex-col bg-blue-500 shadow-lg shadow-blue-500/50 text-white py-1 px-2 rounded-sm">
                                            <span>Hi, How are you?</span>
                                        </div>
                                        <div>
                                            <img className="w-[38px] h-[38px] max-w-[38px] border-green-500 border-2 p-[2px] rounded-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1758801906/become_a_selelr_-_mm_fashion_world_aae1wu.png" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="flex gap-3 ">
                            <input className="w-full justify-between items-center px-2 border border-slate-700 focus:border-[#108062] rounded-md outline-none py-[5px] bg-transparent text-[#d0d2d6]" type="text" placeholder="type your message" />
                            <button className="bg-cyan-500 shadow-lg hover:shadow-cyan-500/50 font-semibold w-[85px] h-[35px] flex items-center gap-1 px-3 ">Send <IoIosSend /></button>
                        </form>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SellerToAdmin;