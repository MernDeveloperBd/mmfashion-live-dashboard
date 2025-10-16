import { useEffect, useState } from "react";
import { HiMiniArrowDownTray } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import { useSelector, useDispatch } from 'react-redux';
import { get_admin_orders } from "../../store/Reducers/orderReducer";

const Orders = () => {
  const dispatch = useDispatch();
  const { totalOrder, myOrders } = useSelector(state => state.order);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [openId, setOpenId] = useState(null); // which row is open

  useEffect(() => {
    dispatch(get_admin_orders({
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue
    }));
  }, [perPage, dispatch, currentPage, searchValue]);

  const toggle = (id) => {
    setOpenId(prev => prev === id ? null : id);
  };

  const fmtPrice = (n) => (typeof n === 'number' ? n.toLocaleString() : n);
  const badge = (type, val) => {
    const base = 'px-2 py-1 rounded text-xs';
    if (type === 'payment') {
      if (val === 'paid') return `${base} bg-emerald-600/20 text-emerald-300`;
      if (val === 'unpaid' || val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
      return `${base} bg-slate-600/20 text-slate-300`;
    }
    // delivery
    if (val === 'delivered' || val === 'completed') return `${base} bg-emerald-600/20 text-emerald-300`;
    if (val === 'cancelled') return `${base} bg-rose-600/20 text-rose-300`;
    if (val === 'pending' || val === 'processing') return `${base} bg-amber-600/20 text-amber-300`;
    return `${base} bg-slate-600/20 text-slate-300`;
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <div className="flex justify-between items-center gap-3">
          <select
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            value={perPage}
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <input
            value={searchValue}
            onChange={e => { setSearchValue(e.target.value); setCurrentPage(1); }}
            type="text"
            placeholder="Search by order id or customer"
            className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-white w-full md:w-80"
          />
        </div>
      </div>

      <div className="relative mt-5 overflow-x-auto">
        <div className="w-full text-sm text-left bg-[#283046] rounded-md">
          {/* Header */}
          <div className="text-xs uppercase border-b border-slate-700 text-[#d0d2d6] px-5 py-3">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-4">Order Id</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Payment Status</div>
              <div className="col-span-2">Order Status</div>
              <div className="col-span-1">Action</div>
              <div className="col-span-1 flex justify-end">
                <HiMiniArrowDownTray />
              </div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-700">
            {myOrders?.length ? myOrders.map((o) => (
              <div key={o?._id} className="px-5">
                {/* Top row */}
                <div className="grid grid-cols-12 items-center text-[#d0d2d6] py-3">
                  <div className="col-span-4 font-medium truncate" title={o?._id}>
                    #{o?._id}
                  </div>
                  <div className="col-span-2">Tk {fmtPrice(o?.price)}</div>
                  <div className="col-span-2">
                    <span className={badge('payment', o?.payment_status)}>
                      {o?.payment_status || '-'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={badge('delivery', o?.delivery_status)}>
                      {o?.delivery_status || '-'}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <Link
                      to={`/admin/dashboard/order/details/${o?._id}`}
                      className="inline-block px-3 py-1 bg-green-500 text-white rounded hover:shadow-lg hover:shadow-green-500/30"
                    >
                      
                      View
                    </Link>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => toggle(o?._id)}
                      aria-expanded={openId === o?._id}
                      className="p-2 hover:bg-slate-700/50 rounded transition"
                      title={openId === o?._id ? 'Collapse' : 'Expand'}
                    >
                      <HiMiniArrowDownTray
                        className={`transition-transform duration-200 ${
                          openId === o?._id ? 'rotate-180' : 'rotate-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded suborders */}
                {openId === o?._id && (
                  <div className="mb-2 rounded-md bg-slate-800/60 text-gray-200">
                    <div className="px-4 py-2 text-xs uppercase text-slate-300 border-b border-slate-700">
                      Sub Orders
                    </div>
                    <div className="divide-y divide-slate-700">
                      {o?.suborder?.length ? o.suborder.map((so) => (
                        <div
                          key={so?._id}
                          className="grid grid-cols-12 items-center px-4 py-3"
                        >
                          <div className="col-span-4 font-medium truncate" title={so?._id}>
                            #{so?._id}
                          </div>
                          <div className="col-span-2">Tk {fmtPrice(so?.price)}</div>
                          <div className="col-span-2">
                            <span className={badge('payment', so?.payment_status)}>
                              {so?.payment_status || '-'}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className={badge('delivery', so?.delivery_status)}>
                              {so?.delivery_status || '-'}
                            </span>
                          </div>
                          <div className="col-span-2 text-right">
                            {/* জায়গা ফাঁকা রাখা হলো ভবিষ্যতে অ্যাকশনের জন্য */}
                          </div>
                        </div>
                      )) : (
                        <div className="px-4 py-3 text-slate-400">No sub-orders</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <div className="px-5 py-6 text-center text-slate-400">No orders found</div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalOrder <= perPage ? null : (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOrder}
              perPage={perPage}  /* যদি Pagination perPage চায়, এখানে perPage দিন */
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;