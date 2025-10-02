import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete } from "react-icons/md";
import Pagination from '../pagination/Pagination';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { categoryAdd, messageClear, get_category } from '../../store/Reducers/categoryReducer';
import Search from '../Components/Search';

const Category = () => {
  const { loader, errorMessage, successmessage, categories } = useSelector(state => state.category);
  const dispatch = useDispatch();
const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState('');
  const [state, setState] = useState({
    name: '',
    image: null
  });

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState(prev => ({ ...prev, image: files[0] }));
    }
  };

  const addCategory = (e) => {
    e.preventDefault();
    // basic validation
    if (!state.name || !state.image) {
      toast.error('Name and image are required');
      return;
    }
    dispatch(categoryAdd({ name: state.name, image: state.image }));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successmessage) {
      toast.success(successmessage);
      dispatch(messageClear());
      // reset form & close panel
      setState({ name: '', image: null });
      setImage('');
      setShow(false);
    }
  }, [errorMessage, successmessage, dispatch]);

//   category get
useEffect(() =>{
    const obj={
        perPage:parseInt(perPage),
        page:parseInt(currentPage),
        searchValue
    }
    dispatch(get_category(obj))
},[searchValue, currentPage, perPage, dispatch])

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full flex lg:hidden justify-between items-center bg-[#283046] p-3 gap-2 mb-4 rounded-md shadow">
        <h1 className="text-lg font-semibold text-[#d0d2d6]"> Category</h1>
        <button onClick={() => setShow(true)}
            className="ml-auto px-4 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >Add </button>
      </div>

      <div className='flex flex-wrap w-full'>
      
        <div className='w-full lg:w-7/12'>
          <div className="w-full bg-[#283046] p-4 rounded-md">
              <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue}/>          

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    // optionally render categories from state if available
                    categories.length && categories.map((d, i) => (
                      <tr key={i}>
                        <td className="py-1 px-4 font-medium whitespace-normal">{i+1}</td>
                        <td className="py-1 px-4 font-medium whitespace-normal">
                          <img className='w-[35px] h-[45px]' src={ typeof d === 'object' && d.image } alt="category_image" />
                        </td>
                        <td className="py-1 px-4 font-medium whitespace-normal">
                          <span>{ typeof d === 'object' ? d.name : 'Three piece' }</span>
                        </td>
                        <td className="py-1 px-4 font-medium whitespace-normal">
                          <div className='flex justify-start items-center gap-4'>
                            <Link className='p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50'><MdEdit /></Link>
                            <Link className='p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50'><MdDelete /></Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className="w-full flex justify-end mt-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={50}
                perPage={perPage}
                showItem={7}
              />
            </div>
          </div>
        </div>

        <div className={`w-[320px] lg:w-5/12 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[340px]'} z-50 top-0 transition-all duration-500`}>
          <div className='w-full pl-5'>
            <div className=" bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
              <div className='flex justify-between items-center'>
                <h2 className='text-[#d0d2d6] font-semibold text-md mb-4 text-center'>Add Category</h2>
                <div onClick={() => setShow(false)} className='block md:hidden bg-gray-800 p-1 cursor-pointer rounded-full hover:bg-[#d0d2d6] transition-all duration-300 hover:text-black'><IoCloseSharp /></div>
              </div>

              <form onSubmit={addCategory}>
                <div className='flex flex-col w-full gap-1 mb-3'>
                  <label htmlFor="name">Category Name</label>
                  <input onChange={(e) => setState({ ...state, name: e.target.value })} value={state.name} required type="text" placeholder="Category name" id='name' name='category_name' className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-white" />
                </div>

                <div>
                  <label className='flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500' htmlFor="image">
                    { imageShow ? <img src={imageShow} alt="category_image" className='w-full h-full object-cover' /> : <>
                      <span><BsImage /></span>
                      <span>Select Image</span>
                    </> }
                  </label>
                </div>

                <input onChange={imageHandle} className='hidden' type="file" name="image" id="image" required />

                <button
                  disabled={loader}
                  type="submit"
                  className={`primaryBtn w-full transition-all duration-200 mt-4 ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  { loader ? <PropagateLoader color='white' cssOverride={overrideStyle} size={8} /> : "Add Category" }
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Category;