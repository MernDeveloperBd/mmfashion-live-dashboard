import { useState } from "react";
import Search from "../Components/Search";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import Pagination from "../pagination/Pagination";


const Orders = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [perPage, setPerPage] = useState(10);
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <Search setPerPage={setPerPage} searchValue={searchValue} setSearchValue={setSearchValue} />

                <div className="relative overflow-x-auto mt-6">
                    <table className="w-full text-sm text-left text-[#d0d2d6]">
                        <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-4">Order id</th>
                                <th scope="col" className="py-3 px-4">Price</th>
                                <th scope="col" className="py-3 px-4">Payment Status</th>
                                <th scope="col" className="py-3 px-4">Order Status</th>
                                <th scope="col" className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [1, 2, 3, 4].map((d, i) => <tr key={i}>
                                    <td scope="col" className="py-4 px-4 font-medium whitespace-normal">#254685</td>
                                    <td scope="col" className="py-4 px-4 font-medium whitespace-normal">TK652</td>
                                    <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                        <span>Pending</span>
                                    </td>
                                    <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                        <span>Pending</span>
                                    </td>
                                    <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                        <div className='flex justify-start items-center gap-2'>
                                            <Link to={`/seller/order/details/1`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>

                                        </div>
                                    </td>
                                </tr>)
                            }

                        </tbody>
                    </table>

                </div>
                 {/* pagination */}
                        <div className="w-full flex justify-end mt-4">
                            <Pagination
                                pageNumber={currentPage}
                                setPageNumber={setCurrentPage}
                                totalItem={50}
                                perPage={perPage}
                                showItem={7}
                            />
                        </div>
            </div>
        </div>
    );
};

export default Orders;