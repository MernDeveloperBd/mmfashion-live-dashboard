import React, { useEffect, useMemo, useState } from "react";
import { HiMiniArrowDownTray } from "react-icons/hi2";
import toast from "react-hot-toast";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  get_payment_request,
  confirm_payment_request,
  messageClear,
} from "../../store/Reducers/PaymentReducer";
import Pagination from "../pagination/Pagination";

const PaymentRequest = () => {
  const dispatch = useDispatch();
  const { successMessage, errorMessage, loader, pendingWithdrows = [] } =
    useSelector((state) => state.payment);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState([]); // row indexes
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    dispatch(get_payment_request());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // Refresh list after confirm
      dispatch(get_payment_request());
      setConfirmingId(null);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      setConfirmingId(null);
    }
  }, [dispatch, successMessage, errorMessage]);

  // toggle expanded row
  const toggleRow = (idx) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // client-side filter
  const filtered = useMemo(() => {
    const q = (searchValue || "").toLowerCase().trim();
    if (!q) return pendingWithdrows;
    return pendingWithdrows.filter((r) => {
      const id = (r?._id || "").toLowerCase();
      const status = (r?.status || "").toLowerCase();
      const amt = String(r?.amount || "").toLowerCase();
      const date = r?.createdAt ? moment(r.createdAt).format("LL").toLowerCase() : "";
      return (
        id.includes(q) ||
        status.includes(q) ||
        amt.includes(q) ||
        date.includes(q)
      );
    });
  }, [pendingWithdrows, searchValue]);

  // pagination slice
  const pageData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage, perPage]);

  const confirm_request = (id) => {
    setConfirmingId(id);
    dispatch(confirm_payment_request(id));
  };

  const fmtTk = (n) => `TK ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md text-[#d0d2d6]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-xl font-medium">Withdraw requests</h2>
          <div className="flex items-center gap-3">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              placeholder="Search by id/amount/status/date"
              className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md text-sm text-white"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto mt-4">
          <table className="w-full min-w-[800px] text-sm text-left text-[#d0d2d6]">
            <thead>
              <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                <th className="p-2 w-[18%]">No</th>
                <th className="p-2 w-[22%]">Amount</th>
                <th className="p-2 w-[20%]">Status</th>
                <th className="p-2 w-[20%]">Date</th>
                <th className="p-2 w-[20%]">Action</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length ? (
                pageData.map((row, idx) => {
                  const globalIndex = (currentPage - 1) * perPage + idx; // track expanded per full list
                  const expanded = expandedRows.includes(globalIndex);
                  return (
                    <React.Fragment key={row?._id || idx}>
                      <tr className="border-b border-slate-700">
                        <td className="p-2">#{row?._id?.slice(-8) || globalIndex + 1}</td>
                        <td className="p-2">{fmtTk(row?.amount)}</td>
                        <td className="p-2">
                          <span className="py-[2px] px-2 rounded text-xs bg-slate-700 text-amber-300">
                            {row?.status || "pending"}
                          </span>
                        </td>
                        <td className="p-2">
                          {row?.createdAt ? moment(row.createdAt).format("LL") : "-"}
                        </td>
                        <td className="p-2 flex items-center gap-2">
                          <button
                            onClick={() => toggleRow(globalIndex)}
                            className="text-sm text-teal-300 hover:underline flex items-center gap-1"
                          >
                            View
                            <HiMiniArrowDownTray
                              className={`text-xs transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => confirm_request(row?._id)}
                            disabled={loader || confirmingId === row?._id}
                            className={`px-3 py-1 rounded text-white text-sm ${
                              loader || confirmingId === row?._id
                                ? "bg-indigo-500/60 cursor-not-allowed"
                                : "bg-indigo-500 hover:bg-indigo-600"
                            }`}
                          >
                            {confirmingId === row?._id ? "Confirming..." : "Confirm"}
                          </button>
                        </td>
                      </tr>

                      {expanded && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <div className="bg-slate-800 p-3">
                              <div className="text-sm mb-2 font-medium">Request details</div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                <div className="p-2 bg-slate-900 rounded">
                                  <div className="text-slate-400 text-xs">Request ID</div>
                                  <div className="font-medium break-all">{row?._id || "-"}</div>
                                </div>
                                <div className="p-2 bg-slate-900 rounded">
                                  <div className="text-slate-400 text-xs">Seller ID</div>
                                  <div className="font-medium break-all">{row?.sellerId || "-"}</div>
                                </div>
                                <div className="p-2 bg-slate-900 rounded">
                                  <div className="text-slate-400 text-xs">Created</div>
                                  <div className="font-medium">
                                    {row?.createdAt ? moment(row.createdAt).format("LLL") : "-"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td className="p-4 text-slate-400" colSpan={5}>
                    No pending requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > perPage && (
          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={filtered.length}
              perPage={perPage}
              showItem={7}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentRequest;