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

const AddProduct = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.category);
  const { loader, errorMessage, successmessage } = useSelector(state => state.product);

  const [state, setState] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    discount: "",            // auto-calculated
    resellingPrice: "",
    brand: "",
    fbProductLink: "",
    sku: "",
    stock: ""
  });

  const [images, setImages] = useState([]); // File objects
  const [imageShow, setImageShow] = useState([]); // preview urls [{url}]
  const [category, setCategory] = useState('');
  const [catShow, setCatShow] = useState(false);
  const [allCategory, setAllCategory] = useState([]);

  // validation errors
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
    if (successmessage) {
      toast.success(successmessage);
      dispatch(messageClear());
      // reset form
      setState({
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
      setImages([]);
      setImageShow([]);
      setCategory('');
      dispatch(get_products({ page: 1, searchValue: '', perPage: 10 }));
    }
  }, [errorMessage, successmessage, dispatch]);

  // auto-calc discount when price or oldPrice change
  useEffect(() => {
    const priceNum = parseFloat(state.price);
    const oldPriceNum = parseFloat(state.oldPrice);

    let newDiscount = "";
    if (!isNaN(priceNum) && !isNaN(oldPriceNum) && oldPriceNum > priceNum) {
      newDiscount = String(Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100));
    } else {
      newDiscount = "";
    }

    if (String(state.discount) !== String(newDiscount)) {
      setState(prev => ({ ...prev, discount: newDiscount }));
    }

    // validate price/oldPrice relationship and set errors
    validatePrices(state.price, state.oldPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.price, state.oldPrice]);

  // validation helper
  const validatePrices = (priceVal, oldPriceVal) => {
    const priceNum = parseFloat(priceVal);
    const oldNum = parseFloat(oldPriceVal);

    // default no error
    let err = '';

    // if oldPrice provided, require price present and numeric
    if (oldPriceVal !== '' && oldPriceVal != null) {
      if (isNaN(oldNum)) {
        err = 'Old Price must be a number';
      } else if (priceVal === '' || isNaN(priceNum)) {
        err = 'Enter Price first';
      } else if (oldNum <= priceNum) {
        err = 'Old Price must be greater than Price';
      }
    }

    setErrors(prev => ({ ...prev, oldPrice: err }));
    return err;
  };

  // prevent manual edit of discount by ignoring name='discount'
  const inputHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') return;
    // numeric fields: ensure no arrays
    setState(prev => ({ ...prev, [name]: value }));
  };

  const imageHandle = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f) }));
    setImageShow(prev => [...prev, ...newPreviews]);
  };

  const changeImage = (file, index) => {
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const newPreviews = [...imageShow];
    newPreviews[index] = { url: URL.createObjectURL(file) };
    setImageShow(newPreviews);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageShow(prev => prev.filter((_, i) => i !== index));
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    if (!value) {
      setAllCategory(categories || []);
    } else {
      setAllCategory((categories || []).filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    // basic validation
    if (!state.name) return toast.error("Product name required");
    if (!category) return toast.error("Select category");
    if (images.length === 0) return toast.error("At least one image required");

    // enforce price numeric and >0
    const priceNum = parseFloat(state.price);
    if (isNaN(priceNum) || priceNum <= 0) return toast.error("Enter a valid price");

    // validate oldPrice rule (if provided)
    if (state.oldPrice !== '') {
      // const oldPriceNum = parseFloat(state.oldPrice);
      const err = validatePrices(state.price, state.oldPrice);
      if (err) {
        toast.error(err);
        return;
      }
    }
    // prepare form data
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("oldPrice", state.oldPrice);
    formData.append("discount", state.discount); // auto-calculated
    formData.append("resellingPrice", state.resellingPrice);
    formData.append("brand", state.brand);
    formData.append("fbProductLink", state.fbProductLink);
    formData.append("sku", state.sku);
    formData.append("category", category);
    formData.append("shopName", "MM Fashion World");
    formData.append("stock", state.stock);

    images.forEach(file => formData.append("images", file));

    dispatch(add_product(formData));
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
              <input name="name" value={state.name} onChange={inputHandle} type="text" placeholder='product name' id='name' className='inputField' required/>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="brand">Product Brand</label>
              <input name="brand" value={state.brand} onChange={inputHandle} type="text" placeholder='product brand' id='brand' className='inputField' />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full relative'>
              <label htmlFor="category">Category <span className='text-red-600'>*</span></label>
              <input readOnly onClick={() => setCatShow(!catShow)} value={category} type="text" placeholder='--- Select Category ---' name='category' id='category' className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md  text-[#d0d2d6]' />
              <div className={`absolute top-[101%] bg-slate-800 w-full transition-all ${catShow ? 'scale-100' : 'scale-0'}`}>
                <div className='w-full px-4 py-2 fixed'>
                  <input onChange={categorySearch} placeholder='search category' className='px-3 py-1 focus:border-indigo-500 outline-none bg-transparent  border border-slate-700 rounded-md w-full text-[#d0d2d6]' />
                </div>
                <div className='pt-14'> </div>
                <div className='flex justify-start items-start flex-col h-[200px] overflow-y-auto'>
                  {
                    allCategory.map((c, i) => <span
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg  w-full cursor-pointer ${category === c.name ? 'bg-indigo-500' : ''}`}
                      key={i} onClick={() => {
                        setCatShow(false);
                        setCategory(c.name);
                        setAllCategory(categories);
                      }}>{c.name}</span>)
                  }

                </div>

              </div>
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="stock">Stock</label>
              <input name="stock" value={state.stock} onChange={inputHandle} type="number" placeholder='product stock' id='stock' className='inputField' />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="price">Price <span className='text-red-600'>*</span></label>
              <input name="price" value={state.price} onChange={inputHandle} type="number" placeholder='price' id='price' className='inputField' min={0} />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="oldPrice" className='text-red-500'>Old Price</label>
              <input name="oldPrice" value={state.oldPrice} onChange={inputHandle} type="number" placeholder='oldPrice' id='oldPrice' className='inputField' min={0} />
              {errors.oldPrice && <p className="text-red-400 text-sm mt-1">{errors.oldPrice}</p>}
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="discount">Discount (%)</label>
              <input name="discount" value={state.discount} onChange={inputHandle} type="number" placeholder='discount' id='discount' className='inputField' min={0} disabled />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="resellingPrice">Reselling Price</label>
              <input name="resellingPrice" value={state.resellingPrice} onChange={inputHandle} type="number" placeholder='resellingPrice' id='resellingPrice' className='inputField' min={0} />
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="fbProductLink">Product Fb Link</label>
              <input name="fbProductLink" value={state.fbProductLink} onChange={inputHandle} type="text" placeholder='Product FB Link' id='fbProductLink' className='inputField' />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor="sku">Sku</label>
              <input name="sku" value={state.sku} onChange={inputHandle} type="text" placeholder='sku' id='sku' className='inputField' />
            </div>
          </div>
  <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
            <label htmlFor="description">Description <span className='text-red-600'>*</span></label>
            <textarea name="description" value={state.description} onChange={inputHandle} placeholder='description here' id='description' className='inputField' rows={6}></textarea>
          </div>
          <div className='grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-4 mt-4'>
            {
              imageShow.map((img, i) => <div key={i} className='h-[160px] relative'>
                <label htmlFor={i}>
                  <img src={img.url} alt="" className='w-full h-full rounded-sm object-cover' />
                </label>
                <input onChange={(e) => changeImage(e.target.files[0], i)} type="file" id={i} className='hidden' />
                <span onClick={() => removeImage(i)} className='p-2 z-10 cursor-pointer bg-gray-800  rounded-full hover:bg-[#d0d2d6] transition-all duration-300 hover:text-black text-white absolute top-0 right-0'><IoCloseSharp /></span>
              </div>)
            }
            <label className='flex justify-center items-center flex-col h-[160px] cursor-pointer border border-dashed hover:border-teal-500 w-full' htmlFor="image">
              <span><BsImage /></span>
              <span>Select Image</span>
            </label>
            <input multiple onChange={imageHandle} type='file' id='image' className='hidden' />
          </div>

          <div className='flex my-4'>
            <button disabled={loader || !!errors.oldPrice} type="submit" className={`primaryBtn w-full md:w-52 transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
              {
                loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Add Product"
              }

            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;