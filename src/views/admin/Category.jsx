import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '../pagination/Pagination';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";

const Category = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [perPage, setPerPage] = useState(10);
    const [show, setShow] = useState(false)
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full flex lg:hidden justify-between items-center bg-[#283046] p-3 gap-2 mb-4 rounded-md shadow">
                <h1 className="text-lg font-semibold text-[#d0d2d6]"> Category</h1>
                <button onClick={() => setShow(true)} 
                    className="ml-auto px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >Add </button>
            </div>
            <div className='flex flex-wrap w-full'>
                <div className='w-full lg:w-7/12'>
                    <div className="w-full bg-[#283046] p-4 rounded-md">
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
                                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                                    <tr>
                                        <th scope="col" className="py-3 px-4">No</th>
                                        <th scope="col" className="py-3 px-4">Image</th>
                                        <th scope="col" className="py-3 px-4"> Name</th>
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
                                                <div className='flex justify-start items-center gap-4'>
                                                    <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><MdEdit /></Link>
                                                    <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><MdDelete /></Link>

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
                {/* right div */}
                <div className={`w-[320px] lg:w-5/12  lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-50 top-0 transition-all duration-500`}>
                    <div className='w-full pl-5'>
                        <div className=" bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                           <div className='flex justify-between items-center'>
                             <h2 className='text-[#d0d2d6] font-semibold text-md mb-4 text-center'>Add Category</h2>
                             <div onClick={()=>setShow(false)} className='block md:hidden bg-gray-800 p-1 cursor-pointer rounded-full hover:bg-[#d0d2d6] transition-all duration-300 hover:text-black'><IoCloseSharp /></div>
                           </div>
                            <form>
                                <div className='flex flex-col w-full gap-1 mb-3'>
                                    <label htmlFor="name">Category Name</label>
                                    <input type="text" placeholder="Category name" id='name' name='category_name' className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-white" />
                                </div>
                                <div>
                                    <label className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500' htmlFor="image">
                                        <span><BsImage /></span>
                                        <span>Select Image</span>
                                    </label>
                                </div>
                                <input className='hidden' type="file" name="image" id="image" />
                                <div className='my-2'>
                                    <button className='primaryBtn w-full'>Add Category</button>
                                </div>
                            </form>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    );
};

export default Category;