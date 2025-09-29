import { TbCoinTaka } from "react-icons/tb";
import { RiProductHuntLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Chart from 'react-apexcharts'
import { Link } from "react-router-dom";

const SellerDashboard = () => {
    const state = {
        series: [
            {
                name: "Orders",
                data: [30, 40, 35, 50, 49, 60, 70, 91, 15, 19, 27, 68]
            },
            {
                name: "Revinue",
                data: [50, 47, 35, 50, 59, 40, 10, 41, 25, 19, 27, 78]
            },
            {
                name: "Sales",
                data: [15, 47, 33, 77, 45, 24, 47, 14, 14, 19, 16, 24]
            }
        ],
        options: {
            color: ['#181ee8', '#181ee8'],
            plotOptions: {
                radious: 30
            },
            chart: {
                background: 'transparent',
                foreColor: '#d0d2d6'
            },
            datalabels: {
                enabled: false
            },
            stroke: {
                show: true,
                curve: ['smooth', 'straight', 'stepline'],
                lineCap: 'butt',
                colors: '#f0f0f0',
                width: .5,
                dashArrow: 0
            },
            xAxis: {
                categories: ['jan', 'feb', 'march', 'April', 'May', 'June', 'july', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            legeng: {
                position: 'top'
            },
            responsive: [
                {
                    breakPoint: 565,
                    yaxis: {
                        categories: ['jan', 'feb', 'march', 'April', 'May', 'June', 'july', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    },
                    options: {
                        plotOptions: {
                            bar: {
                                horizontal: true
                            }
                        },
                        chart: {
                            height: '550px'
                        }
                    }
                }
            ]
        }
    }
    return (
        <div className="px-2 md:px-7 md:py-5">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-7">
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-2xl font-bold">TK 5600</h2>
                        <span className="text-md font-medium">Total Sales</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <TbCoinTaka className="text-white" />
                    </div>
                </div>
                {/* second div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-2xl font-bold">20</h2>
                        <span className="text-md font-medium">Products</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-3xl">
                        <RiProductHuntLine className="" />
                    </div>
                </div>
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-2xl font-bold">18</h2>
                        <span className="text-md font-medium">Orders</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <AiOutlineShoppingCart className="text-[#00cfe8]" />
                    </div>
                </div>
                {/* first div */}
                <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
                    <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                        <h2 className="text-2xl font-bold">38</h2>
                        <span className="text-md font-medium">Pending Orders</span>
                    </div>
                    <div className="w-[40px] h-[47px] rounded-full bg-[#108062] flex justify-center items-center text-3xl">
                        <AiOutlineShoppingCart className="text-white" />
                    </div>
                </div>
            </div>
            {/* charts */}
            <div className="w-full flex flex-wrap mt-4">
                <div className="w-full lg:w-7/12 lg:pr-3">
                    <div className="w-full bg-[#283046] p-4 rounded-md">
                        <Chart options={state.options} series={state.series} type="bar" width={500} height={350} />
                    </div>
                </div>
                {/* seller chat */}
                <div className="w-full lg:w-5/12 mt-4 lg:mt-0">
                    <div className="w-full bg-[#283046] p-4 rounded-md text-[#d0d2d6]">
                        <div className="flex justify-between items-center">
                            <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">Recent Customer message</h2>
                            <Link className="font-semibold text-sm text-[#d0d2d6]">View all</Link>
                        </div>
                        <div className="flex flex-col gap-2 pt-6 text-[#d0d2d6]">
                            <ol className="relative border-1 border-slate-600 ml-4 p-1">
                                <li className="mb-3 ml-6">
                                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00d1e848] rounded-full z-10">
                                        <img className=" w-full h-full rounded-full shadow-lg" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="seller-image" />
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-600 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <Link className="text-md font-normal">Customer name</Link>
                                            <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">4 days ago</time>
                                        </div>
                                        <div className="p-2 text-xs font-normal bg-slate-700 border border-slate-800 rounded-sm">
                                            how are you?
                                        </div>
                                    </div>
                                </li>

                                <li className="mb-3 ml-6">
                                    <div className="flex absolute -left-5 shadow-lg justify-center items-center w-10 h-10 p-[6px] bg-[#00d1e848] rounded-full z-10">
                                        <img className=" w-full h-full rounded-full shadow-lg" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="seller-image" />
                                    </div>
                                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-600 shadow-sm">
                                        <div className="flex justify-between items-center mb-2">
                                            <Link className="text-md font-normal">Seller name</Link>
                                            <time className="mb-1 text-sm font-normal sm:order-last sm:mb-0">4 days ago</time>
                                        </div>
                                        <div className="p-2 text-xs font-normal bg-slate-700 border border-slate-800 rounded-sm">
                                            how are you?
                                        </div>
                                    </div>
                                </li>

                            </ol>

                        </div>

                    </div>

                </div>
            </div>
            {/* Recent Orders */}
            <div className="w-full p-4 bg-[#283046] rounded-lg mt-6">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg text-[#d0d2d6] pb-3">Recent Orders</h2>
                    <Link className="font-semibold text-sm text-[#d0d2d6]">View all</Link>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-[#d0d2d6]">
                        <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                            <tr>
                                <th scope="col" className="py-3 px-4">Order id</th>
                                <th scope="col" className="py-3 px-4">Price</th>
                                <th scope="col" className="py-3 px-4">Payment Status</th>
                                <th scope="col" className="py-3 px-4">Order Status</th>
                                <th scope="col" className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                [1,2,3,4].map((d,i)=> <tr key={i}>
                                <td scope="col" className="py-4 px-4 font-medium whitespace-normal">#254685</td>
                                <td scope="col" className="py-4 px-4 font-medium whitespace-normal">TK652</td>
                                <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                    <span>Pending</span>
                                </td>
                                <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                    <span>Pending</span>
                                </td>
                                <td scope="col" className="py-4 px-4 font-medium whitespace-normal">
                                    <Link>view</Link>
                                </td>
                            </tr>)
                            }
                            
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;