import { BsImage } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import toast from 'react-hot-toast';
import { FadeLoader, PropagateLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { messageClear, profile_image_upload, profile_info_add } from "../../store/Reducers/authReducer";
import { useEffect, useState } from "react";
import { overrideStyle } from "../../utils/utils";

const Profile = () => {
    const dispatch = useDispatch();
    const { userInfo, loader, successmessage } = useSelector(state => state.auth);

    const [state, setState] = useState({
        shopName: '',
        businessPage: '',
        whatsapp: '',
        division: '',
        district: '',
        subDistrict: '',

    })
    const add_image = (e) => {
        if (e.target.files.length > 0) {
            const formData = new FormData()
            formData.append('image', e.target.files[0])
            console.log(e.target.files[0]);
            dispatch(profile_image_upload(formData))
        }
    }
    useEffect(() => {
        if (successmessage) {
            toast.success(successmessage)
            messageClear()
        }
    }, [successmessage]);
    // input handleer
    const inputHandle = (e) => {      
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const handleUpdateInfo = (e) =>{
        e.preventDefault()
        dispatch(profile_info_add(state))
        
    }
    return (
        <div className="px-2 md:px-7 py-5">
            <div className="w-full flex flex-wrap">
                <div className="w-full md:w-6/12">
                    <div className="w-full p-4 bg-[#283046] rounded text-[#d0d2d6]">
                        <div className="flex justify-center items-center py-3">

                            {
                                userInfo?.image ? <label htmlFor="img" className=" h-[210px] w-[300px] relative p-3 cursor-pointer overflow-hidden ">
                                    <img className="w-full h-full rounded-sm" src={userInfo?.image} alt="" />
                                    {
                                        loader & <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span><FadeLoader /></span>

                                        </div>
                                    }
                                </label> : <label className="flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-[#108062d0] border-[#d0d2d6] relative" htmlFor="img">
                                    <span><BsImage /></span>
                                    <span>Select Image</span>
                                    {
                                        loader & <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                                            <span><FadeLoader /></span>
                                        </div>
                                    }
                                </label>
                            }
                            <input onChange={add_image} type="file" name="" id="img" className="hidden" />
                        </div>
                        {/*  */}
                        <div className="px-0 md:px-5 py-2">
                            <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"><FaEdit /> </span>
                                <div className="flex gap-2">
                                    <span>Name:</span>
                                    <span>{userInfo?.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Email:</span>
                                    <span>{userInfo?.email}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Role:</span>
                                    <span>{userInfo?.role}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Status:</span>
                                    <span>{userInfo?.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span>Payment:</span>
                                    <p>
                                        {
                                            status === 'active' ? <span className="bg-red-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">{userInfo?.payment}</span> : <span className="bg-blue-600 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">
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
                                !userInfo?.shopInfo ? <form onSubmit={handleUpdateInfo}>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="shop">Shop Name</label>
                                        <input value={state.shopName} onChange={inputHandle} type="text" placeholder='Shop name' name='shopName' id='shop' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="businessPage">Business FB Page</label>
                                        <input value={state.businessPage} onChange={inputHandle} type="text" placeholder='Business FB Page' name='businessPage' id='businessPage' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="whatsapp">Whatsapp</label>
                                        <input value={state.whatsapp} onChange={inputHandle} type="number" placeholder='whatsapp' name='whatsapp' id='whatsapp' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="div">Division</label>
                                        <input value={state.division} onChange={inputHandle} type="text" placeholder='Division name' name='division' id='division' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="district">District Name</label>
                                        <input value={state.district} onChange={inputHandle} type="text" placeholder='District name' name='district' id='district' className='inputField' />
                                    </div>
                                    <div className='flex flex-col gap-1 w-full mb-2'>
                                        <label htmlFor="sub">Sub District</label>
                                        <input value={state.subDistrict} onChange={inputHandle} type="text" placeholder='Sub District' name='subDistrict' id='sub' className='inputField' />
                                    </div>
                                    <div className=' my-4'>
                                        <button type="submit" disabled={loader } className={`primaryBtn w-full md:w-52 transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                                            {
                                                loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Update info"
                                            }
                                        </button>
                                    </div>
                                </form> : <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                                    <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"><FaEdit /> </span>
                                    <div className="flex gap-2">
                                        <span>Shop Name:</span>
                                        <span>{userInfo?.shopInfo?.shopName}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Business Page:</span>
                                        <span>{userInfo?.shopInfo?.businessPage}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Whatsapp:</span>
                                        <span>{userInfo?.shopInfo?.whatsapp}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Division:</span>
                                        <span>{userInfo?.shopInfo?.division}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>District:</span>
                                        <span>{userInfo?.shopInfo?.district}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span>Sub District:</span>
                                        <span>{userInfo?.shopInfo?.subDistrict}</span>
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