import  { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import { FaEye } from 'react-icons/fa6';

const Sellers = () => {
    const [currentPage, setCurrentPage] = useState(1)
        const [searchValue, setSearchValue] = useState('')
        const [perPage, setPerPage] = useState(10);
        const [show, setShow] = useState(false)
    return (
        <div className="px-2 md:px-7 md:py-5">
           <div className="w-full bg-[#283046] p-4 rounded-md">
            {/* search start */}
             <div className="flex justify-between items-center">
                            <select onChange={(e) => setPerPage(parseInt(e.target.value))} className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-[#d0d2d6]">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <input type="text" placeholder="Search" className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-white" />
                        </div>
            {/* search end */}
             {/* TAble start */}
                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left text-[#d0d2d6]">
                                <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
                                    <tr>
                                        <th scope="col" className="py-3 px-2">No</th>
                                        <th scope="col" className="py-3 px-2">Image</th>
                                        <th scope="col" className="py-3 px-2"> Name</th>
                                        <th scope="col" className="py-3 px-2">Shop Name</th>
                                        <th scope="col" className="py-3 px-2">Payment Status</th>
                                        <th scope="col" className="py-3 px-2">Email</th>
                                        <th scope="col" className="py-3 px-2">Division</th>
                                        <th scope="col" className="py-3 px-2">District</th>
                                        <th scope="col" className="py-3 px-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [1, 2, 3, 4, 5].map((d, i) => <tr key={i}>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">{d}</td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <img className='w-[35px] h-[45px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="category_image" />
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>Marifa akter</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>Kenakata bazar bd</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>Pending</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>marifa@misam.com</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>Dhaka</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <span>Dhaka</span>
                                            </td>
                                            <td scope="col" className="py-1 px-2 font-medium whitespace-normal">
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEye /></Link>
                                                    

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

export default Sellers;