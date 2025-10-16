import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { get_seller, messageClear, seller_status_update } from "../../store/Reducers/sellerReducer";
import { FiUser, FiMail, FiPhone, FiLink, FiMapPin, FiShoppingBag, FiAward } from 'react-icons/fi';

const statusBadge = (val) => {
  const base = 'px-2 py-1 rounded text-xs';
  if (val === 'active') return `${base} bg-emerald-600/20 text-emerald-300`;
  if (val === 'pending') return `${base} bg-amber-600/20 text-amber-300`;
  if (val === 'deactive') return `${base} bg-rose-600/20 text-rose-300`;
  return `${base} bg-slate-600/20 text-slate-300`;
};

const avatar = (seller) =>
  seller?.image ||
  `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(seller?.name || 'Seller')}`;

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { sellerId } = useParams();
  const { seller, successMessage, errorMessage, loader } = useSelector((state) => state.seller);

  useEffect(() => {
    if (sellerId) dispatch(get_seller(sellerId));
  }, [dispatch, sellerId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(`${successMessage} to ${seller?.status || ''}`);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, seller, dispatch]);

  const [status, setStatus] = useState('');
  useEffect(() => {
    if (seller?.status) setStatus(seller.status);
  }, [seller]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!status) return;
    dispatch(seller_status_update({ sellerId, status }));
  };

  const joinedAt = seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString() : '-';

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full bg-[#283046] rounded-md ring-1 ring-slate-700/40">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/60 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-700"
              src={avatar(seller)}
              alt="seller_avatar"
            />
            <div className="text-[#d0d2d6]">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{seller?.name || '—'}</h2>
                {seller?.role && (
                  <span className="px-2 py-0.5 rounded text-xs bg-indigo-600/20 text-indigo-300 inline-flex items-center gap-1">
                    <FiAward /> {seller?.role}
                  </span>
                )}
                {seller?.status && <span className={statusBadge(seller?.status)}>{seller?.status}</span>}
              </div>
              <div className="text-sm text-slate-300 flex items-center gap-2 mt-1">
                <FiMail /> <span>{seller?.email || '—'}</span>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              required
            >
              <option value="">...Select...</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="deactive">Deactive</option>
            </select>
            <button
              disabled={!status || status === seller?.status}
              className={`rounded-md px-6 py-2 font-semibold text-white ${
                !status || status === seller?.status
                  ? 'bg-emerald-600/40 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="p-4">
          {loader && !seller ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 bg-slate-700 rounded" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-md p-4 h-40" />
                <div className="bg-slate-800/50 rounded-md p-4 h-40" />
                <div className="bg-slate-800/50 rounded-md p-4 h-40" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Profile Summary</h3>
                <div className="space-y-3 text-[#d0d2d6]">
                  <div className="flex items-center gap-2 text-sm">
                    <FiUser className="text-slate-300" />
                    <span>{seller?.name || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMail className="text-slate-300" />
                    <span>{seller?.email || '—'}</span>
                  </div>
                  {seller?.shopInfo?.whatsapp && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiPhone className="text-slate-300" />
                      <span>{seller.shopInfo.whatsapp}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-300">Payment Account:</span>
                    <span className="text-slate-100">{seller?.payment || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-300">Joined:</span>
                    <span className="text-slate-100">{joinedAt}</span>
                  </div>
                  {seller?.shopInfo?.businessPage && (
                    <div className="flex items-center gap-2 text-sm">
                      <FiLink className="text-slate-300" />
                      <a
                        href={seller.shopInfo.businessPage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                      >
                        Business Page
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Basic Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Name</span>
                    <span className="text-slate-100">{seller?.name || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Email</span>
                    <span className="text-slate-100">{seller?.email || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Role</span>
                    <span className="text-slate-100 capitalize">{seller?.role || '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status</span>
                    <span className={statusBadge(seller?.status)}>{seller?.status || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Address / Shop Info */}
              <div className="bg-slate-800/50 rounded-md p-4 border border-slate-700/50">
                <h3 className="text-sm font-semibold uppercase text-slate-300 mb-3">Shop & Address</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FiShoppingBag className="text-slate-300" />
                    <span className="text-slate-300 w-28">Shop Name</span>
                    <span className="text-slate-100">{seller?.shopInfo?.shopName || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-300" />
                    <span className="text-slate-300 w-28">Division</span>
                    <span className="text-slate-100">{seller?.shopInfo?.division || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-300" />
                    <span className="text-slate-300 w-28">District</span>
                    <span className="text-slate-100">{seller?.shopInfo?.district || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-slate-300" />
                    <span className="text-slate-300 w-28">Sub District</span>
                    <span className="text-slate-100">{seller?.shopInfo?.subDistrict || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SellerDetails;