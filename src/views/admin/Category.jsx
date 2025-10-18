import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MdEdit, MdDelete } from "react-icons/md";
import Pagination from '../pagination/Pagination';
import { BsImage } from 'react-icons/bs';
import { IoCloseSharp } from "react-icons/io5";
import { PropagateLoader } from 'react-spinners';
import { overrideStyle } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import {
  categoryAdd, messageClear, get_category, categoryUpdate, categoryDelete,
  subCategoryAdd, get_sub_category, delete_sub_category,
  childCategoryAdd, get_child_category, delete_child_category
} from '../../store/Reducers/categoryReducer';
import Search from '../Components/Search';
import api from '../../api/api';

// ----- Sub Category Section -----
function SubCategorySection() {
  const dispatch = useDispatch();
  const {
    loader, errorMessage, successMessage,
    subCategories = [], totalSubCategory = 0
  } = useSelector(s => s.category);

  const [catOptions, setCatOptions] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Load all categories for dropdown (no pagination)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/category-get', { withCredentials: true });
        setCatOptions(data?.categories || []);
      } catch {}
    })();
  }, []);

  // Fetch sub categories only when a category is selected
  useEffect(() => {
    if (!selectedCat) return;
    dispatch(get_sub_category({
      categoryId: selectedCat,
      page, perPage,
      searchValue
    }));
  }, [dispatch, selectedCat, page, perPage, searchValue]);

  // Reset form on success
  useEffect(() => {
    if (successMessage?.toLowerCase().includes('sub category')) {
      setName(''); setFile(null); setPreview('');
    }
  }, [successMessage, errorMessage]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onAdd = (e) => {
    e.preventDefault();
    if (!selectedCat) return toast.error('Select parent category');
    if (!name.trim()) return toast.error('Sub category name is required');
    dispatch(subCategoryAdd({ categoryId: selectedCat, name: name.trim(), image: file }));
  };

  const catNameById = (id) => catOptions.find(c => c._id === id)?.name || '-';

  return (
    <div className="mt-6 relative bg-gradient-to-br from-[#2b3349] to-[#21293d] border border-slate-700/60 p-5 rounded-xl shadow-xl">
      {/* Loader overlay */}
      {loader ? (
        <div className="absolute inset-0 grid place-items-center bg-[#0f1625]/40 backdrop-blur-sm rounded-xl z-10">
          <PropagateLoader color="#3de0c2" cssOverride={overrideStyle} size={10} />
        </div>
      ) : null}

      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
        <h3 className="text-[#e6e8ee] font-semibold tracking-wide">Sub Categories</h3>
      </div>

      <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <select
          className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-[#d0d2d6] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40 placeholder-slate-400"
          value={selectedCat}
          onChange={(e)=>{ setSelectedCat(e.target.value); setPage(1); }}
        >
          <option value="">Select Category</option>
          {catOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input
          className="px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-[#d0d2d6] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40 placeholder-slate-400"
          placeholder="Sub category name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label htmlFor="sub-file" className="px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-[#e6e8ee] rounded-lg cursor-pointer transition">
            Choose Image
          </label>
          <input id="sub-file" type="file" accept="image/*" className="hidden" onChange={onFile}/>
          <button disabled={loader} className="px-3 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white disabled:opacity-60 hover:from-teal-500 hover:to-teal-400 transition cursor-pointer">
            {loader ? 'Saving...' : 'Add Sub Category'}
          </button>
        </div>
        {preview ? (
          <div className="md:col-span-3">
            <img src={preview} alt="preview" className="h-20 rounded-lg border border-slate-700 ring-1 ring-slate-700/50 shadow-md object-cover" />
          </div>
        ) : null}
      </form>

      {selectedCat ? (
        <>
          <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue} />

          <div className="relative overflow-hidden mt-3 rounded-lg border border-slate-700/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="uppercase text-[12px] tracking-wider bg-slate-800/70 backdrop-blur border-b border-slate-700 sticky top-0 z-[1]">
                  <tr>
                    <th className="py-3.5 px-4">No</th>
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {subCategories?.length ? subCategories.map((s, i) => (
                    <tr key={s._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-2.5 px-4">{(page-1)*perPage + i + 1}</td>
                      <td className="py-2.5 px-4">
                        {s.image ? (
                          <img src={s.image} className="w-10 h-10 object-cover rounded-md border border-slate-700" alt="subCategory_image" />
                        ) : '-'}
                      </td>
                      <td className="py-2.5 px-4">{s.name}</td>
                      <td className="py-2.5 px-4">{catNameById(s.categoryId)}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={()=> {
                            const ok = window.confirm('Delete this sub category?');
                            if (ok) dispatch(delete_sub_category(s._id));
                          }}
                          className="p-[6px] bg-rose-500/90 hover:bg-rose-500 text-white rounded-md hover:shadow-lg hover:shadow-rose-500/30 cursor-pointer transition"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-10 px-4 text-center text-slate-400">
                        No sub categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={page}
              setPageNumber={setPage}
              totalItem={totalSubCategory}
              perPage={perPage}
              showItem={7}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">Select a category to manage its sub categories.</p>
      )}
    </div>
  );
}

// ----- Child Category Section -----
function ChildCategorySection() {
  const dispatch = useDispatch();
  const {
    loader, errorMessage, successMessage,
    childCategories = [], totalChildCategory = 0
  } = useSelector(s => s.category);

  const [catOptions, setCatOptions] = useState([]);
  const [subOptions, setSubOptions] = useState([]);

  const [catId, setCatId] = useState('');
  const [subId, setSubId] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/category-get', { withCredentials: true });
        setCatOptions(data?.categories || []);
      } catch {}
    })();
  }, []);

  // Load sub options on category change
  useEffect(() => {
    (async () => {
      setSubOptions([]);
      setSubId('');
      setPage(1);
      if (!catId) return;
      try {
        const { data } = await api.get(`/sub-category-get?categoryId=${catId}`, { withCredentials: true });
        setSubOptions(data?.subCategories || []);
      } catch {}
    })();
  }, [catId]);

  // Fetch child categories list when subId selected
  useEffect(() => {
    if (!subId) return;
    dispatch(get_child_category({
      subcategoryId: subId,
      page, perPage,
      searchValue
    }));
  }, [dispatch, subId, page, perPage, searchValue]);

  // Reset form on success
  useEffect(() => {
    if (successMessage?.toLowerCase().includes('child category')) {
      setName(''); setFile(null); setPreview('');
    }
  }, [successMessage, errorMessage]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const onAdd = (e) => {
    e.preventDefault();
    if (!catId) return toast.error('Select category');
    if (!subId) return toast.error('Select sub category');
    if (!name.trim()) return toast.error('Child category name is required');
    if (!file) return toast.error('Image is required');
    dispatch(childCategoryAdd({
      categoryId: catId,
      subcategoryId: subId,
      name: name.trim(),
      image: file
    }));
  };

  const catNameById = (id) => catOptions.find(c => c._id === id)?.name || '-';
  const subNameById = (id) => subOptions.find(s => s._id === id)?.name || '-';

  return (
    <div className="mt-6 relative bg-gradient-to-br from-[#2b3349] to-[#21293d] border border-slate-700/60 p-5 rounded-xl shadow-xl">
      {/* Loader overlay */}
      {loader ? (
        <div className="absolute inset-0 grid place-items-center bg-[#0f1625]/40 backdrop-blur-sm rounded-xl z-10">
          <PropagateLoader color="#3de0c2" cssOverride={overrideStyle} size={10} />
        </div>
      ) : null}

      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
        <h3 className="text-[#e6e8ee] font-semibold tracking-wide">Child Categories</h3>
      </div>

      <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <select
          className="px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-[#d0d2d6] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40 placeholder-slate-400"
          value={catId}
          onChange={(e)=>setCatId(e.target.value)}
        >
          <option value="">Select Category</option>
          {catOptions.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select
          className="px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-[#d0d2d6] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40 placeholder-slate-400 disabled:opacity-50"
          value={subId}
          onChange={(e)=>setSubId(e.target.value)}
          disabled={!catId}
        >
          <option value="">{catId ? 'Select Sub Category' : 'Select category first'}</option>
          {subOptions.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <input
          className="px-3 py-1.5 bg-slate-800/60 border border-slate-700 rounded-lg text-[#d0d2d6] focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40 placeholder-slate-400"
          placeholder="Child category name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label htmlFor="child-file" className="px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-[#e6e8ee] rounded-lg cursor-pointer transition">
            Choose Image
          </label>
          <input id="child-file" type="file" accept="image/*" className="hidden" onChange={onFile}/>
          <button disabled={loader} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white disabled:opacity-60 hover:from-teal-500 hover:to-teal-400 transition cursor-pointer">
            {loader ? 'Saving...' : 'Add Child Category'}
          </button>
        </div>
        {preview ? (
          <div className="md:col-span-4">
            <img src={preview} alt="preview" className="h-20 rounded-lg border border-slate-700 ring-1 ring-slate-700/50 shadow-md object-cover" />
          </div>
        ) : null}
      </form>

      {subId ? (
        <>
          <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue} />

          <div className="relative overflow-hidden mt-3 rounded-lg border border-slate-700/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="uppercase text-[12px] tracking-wider bg-slate-800/70 backdrop-blur border-b border-slate-700 sticky top-0 z-[1]">
                  <tr>
                    <th className="py-3.5 px-4">No</th>
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Sub Category</th>
                    <th className="py-3.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {childCategories?.length ? childCategories.map((c, i) => (
                    <tr key={c._id} className="hover:bg-slate-700/30 transition">
                      <td className="py-2.5 px-4">{(page-1)*perPage + i + 1}</td>
                      <td className="py-2.5 px-4">
                        {c.image ? (
                          <img src={c.image} className="w-10 h-10 object-cover rounded-md border border-slate-700" alt="child_category_image" />
                        ) : '-'}
                      </td>
                      <td className="py-2.5 px-4">{c.name}</td>
                      <td className="py-2.5 px-4">{catNameById(c.categoryId)}</td>
                      <td className="py-2.5 px-4">{subNameById(c.subcategoryId)}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={()=> {
                            const ok = window.confirm('Delete this child category?');
                            if (ok) dispatch(delete_child_category(c._id));
                          }}
                          className="p-[6px] bg-rose-500/90 hover:bg-rose-500 text-white rounded-md hover:shadow-lg hover:shadow-rose-500/30 cursor-pointer transition"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="py-10 px-4 text-center text-slate-400">
                        No child categories found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-full flex justify-end mt-4">
            <Pagination
              pageNumber={page}
              setPageNumber={setPage}
              totalItem={totalChildCategory}
              perPage={perPage}
              showItem={7}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400">Select a sub category to manage its child categories.</p>
      )}
    </div>
  );
}

const Category = () => {
  const { loader, errorMessage, successMessage, categories = [], totalCategory = 0 } = useSelector(state => state.category);
  const dispatch = useDispatch();

  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState('');

  // edit mode state
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [state, setState] = useState({
    name: '',
    image: null
  });

  const openAddPanel = () => {
    setIsEdit(false);
    setEditingId(null);
    setState({ name: '', image: null });
    setImage('');
    setShow(true);
  };

  const openEditPanel = (cat) => {
    setIsEdit(true);
    setEditingId(cat?._id);
    setState({ name: cat?.name || '', image: null }); // image optional on edit
    setImage(cat?.image || '');
    setShow(true);
  };

  const closePanel = () => {
    setShow(false);
    setIsEdit(false);
    setEditingId(null);
    setState({ name: '', image: null });
    setImage('');
  };

  const imageHandle = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState(prev => ({ ...prev, image: files[0] }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!state.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!isEdit && !state.image) {
      toast.error('Image is required');
      return;
    }

    if (isEdit) {
      dispatch(categoryUpdate({ id: editingId, name: state.name.trim(), image: state.image }));
    } else {
      dispatch(categoryAdd({ name: state.name.trim(), image: state.image }));
    }
  };

  const handleDelete = (id) => {
    if (!id) return;
    const ok = window.confirm('Are you sure you want to delete this category?');
    if (!ok) return;
    dispatch(categoryDelete(id));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      const m = successMessage.toLowerCase();
      const isMainCategoryOp = m.includes('category') && !m.includes('sub') && !m.includes('child');
      if (show && isMainCategoryOp) {
        closePanel();
      }
      dispatch(messageClear());
    }
  }, [show,errorMessage, successMessage, dispatch]);

  // category fetch
  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue
    };
    dispatch(get_category(obj));
  }, [searchValue, currentPage, perPage, dispatch]);

  return (
    <div className="px-2 md:px-7 py-6 space-y-6">
      {/* Top bar (mobile) */}
      <div className="w-full flex lg:hidden justify-between items-center bg-gradient-to-br from-[#2b3349] to-[#21293d] border border-slate-700/60 p-3 gap-2 rounded-xl shadow">
        <h1 className="text-lg font-semibold text-[#e6e8ee]">Category</h1>
        <button
          onClick={openAddPanel}
          className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 transition"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap w-full gap-y-6">
        {/* Left: table */}
        <div className="w-full lg:w-7/12">
          <div className="relative w-full bg-gradient-to-br from-[#2b3349] to-[#21293d] border border-slate-700/60 p-4 rounded-xl shadow-xl">
            {/* Loader overlay (optional for table ops) */}
            {loader ? (
              <div className="absolute inset-0 grid place-items-center bg-[#0f1625]/30 backdrop-blur-[1px] rounded-xl z-10">
                <PropagateLoader color="#3de0c2" cssOverride={overrideStyle} size={8} />
              </div>
            ) : null}

            <Search setPerPage={setPerPage} setSearchValue={setSearchValue} searchValue={searchValue} />

            <div className="relative overflow-hidden mt-3 rounded-lg border border-slate-700/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[#d0d2d6]">
                  <thead className="text-xs uppercase tracking-wider bg-slate-800/70 backdrop-blur border-b border-slate-700 sticky top-0 z-[1]">
                    <tr>
                      <th className="py-3.5 px-4">No</th>
                      <th className="py-3.5 px-4">Image</th>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {categories?.length > 0 ? (
                      categories.map((d, i) => {
                        const serial = (currentPage - 1) * perPage + i + 1;
                        return (
                          <tr key={d._id || i} className="hover:bg-slate-700/30 transition">
                            <td className="py-2.5 px-4 font-medium whitespace-normal">{serial}</td>
                            <td className="py-2.5 px-4 font-medium whitespace-normal">
                              <img
                                className="w-[38px] h-[46px] object-cover rounded-md border border-slate-700 ring-1 ring-slate-700/40"
                                src={d?.image}
                                alt={d?.name || 'category_image'}
                              />
                            </td>
                            <td className="py-2.5 px-4 font-medium whitespace-normal">
                              <span>{d?.name}</span>
                            </td>
                            <td className="py-2.5 px-4 font-medium whitespace-normal">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditPanel(d)}
                                  className="p-[7px] bg-amber-500/90 hover:bg-amber-500 text-black rounded-md hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer transition"
                                  title="Edit"
                                >
                                  <MdEdit />
                                </button>
                                <button
                                  onClick={() => handleDelete(d?._id)}
                                  disabled={loader}
                                  className="p-[7px] bg-rose-500/90 hover:bg-rose-500 text-white rounded-md hover:shadow-lg hover:shadow-rose-500/30 disabled:opacity-60 cursor-pointer transition"
                                  title="Delete"
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="py-12 px-4 text-center text-slate-400" colSpan="4">
                          No categories found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full flex justify-end mt-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalCategory}
                perPage={perPage}
                showItem={7}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Add / Edit (Slide-over) */}
        <div className={`w-[340px] lg:w-5/12 lg:relative lg:right-0 fixed ${show ? 'right-0' : '-right-[360px]'} z-50 top-0 transition-all duration-500`}>
          <div className="w-full lg:pl-5">
            <div className="bg-gradient-to-b from-[#2b3349] to-[#21293d] h-screen lg:h-auto px-3 py-3 lg:rounded-xl text-[#d0d2d6] border border-slate-700/60 shadow-2xl">
              <div className="sticky top-0 bg-transparent z-[2]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-teal-500 rounded-full" />
                    <h2 className="text-[#e6e8ee] font-semibold text-md">
                      {isEdit ? 'Edit Category' : 'Add Category'}
                    </h2>
                  </div>
                  <div
                    onClick={closePanel}
                    className="block md:hidden bg-slate-800/90 p-1 cursor-pointer rounded-full hover:bg-slate-200 hover:text-black transition-all duration-200"
                    title="Close"
                  >
                    <IoCloseSharp />
                  </div>
                </div>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                <div className="flex flex-col w-full gap-1">
                  <label htmlFor="name" className="text-sm text-slate-300">Category Name</label>
                  <input
                    onChange={(e) => setState({ ...state, name: e.target.value })}
                    value={state.name}
                    required
                    type="text"
                    placeholder="Category name"
                    id="name"
                    name="category_name"
                    className="px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/40"
                  />
                </div>

                <div>
                  <label
                    className="flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed border-slate-600 hover:border-teal-500/70 rounded-lg bg-slate-900/30 transition"
                    htmlFor="image"
                  >
                    {imageShow ? (
                      <img src={imageShow} alt="category_image" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <span className="text-3xl mb-2"><BsImage /></span>
                        <span>Click to select image</span>
                        <span className="text-xs mt-1 text-slate-500">JPG, PNG or WEBP</span>
                      </div>
                    )}
                  </label>
                </div>

                <input
                  onChange={imageHandle}
                  className="hidden"
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  required={!isEdit}
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closePanel}
                    className="w-1/3 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800/50 text-slate-200 hover:bg-slate-700/60 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loader}
                    type="submit"
                    className={`w-2/3 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 transition cursor-pointer ${loader ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {loader ? <PropagateLoader color="white" cssOverride={overrideStyle} size={8} /> : (isEdit ? 'Save Changes' : 'Add Category')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Floating Add button for desktop */}
        <div className="hidden lg:block lg:w-5/12 lg:pl-5">
          <div className="bg-gradient-to-br from-[#2b3349] to-[#21293d] rounded-xl p-4 border border-slate-700/60 shadow">
            <button
              onClick={openAddPanel}
              className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:from-teal-500 hover:to-teal-400 transition cursor-pointer"
            >
              Add Category
            </button>
            <p className="text-xs text-slate-400 mt-2">
              Click to add a new category. To edit, use the yellow button in the list.
            </p>
          </div>
        </div>
      </div>

      {/* Dim backdrop for slide-over on small screens */}
      <div
        onClick={closePanel}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${show ? 'opacity-100 visible lg:invisible' : 'opacity-0 invisible'}`}
      />

      {/* Sub + Child sections */}
      <SubCategorySection />
      <ChildCategorySection />
    </div>
  );
};

export default Category;