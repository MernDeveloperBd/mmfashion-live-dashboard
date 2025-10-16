// src/pages/.../EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { update_product, messageClear, get_products } from '../../store/Reducers/productReducer';
import api from '../../api/api';
import toast from 'react-hot-toast';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const navigate = useNavigate();
  const { categories } = useSelector(state => state.category);
  const { loader, errorMessage, successMessage } = useSelector(state => state.product);

  const [state, setState] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",
    resellingPrice: "",
    brand: "",
    rating: "",
    fbProductLink: "",
    sku: "",
    stock: ""
  });

  const [imageShow, setImageShow] = useState([]);

  // Cascade dropdown states
  const [allCategory, setAllCategory] = useState([]);
  const [catShow, setCatShow] = useState(false);
  const [subShow, setSubShow] = useState(false);
  const [childShow, setChildShow] = useState(false);

  const [category, setCategory] = useState('');       // name
  const [selectedCatId, setSelectedCatId] = useState('');

  const [subList, setSubList] = useState([]);
  const [subcategory, setSubcategory] = useState(''); // name
  const [selectedSubId, setSelectedSubId] = useState('');

  const [childList, setChildList] = useState([]);
  const [child, setChild] = useState('');             // name
  const [selectedChildId, setSelectedChildId] = useState(''); // NEW

  const [searchValue, setSearchValue] = useState('');
  const [errors, setErrors] = useState({ oldPrice: '' });
  const [initialLoading, setInitialLoading] = useState(true);

  // New: colors & sizes
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const suggestedColors = ['Black','White','Red','Blue','Green','Yellow','Pink','Purple','Gray','Brown','Orange','Navy'];
  const suggestedSizes = ['XS','S','M','L','XL','XXL','3XL','Free Size','22','24','26','28','30','32','34','36','38','40'];

  // dropdown classes
  const openMenu = 'opacity-100 scale-100 pointer-events-auto';
  const closedMenu = 'opacity-0 scale-95 pointer-events-none';

  // Helpers to safely append numbers
  const parseNumOrUndef = (v) => {
    if (v === null || v === undefined) return undefined;
    const s = String(v).trim();
    if (s === '') return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };
  const appendIfNumber = (fd, key, val) => {
    const n = parseNumOrUndef(val);
    if (n !== undefined) fd.append(key, String(n));
  };

  // preload categories
  useEffect(() => {
    dispatch(get_category({ searchValue: '', perPage: 50, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setAllCategory(categories || []);
    if (category && categories?.length && !selectedCatId) {
      const found = categories.find(c => c.name === category);
      if (found) setSelectedCatId(found._id);
    }
  }, [categories, category, selectedCatId]);

  // fetch product
  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(`/single-product-get/${productId}`, { withCredentials: true });
        const p = res.data?.product;
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
          rating: p.rating ?? '',
          stock: p.stock ?? ''
        });

        // names
        setCategory(p.category ?? '');
        setSubcategory(p.subcategory ?? '');
        setChild(p.child ?? '');

        // IDs (NEW)
        setSelectedCatId(p.categoryId || '');
        setSelectedSubId(p.subcategoryId || '');
        setSelectedChildId(p.childId || '');

        // colors/sizes
        setColors(Array.isArray(p.colors) ? p.colors : []);
        setSizes(Array.isArray(p.sizes) ? p.sizes : []);

        setImageShow((p.images || []).map(url => (typeof url === 'string' ? url : url.url || url)));
      } catch (err) {
        toast.error('Failed to load product', err);
      } finally {
        if (mounted) setInitialLoading(false);
      }
    };
    if (productId) fetchProduct();
    return () => { mounted = false; };
  }, [productId]);

  // when selectedCatId changes, load sub list and map subcategory name -> id
  useEffect(() => {
    const loadSubs = async () => {
      if (!selectedCatId) { setSubList([]); return; }
      try {
        const { data } = await api.get(`/sub-category-get?categoryId=${selectedCatId}`, { withCredentials: true });
        const subs = data?.subCategories || [];
        setSubList(subs);
        if (subcategory && subs.length && !selectedSubId) {
          const found = subs.find(s => s.name === subcategory);
          if (found) setSelectedSubId(found._id);
        }
      } catch {
        setSubList([]);
      }
    };
    loadSubs();
  }, [selectedCatId, subcategory, selectedSubId]);

  // when selectedSubId changes, load child list
  useEffect(() => {
    const loadChilds = async () => {
      if (!selectedSubId) { setChildList([]); return; }
      try {
        const { data } = await api.get(`/child-category-get?subcategoryId=${selectedSubId}`, { withCredentials: true });
        setChildList(data?.childCategories || []);
      } catch {
        setChildList([]);
      }
    };
    loadChilds();
  }, [selectedSubId]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch]);

  const inputHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') return;
    setState(prev => ({ ...prev, [name]: value }));
  };

  // add new files
  const imageHandle = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const previews = files.map(f => ({ url: URL.createObjectURL(f), file: f }));
    setImageShow(prev => [...prev, ...previews]);
  };

  // replace an image
  const changeImage = (imgOrUrl, files) => {
    if (!files || files.length === 0) return;
    const newFile = files[0];
    const key = typeof imgOrUrl === 'string' ? imgOrUrl : imgOrUrl.url;
    const idx = imageShow.findIndex(it => (typeof it === 'string' ? it : it.url) === key);
    if (idx === -1) return;
    const newPreview = { url: URL.createObjectURL(newFile), file: newFile };
    setImageShow(prev => {
      const copy = [...prev];
      const old = copy[idx];
      if (old && typeof old !== 'string' && old.file && old.url) {
        try { URL.revokeObjectURL(old.url); } catch {}
      }
      copy[idx] = newPreview;
      return copy;
    });
  };

  const removeImage = (index) => {
    const item = imageShow[index];
    if (item && typeof item !== 'string' && item.file && item.url) {
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
      else if (oldPriceNum <= priceNum) newError = 'Old Price must be greater than Price or blank';
      else newDiscount = String(Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100));
    } else {
      newDiscount = "";
      newError = "";
    }

    if (String(state.discount) !== String(newDiscount)) setState(prev => ({ ...prev, discount: newDiscount }));
    if (errors.oldPrice !== newError) setErrors(prev => ({ ...prev, oldPrice: newError }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.price, state.oldPrice]);

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

    // numeric fields: only append if valid
    appendIfNumber(fd, 'price', state.price);
    appendIfNumber(fd, 'oldPrice', state.oldPrice);
    appendIfNumber(fd, 'discount', state.discount);
    appendIfNumber(fd, 'resellingPrice', state.resellingPrice);
    appendIfNumber(fd, 'rating', state.rating);
    appendIfNumber(fd, 'stock', state.stock);

    // text fields
    fd.append('brand', state.brand);
    fd.append('fbProductLink', state.fbProductLink);
    fd.append('sku', state.sku);

    // names
    fd.append('category', category);
    fd.append('subcategory', subcategory);
    fd.append('child', child);

    // IDs (NEW)
    fd.append('categoryId', selectedCatId || '');
    fd.append('subcategoryId', selectedSubId || '');
    fd.append('childId', selectedChildId || '');

    // New: colors & sizes
    fd.append('colors', JSON.stringify(colors));
    fd.append('sizes', JSON.stringify(sizes));

    // existing image URLs
    const existing = imageShow
      .filter(item => typeof item === 'string')
      .map(item => item);
    fd.append('existingImages', JSON.stringify(existing));

    // append new files
    imageShow
      .filter(item => typeof item !== 'string' && item.file)
      .forEach(it => fd.append('images', it.file));

    try {
      const result = await dispatch(update_product(fd)).unwrap();
      // refresh list (optional) and navigate
      dispatch(get_products({ page: 1, searchValue: '', perPage: 10 }));
      navigate('/seller/products');

      // update local previews if needed
      if (result?.product?.images) {
        setImageShow((result.product.images || []).map(url => url));
      }
    } catch (err) {
      toast.error(err?.error || err?.message || 'Update failed');
    }
  };

  // cleanup object URLs
  useEffect(() => {
    return () => {
      imageShow.forEach(it => {
        if (it && typeof it !== 'string' && it.file && it.url) {
          try { URL.revokeObjectURL(it.url); } catch {}
        }
      });
    };
  }, [imageShow]);

  // color/size helpers
  const addColor = () => {
    let v = colorInput.trim();
    if (!v) return;
    v = v.charAt(0).toUpperCase() + v.slice(1);
    if (!colors.includes(v)) setColors(prev => [...prev, v]);
    setColorInput('');
  };
  const addSize = () => {
    let v = sizeInput.trim();
    if (!v) return;
    v = v.toUpperCase();
    if (!sizes.includes(v)) setSizes(prev => [...prev, v]);
    setSizeInput('');
  };
  const removeColor = (val) => setColors(prev => prev.filter(c => c !== val));
  const removeSize = (val) => setSizes(prev => prev.filter(s => s !== val));
  const onColorKey = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addColor(); } };
  const onSizeKey = (e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSize(); } };
  const toggleSuggestColor = (val) => {
    if (colors.includes(val)) setColors(prev => prev.filter(c => c !== val));
    else setColors(prev => [...prev, val]);
  };
  const toggleSuggestSize = (val) => {
    if (sizes.includes(val)) setSizes(prev => prev.filter(s => s !== val));
    else setSizes(prev => [...prev, val]);
  };

  if (initialLoading) {
    return <div className="p-6 text-center"><PropagateLoader color="#fff" cssOverride={overrideStyle} /></div>;
  }

  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
          <Link className='primaryBtn ' to='/seller/products'>Products</Link>
        </div>

        <form onSubmit={handleUpdate}>
          {/* Name + Brand */}
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

          {/* Category */}
          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full relative z-[1000]'>
              <label htmlFor="category">Category</label>
              <input
                readOnly
                onClick={() => { setCatShow(s => !s); setSubShow(false); setChildShow(false); }}
                value={category}
                type="text"
                placeholder='--- Select Category ---'
                id='category'
                className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
              />
              <div className={`absolute top-[101%] left-0 w-full bg-slate-800 rounded-md shadow-lg transition transform origin-top ${catShow ? openMenu : closedMenu} z-[1000]`}>
                <div className='w-full px-4 py-2 sticky top-0 bg-slate-800'>
                  <input
                    onChange={categorySearch}
                    value={searchValue}
                    type="text"
                    placeholder='search category'
                    className='px-3 py-1 focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md w-full text-[#d0d2d6]'
                  />
                </div>
                <div className='max-h-[240px] overflow-y-auto'>
                  {allCategory.map((c, i) => (
                    <span
                      key={c._id || i}
                      className={`block px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${category === c.name ? 'bg-indigo-500 text-white' : ''}`}
                      onClick={() => {
                        setCatShow(false);
                        setCategory(c.name);
                        setSelectedCatId(c._id || '');
                        setSubcategory(''); setSelectedSubId('');
                        setChild(''); setSelectedChildId('');
                        setChildList([]);
                        setSearchValue('');
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stock */}
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="stock">Stock</label>
              <input name="stock" value={state.stock} onChange={inputHandle} type="number" placeholder='product stock' id='stock' className='inputField' min={0} />
            </div>
          </div>

          {/* Sub + Child */}
          {selectedCatId ? (
            <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
              {/* Sub */}
              <div className='flex flex-col gap-1 w-full relative z-[900]'>
                <label htmlFor="subcategory">Sub Category</label>
                <input
                  readOnly
                  onClick={async () => {
                    if (!subList.length) {
                      try {
                        const { data } = await api.get(`/sub-category-get?categoryId=${selectedCatId}`, { withCredentials: true });
                        setSubList(data?.subCategories || []);
                      } catch { setSubList([]); }
                    }
                    setSubShow(s => !s); setCatShow(false); setChildShow(false);
                  }}
                  value={subcategory}
                  type="text"
                  placeholder={subList?.length ? '--- Select Sub Category ---' : 'No Sub Category'}
                  id='subcategory'
                  className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                />
                {subList?.length ? (
                  <div className={`absolute top-[101%] left-0 w-full bg-slate-800 rounded-md shadow-lg transition transform origin-top ${subShow ? openMenu : closedMenu} z-[900]`}>
                    <div className='max-h-[240px] overflow-y-auto'>
                      {subList.map((s) => (
                        <span
                          key={s._id}
                          className={`block px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${subcategory === s.name ? 'bg-indigo-500 text-white' : ''}`}
                          onClick={() => {
                            setSubShow(false);
                            setSubcategory(s.name);
                            setSelectedSubId(s._id);
                            setChild(''); setSelectedChildId('');
                            setChildList([]);
                          }}
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Child */}
              <div className='flex flex-col gap-1 w-full relative z-[800]'>
                <label htmlFor="child">Child Category</label>
                <input
                  readOnly
                  onClick={async () => {
                    if (!selectedSubId) return;
                    if (!childList.length) {
                      try {
                        const { data } = await api.get(`/child-category-get?subcategoryId=${selectedSubId}`, { withCredentials: true });
                        setChildList(data?.childCategories || []);
                      } catch { setChildList([]); }
                    }
                    setChildShow(s => !s); setCatShow(false); setSubShow(false);
                  }}
                  value={child}
                  type="text"
                  placeholder={selectedSubId ? (childList?.length ? '--- Select Child Category ---' : 'No Child Category') : 'Select Sub Category first'}
                  id='child'
                  className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'
                  disabled={!selectedSubId}
                />
                {childList?.length ? (
                  <div className={`absolute top-[101%] left-0 w-full bg-slate-800 rounded-md shadow-lg transition transform origin-top ${childShow ? openMenu : closedMenu} z-[800]`}>
                    <div className='max-h-[240px] overflow-y-auto'>
                      {childList.map((ch) => (
                        <span
                          key={ch._id}
                          className={`block px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer ${child === ch.name ? 'bg-indigo-500 text-white' : ''}`}
                          onClick={() => { 
                            setChildShow(false); 
                            setChild(ch.name); 
                            setSelectedChildId(ch._id); // NEW
                          }}
                        >
                          {ch.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Prices */}
          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="price">Price</label>
              <input name="price" value={state.price} onChange={inputHandle} type="number" placeholder='price' id='price' className='inputField' min={0} />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="oldPrice">Old Price</label>
              <input name="oldPrice" value={state.oldPrice} onChange={inputHandle} type="number" placeholder='oldPrice' id='oldPrice' className='inputField' min={0} />
              {errors.oldPrice && <p className="text-red-400 text-sm mt-1">{errors.oldPrice}</p>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="discount">Discount</label>
              <input name="discount" value={state.discount} onChange={inputHandle} type="number" placeholder='discount' id='discount' className='inputField' min={0} disabled />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="resellingPrice">Reselling Price</label>
              <input name="resellingPrice" value={state.resellingPrice} onChange={inputHandle} type="number" placeholder='resellingPrice' id='resellingPrice' className='inputField' />
            </div>
          </div>

          {/* Colors */}
          <div className='flex flex-col gap-2 w-full text-[#d0d2d6] mb-4'>
            <label>Colors</label>
            <div className="flex gap-2">
              <input
                value={colorInput}
                onChange={(e)=>setColorInput(e.target.value)}
                onKeyDown={onColorKey}
                placeholder="Type color and press Enter"
                className="inputField flex-1"
              />
              <button type="button" onClick={addColor} className="px-3 py-2 bg-teal-600 rounded text-white">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map(c => (
                <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 text-xs">
                  {c}
                  <button type="button" onClick={()=>removeColor(c)} className="hover:text-red-400"><IoCloseSharp size={12}/></button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedColors.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={()=>toggleSuggestColor(c)}
                  className={`text-xs px-2 py-1 rounded border ${colors.includes(c) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-600 hover:bg-slate-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className='flex flex-col gap-2 w-full text-[#d0d2d6] mb-4'>
            <label>Sizes</label>
            <div className="flex gap-2">
              <input
                value={sizeInput}
                onChange={(e)=>setSizeInput(e.target.value)}
                onKeyDown={onSizeKey}
                placeholder="Type size (e.g. M, 32) and press Enter"
                className="inputField flex-1"
              />
              <button type="button" onClick={addSize} className="px-3 py-2 bg-teal-600 rounded text-white">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-700 text-xs">
                  {s}
                  <button type="button" onClick={()=>removeSize(s)} className="hover:text-red-400"><IoCloseSharp size={12}/></button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedSizes.map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={()=>toggleSuggestSize(s)}
                  className={`text-xs px-2 py-1 rounded border ${sizes.includes(s) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-600 hover:bg-slate-700'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="rating">Rating</label>
              <input name="rating" value={state.rating} onChange={inputHandle} type="number" placeholder='rating' id='rating' className='inputField' min={0} max={5} step="0.1" />
            </div>
          </div>

          <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="description">Description <span className='text-red-600'>*</span></label>
            <textarea name="description" value={state.description} onChange={inputHandle} placeholder='description here' id='description' className='inputField' rows={6}></textarea>
          </div>

          {/* Image strip */}
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
                  <input
                    id={`img-${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => changeImage(img, e.target.files)}
                  />
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

              {/* Add images */}
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
              {loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;