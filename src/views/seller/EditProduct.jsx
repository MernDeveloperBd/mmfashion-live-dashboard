import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const EditProduct = () => {
    const categories = [
        {
            id: 1,
            name: 'Fashion'
        },
        {
            id: 2,
            name: 'Cosmetics'
        },
        {
            id: 3,
            name: 'Home Decore'
        },
    ]
    const [state, setState] = useState({
        name: "",
        description: "",
        price: "",
        oldPrice: "",
        discount: "",
        resellingPrice: "",
        brand: "",
        stock: ""
    })
    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: [e.target.value]
        })
    };

    const [catShow, setCatShow] = useState(false)
    const [category, setCategory] = useState('')
    const [allCategory, setAllCategory] = useState(categories)
    const [searchValue, setSearchValue] = useState('')

    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value)
        if (value) {
            let srcValue = allCategory.filter(c => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1)
            setAllCategory(srcValue)
        } else {
            setAllCategory(categories)
        }
    }
   
    const [imageShow, setImageShow] = useState([])
  

    const changeImage = (img, files) => {
     if(files.length > 0){
        console.log(img);
        console.log(files[0]);
        
     }
    } 

    useEffect(() =>{
        setState({
             name: "Cotton Three piece",
        description: "Descript for this product",
        price: 540,
        oldPrice: 590,
        discount: 5,
        resellingPrice: 450,
        brand: "Silk",
        stock: 15
        })
        setCategory("Fashion")
        setImageShow([
            "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png",
            "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png",
        ])
    },[])

    return (
        <div className="px-2 md:px-7 md:py-5">
            <div className="w-full bg-[#283046] p-4 rounded-md">
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
                    <Link className='primaryBtn ' to='/seller/products'>Products</Link>
                </div>
                <div>
                    <form>
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
                                <input readOnly onClick={() => setCatShow(!catShow)} onChange={inputHandle} value={category} type="text" placeholder='--- Select Category ---' name='category' id='category' className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md  text-[#d0d2d6] ' />
                                <div className={`absolute top-[101%] bg-slate-800 w-full transition-all ${catShow ? 'scale-100' : 'scale-0'}`}>
                                    <div className='w-full px-4 py-2 fixed'>
                                        <input onChange={categorySearch} value={searchValue} type="text" placeholder='search category' className='px-3 py-1 focus:border-indigo-500 outline-none bg-transparent  border border-slate-700 rounded-md w-full text-[#d0d2d6] overflow-hidden' />
                                    </div>
                                    <div className='pt-14'> </div>
                                    <div className='flex justify-start items-start flex-col h-[200px] overflow-y-auto'>
                                        {
                                            allCategory.map((c, i) => <span
                                                className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg  w-full cursor-pointer ${category === c.name && 'bg-indigo-500'}`}
                                                key={i} onClick={() => {
                                                    setCatShow(false)
                                                    setCategory(c.name)
                                                    setSearchValue('')
                                                    setAllCategory(categories)
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
                        {/*  */}
                        <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="price">Price</label>
                                <input onChange={inputHandle} value={state.price} type="number" placeholder='price' name='price' id='price' className='inputField' min={0} />
                            </div>
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="oldPrice">Old Price</label>
                                <input onChange={inputHandle} value={state.oldPrice} type="number" placeholder='oldPrice' name='oldPrice' id='oldPrice' className='inputField' min={0} />
                            </div>
                        </div>
                        {/*  */}
                        <div className='flex flex-col md:flex-row gap-4 w-full text-[#d0d2d6] mb-4'>
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="discount">Discount</label>
                                <input onChange={inputHandle} value={state.discount} type="number" placeholder='discount' name='discount' id='discount' className='inputField' min={0} />
                            </div>
                            <div className='flex flex-col gap-1 w-full'>
                                <label htmlFor="resellingPrice">Reselling Price</label>
                                <input onChange={inputHandle} value={state.resellingPrice} type="number" placeholder='resellingPrice' name='resellingPrice' id='Reselling Price' className='inputField' min={0} />
                            </div>
                        </div>
                        {/*  */}
                        <div className='flex flex-col gap-4 w-full text-[#d0d2d6] mb-4'>
                            <label htmlFor="description">Description</label>
                            <textarea onChange={inputHandle} value={state.description} placeholder='description here' name='description' id='description' className='inputField' min={0} rows={6}></textarea>

                        </div>
                        {/* image */}
                        <div className='grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3  md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] cursor-pointer'>                     
                            {
                                imageShow?.map((img, i) => <div key={i} className='h-[160px] relative'>
                                    <label htmlFor={i}>
                                        <img src={img} alt="" />
                                    </label>
                                    <input onChange={(e)=>changeImage(img, e.target.files)} type="file" name="" id={i} className='hidden'/>
                                </div>)
                            }                            

                        </div>
                        <div className=' my-4 md:mt-12'>
                            <button className='primaryBtn'>Update Product</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default EditProduct;