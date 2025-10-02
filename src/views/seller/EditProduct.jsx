import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { update_product, messageClear, get_product } from '../../store/Reducers/productReducer';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
const navigate = useNavigate()
  const { categories } = useSelector(state => state.category);
  const { loader, errorMessage, successmessage } = useSelector(state => state.product);

  const [state, setState] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    resellingPrice: "",
    brand: "",
    fbProductLink: "",
    sku: "",
    stock: ""
  });

  // imageShow: array of either string URL (existing) or { url, file } for newly added files
  const [imageShow, setImageShow] = useState([]);
  // keep new files separately if you want, but we store them in imageShow entries with .file

  const [category, setCategory] = useState('');
  const [catShow, setCatShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [errors, setErrors] = useState({ oldPrice: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(get_category({ searchValue: '', perPage: 50, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setAllCategory(categories || []);
  }, [categories]);

  // fetch single product
  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(`/single-product-get/${productId}`, { withCredentials: true });
        const p = res.data.product;
        if (!p) {
          toast.error('Product not found');
          setInitialLoading(false);
          return;
        }
        if (!mounted) return;
        setState({
          name: p.name ?? '',
          description: p.description ?? '',
          price: p.price ?? '',
          oldPrice: p.oldPrice ?? '',
          discount: p.discount ?? '',
          resellingPrice: p.resellingPrice ?? '',
          brand: p.brand ?? '',
          fbProductLink: p.fbProductLink ?? '',
          sku: p.sku ?? '',
          stock: p.stock ?? ''
        });
        setCategory(p.category ?? '');
        // initialize imageShow with string URLs
        setImageShow((p.images || []).map(url => (typeof url === 'string' ? url : url.url || url)));
      } catch (err) {
        console.error('fetch single product error', err);
        toast.error('Failed to load product');
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };
    if (productId) fetchProduct();
    return () => { mounted = false; };
  }, [productId, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successmessage) {
      toast.success(successmessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successmessage, dispatch]);

  // input handler
  const inputHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') return;
    setState(prev => ({ ...prev, [name]: value }));
  };

  // imageHandle: add new files -> preview objects with .file
  const imageHandle = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
    setImageShow(prev => [...prev, ...previews]);
  };

  // changeImage(img, files)
  const changeImage = (imgOrUrl, files) => {
    if (!files || files.length === 0) return;
    const newFile = files[0];
    const key = typeof imgOrUrl === 'string' ? imgOrUrl : imgOrUrl.url;
    const idx = imageShow.findIndex(it => (typeof it === 'string' ? it : it.url) === key);
    if (idx === -1) return;
    const newPreview = { url: URL.createObjectURL(newFile), file: newFile };
    setImageShow(prev => {
      const copy = [...prev];
      // revoke old objectURL if it was a created one
      const old = copy[idx];
      if (old && old.file && old.url) { try { URL.revokeObjectURL(old.url); } catch {} }
      copy[idx] = newPreview;
      return copy;
    });
  };

  const removeImage = (index) => {
    const item = imageShow[index];
    if (item && item.file && item.url) {
      try { URL.revokeObjectURL(item.url); } catch {}
    }
    setImageShow(prev => prev.filter((_, i) => i !== index));
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value) setAllCategory(categories || []);
    else setAllCategory((categories || []).filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
  };

  // discount calc + validation
  useEffect(() => {
    const priceNum = parseFloat(state.price);
    const oldPriceNum = parseFloat(state.oldPrice);

    let newDiscount = "";
    let newError = "";

    if (state.oldPrice !== "" && state.oldPrice != null) {
      if (isNaN(oldPriceNum)) newError = 'Old Price must be a number';
      else if (state.price === "" || isNaN(priceNum)) newError = 'Enter Price first';
      else if (oldPriceNum <= priceNum) newError = 'Old Price must be greater than Price';
      else newDiscount = String(Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100));
    } else {
      newDiscount = "";
      newError = "";
    }

    if (String(state.discount) !== String(newDiscount)) setState(prev => ({ ...prev, discount: newDiscount }));
    if (errors.oldPrice !== newError) setErrors(prev => ({ ...prev, oldPrice: newError }));
  }, [state.price, state.oldPrice]); // eslint-disable-line

  const isFormValid = () => {
    const nameOK = state.name?.toString().trim() !== '';
    const descOK = state.description?.toString().trim() !== '';
    const priceNum = parseFloat(state.price);
    const priceOK = !isNaN(priceNum) && priceNum > 0;
    const catOK = (category || '').toString().trim() !== '';
    const imagesOK = imageShow.length > 0;
    const oldErrOK = errors.oldPrice === '';
    return nameOK && descOK && priceOK && catOK && imagesOK && oldErrOK;
  };

  // Update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fix validation errors');
      return;
    }

    const fd = new FormData();
    fd.append('productId', productId);
    fd.append('name', state.name);
    fd.append('description', state.description);
    fd.append('price', state.price);
    fd.append('oldPrice', state.oldPrice);
    fd.append('discount', state.discount);
    fd.append('resellingPrice', state.resellingPrice);
    fd.append('brand', state.brand);
    fd.append('fbProductLink', state.fbProductLink);
    fd.append('sku', state.sku);
    fd.append('stock', state.stock);
    fd.append('category', category);

    // existing image URLs
    const existing = imageShow.filter(item => !item.file).map(item => (typeof item === 'string' ? item : item.url));
    fd.append('existingImages', JSON.stringify(existing));

    // append new files
    imageShow.filter(item => item.file).forEach(it => fd.append('images', it.file));

    try {
      const result = await dispatch(update_product(fd)).unwrap();
      // toast.success(result?.message || 'Product updated');
      navigate('/seller/products')
      // replace previews with returned images
      if (result?.product?.images) {
        setImageShow((result.product.images || []).map(url => url));
      }
      // optionally refresh listing
      dispatch(get_product({ page: 1, searchValue: '', perPage: 10 }));
    } catch (err) {
      console.error('update err', err);
      toast.error(err?.error || err?.message || 'Update failed');
    }
  };

  // cleanup on unmount: revoke any created object URLs
  useEffect(() => {
    return () => {
      imageShow.forEach(it => {
        if (it && it.file && it.url) {
          try { URL.revokeObjectURL(it.url); } catch {}
        }
      });
    };
  }, [imageShow]);

  if (initialLoading) {
    return <div className="p-6 text-center"><PropagateLoader color="#fff" /></div>;
  }

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
          <Link className='primaryBtn ' to='/seller/products'>Products</Link>
        </div>

        <form onSubmit={handleUpdate}>
          {/* keep your exact form JSX here — using handlers defined above */}
          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="name">Product Name</label>
              <input name="name" value={state.name} onChange={inputHandle} type="text" placeholder='product name' id='name' className='inputField' />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="brand">Product Brand</label>
              <input name="brand" value={state.brand} onChange={inputHandle} type="text" placeholder='product brand' id='brand' className='inputField' />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full relative'>
              <label htmlFor="category">Category</label>
              <input readOnly onClick={() => setCatShow(!catShow)} value={category} type="text" placeholder='--- Select Category ---' name='category' id='category' className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md  text-[#d0d2d6]' />
              <div className={`absolute top-[101%] bg-slate-800 w-full transition-all ${catShow ? 'scale-100' : 'scale-0'}`}>
                <div className='w-full px-4 py-2 fixed'>
                  <input onChange={categorySearch} value={searchValue} type="text" placeholder='search category' className='px-3 py-1 focus:border-indigo-500 outline-none bg-transparent  border border-slate-700 rounded-md w-full text-[#d0d2d6] overflow-hidden' />
                </div>
                <div className='pt-14'> </div>
                <div className='flex justify-start items-start flex-col h-[200px] overflow-y-auto'>
                  {
                    allCategory.map((c, i) => <span
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg  w-full cursor-pointer ${category === c.name ? 'bg-indigo-500' : ''}`}
                      key={i} onClick={() => {
                        setCatShow(false);
                        setCategory(c.name);
                        setSearchValue('');
                        setAllCategory(categories);
                      }}>{c.name}</span>)
                  }

                </div>

              </div>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="stock">Stock</label>
              <input name="stock" value={state.stock} onChange={inputHandle} type="text" placeholder='product stock' id='stock' className='inputField' />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="price">Price</label>
              <input name="price" value={state.price} onChange={inputHandle} type="number" placeholder='price'  id='price' className='inputField' min={0} />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="oldPrice">Old Price</label>
              <input name="oldPrice" value={state.oldPrice} onChange={inputHandle} type="number" placeholder='oldPrice'  id='oldPrice' className='inputField' min={0} />
              {errors.oldPrice && <p className="text-red-400 text-sm mt-1">{errors.oldPrice}</p>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="discount">Discount</label>
              <input name="discount" value={state.discount} onChange={inputHandle} type="number" placeholder='discount'  id='discount' className='inputField' min={0} disabled />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="resellingPrice">Reselling Price</label>
              <input name="resellingPrice" value={state.resellingPrice} onChange={inputHandle} type="number" placeholder='resellingPrice'  id='Reselling Price' className='inputField'  />
            </div>
          </div>
{/* Horizontal single-line responsive image strip */}
<div className="overflow-x-auto py-2 -mx-2">
  <div className="flex gap-3 px-2 min-w-max items-start">
    {imageShow?.map((img, i) => (
      <div
        key={i}
        className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-[120px] md:h-[140px] rounded-md overflow-hidden relative shadow-sm"
      >
        <label htmlFor={`img-${i}`} className="block w-full h-full cursor-pointer">
          <img
            src={typeof img === 'string' ? img : img.url}
            alt={`preview-${i}`}
            className="w-full h-full object-cover"
          />
        </label>

        {/* hidden file input to replace this image */}
        <input
          id={`img-${i}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => changeImage(img, e.target.files)}
        />

        {/* remove button */}
        <button
          type="button"
          onClick={() => removeImage(i)}
          className="absolute top-2 right-2 z-20 bg-black/60 text-white rounded-full p-1 hover:bg-white hover:text-black transition"
          aria-label={`Remove image ${i + 1}`}
        >
          <IoCloseSharp size={16} />
        </button>
      </div>
    ))}

    {/* Add images tile */}
    <div className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-[120px] md:h-[140px] rounded-md border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400 cursor-pointer">
      <label htmlFor="imageAdd" className="flex flex-col items-center justify-center gap-1 w-full h-full">
        <BsImage size={24} />
        <div className="text-sm">Select Images</div>
      </label>
      <input id="imageAdd" type="file" multiple accept="image/*" className="hidden" onChange={imageHandle} />
    </div>
  </div>
</div>
          <div className=' my-4'>
            <button disabled={loader || !!errors.oldPrice} className={`primaryBtn w-full md:w-52 transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
              {
                loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Update Product"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;