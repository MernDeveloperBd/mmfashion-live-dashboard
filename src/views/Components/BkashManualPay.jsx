// src/views/components/BkashManualPay.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  get_bkash_config,
  submit_bkash_payment,
  get_bkash_by_order,
  messageClear
} from '../../store/Reducers/orderReducer';
import toast from 'react-hot-toast';

const BkashManualPay = ({ orderId, amount }) => {
  const dispatch = useDispatch();
  const { merchantNumber, successMessage, errorMessage, bkashPayments } = useSelector(s => s.order);

  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');

  useEffect(() => {
    dispatch(get_bkash_config());
    if (orderId) dispatch(get_bkash_by_order(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // reload list after submit
      if (orderId) dispatch(get_bkash_by_order(orderId));
      setTrxId('');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, orderId]);

  const submit = (e) => {
    e.preventDefault();
    if (!orderId) return toast.error('Order missing!');
    dispatch(submit_bkash_payment({ orderId, amount, senderNumber, trxId }));
  };

  return (
    <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50 text-[#d0d2d6]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase text-slate-300">Pay with bKash (Manual)</h3>
      </div>

      <div className="mt-3 space-y-3 text-sm">
        <div>
          <div>Merchant bKash: <span className="font-mono">{merchantNumber || 'loading...'}</span></div>
          <div>Amount: <span className="font-mono">Tk {amount}</span></div>
        </div>

        <ol className="list-decimal ml-5 text-slate-300">
          <li>bKash app বা *247# এ যান</li>
          <li>Send Money → Merchant নাম্বার: {merchantNumber || '017...'} → Amount: {amount}</li>
          <li>Reference: {orderId}</li>
          <li>পেমেন্ট হয়ে গেলে TrxID কপি করুন</li>
        </ol>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">Sender bKash number</label>
              <input
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                className="w-full bg-[#283046] border border-slate-700 rounded px-3 py-2 outline-none"
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Transaction ID (TrxID)</label>
              <input
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                className="w-full bg-[#283046] border border-slate-700 rounded px-3 py-2 outline-none"
                placeholder="e.g. 8G3K9XABCD"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-700 text-white"
          >
            Submit for verification
          </button>
        </form>

        {/* Previous submissions */}
        <div className="mt-4">
          <div className="text-xs uppercase text-slate-300 mb-2">Your submissions</div>
          {bkashPayments?.length ? (
            <div className="space-y-2">
              {bkashPayments.map(p => (
                <div key={p._id} className="p-2 rounded bg-slate-900 border border-slate-700">
                  <div className="text-xs">
                    <div>Sender: <span className="font-mono">{p.senderNumber}</span></div>
                    <div>TrxID: <span className="font-mono">{p.trxId}</span></div>
                    <div>Amount: <span className="font-mono">Tk {p.amount}</span></div>
                    <div>Time: {new Date(p.createdAt).toLocaleString()}</div>
                    <div>Status: 
                      <span className={`ml-2 px-2 py-0.5 rounded ${
                        p.status === 'approved' ? 'bg-emerald-600/20 text-emerald-300'
                        : p.status === 'rejected' ? 'bg-rose-600/20 text-rose-300'
                        : 'bg-amber-600/20 text-amber-300'
                      }`}>{p.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-sm">No submissions yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BkashManualPay;