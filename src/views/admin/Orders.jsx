import { useState } from "react";
import { HiMiniArrowDownTray } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { BsArrowBarUp } from "react-icons/bs";
import Pagination from "../pagination/Pagination";

const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [perPage, setPerPage] = useState(10);
    const [show, setShow] = useState(false)
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <div className="flex justify-between items-center">
                    <select onChange={(e) => setPerPage(parseInt(e.target.value))} className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-[#d0d2d6]">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                    <input type="text" placeholder="Search" className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-white" />
                </div>
            </div>
            {/*  */}
            <div className="relative mt-5 overflow-x-auto">
                <div className="w-full text-sm text-left bg-[#283046] p-5">
                    <div className="text-sm   uppercase border-b border-slatea-700  text-[#d0d2d6]">
                        <div className="flex justify-between items-start">
                            <div className="py-3 w-[25%]">Order Id</div>
                            <div className="py-3 w-[13%]">Price</div>
                            <div className="py-3 w-[18%]">Payment Status</div>
                            <div className="py-3 w-[18%]">Order Status</div>
                            <div className="py-3 w-[18%]">Action</div>
                            <div className="py-3 w-[8%]">
                                <HiMiniArrowDownTray />
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div>
                        <div className="flex justify-between items-start border-b border-slate-700 text-[#d0d2d6]">
                            <div className="py-4 w-[25%]">#45465722 </div>
                            <div className="py-4 w-[13%]">TK 265</div>
                            <div className="py-4 w-[18%]">Pending</div>
                            <div className="py-4 w-[18%]">Pending</div>
                            <div onClick={() => setShow(!show)} className="py-4 w-[18%]">
                                <Link>View</Link>
                            </div>
                            <div className="py-3 w-[8%]">
                                {
                                    show ? <HiMiniArrowDownTray className="rotate-180" /> : <HiMiniArrowDownTray />
                                }

                            </div>
                        </div>
                        {/*  */}
                        <div className={`${show ? 'block border-b border-slate-700 bg-slate-800' : 'hidden'}`}>
                            <div className="flex justify-start items-start border-b border-slate-700 text-[#d0d2d6] px-2">
                                <div className="py-4 w-[25%]">#45465722 </div>
                                <div className="py-4 w-[13%]">TK 265</div>
                                <div className="py-4 w-[18%]">Pending</div>
                                <div className="py-4 w-[18%]">Pending</div>

                            </div>
                            <div className="flex justify-start items-start border-b border-slate-700 text-[#d0d2d6] px-2">
                                <div className="py-4 w-[25%]">#45465722 </div>
                                <div className="py-4 w-[13%]">TK 265</div>
                                <div className="py-4 w-[18%]">Pending</div>
                                <div className="py-4 w-[18%]">Pending</div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-start border-b border-slate-700 text-[#d0d2d6]">
                            <div className="py-4 w-[25%]">#45465722 </div>
                            <div className="py-4 w-[13%]">TK 265</div>
                            <div className="py-4 w-[18%]">Pending</div>
                            <div className="py-4 w-[18%]">Pending</div>
                            <div onClick={() => setShow(!show)} className="py-4 w-[18%]">
                                <Link>View</Link>
                            </div>
                            <div className="py-3 w-[8%]">
                                {
                                    show ? <HiMiniArrowDownTray className="rotate-180" /> : <HiMiniArrowDownTray />
                                }

                            </div>
                        </div>
                        {/*  */}
                        <div className={`${show ? 'block border-b border-slate-700 bg-slate-800' : 'hidden'}`}>
                            <div className="flex justify-start items-start border-b border-slate-700 text-[#d0d2d6] px-2">
                                <div className="py-4 w-[25%]">#45465722 </div>
                                <div className="py-4 w-[13%]">TK 265</div>
                                <div className="py-4 w-[18%]">Pending</div>
                                <div className="py-4 w-[18%]">Pending</div>

                            </div>
                            <div className="flex justify-start items-start border-b border-slate-700 text-[#d0d2d6] px-2">
                                <div className="py-4 w-[25%]">#45465722 </div>
                                <div className="py-4 w-[13%]">TK 265</div>
                                <div className="py-4 w-[18%]">Pending</div>
                                <div className="py-4 w-[18%]">Pending</div>

                            </div>
                        </div>
                    </div>

                </div>
                {/* pagination */}
                <div className="w-full flex justify-end mt-4">
                    <Pagination
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={500}
                        perPage={perPage}
                        showItem={7}
                    />
                </div>
            </div>
        </div>
    );
};

export default Orders;