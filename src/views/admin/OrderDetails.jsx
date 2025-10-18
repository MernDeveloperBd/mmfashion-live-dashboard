import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  get_admin_order,
  admin_order_status_update,
  get_bkash_by_order,
  approve_bkash_payment,
  reject_bkash_payment,
  messageClear
} from '../../store/Reducers/orderReducer';

import { FiHash, FiCalendar, FiUser, FiMapPin, FiPackage } from 'react-icons/fi';

// NEW: import the component
import BkashManualPay from '../Components/BkashManualPay';

const badgeCls = (type, val) => {
  const base = 'px-2 py-1 rounded text-xs';
  if (type === 'payment') {
    if (val === 'paid') return `${base} bg-emerald-600/20 text-emerald-300`;
    if (val === 'unpaid' || val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
    return `${base} bg-slate-600/20 text-slate-300`;
  }
  // delivery
  if (val === 'delivered' || val === 'completed' || val === 'placed' || val === 'warehouse')
    return `${base} bg-emerald-600/20 text-emerald-300`;
  if (val === 'cancelled') return `${base} bg-rose-600/20 text-rose-300`;
  if (val === 'pending' || val === 'processing') return `${base} bg-amber-600/20 text-amber-300`;
  return `${base} bg-slate-600/20 text-slate-300`;
};

const skeleton = (
  <div className="animate-pulse space-y-4">
    <div className="h-6 w-48 bg-slate-700 rounded" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-slate-800/50 rounded-md p-4 space-y-3">
        <div className="h-4 bg-slate-700 rounded w-2/3" />
        <div className="h-4 bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-slate-700 rounded w-1/2" />
        <div className="h-4 bg-slate-700 rounded w-3/5" />
      </div>
      <div className="bg-slate-800/50 rounded-md p-4 lg:col-span-2 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-700/60 rounded" />
        ))}
      </div>
    </div>
  </div>
);

const OrderDetails = () => {
  const { orderId } = useParams(); // route: /admin/dashboard/order/details/:orderId
  const dispatch = useDispatch();

  const {
    order, errorMessage, successMessage, loader,
    bkashPayments = [], verifyLoading = false
  } = useSelector(state => state.order);

  const [status, setStatus] = useState('');
  

  // Order লোড
  useEffect(() => {
    if (orderId) dispatch(get_admin_order(orderId));
  }, [dispatch, orderId]);

  // bKash submissions লোড
  useEffect(() => {
    if (orderId) dispatch(get_bkash_by_order(orderId));
  }, [dispatch, orderId]);

  // Toasts
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage, errorMessage]);

  // delivery status local state
  useEffect(() => {
    setStatus(order?.delivery_status || 'pending');
  }, [order]);

  const status_update = (e) => {
    const val = e.target.value;
    dispatch(admin_order_status_update({ orderId, info: { status: val } }));
    setStatus(val);
  };

  const shipping = order?.shippingInfo || {};
  const products = order?.products || [];
  const suborders = order?.suborder || [];
  const addressLine = [shipping.address, shipping.area, shipping.city, shipping.province].filter(Boolean).join(', ');
  const totalItems = products.reduce((sum, p) => sum + (p?.quantity || 0), 0);
  const fmtPrice = n => (typeof n === 'number' ? n.toLocaleString() : n);

  // Approve / Reject handlers
  const onApprove = (paymentId) => {
    dispatch(approve_bkash_payment({ paymentId, orderId }));
  };
  const onReject = (paymentId) => {
    const reason = prompt('Reject reason? (optional)') || '';
    dispatch(reject_bkash_payment({ paymentId, reason }));
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#283046] rounded-md ring-1 ring-slate-700/40">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-slate-700/60">
          <div className="flex flex-wrap items-center gap-3 text-[#d0d2d6]">
            <span className="inline-flex items-center gap-2 text-lg font-semibold">
              <FiHash /> {order?._id ? `#${order?._id}` : 'Order'}
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-slate-300">
              <FiCalendar />
              {order?.date || (order?.createdAt && new Date(order.createdAt).toLocaleString()) || '-'}
            </span>
            {order?.payment_status && (
              <span className={badgeCls('payment', order?.payment_status)}>{order?.payment_status}</span>
            )}
            {order?.delivery_status && (
              <span className={badgeCls('delivery', order?.delivery_status)}>{order?.delivery_status}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              onChange={status_update}
              value={status}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            >
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="warehouse">warehouse</option>
              <option value="placed">placed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>

        <div className="p-4 text-[#d0d2d6]">
          {loader ? (
            skeleton
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                {/* Order summary */}
                <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                  <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm">
                        <FiPackage /> Items
                      </span>
                      <span className="text-sm">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm">Total Price</span>
                      <span className="text-sm">Tk {fmtPrice(order?.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm">Payment status</span>
                      <span className={badgeCls('payment', order?.payment_status)}>{order?.payment_status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-sm">Delivery status</span>
                      <span className={badgeCls('delivery', order?.delivery_status)}>{order?.delivery_status}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                  <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Shipping Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-slate-300" />
                      <span className="text-sm">{shipping?.name || '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-slate-300 mt-0.5" />
                      <span className="text-sm leading-5">{addressLine || 'Address not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* NEW: Customer manual bKash pay widget (show only if unpaid) */}
                {order?.payment_status !== 'paid' && (
                  <BkashManualPay orderId={order?._id} amount={order?.price} />
                )}

                {/* BKash Payments (manual submissions) */}
                <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase text-slate-300">Bkash submissions</h3>
                    {verifyLoading && <span className="text-xs text-amber-300">Processing...</span>}
                  </div>

                  <div className="mt-3 space-y-3">
                    {bkashPayments.length ? (
                      bkashPayments.map((p) => (
                        <div key={p._id} className="p-3 rounded bg-slate-800 border border-slate-700/60">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-xs text-slate-300">
                              <div>Sender: <span className="font-mono text-slate-100">{p.senderNumber}</span></div>
                              <div>TrxID: <span className="font-mono text-slate-100">{p.trxId}</span></div>
                              <div>Amount: <span className="font-mono text-slate-100">Tk {p.amount}</span></div>
                              <div>Time: <span className="text-slate-400">{new Date(p.createdAt).toLocaleString()}</span></div>
                              <div>Status: <span className={`px-2 py-0.5 rounded text-[11px] ${
                                p.status === 'approved' ? 'bg-emerald-600/20 text-emerald-300'
                                : p.status === 'rejected' ? 'bg-rose-600/20 text-rose-300'
                                : 'bg-amber-600/20 text-amber-300'
                              }`}>{p.status}</span></div>
                            </div>

                            {p.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  disabled={verifyLoading}
                                  onClick={() => onApprove(p._id)}
                                  className={`px-3 py-1.5 rounded text-white text-xs ${verifyLoading ? 'bg-emerald-700/70 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                                >
                                  Approve
                                </button>
                                <button
                                  disabled={verifyLoading}
                                  onClick={() => onReject(p._id)}
                                  className={`px-3 py-1.5 rounded text-white text-xs ${verifyLoading ? 'bg-rose-700/70 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-sm">No Bkash submissions for this order</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Products */}
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50">
                  <div className="px-4 py-3 border-b border-slate-700/60">
                    <h3 className="text-sm font-semibold uppercase text-slate-300">Products</h3>
                  </div>
                  <div className="divide-y divide-slate-700/60">
                    {products.length ? (
                      products.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-4">
                          <img
                            className="w-[48px] h-[56px] rounded object-cover"
                            src={p?.images?.[0] || p?.image || 'https://via.placeholder.com/48x56'}
                            alt="product"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-5">{p?.name || 'Product'}</div>
                            <div className="text-xs text-slate-300">
                              <span>Category: {p?.category || '-'}</span>
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

                {/* Sub Orders */}
                <div className="bg-slate-800/50 rounded-md border border-slate-700/50">
                  <div className="px-4 py-3 border-b border-slate-700/60">
                    <h3 className="text-sm font-semibold uppercase text-slate-300">Seller wise sub-orders</h3>
                  </div>
                  <div className="divide-y divide-slate-700/60">
                    {suborders.length ? (
                      suborders.map((so, idx) => (
                        <div key={so?._id || idx} className="p-4">
                          <div className="flex flex-wrap items-center gap-3 justify-between">
                            <div className="text-sm font-medium">
                              Seller - {idx + 1} Order: #{so?._id}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={badgeCls('payment', so?.payment_status)}>
                                {so?.payment_status || 'pending'}
                              </span>
                              <span className={badgeCls('delivery', so?.delivery_status)}>
                                {so?.delivery_status || 'pending'}
                              </span>
                              <span className="text-xs text-slate-300">Tk {fmtPrice(so?.price)}</span>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            {(so?.products || []).map((sp, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <img
                                  className="w-[42px] h-[52px] rounded object-cover"
                                  src={sp?.images?.[0] || sp?.image || 'https://via.placeholder.com/42x52'}
                                  alt="suborder_product"
                                />
                                <div className="flex-1">
                                  <div className="text-sm leading-5">{sp?.name || 'Product'}</div>
                                  <div className="text-xs text-slate-300">
                                    <span>Category: {sp?.category || '-'}</span>
                                    <span className="ml-3">Qty: {sp?.quantity || 1}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-400">No sub-orders</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400">No order found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;