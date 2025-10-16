import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../pagination/Pagination';
import { FaEye } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { get_deactive_sellers } from '../../store/Reducers/sellerReducer';

const DeactiveSellers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(5);

  const { sellers, totalSellers } = useSelector(state => state.seller);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(get_deactive_sellers({
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue
      }));
    }
  }, [searchValue, token, dispatch, currentPage, perPage]);

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className="flex justify-between items-center">
          <select onChange={(e) => setPerPage(parseInt(e.target.value))} className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <input onChange={e => setSearchValue(e.target.value)} value={searchValue} type="text" placeholder="Search" className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white" />
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-2">No</th>
                <th className="py-3 px-2">Image</th>
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((d, i) => (
                <tr key={d?._id || i}>
                  <td className="py-1 px-2">{(currentPage - 1) * perPage + i + 1}</td>
                  <td className="py-1 px-2">
                    <img className='w-[35px] h-[45px] object-cover' src={d?.image} alt="seller_image" />
                  </td>
                  <td className="py-1 px-2">
                    <span>{d?.name}</span>
                  </td>
                  <td className="py-1 px-2">
                    <span>{d?.email}</span>
                  </td>
                  <td className="py-1 px-2">
                    <span>{d?.status}</span>
                  </td>
                  <td className="py-1 px-2">
                    <div className='flex items-center gap-4'>
                      <Link to={`/admin/dashboard/seller/details/${d?._id}`} className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><FaEye /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalSellers > perPage ? ( // fixed condition
          <div className='w-full flex justify-end mt-4'>
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalSellers}
              perPage={perPage}
              showItem={4}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DeactiveSellers;