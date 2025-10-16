import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { add_product, messageClear, get_products } from '../../store/Reducers/productReducer';
import toast from 'react-hot-toast';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';
import api from '../../api/api';

const AddProduct = () => {
  const dispatch = useDispatch();
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
    stock: "",
    slug:''
  });

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);

  // Cascade states
  const [catShow, setCatShow] = useState(false);
  const [subShow, setSubShow] = useState(false);
  const [childShow, setChildShow] = useState(false);

  const [allCategory, setAllCategory] = useState([]);
  const [category, setCategory] = useState('');        // name
  const [selectedCatId, setSelectedCatId] = useState('');

  const [subList, setSubList] = useState([]);
  const [subcategory, setSubcategory] = useState('');  // name
  const [selectedSubId, setSelectedSubId] = useState('');

  const [childList, setChildList] = useState([]);
  const [child, setChild] = useState('');              // name
  const [selectedChildId, setSelectedChildId] = useState(''); // NEW

  // New: colors & sizes
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const suggestedColors = ['Black','White','Red','Blue','Green','Yellow','Pink','Purple','Gray','Brown','Orange','Navy'];
  const suggestedSizes = ['XS','S','M','L','XL','XXL','3XL','Free Size','22','24','26','28','30','32','34','36','38','40'];

  const [errors, setErrors] = useState({ oldPrice: '' });

  useEffect(() => {
    dispatch(get_category({ searchValue: '', perPage: 50, page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    setAllCategory(categories || []);
  }, [categories]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // reset
      setState({
        name: "", description: "", price: "", oldPrice: "", discount: "",
        resellingPrice: "", brand: "", rating: "", fbProductLink: "", sku: "",
        stock: "", slug:''
      });
      setImages([]); setImageShow([]);
      setCategory(''); setSelectedCatId('');
      setSubcategory(''); setSelectedSubId('');
      setChild(''); setSelectedChildId('');
      setSubList([]); setChildList([]);
      // reset colors/sizes
      setColors([]); setSizes([]); setColorInput(''); setSizeInput('');
      dispatch(get_products({ page: 1, searchValue: '', perPage: 10 }));
    }
  }, [errorMessage, successMessage, dispatch]);

  // auto-calc discount + validate
  useEffect(() => {
    const priceNum = parseFloat(state.price);
    const oldPriceNum = parseFloat(state.oldPrice);
    let newDiscount = "";
    if (!isNaN(priceNum) && !isNaN(oldPriceNum) && oldPriceNum > priceNum) {
      newDiscount = String(Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100));
    } else newDiscount = "";
    if (String(state.discount) !== String(newDiscount)) {
      setState(prev => ({ ...prev, discount: newDiscount }));
    }
    validatePrices(state.price, state.oldPrice);
    // eslint-disable-next-line
  }, [state.price, state.oldPrice]);

  const validatePrices = (priceVal, oldPriceVal) => {
    const priceNum = parseFloat(priceVal);
    const oldNum = parseFloat(oldPriceVal);
    let err = '';
    if (oldPriceVal !== '' && oldPriceVal != null) {
      if (isNaN(oldNum)) err = 'Old Price must be a number';
      else if (priceVal === '' || isNaN(priceNum)) err = 'Enter Price first';
      else if (oldNum <= priceNum) err = 'Old Price must be greater than Price';
    }
    setErrors(prev => ({ ...prev, oldPrice: err }));
    return err;
  };

  const inputHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') return;
    setState(prev => ({ ...prev, [name]: value }));
  };

  const imageHandle = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f) }));
    setImageShow(prev => [...prev, ...newPreviews]);
  };

  const changeImage = (file, index) => {
    if (!file) return;
    const newImages = [...images]; newImages[index] = file; setImages(newImages);
    const newPreviews = [...imageShow]; newPreviews[index] = { url: URL.createObjectURL(file) }; setImageShow(newPreviews);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageShow(prev => prev.filter((_, i) => i !== index));
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    if (!value) setAllCategory(categories || []);
    else setAllCategory((categories || []).filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
  };

  const fetchSubs = async (catId) => {
    if (!catId) { setSubList([]); return; }
    try {
      const { data } = await api.get(`/sub-category-get?categoryId=${catId}`, { withCredentials: true });
      setSubList(data?.subCategories || []);
    } catch { setSubList([]); }
  };

  const fetchChilds = async (subId) => {
    if (!subId) { setChildList([]); return; }
    try {
      const { data } = await api.get(`/child-category-get?subcategoryId=${subId}`, { withCredentials: true });
      setChildList(data?.childCategories || []);
    } catch { setChildList([]); }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!state.name) return toast.error("Product name required");
    if (!category || !selectedCatId) return toast.error("Select category");
    if (images.length === 0) return toast.error("At least one image required");
    const priceNum = parseFloat(state.price);
    if (isNaN(priceNum) || priceNum <= 0) return toast.error("Enter a valid price");
    if (state.oldPrice !== '') {
      const err = validatePrices(state.price, state.oldPrice);
      if (err) return toast.error(err);
    }

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("slug", state.slug);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("oldPrice", state.oldPrice);
    formData.append("discount", state.discount);
    formData.append("resellingPrice", state.resellingPrice);
    formData.append("brand", state.brand);
    formData.append("fbProductLink", state.fbProductLink);
    formData.append("sku", state.sku);
    formData.append("rating", state.rating);

    // names (optional)
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("child", child);

    // IDs (required for filtering)
    formData.append("categoryId", selectedCatId || '');
    formData.append("subcategoryId", selectedSubId || '');
    formData.append("childId", selectedChildId || '');

    // New: colors & sizes
    formData.append("colors", JSON.stringify(colors));
    formData.append("sizes", JSON.stringify(sizes));

    formData.append("shopName", "MM Fashion World");
    formData.append("stock", state.stock);
    images.forEach(file => formData.append("images", file));

    dispatch(add_product(formData));
  };

  // Dropdown visibility helpers
  const openMenu = 'opacity-100 scale-100 pointer-events-auto';
  const closedMenu = 'opacity-0 scale-95 pointer-events-none';

  // Helpers for colors/sizes chips
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

  return (
    <div className="px-2 md:px-7 py-2">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Add Product</h1>
          <Link className='primaryBtn ' to='/seller/products'>Products</Link>
        </div>

        <form onSubmit={handleAddProduct}>
          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="name">Product Name <span className='text-red-600'>*</span></label>
              <input name="name" value={state.name} onChange={inputHandle} type="text" placeholder='product name' id='name' className='inputField' required />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="brand">Product Brand</label>
              <input name="brand" value={state.brand} onChange={inputHandle} type="text" placeholder='product brand' id='brand' className='inputField' />
            </div>
          </div>

          {/* Category */}
          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full relative z-[1000]'>
              <label htmlFor="category">Category <span className='text-red-600'>*</span></label>
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
                  <input onChange={categorySearch} placeholder='search category' className='px-3 py-1 focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md w-full text-[#d0d2d6]' />
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
                        fetchSubs(c._id);
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
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
                  onClick={() => { if (subList.length) { setSubShow(s => !s); setCatShow(false); setChildShow(false); } }}
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
                            fetchChilds(s._id);
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
                  onClick={() => { if (selectedSubId && childList.length) { setChildShow(s => !s); setCatShow(false); setSubShow(false); } }}
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
              <label htmlFor="price">Price <span className='text-red-600'>*</span></label>
              <input name="price" value={state.price} onChange={inputHandle} type="number" placeholder='price' id='price' className='inputField' min={0} />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="oldPrice" >Old Price</label>
              <input name="oldPrice" value={state.oldPrice} onChange={inputHandle} type="number" placeholder='oldPrice' id='oldPrice' className='inputField' min={0} />
              {errors.oldPrice && <p className="text-red-400 text-sm mt-1">{errors.oldPrice}</p>}
            </div>
             <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="resellingPrice">Reselling Price</label>
              <input name="resellingPrice" value={state.resellingPrice} onChange={inputHandle} type="number" placeholder='resellingPrice' id='resellingPrice' className='inputField' min={0} />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="discount">Discount (%)</label>
              <input name="discount" value={state.discount} onChange={inputHandle} type="number" placeholder='discount' id='discount' className='inputField' min={0} disabled />
            </div>
            {/* Stock */}
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="stock">Stock <span className='text-red-600'>*</span></label>
              <input name="stock" value={state.stock} onChange={inputHandle} type="number" placeholder='product stock' id='stock' className='inputField' required/>
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

          <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="fbProductLink">Product Fb Link</label>
            <input name="fbProductLink" value={state.fbProductLink} onChange={inputHandle} type="text" placeholder='Product FB Link' id='fbProductLink' className='inputField' />
          </div>
<div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
<div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="sku">Sku</label>
            <input name="sku" value={state.sku} onChange={inputHandle} type="text" placeholder='sku' id='sku' className='inputField' />
          </div>

          <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="rating">Rating</label>
            <input name="rating" value={state.rating} onChange={inputHandle} type="Number" placeholder='rating' id='rating' className='inputField' />
          </div>
</div>
          

          <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="description">Description <span className='text-red-600'>*</span></label>
            <textarea name="description" value={state.description} onChange={inputHandle} placeholder='description here' id='description' className='inputField' rows={6}></textarea>
          </div>

          {/* Images */}
          <div className='grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 mt-4'>
            {imageShow.map((img, i) => (
              <div key={i} className='h-[160px] relative'>
                <label htmlFor={i}>
                  <img src={img.url} alt="image_show_image" className='w-full h-full rounded-sm object-cover' />
                </label>
                <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={i} className='hidden' />
                <span onClick={() => removeImage(i)} className='p-2 z-10 cursor-pointer bg-gray-800 rounded-full hover:bg-[#d0d2d6] transition-all duration-300 hover:text-black text-white absolute top-0 right-0'>
                  <IoCloseSharp />
                </span>
              </div>
            ))}
            <label className='flex justify-center items-center flex-col h-[160px] cursor-pointer border border-dashed hover:border-teal-500 w-full' htmlFor="image">
              <span><BsImage /></span>
              <span>Select Image</span>
            </label>
            <input multiple onChange={imageHandle} type='file' id='image' className='hidden' />
          </div>

          <div className='flex my-4'>
            <button disabled={loader || !!errors.oldPrice} type="submit" className={`primaryBtn w-full md:w-52 transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
              {loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;