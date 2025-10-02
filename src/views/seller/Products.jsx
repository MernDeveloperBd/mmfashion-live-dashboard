import React, { useEffect, useState } from 'react';
import Search from '../Components/Search';
import Pagination from '../pagination/Pagination';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { get_products } from '../../store/Reducers/productReducer';

const Products = () => {
    const { products, totalProduct } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [perPage, setPerPage] = useState(10);

    //   category get
    useEffect(() => {
        const obj = {
            perPage: parseInt(perPage),
            page: parseInt(currentPage),
            searchValue
        }
        dispatch(get_products(obj))
    }, [searchValue, currentPage, perPage, dispatch])
    console.log(perPage, searchValue, currentPage);

    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full p-4 bg-[#283046] rounded-md">
                <Search setPerPage={setPerPage} searchValue={searchValue} setSearchValue={setSearchValue} />

                {/* TAble start */}
                <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm text-left text-[#d0d2d6]">
                        <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-4 text-xs">No</th>
                                <th scope="col" className="py-3 px-4 text-xs">Image</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Name</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Category</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Brand</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Price</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Old Price</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Discount</th>
                                <th scope="col" className="py-3 px-4 text-xs"> R Price</th>
                                <th scope="col" className="py-3 px-4 text-xs"> Stock</th>
                                <th scope="col" className="py-3 px-4 text-xs">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products?.length > 0 && products.map((item, i) => <tr key={i}>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">{i + 1}</td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <img className='w-[35px] h-[45px]' src={item?.images[0]} alt="category_image" />
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.name}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.category}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.brand}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.price}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.oldPrice}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.discount}%</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.resellingPrice}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <span>{item?.stock}</span>
                                    </td>
                                    <td scope="col" className="py-1 px-4 font-medium whitespace-normal">
                                        <div className='flex justify-start items-center gap-2'>
                                            <Link to={`/seller/edit-product/${item?._id}`} className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><MdEdit /></Link>
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
                {
                    totalProduct <= perPage ? "" : <div className="w-full flex justify-end mt-4">
                    <Pagination
                        pageNumber={currentPage}
                        setPageNumber={setCurrentPage}
                        totalItem={50}
                        perPage={perPage}
                        showItem={7}
                    />
                </div>
                }
                
            </div>

        </div>
    );
};

export default Products;