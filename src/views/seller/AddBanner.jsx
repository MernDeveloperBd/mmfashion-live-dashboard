import { Link, useParams } from 'react-router-dom';
import { IoCloudUpload } from "react-icons/io5";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { add_banner, messageClear, get_banner, update_banner } from '../../store/Reducers/bannerReducer';
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';

const AddBanner = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  const [imageShow, setImageShow] = useState('');
  const [image, setImage] = useState(null);

  const { loader, successMessage, errorMessage, banner } = useSelector(state => state.banner);

  const imageHandle = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageShow(URL.createObjectURL(file));
    }
  };

  const add = (e) => {
    e.preventDefault();
    if (!image) return;
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('image', image);
    dispatch(add_banner(formData));
  };

  const update = (e) => {
    e.preventDefault();
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);
    dispatch(update_banner({ info: formData, bannerId: banner._id }));
  };

  useEffect(() => {
    if (productId) dispatch(get_banner(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setImage(null);
      setImageShow('');
      // refresh banner
      if (productId) dispatch(get_banner(productId));
    }
  }, [dispatch, successMessage, errorMessage, productId]);

  return (
    <div className="px-2 md:px-7 py-2">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Banner</h1>
          <Link className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2" to="/seller/banners">
            Banners
          </Link>
        </div>

        {!banner ? (
          <form onSubmit={add}>
            <div className="mb-6">
              <label htmlFor="image" className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6] rounded">
                <span className="text-4xl"><IoCloudUpload /></span>
                <span>Select banner image</span>
              </label>
              <input required onChange={imageHandle} className="hidden" type="file" id="image" />
            </div>
            {imageShow && (
              <div className="mb-4">
                <img className="w-full h-auto rounded" src={imageShow} alt="preview" />
              </div>
            )}
            <button disabled={loader} className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3">
              {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : 'Add banner'}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <img className="w-full h-[360px] rounded object-fit" src={banner.banner} alt="current banner" />
            </div>
            <form onSubmit={update}>
              <div className="mb-6">
                <label htmlFor="image" className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-indigo-500 w-full text-[#d0d2d6] rounded">
                  <span className="text-4xl"><IoCloudUpload /></span>
                  <span>Select new banner image</span>
                </label>
                <input required onChange={imageHandle} className="hidden" type="file" id="image" />
              </div>
              {imageShow && (
                <div className="mb-4">
                  <img className="w-full h-[360px] rounded object-fit" src={imageShow} alt="preview" />
                </div>
              )}
              <button disabled={loader} className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3">
                {loader ? <PropagateLoader color="#fff" cssOverride={overrideStyle} /> : 'Update banner'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBanner;