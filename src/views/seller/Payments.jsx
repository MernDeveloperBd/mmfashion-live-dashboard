import React, { useState } from "react";
import { TbCoinTaka } from "react-icons/tb";
import { HiMiniArrowDownTray } from "react-icons/hi2";
import Pagination from "../pagination/Pagination";

const Payments = () => {
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
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7 mb-5">
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-xl font-bold">TK 5600</h2>
                        <span className="text-sm font-medium">Total Sales</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <TbCoinTaka className="text-white" />
                    </div>
                </div>
                {/* second div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-xl font-bold">20</h2>
                        <span className="text-sm font-medium">Available Amout</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-3xl">
                        <TbCoinTaka className="" />
                    </div>
                </div>
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-xl font-bold">18</h2>
                        <span className="text-sm font-medium">Withdrawl amount</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <TbCoinTaka className="text-[#00cfe8]" />
                    </div>
                </div>
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-xl font-bold">38</h2>
                        <span className="text-sm font-medium">Pending amount</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <TbCoinTaka className="text-white" />
                    </div>
                </div>
            </div>
            {/*  */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4 ">
                <div className="bg-[#263046] text-[#d0d2d6] rounded-md p-5 ">
                    <h2 className="text-lg">Send Request</h2>
                    <div className="pt-5">
                        <form>
                            <div className="flex gap-3 flex-wrap">
                                <input min={0} type="number" name="amount" className="inputField md:w-[70%]" />

                                <button className="primaryBtn">Send Request</button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h2 className="text-lg pb-4">Pending Request</h2>
                        <div>
                            <div
                                className="w-full overflow-x-auto max-h-[350px]"
                                onWheel={handleOnWheel}
                            >
                                <table className="w-full  text-sm text-left text-[#d0d2d6]">
                                    {/* Header */}
                                    <thead>
                                        <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                                            <th className="p-2 w-[25%]">No</th>
                                            <th className="p-2 w-[25%]">Amount</th>
                                            <th className="p-2 w-[25%]">Status</th>
                                            <th className="p-2 w-[25%]">Date</th>
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
                        </div>
                    </div>
                </div>
                {/*  */}
                 <div className="bg-[#263046] text-[#d0d2d6] rounded-md p-5 ">
                   
                    <div>
                        <h2 className="text-lg pb-4">Success Withdrawl</h2>
                        <div>
                            <div
                                className="w-full overflow-x-auto max-h-[350px]"
                                onWheel={handleOnWheel}
                            >
                                <table className="w-full  text-sm text-left text-[#d0d2d6]">
                                    {/* Header */}
                                    <thead>
                                        <tr className="uppercase text-xs bg-[#161d31] border-b border-slate-700">
                                            <th className="p-2 w-[25%]">No</th>
                                            <th className="p-2 w-[25%]">Amount</th>
                                            <th className="p-2 w-[25%]">Status</th>
                                            <th className="p-2 w-[25%]">Date</th>
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
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Payments;