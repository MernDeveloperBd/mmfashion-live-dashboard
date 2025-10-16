// src/views/seller/Discountproduct.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { 
  get_all_products, 
  delete_product, 
  messageClear 
} from '../../store/Reducers/productReducer';
import Search from '../Components/Search';
import Pagination from '../pagination/Pagination';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa6';

// NEW: ZIP download helpers (same as Products.jsx)
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Discountproduct = () => {
  const dispatch = useDispatch();
  const { allProducts: products, allTotalProduct: totalProduct, loader, errorMessage, successMessage } = useSelector(state => state.product);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(10);

  // Modal states (same as Products.jsx)
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const openView = (product) => {
    setSelectedProduct(product);
    setViewOpen(true);
  };
  const closeView = () => {
    setSelectedProduct(null);
    setViewOpen(false);
  };

  // Esc to close + scroll lock (same as Products.jsx)
  useEffect(() => {
    if (!viewOpen) return;
    const onKey = (e) => e.key === 'Escape' && closeView();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [viewOpen]);

  // ✅ Toast messages
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

  // ✅ Fetch discounted products
  useEffect(() => {
    const obj = {
      page: currentPage,
      searchValue,
      perPage,
      discount: true  // ✅ Only discounted
    };
    dispatch(get_all_products(obj));
  }, [currentPage, searchValue, perPage, dispatch]);

  // ✅ Custom Toast Confirmation
  const confirmDelete = (productId, onConfirm) => {
    toast((t) => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Delete</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Delete this discounted product? <strong className="text-red-500 block">Irreversible!</strong>
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await onConfirm();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, position: 'top-center' });
  };

  const handleDelete = async (productId) => {
    confirmDelete(productId, async () => {
      try {
        await dispatch(delete_product(productId)).unwrap();
        toast.success('Discounted product deleted! 🎉');
      } catch (err) {
        toast.error(err?.message || 'Delete failed ❌');
      }
    });
  };

  // NEW: Download all images as ZIP (same as Products.jsx)
  const downloadAllImages = async (product) => {
    if (!product?.images?.length) {
      toast.error('No images found for this product.');
      return;
    }
    try {
      setDownloading(true);
      const zip = new JSZip();

      await Promise.all(
        product.images.map(async (url, idx) => {
          try {
            const res = await fetch(url, { mode: 'cors' }); // server must allow CORS
            if (!res.ok) throw new Error('Image fetch failed');
            const blob = await res.blob();

            const filename = (() => {
              try {
                const u = new URL(url);
                const last = u.pathname.split('/').pop() || `image-${idx + 1}.jpg`;
                return decodeURIComponent(last.split('?')[0]);
              } catch {
                return `image-${idx + 1}.jpg`;
              }
            })();

            zip.file(filename, blob);
          } catch (e) {
            console.warn('Skipping image due to fetch/CORS error:', url, e);
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipName = `${product.slug || product.name || 'product'}-images.zip`;
      saveAs(zipBlob, zipName);
      toast.success('All images downloaded ✅');
    } catch (err) {
      toast.error('Failed to download images. The image host may block cross-origin downloads (CORS).', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search setPerPage={setPerPage} searchValue={searchValue} setSearchValue={setSearchValue} />

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Old Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">R Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center">Loading discounted products...</td>
                </tr>
              ) : products?.length > 0 ? (
                products.map((item, i) => (
                  <tr key={item._id}>
                    <td className="py-1 px-4">{((currentPage - 1) * perPage) + i + 1}</td>
                    <td className="py-1 px-4">
                      <img 
                        className="w-[35px] h-[45px] object-cover rounded" 
                        src={item?.images?.[0] || '/placeholder.jpg'} 
                        alt="product" 
                        onError={(e) => e.target.src = '/placeholder.jpg'}
                      />
                    </td>
                    <td className="py-1 px-4">{item.name}</td>
                    <td className="py-1 px-4">{item.category}</td>
                    {item.brand && <td className="py-1 px-4">{item.brand}</td>}
                    
                    <td className="py-1 px-4">TK {item.price}</td>
                    {item.oldPrice && <td className="py-1 px-4">TK {item.oldPrice}</td>}
                    <td className="py-1 px-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {item.discount}%
                      </span>
                    </td>
                    {item.resellingPrice &&  <td className="py-1 px-4">Tk {item.resellingPrice}</td>}
                   
                    <td className="py-1 px-4">{item.stock}</td>
                    <td className="py-1 px-4">
                      <div className="flex gap-2">
                        <Link to={`/seller/edit-product/${item._id}`} className="p-2 bg-yellow-500 rounded hover:shadow-lg">
                          <MdEdit />
                        </Link>

                        {/* VIEW => open inline modal (same as Products.jsx) */}
                        <button
                          onClick={() => openView(item)}
                          className="p-2 bg-green-500 rounded hover:shadow-lg cursor-pointer"
                          title="View"
                          aria-label="View details"
                        >
                          <FaEye />
                        </button>

                        <button 
                          onClick={() => handleDelete(item._id)} 
                          disabled={loader}
                          className="p-2 bg-red-500 rounded hover:shadow-lg disabled:opacity-50"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-400">
                    No discounted products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalProduct > 0 && (
          <div className="w-full flex justify-between items-center mt-4 px-4">
            <p className="text-white">Showing {perPage} of {totalProduct} discounted products</p>
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalProduct}
              perPage={perPage}
              showItem={7}
            />
          </div>
        )}
      </div>

      {/* Inline View Modal (same layout/styles as Products.jsx) */}
      {viewOpen && selectedProduct && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeView} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#1f2937] text-[#d0d2d6] rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold">{selectedProduct?.name}</h3>
                  <p className="text-xs text-gray-400">SKU/ID: {selectedProduct?._id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadAllImages(selectedProduct)}
                    disabled={downloading || !selectedProduct?.images?.length}
                    className="px-3 py-2 rounded bg-[#0d6b54] hover:bg-[#149777] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {downloading ? 'Preparing ZIP...' : 'Download All Images (ZIP)'}
                  </button>
                  <button onClick={closeView} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">
                    Close
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[75vh] overflow-y-auto">
                {/* Images */}
                <div className="lg:col-span-2">
                  <h4 className="text-sm font-semibold mb-3">Images</h4>
                  {selectedProduct?.images?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProduct.images.map((img, idx) => (
                        <div key={idx} className="group relative">
                          <img
                            src={img}
                            alt={`${selectedProduct?.name}-img-${idx + 1}`}
                            className="w-full h-36 object-cover rounded border border-slate-700"
                          />
                          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-2 bg-black/40 rounded">
                            <a
                              href={img}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
                            >
                              Open
                            </a>
                            <a
                              href={img}
                              download
                              className="px-2 py-1 text-xs bg-amber-600 hover:bg-amber-700 rounded"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No images found.</p>
                  )}

                  {/* Description */}
                  <div className="lg:col-span-2 border p-2 border-gray-200 mt-2 rounded">
                    <h4 className="text-sm md:text-lg font-semibold mb-2 text-teal-500">Description</h4>
                    {selectedProduct?.description ? (
                      <div className="text-sm text-gray-300 leading-6 whitespace-pre-line">
                        {selectedProduct.description}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No description provided.</p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-semibold mb-3">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Category</span>
                      <span className="font-medium">{selectedProduct?.category || '-'}</span>
                    </div>
                    {
                      selectedProduct?.brand  && <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Brand</span>
                      <span className="font-medium">{selectedProduct?.brand}</span>
                    </div>
                    }
                    
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Price</span>
                      <span className="font-medium">TK{selectedProduct?.price}</span>
                    </div>
                    {
                      selectedProduct?.oldPrice && <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Old Price</span>
                      <span className="font-medium">TK {selectedProduct?.oldPrice}</span>
                    </div>
                    }
                    {
                      selectedProduct?.discount && <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Discount</span>
                      <span className="font-medium">{selectedProduct?.discount}%</span>
                    </div>
                    }
                    {
                      selectedProduct?.resellingPrice &&  <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Reselling Price</span>
                      <span className="font-medium">TK {selectedProduct?.resellingPrice}</span>
                    </div>
                    }
                    
                   
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Stock</span>
                      <span className="font-medium">{selectedProduct?.stock}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Slug</span>
                      <span className="font-medium break-all">{selectedProduct?.slug}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-700">
                <button
                  onClick={() => downloadAllImages(selectedProduct)}
                  disabled={downloading || !selectedProduct?.images?.length}
                  className="px-3 py-2 rounded bg-[#0d6b54] hover:bg-[#149777] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {downloading ? 'Preparing ZIP...' : 'Download All Images (ZIP)'}
                </button>
                <button
                  onClick={closeView}
                  className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discountproduct;