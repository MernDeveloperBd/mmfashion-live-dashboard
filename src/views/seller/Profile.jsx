import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiMail, FiUser, FiMapPin, FiPhone, FiLink, FiAward } from "react-icons/fi";
import toast from 'react-hot-toast';
import { FadeLoader, PropagateLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import {
  messageClear,
  profile_image_upload,
  profile_info_add,
  change_password,
  logout,
  profile_basic_update
} from "../../store/Reducers/authReducer";
import { create_stripe_connect_account } from "../../store/Reducers/sellerReducer";
import { overrideStyle } from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loader, successMessage, errorMessage, role } = useSelector(state => state.auth);

  // Business info form state
  const [state, setState] = useState({
    shopName: '',
    businessPage: '',
    whatsapp: '',
    division: '',
    district: '',
    subDistrict: '',
  });

  // Account summary (basic) edit state
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [basic, setBasic] = useState({
    name: '',
    email: ''
  });

  // Password change form state
  const [pw, setPw] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Business edit toggle
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);

  const onImageSelect = (e) => {
    if (e.target.files?.length) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      dispatch(profile_image_upload(formData));
    }
  };

  // Prefill user data
  useEffect(() => {
    if (userInfo) {
      setBasic({
        name: userInfo.name || '',
        email: userInfo.email || ''
      });
      if (userInfo?.shopInfo) {
        setState({
          shopName: userInfo.shopInfo.shopName || '',
          businessPage: userInfo.shopInfo.businessPage || '',
          whatsapp: userInfo.shopInfo.whatsapp || '',
          division: userInfo.shopInfo.division || '',
          district: userInfo.shopInfo.district || '',
          subDistrict: userInfo.shopInfo.subDistrict || '',
        });
      }
    }
  }, [userInfo]);

  // Toasts + special handling for password change (force logout)
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      if (successMessage.toLowerCase().includes('password changed')) {
        dispatch(logout({ navigate, role: role || userInfo?.role || 'seller' }));
      }
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate, role, userInfo?.role]);

  // Handlers
  const onBizChange = (e) => setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmitInfo = (e) => {
    e.preventDefault();
    dispatch(profile_info_add(state)).then((res) => {
      if (!res.error) setIsEditingBusiness(false);
    });
  };

  const onBasicChange = (e) => setBasic(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmitBasic = (e) => {
    e.preventDefault();
    if (!basic.name.trim()) return toast.error('Name is required');
    // Email আপডেট করতে চাইলে validation দিন (optional)
    dispatch(profile_basic_update({ name: basic.name /*, email: basic.email*/ })).then((res) => {
      if (!res.error) setIsEditingAccount(false);
    });
  };

  const onPwChange = (e) => setPw(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const onSubmitPassword = (e) => {
  e.preventDefault();
  if (!pw.oldPassword.trim()) return toast.error('Old password is required');
  if (!pw.newPassword.trim()) return toast.error('New password is required');
  if (pw.newPassword.length < 8) return toast.error('Minimum 8 characters required');
  if (pw.newPassword !== pw.confirmPassword) return toast.error('Passwords do not match');

  dispatch(change_password({
    oldPassword: pw.oldPassword,
    newPassword: pw.newPassword
  }))
    .unwrap()
    .then(() => {
      // লোকাল টোকেন সেফলি কেটে দিন
      localStorage.removeItem('accessToken');
      toast.success('Password changed. Please login again.');
      // replace দিয়ে হার্ড রিডাইরেক্ট করুন
      window.location.replace('/login');
      // navigate('/login', { replace: true }); // চাইলে এটাও ব্যবহার করতে পারেন
    })
    .catch((err) => {
      toast.error(err?.error || 'Change failed');
    });
};
  // UI helpers
  const avatar = userInfo?.image || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userInfo?.name || 'User')}`;
  const joinedAt = userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '-';
  const hasShopInfo = !!userInfo?.shopInfo && Object.keys(userInfo.shopInfo).length > 0;

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full bg-[#283046] rounded-2xl ring-1 ring-slate-700/40 overflow-hidden">
        {/* Gradient Hero */}
        <div className="h-28 bg-gradient-to-r from-emerald-600/25 via-indigo-600/20 to-fuchsia-600/25" />

        {/* Header */}
        <div className="px-4 md:px-6 -mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Avatar + Meta */}
          <div className="flex items-end gap-4">
            <label htmlFor="img" className="relative w-[92px] h-[92px] rounded-full overflow-hidden ring-2 ring-white/10 shadow-md cursor-pointer group">
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs text-white">
                Change
              </div>
              {loader && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <FadeLoader color="#fff" />
                </div>
              )}
            </label>
            <input onChange={onImageSelect} type="file" id="img" className="hidden" />

            <div className="pb-2">
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-xl md:text-2xl font-semibold text-[#d0d2d6]">{userInfo?.name || '—'}</h2>
                {userInfo?.role && (
                  <span className="px-2 py-0.5 rounded text-xs bg-indigo-600/20 text-indigo-300 inline-flex items-center gap-1">
                    <FiAward /> {userInfo.role}
                  </span>
                )}
                {userInfo?.status && (
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    userInfo.status === 'active'
                      ? 'bg-emerald-600/20 text-emerald-300'
                      : userInfo.status === 'pending'
                      ? 'bg-amber-600/20 text-amber-300'
                      : 'bg-rose-600/20 text-rose-300'
                  }`}>
                    {userInfo.status}
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-300 flex items-center gap-2 mt-1">
                <FiMail /> <span>{userInfo?.email || '—'}</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Joined: {joinedAt}</div>
            </div>
          </div>

          {/* Quick badges */}
          <div className="flex items-center gap-3 pb-2">
            <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300 ring-1 ring-white/10">
              Account: {userInfo?.status || '—'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-white/5 text-slate-300 ring-1 ring-white/10">
              Role: {userInfo?.role || '—'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              {/* Account Summary */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase text-slate-300">Account Summary</h3>
                  {!isEditingAccount ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingAccount(true)}
                      className="p-[6px] bg-yellow-500 text-black rounded hover:shadow-lg hover:shadow-yellow-500/30 cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBasic({ name: userInfo?.name || '', email: userInfo?.email || '' });
                          setIsEditingAccount(false);
                        }}
                        className="px-3 py-1 text-xs rounded bg-slate-600 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={onSubmitBasic}
                        disabled={loader}
                        className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-70 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingAccount ? (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#d0d2d6]">
                    <div className="flex items-center gap-2"><FiUser className="text-slate-300" /> {userInfo?.name || '—'}</div>
                    <div className="flex items-center gap-2"><FiMail className="text-slate-300" /> {userInfo?.email || '—'}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">Payment:</span>
                      {userInfo?.payment === 'active' ? (
                        <span className="bg-emerald-600/20 text-emerald-300 text-xs px-2 py-0.5 rounded">
                          {userInfo.payment}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => dispatch(create_stripe_connect_account())}
                          className="text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          Activate payouts
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <form className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" onSubmit={onSubmitBasic}>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-slate-300">Name</label>
                      <input
                        name="name"
                        value={basic.name}
                        onChange={onBasicChange}
                        placeholder="Your name"
                        className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-slate-300">Email</label>
                      <input
                        name="email"
                        value={basic.email}
                        onChange={onBasicChange}
                        disabled // চাইলে এডিটেবল করুন: disabled={false}
                        className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      />
                    </div>
                  </form>
                )}
              </div>

              {/* Business / Shop Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase text-slate-300">Business Info</h3>
                  {hasShopInfo && !isEditingBusiness && (
                    <button
                      type="button"
                      onClick={() => setIsEditingBusiness(true)}
                      className="p-[6px] bg-yellow-500 text-black rounded hover:shadow-lg hover:shadow-yellow-500/30 cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                  )}
                  {isEditingBusiness && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // reset to server values
                          setState({
                            shopName: userInfo?.shopInfo?.shopName || '',
                            businessPage: userInfo?.shopInfo?.businessPage || '',
                            whatsapp: userInfo?.shopInfo?.whatsapp || '',
                            division: userInfo?.shopInfo?.division || '',
                            district: userInfo?.shopInfo?.district || '',
                            subDistrict: userInfo?.shopInfo?.subDistrict || '',
                          });
                          setIsEditingBusiness(false);
                        }}
                        className="px-3 py-1 text-xs rounded bg-slate-600 text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={onSubmitInfo}
                        disabled={loader}
                        className="px-3 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-70 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>

                {!hasShopInfo || isEditingBusiness ? (
                  <form onSubmit={onSubmitInfo} className="mt-3 space-y-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="shop" className="text-xs text-slate-300">Shop Name</label>
                      <input
                        id="shop"
                        name="shopName"
                        value={state.shopName}
                        onChange={onBizChange}
                        placeholder="Shop name"
                        className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="businessPage" className="text-xs text-slate-300">Business FB Page</label>
                      <input
                        id="businessPage"
                        name="businessPage"
                        value={state.businessPage}
                        onChange={onBizChange}
                        placeholder="https://facebook.com/yourpage"
                        className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="whatsapp" className="text-xs text-slate-300">WhatsApp</label>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={state.whatsapp}
                        onChange={onBizChange}
                        placeholder="WhatsApp number"
                        className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="division" className="text-xs text-slate-300">Division</label>
                        <input
                          id="division"
                          name="division"
                          value={state.division}
                          onChange={onBizChange}
                          placeholder="Division"
                          className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="district" className="text-xs text-slate-300">District</label>
                        <input
                          id="district"
                          name="district"
                          value={state.district}
                          onChange={onBizChange}
                          placeholder="District"
                          className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="subDistrict" className="text-xs text-slate-300">Sub District</label>
                        <input
                          id="subDistrict"
                          name="subDistrict"
                          value={state.subDistrict}
                          onChange={onBizChange}
                          placeholder="Sub District"
                          className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loader}
                        className={`w-full sm:w-48 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-md transition cursor-pointer ${
                          loader ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loader ? <PropagateLoader color="white" cssOverride={overrideStyle} /> : 'Save business info'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-3 space-y-2 text-sm text-[#d0d2d6]">
                    <div className="flex items-center gap-2"><FiMapPin className="text-slate-300" /> {userInfo?.shopInfo?.shopName || '—'}</div>
                    <div className="flex items-center gap-2">
                      <FiLink className="text-slate-300" />
                      {userInfo?.shopInfo?.businessPage ? (
                        <a
                          href={userInfo.shopInfo.businessPage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                        >
                          Business Page
                        </a>
                      ) : '—'}
                    </div>
                    <div className="flex items-center gap-2"><FiPhone className="text-slate-300" /> {userInfo?.shopInfo?.whatsapp || '—'}</div>
                    <div className="flex items-center gap-2"><FiMapPin className="text-slate-300" /> {userInfo?.shopInfo?.division || '—'}</div>
                    <div className="flex items-center gap-2"><FiMapPin className="text-slate-300" /> {userInfo?.shopInfo?.district || '—'}</div>
                    <div className="flex items-center gap-2"><FiMapPin className="text-slate-300" /> {userInfo?.shopInfo?.subDistrict || '—'}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h2 className="text-xl font-semibold text-[#d0d2d6]">Change password</h2>
                <form className="space-y-3" onSubmit={onSubmitPassword}>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-xs text-slate-300">Email</label>
                    <input
                      id="email"
                      type="email"
                      defaultValue={userInfo?.email || ''}
                      className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="oldPassword" className="text-xs text-slate-300">Old Password</label>
                    <input
                      id="oldPassword"
                      name="oldPassword"
                      type="password"
                      value={pw.oldPassword}
                      onChange={onPwChange}
                      placeholder="Old Password"
                      className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="newPassword" className="text-xs text-slate-300">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={pw.newPassword}
                      onChange={onPwChange}
                      placeholder="New Password"
                      className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="confirmPassword" className="text-xs text-slate-300">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={pw.confirmPassword}
                      onChange={onPwChange}
                      placeholder="Confirm New Password"
                      className="px-3 py-2 bg-[#283046] border border-slate-700 rounded-md focus:border-indigo-500 outline-none text-[#d0d2d6]"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loader}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loader ? 'Updating...' : 'Submit'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;