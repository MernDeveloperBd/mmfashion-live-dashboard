import { TbCoinTaka } from "react-icons/tb";
import { RiProductHuntLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Chart from 'react-apexcharts';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import moment from 'moment';
import seller from '../../assets/seller.png';
import { get_admin_dashboard_index_data } from "../../store/Reducers/dashboardIndexReducer";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector(state => state.auth);
  const {
    totalSale = 0,
    totalOrder = 0,
    totalProduct = 0,
    totalSeller = 0,
    recentOrders = [],
    recentMessage = []
  } = useSelector(state => state.dashboardIndex);

  useEffect(() => {
    dispatch(get_admin_dashboard_index_data());
  }, [dispatch]);

  const fmtTk = (n) => `TK ${Number(n || 0).toLocaleString()}`;
  const badge = (type, val) => {
    const base = 'px-2 py-1 rounded text-xs';
    if (type === 'payment') {
      if (val === 'paid') return `${base} bg-emerald-600/20 text-emerald-300`;
      if (val === 'unpaid' || val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
      return `${base} bg-slate-600/20 text-slate-300`;
    }
    if (val === 'delivered' || val === 'completed' || val === 'placed' || val === 'warehouse')
      return `${base} bg-emerald-600/20 text-emerald-300`;
    if (val === 'cancelled') return `${base} bg-rose-600/20 text-rose-300`;
    if (val === 'pending' || val === 'processing') return `${base} bg-amber-600/20 text-amber-300`;
    return `${base} bg-slate-600/20 text-slate-300`;
  };

  const chartState = useMemo(() => ({
    series: [
      { name: "Orders", data: [30, 40, 35, 50, 49, 60, 70, 91, 15, 19, 27, 68] },
      { name: "Revenue", data: [50, 47, 35, 50, 59, 40, 10, 41, 25, 19, 27, 78] },
      { name: "Sellers", data: [15, 47, 33, 77, 45, 24, 47, 14, 14, 19, 16, 24] }
    ],
    options: {
      chart: { background: 'transparent', foreColor: '#d0d2d6', toolbar: { show: false }, height: 360 },
      colors: ['#00E396', '#FEB019', '#008FFB'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      grid: { borderColor: '#334155' },
      xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
      legend: { position: 'top', labels: { colors: '#d0d2d6' } },
      responsive: [
        { breakpoint: 1280, options: { chart: { height: 340 } } },
        { breakpoint: 1024, options: { chart: { height: 320 } } },
        { breakpoint: 768,  options: { chart: { height: 300 } } },
        { breakpoint: 640,  options: { chart: { height: 280 } } },
      ]
    }
  }), []);

  return (
    <div className="px-2 md:px-7 md:py-5">
      {/* Stat cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{fmtTk(totalSale)}</h2>
            <span className="text-xs sm:text-sm">Total Sales</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-600/20 flex justify-center items-center text-xl sm:text-2xl">
            <TbCoinTaka className="text-emerald-300" />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{totalProduct}</h2>
            <span className="text-xs sm:text-sm">Products</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-indigo-600/20 flex justify-center items-center text-xl sm:text-2xl">
            <RiProductHuntLine className="text-indigo-300" />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{totalSeller}</h2>
            <span className="text-xs sm:text-sm">Sellers</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-600/20 flex justify-center items-center text-xl sm:text-2xl">
            <FaUsers className="text-cyan-300" />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{totalOrder}</h2>
            <span className="text-xs sm:text-sm">Orders</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600/20 flex justify-center items-center text-xl sm:text-2xl">
            <AiOutlineShoppingCart className="text-amber-300" />
          </div>
        </div>
      </div>

      {/* Chart + Messages */}
      <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-4 mt-5">
        <div className="w-full lg:w-7/12">
          <div className="w-full bg-[#283046] p-3 sm:p-4 rounded-xl ring-1 ring-slate-700/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#d0d2d6] font-semibold">Overview</h3>
            </div>
            <Chart options={chartState.options} series={chartState.series} type="area" width="100%" height={chartState.options.chart.height} />
          </div>
        </div>

        <div className="w-full lg:w-5/12">
          <div className="w-full bg-[#283046] p-3 sm:p-4 rounded-xl ring-1 ring-slate-700/50 text-[#d0d2d6]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base sm:text-lg">Recent Seller Messages</h2>
              <Link className="font-semibold text-xs sm:text-sm text-slate-300 hover:text-white">View all</Link>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto pr-1">
              <ol className="relative ml-4">
                {(recentMessage || []).length ? (
                  recentMessage.map((m, i) => (
                    <li key={i} className="mb-4 ml-6">
                      <span className="absolute -left-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-slate-700 overflow-hidden bg-slate-700">
                        {m.senderId === userInfo?._id ? (
                          <img className="w-full h-full object-cover" src={userInfo?.image} alt="admin" />
                        ) : (
                          <img className="w-full h-full object-cover" src={seller} alt="seller" />
                        )}
                      </span>

                      <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{m.senderName}</span>
                          <time className="text-[11px] text-slate-300">
                            {m?.createdAt ? moment(m.createdAt).startOf('minute').fromNow() : '-'}
                          </time>
                        </div>
                        <div className="p-2 text-xs bg-slate-700/60 rounded border border-slate-700">
                          {m.message}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-slate-400 text-sm mt-2">No recent messages</div>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="w-full p-3 sm:p-4 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 mt-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-base sm:text-lg text-[#d0d2d6]">Recent Orders</h2>
          <Link to="/admin/dashboard/orders" className="font-semibold text-xs sm:text-sm text-slate-300 hover:text-white">
            View all
          </Link>
        </div>

        {/* Mobile card list */}
        <div className="mt-3 grid gap-3 md:hidden">
          {(recentOrders || []).length ? (
            recentOrders.map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-800 border border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">#{d?._id}</span>
                  <span>{fmtTk(d?.price)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className={badge('payment', d?.payment_status)}>{d?.payment_status || '-'}</span>
                  <span className={badge('delivery', d?.delivery_status)}>{d?.delivery_status || '-'}</span>
                </div>
                <div className="mt-3">
                  <Link
                    to={`/admin/dashboard/order/details/${d?._id}`}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-400 text-sm">No recent orders</div>
          )}
        </div>

        {/* Desktop table */}
        <div className="relative overflow-x-auto mt-3 hidden md:block">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-xs uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).length ? (
                recentOrders.map((d, i) => (
                  <tr key={i} className="border-b border-slate-800">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">#{d?._id}</td>
                    <td className="py-3 px-4">{fmtTk(d?.price)}</td>
                    <td className="py-3 px-4">
                      <span className={badge('payment', d?.payment_status)}>{d?.payment_status || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={badge('delivery', d?.delivery_status)}>{d?.delivery_status || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/dashboard/order/details/${d?._id}`}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-4 text-slate-400" colSpan={5}>No recent orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;