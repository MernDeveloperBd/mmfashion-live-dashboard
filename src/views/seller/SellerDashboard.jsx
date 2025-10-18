import { TbCoinTaka } from "react-icons/tb";
import { RiProductHuntLine } from "react-icons/ri";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Chart from 'react-apexcharts';
import { Link } from "react-router-dom";
import customer from '../../assets/seller.png';
import { useSelector, useDispatch } from 'react-redux';
import { get_seller_dashboard_index_data } from '../../store/Reducers/dashboardIndexReducer';
import moment from 'moment';
import { useEffect, useMemo } from "react";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const {
    totalSale = 0,
    totalOrder = 0,
    totalProduct = 0,
    totalPendingOrder = 0,
    recentOrders = [],
    recentMessage = []
  } = useSelector(state => state.dashboardIndex);

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

  // Overview chart base options
  const MONTHS = useMemo(() => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], []);
  const chartBaseOptions = useMemo(() => ({
    chart: { background: 'transparent', foreColor: '#d0d2d6', toolbar: { show: false }, height: 360 },
    colors: ['#00E396', '#FEB019', '#008FFB'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    grid: { borderColor: '#334155' },
    legend: { position: 'top', labels: { colors: '#d0d2d6' } },
    tooltip: { y: { formatter: (val) => Number(val || 0).toLocaleString() } },
    responsive: [
      { breakpoint: 1280, options: { chart: { height: 340 } } },
      { breakpoint: 1024, options: { chart: { height: 320 } } },
      { breakpoint: 768,  options: { chart: { height: 300 } } },
      { breakpoint: 640,  options: { chart: { height: 280 } } },
    ]
  }), []);

  // createdAt না থাকলে date (string) থেকে তারিখ পার্সিং
  const parseOrderMoment = (o) => {
    if (o?.createdAt) {
      const m = moment(o.createdAt);
      if (m.isValid()) return m;
    }
    if (o?.date) {
      const m = moment(o.date, [moment.ISO_8601, 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD'], true);
      if (m.isValid()) return m;
      const fallback = moment(o.date);
      if (fallback.isValid()) return fallback;
    }
    return null;
  };

  // monthly aggregation from recentOrders + total revenue (for top card)
  const { categories, series, revenueTotal } = useMemo(() => {
    const categories = MONTHS;
    const orders = Array(12).fill(0);
    const revenue = Array(12).fill(0);
    const sales = Array(12).fill(0);

    (recentOrders || []).forEach((o) => {
      const m = parseOrderMoment(o);
      if (!m) return;

      // শুধু চলতি বছর চাইলে আনকমেন্ট করুন:
      // if (m.year() !== moment().year()) return;

      const idx = m.month(); // 0-11
      orders[idx] += 1;
      revenue[idx] += Number(o?.price || 0);

      // Sales = products[].quantity এর যোগফল; quantity না থাকলে প্রতি প্রোডাক্ট 1 ধরা হয়েছে
      const qty = Array.isArray(o?.products)
        ? o.products.reduce((sum, p) => sum + (Number(p?.quantity) || 1), 0)
        : 0;
      sales[idx] += qty;
    });

    const revenueTotal = Number(revenue.reduce((a, b) => a + b, 0).toFixed(2));

    return {
      categories,
      series: [
        { name: 'Orders', data: orders },
        { name: 'Revenue', data: revenue.map(n => Number(n.toFixed(2))) },
        { name: 'Sales', data: sales },
      ],
      revenueTotal
    };
  }, [recentOrders, MONTHS]);

  // Top কার্ডে কী দেখাবো: backend totalSale > 0 হলে সেটাই, না হলে চার্টের revenueTotal
  const totalSalesToShow = useMemo(() => {
    const backend = Number(totalSale);
    if (!Number.isNaN(backend) && backend > 0) return backend;
    return revenueTotal;
  }, [totalSale, revenueTotal]);

  useEffect(() => {
    dispatch(get_seller_dashboard_index_data());
  }, [dispatch]);

  return (
    <div className="px-2 md:px-7 md:py-5">
      {/* Stat cards */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{fmtTk(totalSalesToShow)}</h2>
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
            <h2 className="text-xl sm:text-2xl font-bold">{totalOrder}</h2>
            <span className="text-xs sm:text-sm">Orders</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-600/20 flex justify-center items-center text-xl sm:text-2xl">
            <AiOutlineShoppingCart className="text-cyan-300" />
          </div>
        </div>

        <div className="flex justify-between items-center p-4 sm:p-5 bg-[#283046] rounded-xl ring-1 ring-slate-700/50 hover:-translate-y-[2px] transition">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl sm:text-2xl font-bold">{totalPendingOrder}</h2>
            <span className="text-xs sm:text-sm">Pending Orders</span>
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
            <div className="w-full">
              <Chart
                options={{ ...chartBaseOptions, xaxis: { categories } }}
                series={series}
                type="area"
                width="100%"
                height={chartBaseOptions.chart.height}
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-5/12">
          <div className="w-full bg-[#283046] p-3 sm:p-4 rounded-xl ring-1 ring-slate-700/50 text-[#d0d2d6]">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base sm:text-lg">Recent Customer Messages</h2>
              <Link className="font-semibold text-xs sm:text-sm text-slate-300 hover:text-white">View all</Link>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto pr-1">
              <ol className="relative ml-4">
                {(recentMessage || []).length ? (
                  recentMessage.map((m, i) => (
                    <li key={i} className="mb-4 ml-6">
                      <span className="absolute -left-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-slate-700 overflow-hidden bg-slate-700">
                        {m.senderId === userInfo?._id ? (
                          <img className="w-full h-full object-cover" src={userInfo?.image} alt="me" />
                        ) : (
                          <img className="w-full h-full object-cover" src={customer} alt="customer" />
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
          <Link to="/seller/dashboard/orders" className="font-semibold text-xs sm:text-sm text-slate-300 hover:text-white">
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
                    to={`/seller/order/details/${d?._id}`}
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
                <th className="py-3 px-4">Payment</th>
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
                        to={`/seller/order/details/${d?._id}`}
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

export default SellerDashboard;