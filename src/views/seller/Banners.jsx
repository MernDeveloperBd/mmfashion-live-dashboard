import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_banners } from '../../store/Reducers/bannerReducer';

const Banners = () => {
  const dispatch = useDispatch();
  const { banners } = useSelector(s => s.banner);

  useEffect(() => {
    dispatch(get_banners());
  }, [dispatch]);

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <h2 className="text-[#d0d2d6] text-xl font-semibold mb-4">Banners</h2>
        {!banners?.length ? (
          <div className="text-slate-300">No banners yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {banners.map((b) => (
              <div key={b?._id} className="bg-slate-800 rounded border border-slate-700 overflow-hidden">
                <img src={b?.banner} alt="banner" className="w-full h-[160px] object-cover" />
                <div className="p-3 text-slate-300 text-sm">
                  <div>Product: {String(b?.productId)?.slice(-6)}</div>
                  <div>Link: {b?.link}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Banners;