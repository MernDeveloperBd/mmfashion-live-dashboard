import React, { useState } from "react";
import { HiMiniArrowDownTray } from "react-icons/hi2";
import Pagination from "../pagination/Pagination";

const PaymentRequest = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchValue, setSearchValue] = useState('')
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false)
  // ডেমো ডেটা (API থেকে ফেচ করে প্রতিস্থাপন করবেন)
  const rows = Array.from({ length: 30 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    amount: `TK ${500 + i * 10}`,
    status: i % 3 === 0 ? "Paid" : "Pending",
    date: "15 Aug 2025",
    details: [
      { name: "Product A", qty: 2, price: "TK 200" },
      { name: "Product B", qty: 1, price: "TK 100" },
    ],
  }));

  const [expandedRows, setExpandedRows] = useState([]); // expanded index list

  const toggleRow = (idx) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleOnWheel = (e) => {
    console.log("wheel deltaY:", e.deltaY);
  };

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md text-[#d0d2d6]">
        <h2 className="text-xl font-medium pb-4">Withdraw request</h2>
        <div
          className="w-full overflow-x-auto max-h-[350px]"
          onWheel={handleOnWheel}
        >
          <table className="w-full min-w-[800px] text-sm text-left text-[#d0d2d6]">
            {/* Header */}
            <thead>
              <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                <th className="p-2 w-[20%]">No</th>
                <th className="p-2 w-[20%]">Amount</th>
                <th className="p-2 w-[20%]">Status</th>
                <th className="p-2 w-[20%]">Date</th>
                <th className="p-2 w-[20%]">Action</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {rows.map((row, idx) => {
                const expanded = expandedRows.includes(idx);
                return (
                  <React.Fragment key={row.id}>
                    <tr className="border-b border-slate-700">
                      <td className="p-2">{row.id}</td>
                      <td className="p-2">{row.amount}</td>
                      <td className="p-2">
                        <span
                          className={`py-[2px] px-2 rounded text-xs ${row.status === "Paid"
                              ? "bg-green-600 text-white"
                              : "bg-slate-700 text-blue-300"
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-2">{row.date}</td>
                      <td className="p-2 flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(idx)}
                          className="text-sm text-teal-300 hover:underline flex items-center gap-1"
                        >
                          View <HiMiniArrowDownTray className={`text-xs ${expanded ? "rotate-180" : ""} transition-transform`} />
                        </button>
                        <button className="bg-indigo-500 px-3 py-1 rounded text-white text-sm hover:bg-indigo-600">
                          Confirm
                        </button>
                      </td>
                    </tr>

                    {/* Expanded details row */}
                    {expanded && (
                      <tr>
                        <td colSpan="5" className="p-0">
                          <div className="bg-slate-800 p-3">
                            <div className="text-sm mb-2 font-medium">Order details</div>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              {row.details.map((d, di) => (
                                <div key={di} className="p-2 bg-slate-900 rounded">
                                  <div className="font-medium">{d.name}</div>
                                  <div className="text-xs text-slate-400">Qty: {d.qty}</div>
                                  <div className="text-xs text-slate-400">{d.price}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

        </div>
        {/* pagination */}
        <div className="w-full flex justify-end mt-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={500}
            perPage={perPage}
            showItem={7}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;