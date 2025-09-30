import { BsImage } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FadeLoader } from 'react-spinners';


const Profile = () => {
    const image = true;
    const loader = true;
    const status = 'active';
    const userInfo = true;
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full flex flex-wrap">
                <div className="w-full md:w-6/12">
                    <div className="w-full p-4 bg-[#283046] rounded text-[#d0d2d6]">
                        <div className="flex justify-center items-center py-3">

                            {
                                image ? <label htmlFor="img" className=" h-[210px] w-[300px] relative p-3 cursor-pointer overflow-hidden ">
                                    <img className="w-full h-full" src="https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png" alt="" />
                                    {
                                        loader & <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span><FadeLoader className="text-white" /></span>

                                        </div>
                                    }
                                </label> : <label className="flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-[#108062d0] border-[#d0d2d6] relative" htmlFor="img">
                                    <span><BsImage /></span>
                                    <span>Select Image</span>
                                    {
                                        loader & <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span><FadeLoader className="text-white" /></span>

                                        </div>
                                    }

                                </label>
                            }
                            <input type="file" name="" id="img" className="hidden" />
                        </div>
                        {/*  */}
                        <div className="px-0 md:px-5 py-2">
                            <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"><FaEdit /> </span>
                                <div className="flex gap-2">
                                    <span>Name:</span>
                                    <span>Marifa Akter</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Email:</span>
                                    <span>marifa@misam.com</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Role:</span>
                                    <span>Sellerr</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Status:</span>
                                    <span>Active</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Payment:</span>
                                    <p>
                                        {
                                            !status === 'active' ? <span className="bg-green-600 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">Pending</span> : <span className="bg-blue-600 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">
                                                click active
                                            </span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/*  */}

                        <div className="px-0 md:px-5 py-2">
                            {
                                !userInfo ? <form>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="shop">Shop Name</label>
                                        <input type="text" placeholder='Shop name' name='shopName' id='shop' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="div">Division</label>
                                        <input type="text" placeholder='Division name' name='division' id='div' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="district">District Name</label>
                                        <input type="text" placeholder='District name' name='district' id='district' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="sub">Sub District</label>
                                        <input type="text" placeholder='Sub District' name='subDistrict' id='sub' className='inputField' />
                                    </div>
                                    <div className='flex my-4'>
                                        <button className='primaryBtn'>Add Product</button>
                                    </div>
                                </form> : <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                    <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"><FaEdit /> </span>
                                    <div className="flex gap-2">
                                        <span>Shop Name:</span>
                                        <span>MM Fashion World</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Division:</span>
                                        <span>Dhaka</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>District:</span>
                                        <span>Dhaka</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Sub District:</span>
                                        <span>Nawabgonj</span>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>

                </div>
                <div className="w-full md:w-6/12 pl0 md:pl-2">
                    <div className="w-full p-4 bg-[#283046] rounded text-[#d0d2d6]">
                        <h1 className='text-[#d0d2d6] text-xl font-semibold mb-3'>Change password</h1>
                        <form>
                            <div className='flex flex-col gap-1 w-full mb-2'>
                                <label htmlFor="email">Email</label>
                                <input type="text" placeholder='email ' name='email' id='email' className='inputField' />
                            </div>
                            <div className='flex flex-col gap-1 w-full mb-2'>
                                <label htmlFor="oldPassword">Old Password</label>
                                <input type="text" placeholder='Old Password' name='oldPassword' id='oldPassword' className='inputField' />
                            </div>
                            <div className='flex flex-col gap-1 w-full mb-2'>
                                <label htmlFor="newPassword">New Password</label>
                                <input type="text" placeholder='New Password' name='newPassword' id='newPassword' className='inputField' />
                            </div>
                           
                           
                            <div className='flex my-4'>
                                <button className='primaryBtn'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;