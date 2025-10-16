import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../pagination/Pagination';
import { FaEye } from 'react-icons/fa6';
import { get_seller_request } from '../../store/Reducers/sellerReducer';
import Search from '../Components/Search';

const SellerRequest = () => {
  const dispatch = useDispatch();
  const { sellers = [], totalSeller = 0 } = useSelector(state => state.seller);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    dispatch(get_seller_request({
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue
    }));
  }, [dispatch, currentPage, perPage, searchValue]);

  const startIndex = useMemo(() => (currentPage - 1) * perPage, [currentPage, perPage]);

  const chip = (val, type) => {
    const base = 'px-2 py-1 rounded text-xs';
    if (type === 'payment') {
      if (val === 'active') return `${base} bg-emerald-600/20 text-emerald-300`;
      if (val === 'inactive' || val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
      return `${base} bg-slate-600/20 text-slate-300`;
    }
    // status chip
    if (val === 'active') return `${base} bg-emerald-600/20 text-emerald-300`;
    if (val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
    if (val === 'deactive' || val === 'rejected') return `${base} bg-rose-600/20 text-rose-300`;
    return `${base} bg-slate-600/20 text-slate-300`;
  };

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md ring-1 ring-slate-700/40">
        {/* Search */}
        <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue} />

        {/* Mobile card list */}
        <div className="mt-4 grid gap-3 md:hidden">
          {sellers.length ? sellers.map((seller, i) => (
            <div key={seller?._id || i} className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-[#d0d2d6]">
              <div className="flex justify-between text-sm">
                <span className="font-medium">#{startIndex + i + 1}</span>
                <Link
                  to={`/admin/dashboard/seller/details/${seller?._id}`}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                >
                  <FaEye /> View
                </Link>
              </div>
              <div className="mt-2">
                <div className="text-sm"><span className="text-slate-300">Name:</span> {seller?.name || '—'}</div>
                <div className="text-sm"><span className="text-slate-300">Email:</span> {seller?.email || '—'}</div>
              </div>
              <div className="flex justify-between mt-3">
                <span className={chip(seller?.payment, 'payment')}>{seller?.payment || '—'}</span>
                <span className={chip(seller?.status, 'status')}>{seller?.status || '—'}</span>
              </div>
            </div>
          )) : (
            <div className="text-slate-400 text-sm">No seller requests found</div>
          )}
        </div>

        {/* Desktop table */}
        <div className="relative overflow-x-auto mt-4 hidden md:block">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="py-2 px-2">No</th>
                <th className="py-2 px-2">Name</th>
                <th className="py-2 px-2">Email</th>
                <th className="py-2 px-2">Payment</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.length ? sellers.map((seller, i) => (
                <tr key={seller?._id || i} className="border-b border-slate-800">
                  <td className="py-2 px-2">{startIndex + i + 1}</td>
                  <td className="py-2 px-2">{seller?.name || '—'}</td>
                  <td className="py-2 px-2">{seller?.email || '—'}</td>
                  <td className="py-2 px-2">
                    <span className={chip(seller?.payment, 'payment')}>
                      {seller?.payment || '—'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={chip(seller?.status, 'status')}>
                      {seller?.status || '—'}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <Link
                      to={`/admin/dashboard/seller/details/${seller?._id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <FaEye /> View
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="py-4 px-2 text-slate-400" colSpan={6}>
                    No seller requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalSeller > perPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalSeller}
              perPage={perPage}
              showItem={7}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRequest;