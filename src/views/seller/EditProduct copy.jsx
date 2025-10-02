import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_category } from '../../store/Reducers/categoryReducer';
import { update_product, messageClear, get_product } from '../../store/Reducers/productReducer';
import toast from 'react-hot-toast';
import { overrideStyle } from '../../utils/utils';
import { PropagateLoader } from 'react-spinners';

const EditProduct = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.category);
  const { loader, product, errorMessage, successmessage } = useSelector(state => state.product);
  const { productId } = useParams()
  console.log(productId);


  useEffect(() => {
    dispatch(get_category({
      searchValue: '',
      perPage: '',
      page: ''
    }))
  }, [dispatch]);

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

  const [images, setImages] = useState([]); // file objects if needed
  const [imageShow, setImageShow] = useState([]);

  const [category, setCategory] = useState('Fashion');
  const [catShow, setCatShow] = useState(false);
  const [allCategory, setAllCategory] = useState(categories || []);
  const [searchValue, setSearchValue] = useState('');

  // validation errors
  const [errors, setErrors] = useState({ oldPrice: '' });

  useEffect(() => {
    if(categories.length > 0){
        setAllCategory(categories || []);
    }
    
  }, [categories]);

  useEffect(() => {
    // initial demo data as you provided
    setState({
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice,
      discount: product.discount, // will be recalculated by effect below
      resellingPrice: product.resellingPrice,
      brand: product.brand,
      stock: product.stock,
      fbProductLink: product.fbProductLink,
      sku: product.sku,
    });
    setCategory("Fashion");
    setImageShow(product.images)
  }, [product]);

  // input handler (fix: keep values as strings/numbers not arrays)
  const inputHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'discount') return; // prevent manual editing
    setState(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    dispatch(get_product(productId))
  }, [dispatch, productId])

  // auto-calc discount and validate oldPrice vs price
  useEffect(() => {
    const priceNum = parseFloat(state.price);
    const oldPriceNum = parseFloat(state.oldPrice);

    // default discount
    let newDiscount = "";
    // reset error
    let newError = "";

    // if both values provided and numeric and old>price => calc discount
    if (state.oldPrice !== "" && state.oldPrice != null) {
      if (isNaN(oldPriceNum)) {
        newError = 'Old Price must be a number';
      } else if (state.price === "" || isNaN(priceNum)) {
        newError = 'Enter Price first';
      } else if (oldPriceNum <= priceNum) {
        newError = 'Old Price must be greater than Price';
      } else {
        // ok compute discount percentage
        newDiscount = String(Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100));
      }
    } else {
      // no oldPrice provided => discount empty, no error
      newDiscount = "";
      newError = "";
    }

    // set if different
    if (String(state.discount) !== String(newDiscount)) {
      setState(prev => ({ ...prev, discount: newDiscount }));
    }
    if (errors.oldPrice !== newError) {
      setErrors(prev => ({ ...prev, oldPrice: newError }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.price, state.oldPrice]);

  // image functions (minimal — preserve UI)
  const imageHandle = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    // add to images state if you want to upload later
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f) }));
    setImageShow(prev => [...prev, ...newPreviews]);
  };

  const changeImage = (file, files) => {
    if (!files || files.length === 0) return;
    const newFile = files[0];
    // find index by preview url
    const idx = imageShow.indexOf(file);
    if (idx === -1) return;
    // update preview and images
    const newPreviews = [...imageShow];
    newPreviews[idx] = { url: URL.createObjectURL(newFile) };
    setImageShow(newPreviews);

    const newImages = [...images];
    newImages[idx] = newFile;
    setImages(newImages);
  };

  const removeImage = (idx) => {
    setImageShow(prev => prev.filter((_, i) => i !== idx));
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value) {
      setAllCategory(categories || []);
    } else {
      setAllCategory((categories || []).filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
    }
  };

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
            setCategory('');      
    }
  }, [errorMessage, successmessage, dispatch]);

    // submit handler placeholder (edit action not implemented here)
  const handleUpdate = (e) => {
    e.preventDefault();
  
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
    dispatch(update_product(state));
    toast.success('Product updated (demo)');
  };


  return (
    <div className="px-2 md:px-7 md:py-5">
      <div className="w-full bg-[#283046] p-4 rounded-md">
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
          <Link className='primaryBtn ' to='/seller/products'>Products</Link>
        </div>
        <div>
          <form onSubmit={handleUpdate}>
            <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="name">Product Name</label>
                <input onChange={inputHandle} value={state.name} type="text" placeholder='product name' name='name' id='name' className='inputField' />
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="brand">Product Brand</label>
                <input onChange={inputHandle} value={state.brand} type="text" placeholder='product brand' name='brand' id='brand' className='inputField' />
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
                <input onChange={inputHandle} value={state.stock} type="text" placeholder='product stock' name='stock' id='stock' className='inputField' />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="price">Price</label>
                <input onChange={inputHandle} value={state.price} type="number" placeholder='price' name='price' id='price' className='inputField' min={0} />
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="oldPrice" className='text-red-500'>Old Price</label>
                <input onChange={inputHandle} value={state.oldPrice} type="number" placeholder='oldPrice' name='oldPrice' id='oldPrice' className='inputField' min={0} />
                {errors.oldPrice && <p className="text-red-400 text-sm mt-1">{errors.oldPrice}</p>}
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="discount">Discount (%)</label>
                <input onChange={inputHandle} value={state.discount} type="number" placeholder='discount' name='discount' id='discount' className='inputField' min={0} disabled />
              </div>
              <div className='flex flex-col gap-1 w-full'>
                <label htmlFor="resellingPrice">Reselling Price</label>
                <input onChange={inputHandle} value={state.resellingPrice} type="number" placeholder='resellingPrice' name='resellingPrice' id='Reselling Price' className='inputField' min={0} />
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
              <label htmlFor="description">Description</label>
              <textarea onChange={inputHandle} value={state.description} placeholder='description here' name='description' id='description' className='inputField' min={0} rows={6}></textarea>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3  md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] cursor-pointer'>
              {
                imageShow?.map((img, i) => <div key={i} className='h-[160px] relative'>
                  <label htmlFor={i}>
                    <img src={img} alt="" className='w-full h-full object-cover' />
                  </label>
                  <input onChange={(e) => changeImage(img, e.target.files)} type="file" name="" id={i} className='hidden' />
                </div>)
              }

            </div>
            <div className=' my-4 md:mt-12'>
              <button disabled={loader || !!errors.oldPrice} className={`primaryBtn w-full md:w-52 transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                {
                  loader ? <PropagateLoader color='white' cssOverride={overrideStyle} /> : "Update Product"
                }
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default EditProduct;