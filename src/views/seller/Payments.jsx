import React, { useEffect, useState } from 'react';
import { TbCoinTaka } from "react-icons/tb";
import Pagination from "../pagination/Pagination";
import toast from 'react-hot-toast';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { get_seller_payemt_details, messageClear, send_withdrowal_request } from '../../store/Reducers/PaymentReducer';

const Payments = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const {
    successMessage, errorMessage, loader,
    pendingWithdrows = [], successWithdrows = [],
    totalAmount = 0, withdrowAmount = 0, pendingAmount = 0, availableAmount = 0
  } = useSelector(state => state.payment);

  const [amount, setAmount] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [pendingPage, setPendingPage] = useState(1);
  const [successPage, setSuccessPage] = useState(1);

  useEffect(() => {
    if (userInfo?._id) dispatch(get_seller_payemt_details(userInfo._id));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // refresh details
      if (userInfo?._id) dispatch(get_seller_payemt_details(userInfo._id));
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [dispatch, successMessage, errorMessage, userInfo]);

  const fmtTk = (n) => `TK ${Number(n || 0).toLocaleString()}`;

  const onSubmitRequest = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (availableAmount - amt < 0) {
      toast.error('Insufficient balance');
      return;
    }
    dispatch(send_withdrowal_request({ amount: amt, sellerId: userInfo._id }));
    setAmount('');
  };

  // local pagination helper
  const sliceData = (arr, page) => {
    const start = (page - 1) * perPage;
    return arr.slice(start, start + perPage);
  };

  return (
    <div className="px-2 md:px-7 md:py-5">
      {/* Stat cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7 mb-5">
        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl font-bold">{fmtTk(totalAmount)}</h2>
            <span className="text-sm font-medium">Total Sales</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
            <TbCoinTaka className="text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl font-bold">{fmtTk(availableAmount)}</h2>
            <span className="text-sm font-medium">Available Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#1b2436] flex justify-center items-center text-3xl">
            <TbCoinTaka className="text-[#00cfe8]" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl font-bold">{fmtTk(withdrowAmount)}</h2>
            <span className="text-sm font-medium">Withdrawn Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
            <TbCoinTaka className="text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
          <div className="text-[#d0d2d6]">
            <h2 className="text-xl font-bold">{fmtTk(pendingAmount)}</h2>
            <span className="text-sm font-medium">Pending Amount</span>
          </div>
          <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
            <TbCoinTaka className="text-white" />
          </div>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
        {/* Pending requests */}
        <div className="bg-[#263046] text-[#d0d2d6] rounded-md p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg">Send Withdrawal Request</h2>
            <select
              value={perPage}
              onChange={(e) => { const p = parseInt(e.target.value); setPerPage(p); setPendingPage(1); setSuccessPage(1); }}
              className="px-3 py-2 bg-[#263046] border border-slate-700 rounded-md text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <form onSubmit={onSubmitRequest} className="pt-5">
            <div className="flex gap-3 flex-wrap">
              <input
                onChange={(e) => setAmount(e.target.value)}
                required
                value={amount}
                min={0}
                type="number"
                name="amount"
                placeholder="Amount"
                className="inputField md:w-[70%]"
              />
              <button className={`primaryBtn ${loader ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={loader}>
                {loader ? 'Processing...' : 'Send Withdrawal Request'}
              </button>
            </div>
          </form>

          <h2 className="text-lg pb-3 mt-6">Pending withdrawal Requests</h2>
          <div className="w-full overflow-x-auto max-h-[350px]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                  <th className="p-2 w-[10%]">No</th>
                  <th className="p-2 w-[30%]">Amount</th>
                  <th className="p-2 w-[30%]">Status</th>
                  <th className="p-2 w-[30%]">Date</th>
                </tr>
              </thead>
              <tbody>
                {sliceData(pendingWithdrows, pendingPage).map((row, idx) => (
                  <tr key={row?._id || idx} className="border-b border-slate-700">
                    <td className="p-2">{(pendingPage - 1) * perPage + idx + 1}</td>
                    <td className="p-2">{fmtTk(row?.amount)}</td>
                    <td className="p-2">
                      <span className="py-[2px] px-2 rounded text-xs bg-slate-700 text-amber-300">{row?.status || 'pending'}</span>
                    </td>
                    <td className="p-2">{row?.createdAt ? moment(row.createdAt).format('LL') : '-'}</td>
                  </tr>
                ))}
                {!pendingWithdrows.length && (
                  <tr>
                    <td className="p-3 text-slate-400" colSpan={4}>No pending requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pendingWithdrows.length > perPage && (
            <div className="w-full flex justify-end mt-3">
              <Pagination
                pageNumber={pendingPage}
                setPageNumber={setPendingPage}
                totalItem={pendingWithdrows.length}
                perPage={perPage}
                showItem={4}
              />
            </div>
          )}
        </div>

        {/* Success withdrawals */}
        <div className="bg-[#263046] text-[#d0d2d6] rounded-md p-5">
          <h2 className="text-lg pb-3">Successful Withdrawals</h2>
          <div className="w-full overflow-x-auto max-h-[350px]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                  <th className="p-2 w-[10%]">No</th>
                  <th className="p-2 w-[30%]">Amount</th>
                  <th className="p-2 w-[30%]">Status</th>
                  <th className="p-2 w-[30%]">Date</th>
                </tr>
              </thead>
              <tbody>
                {sliceData(successWithdrows, successPage).map((row, idx) => (
                  <tr key={row?._id || idx} className="border-b border-slate-700">
                    <td className="p-2">{(successPage - 1) * perPage + idx + 1}</td>
                    <td className="p-2">{fmtTk(row?.amount)}</td>
                    <td className="p-2">
                      <span className="py-[2px] px-2 rounded text-xs bg-emerald-600/20 text-emerald-300">{row?.status || 'success'}</span>
                    </td>
                    <td className="p-2">{row?.createdAt ? moment(row.createdAt).format('LL') : '-'}</td>
                  </tr>
                ))}
                {!successWithdrows.length && (
                  <tr>
                    <td className="p-3 text-slate-400" colSpan={4}>No successful withdrawals</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {successWithdrows.length > perPage && (
            <div className="w-full flex justify-end mt-3">
              <Pagination
                pageNumber={successPage}
                setPageNumber={setSuccessPage}
                totalItem={successWithdrows.length}
                perPage={perPage}
                showItem={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;