

const SellerDetails = () => {
    return (
        <div className="px-2 md:px-7 md:py-5">
            <div className="w-full bg-[#283046] p-4 rounded-md">
                <div className="w-full flex flex-wrap text-[#d0d2d6]">
                    <div className="w-3/12 flex justify-center items-center py-3">
                        <div>
                            <img className='w-full h-[230px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="category_image" />
                        </div>
                    </div>
                    {/* middle */}
                    <div className="w-4/12">
                        <div className="px-0 md:px-5 py-2">
                            <div className="py-2 text-lg">
                                <h2>Basic info</h2>
                            </div>
                            <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                                <div className="flex gap-2">
                                    <span>Name:</span>
                                    <span>Marifa akter</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Email:</span>
                                    <span>marifa@misam.com</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Role:</span>
                                    <span>Seller</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Status:</span>
                                    <span>Pending</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Payment Account:</span>
                                    <span>Active</span>
                                </div>
                            </div>

                        </div>

                    </div>
                    {/* right */}
                    <div className="w-4/12">
                        <div className="px-0 md:px-5 py-2">
                            <div className="py-2 text-lg">
                                <h2>Address</h2>
                            </div>
                            <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                                <div className="flex gap-2">
                                    <span>Shop Name:</span>
                                    <span>MM Fashion world</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Divisiion:</span>
                                    <span>Dhaka</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>District:</span>
                                    <span>Dhaka</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Sub District:</span>
                                    <span>Nawabgonj</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* select option */}
                <div>
                    <form>
                        <div className="flex gap-4 py-3">
                            <select className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-[#d0d2d6]" name="" id="">
                                <option value="">...Select...</option>
                                <option value="active">Active</option>
                                <option value="deactive">Deactive</option>
                            </select>

                            <button className='bg-[#108062] hover:bg-[#108062d0] rounded-sm px-7 py-2 text-white font-semibold  '>Submit</button>


                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerDetails;