import  { useState } from 'react';
import Search from '../Components/Search';
import Pagination from '../pagination/Pagination';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';

const Discountproduct = () => {
     const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [perPage, setPerPage] = useState(10);
    return (
        <div className="px-2 md:px-7 py-5">
             <div className="w-full p-4 bg-[#283046] rounded-md">
                <Search setPerPage={setPerPage} searchValue={searchValue} setSearchValue={setSearchValue}/>

                 {/* TAble start */}
                        <div className="relative overflow-x-auto mt-5">
                            <table className="w-full text-sm text-left text-[#d0d2d6]">
                                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                                    <tr>
                                        <th scope="col" className="py-3 px-4">No</th>
                                        <th scope="col" className="py-3 px-4">Image</th>
                                        <th scope="col" className="py-3 px-4"> Name</th>
                                        <th scope="col" className="py-3 px-4"> Category</th>
                                        <th scope="col" className="py-3 px-4"> Brand</th>
                                        <th scope="col" className="py-3 px-4"> Price</th>
                                        <th scope="col" className="py-3 px-4"> Old Price</th>
                                        <th scope="col" className="py-3 px-4"> Discount</th>
                                        <th scope="col" className="py-3 px-4"> R Price</th>
                                        <th scope="col" className="py-3 px-4"> Stock</th>
                                        <th scope="col" className="py-3 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        [1, 2, 3, 4, 5].map((d, i) => <tr key={i}>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">{d}</td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <img className='w-[35px] h-[45px]' src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1752338714/profile/d0evumcbn12vlftahfsg.jpg" alt="category_image" />
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>Three piece</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>Fashion</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>Easy</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>1500</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>1750</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>5%</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>1140</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <span>14</span>
                                            </td>
                                            <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                                <div className='flex justify-start items-center gap-2'>
                                                    <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><MdEdit /></Link>
                                                    <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
                                                    <button className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50 cursor-pointer'><MdDelete /></button>

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

export default Discountproduct;