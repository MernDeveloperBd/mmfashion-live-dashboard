

const OrderDetails = () => {
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-xl text-[#d0d2d6]">Order details</h2>
                    <select name="" id="" className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-[#d0d2d6]">
                        <option value="">Pending</option>
                        <option value="">Processing</option>
                        <option value="">Wirehouse</option>
                        <option value="">Placed</option>
                        <option value="">Cancel</option>
                    </select>
                </div>
                {/*  */}
                <div className="p-4">
                    <div className="flex gap-2 text-lg text-[#d0d2d6]">
                        <h2>#254568</h2>
                        <span>15 Oct 2025</span>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-[32%]">
                            <div className="pr-3 text-lg text-[#d0d2d6] ">
                                <div className="flex flex-col gap-1">
                                    <h2 className="pb-2 font-semibold">Deliver to: Fatiha akter</h2>
                                    <p><span className="text-sm">Mohammadpur, Dhaka, house-24, road-17</span></p>
                                </div>
                                <div className="flex justify-start items-center gap-3">
                                    <h2>Payment Staus:</h2>
                                    <span className="text-sm">Paid</span>
                                </div>
                                <span>Price: TK 1570</span>
                                <div className="mt-4 flex gap-4">
                                    <div className="text-[#d0d2d6]">
                                        <div className="flex gap-3 text-base">
                                            <img className='w-[35px] h-[45px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="orderDetails_image" />
                                            <div>
                                                <h2>Pakistani cotton three piece</h2>
                                                <p>
                                                    <span>Brand:</span>
                                                    <span>Brand: Easy</span>
                                                    <span className="text-lg"> Quantity: 2</span>
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/*  */}
                        <div className="w-[68%]">
                            <div className="pl-3">
                                <div className="mt-4 flex flex-col">
                                    <div className="text-[#d0d2d6] mb-6">
                                        <div className="flex justify-start items-center gap-3">
                                            <h2>Seller 1 order:</h2>
                                            <span>Pending</span>
                                        </div>
                                          <div className="flex gap-3 text-base mt-2">
                                            <img className='w-[35px] h-[45px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="orderDetails_image" />
                                            <div>
                                                <h2>Pakistani cotton three piece</h2>
                                                <p>
                                                    <span>Brand:</span>
                                                    <span>Brand: Easy</span>
                                                    <span className="text-lg"> Quantity: 2</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[#d0d2d6]">
                                        <div className="flex justify-start items-center gap-3">
                                            <h2>Seller 2 order:</h2>
                                            <span>Pending</span>
                                        </div>
                                          <div className="flex gap-3 text-base mt-2">
                                            <img className='w-[35px] h-[45px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="orderDetails_image" />
                                            <div>
                                                <h2>Pakistani cotton three piece</h2>
                                                <p>
                                                    <span>Brand:</span>
                                                    <span>Brand: Easy</span>
                                                    <span className="text-lg"> Quantity: 2</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetails;