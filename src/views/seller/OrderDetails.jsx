import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { get_seller_order, messageClear, seller_order_status_update } from '../../store/Reducers/orderReducer';

const clsBadge = (val) => {
  const base = 'px-2 py-1 rounded text-xs';
  if (val === 'delivered' || val === 'placed' || val === 'warehouse') return `${base} bg-emerald-600/20 text-emerald-300`;
  if (val === 'cancelled') return `${base} bg-rose-600/20 text-rose-300`;
  if (val === 'pending' || val === 'processing') return `${base} bg-amber-600/20 text-amber-300`;
  return `${base} bg-slate-600/20 text-slate-300`;
};

const SellerOrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, errorMessage, successMessage, loader } = useSelector(state => state.order);

  const [status, setStatus] = useState('');

  useEffect(() => {
    if (orderId) dispatch(get_seller_order(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    setStatus(order?.delivery_status || 'pending');
  }, [order]);

  const onStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    dispatch(seller_order_status_update({ orderId, info: { status: value } }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const fmtPrice = (n) => (typeof n === 'number' ? n.toLocaleString() : n);
  useEffect(() => {
  if (!orderId) return;
  const t = setInterval(() => dispatch(get_seller_order(orderId)), 95000);
  return () => clearInterval(t);
}, [dispatch,orderId]);

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md ring-1 ring-slate-700/40">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700/60">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl font-semibold">Order details</h2>
            <div className="text-sm text-slate-300 mt-1">
              #{order?._id || '-'} • {order?.date || (order?.createdAt && new Date(order.createdAt).toLocaleString()) || '-'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={clsBadge(status)}>{status}</span>
            <select
              value={status}
              onChange={onStatusChange}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="warehouse">Warehouse</option>
              <option value="placed">Placed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="p-4 text-[#d0d2d6]">
          {loader ? (
            <div className="animate-pulse space-y-4">
              <div className="h-5 w-48 bg-slate-700 rounded" />
              <div className="h-24 bg-slate-700/60 rounded" />
              <div className="h-24 bg-slate-700/60 rounded" />
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Summary */}
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                  <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Sub-order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>Tk {fmtPrice(order?.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment</span>
                      <span className={clsBadge(order?.payment_status)}>{order?.payment_status || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className={clsBadge(order?.delivery_status)}>{order?.delivery_status || '-'}</span>
                    </div>
                    <div className="text-xs text-slate-400 pt-2">
                      Shipping: {order?.shippingInfo || 'MM Fashion World'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Products */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50">
                  <div className="px-4 py-3 border-b border-slate-700/60">
                    <h3 className="text-sm font-semibold uppercase text-slate-300">Products in sub-order</h3>
                  </div>
                  <div className="divide-y divide-slate-700/60">
                    {(order?.products || []).length ? (
                      order.products.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-4">
                          <img
                            className="w-[48px] h-[56px] rounded object-cover"
                            src={p?.images?.[0] || p?.image || 'https://via.placeholder.com/48x56'}
                            alt="product"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-5">{p?.name || 'Product'}</div>
                            <div className="text-xs text-slate-300">
                              <span>Brand: {p?.brand || '-'}</span>
                              <span className="ml-3">Qty: {p?.quantity || 1}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-400">No products</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>No order found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOrderDetails;