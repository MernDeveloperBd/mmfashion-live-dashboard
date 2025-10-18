// src/views/seller/AllProducts.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Search from '../Components/Search';
import Pagination from '../pagination/Pagination';
import { FaEye } from 'react-icons/fa6';
import { get_all_products } from '../../store/Reducers/productReducer';
import { toast } from 'react-hot-toast';

// ZIP download helpers
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FALLBACK_IMG = 'https://via.placeholder.com/60x80?text=IMG';

// কলাম-প্রস্থ (Brand সরানো হয়েছে)
const COLS = {
  no: 'w-[60px]',
  img: 'w-[80px]',
  name: 'min-w-[240px]',
  category: 'w-[160px]',
  price: 'w-[120px]',
  oldPrice: 'w-[120px]',
  discount: 'w-[110px]',
  rPrice: 'w-[140px]',
  stock: 'w-[90px]',
  action: 'w-[110px]',
};

const AllProducts = () => {
  const dispatch = useDispatch();
  const { allProducts = [], allTotalProduct = 0, loader } = useSelector((s) => s.product);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [perPage, setPerPage] = useState(10);

  // Modal states
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

  // Esc to close + scroll lock
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

  // Fetch products
  useEffect(() => {
    dispatch(get_all_products({ page: currentPage, perPage, searchValue }));
  }, [dispatch, currentPage, perPage, searchValue]);

  // Reset page on search or perPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, perPage]);

  const base = (currentPage - 1) * perPage;

  // ZIP download
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
            const res = await fetch(url, { mode: 'cors' });
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
      toast.error('Failed to download images. The image host may block cross-origin downloads (CORS).');
    } finally {
      setDownloading(false);
    }
  };

  // Skeleton Row
  const SkeletonRow = () => (
    <div className="border-b border-slate-700/40 animate-pulse">
      <div className="flex items-center text-[#d0d2d6] md:w-[100%]">
        <div className={`py-2 px-4 ${COLS.no}`}><div className="h-[10px] w-8 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.img}`}><div className="h-[45px] w-[35px] bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 flex-1 ${COLS.name}`}><div className="h-[10px] w-3/4 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.category}`}><div className="h-[10px] w-3/4 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.price}`}><div className="h-[10px] w-1/2 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.oldPrice}`}><div className="h-[10px] w-1/2 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.discount}`}><div className="h-[10px] w-1/3 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.rPrice}`}><div className="h-[10px] w-1/2 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.stock}`}><div className="h-[10px] w-1/2 bg-slate-700/50 rounded" /></div>
        <div className={`py-2 px-4 ${COLS.action}`}><div className="h-[26px] w-[26px] bg-slate-700/50 rounded" /></div>
      </div>
    </div>
  );

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full p-4 bg-[#283046] rounded-md">
        <Search setPerPage={setPerPage} searchValue={searchValue} setSearchValue={setSearchValue} />

        <div className="relative overflow-x-auto mt-5">
          {/* Header */}
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th className={`py-3 px-4 text-xs ${COLS.no}`}>No</th>
                <th className={`py-3 px-4 text-xs ${COLS.img}`}>Image</th>
                <th className={`py-3 px-4 text-xs ${COLS.name}`}>Name</th>
                <th className={`py-3 px-4 text-xs ${COLS.category}`}>Category</th>
                <th className={`py-3 px-4 text-xs ${COLS.price}`}>Price</th>
                <th className={`py-3 px-4 text-xs ${COLS.oldPrice}`}>Old Price</th>
                <th className={`py-3 px-4 text-xs ${COLS.discount}`}>Discount</th>
                <th className={`py-3 px-4 text-xs ${COLS.rPrice}`}>Resell Price</th>
                <th className={`py-3 px-4 text-xs ${COLS.stock}`}>Stock</th>
                <th className={`py-3 px-4 text-xs ${COLS.action}`}>Action</th>
              </tr>
            </thead>
          </table>

          {/* Body */}
          <div className="w-full overflow-x-auto">
            <div className="md:w-[100%]">

              {/* Loader */}
              {loader ? (
                Array.from({ length: perPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              ) : allProducts.length > 0 ? (
                allProducts.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="border-b border-slate-700/40 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center text-[#d0d2d6] md:w-[100%]">
                      <div className={`py-2 px-4 ${COLS.no}`}>{base + i + 1}</div>
                      <div className={`py-2 px-4 ${COLS.img}`}>
                        <img
                          className="w-[35px] h-[45px] object-cover bg-slate-200 rounded"
                          src={item.images?.[0] || FALLBACK_IMG}
                          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                          alt="product"
                          loading="lazy"
                        />
                      </div>
                      <div className={`py-2 px-4 flex-1 ${COLS.name}`}>
                        <span className="truncate block">{item.name}</span>
                      </div>
                      <div className={`py-2 px-4 ${COLS.category}`}>{item.category}</div>
                      <div className={`py-2 px-4 ${COLS.price}`}>TK {item.price}</div>
                      <div className={`py-2 px-4 ${COLS.oldPrice}`}>TK {item.oldPrice || '-'}</div>
                      <div className={`py-2 px-4 ${COLS.discount}`}>{item.discount || 0}%</div>
                      <div className={`py-2 px-4 ${COLS.rPrice}`}>TK {item.resellingPrice || '-'}</div>
                      <div className={`py-2 px-4 ${COLS.stock}`}>{item.stock}</div>
                      <div className={`py-2 px-4 ${COLS.action}`}>
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => openView(item)}
                            className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50 cursor-pointer"
                            title="View"
                            aria-label="View details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 px-4 text-center text-slate-400">No products found</div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {allTotalProduct > perPage && (
          <div className="w-full flex justify-between mt-4 items-center px-4">
            <p className='text-white'>{perPage} products of total {allTotalProduct}</p>
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={allTotalProduct}
              perPage={perPage}
              showItem={7}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewOpen && selectedProduct && (
        <div className="fixed inset-0 z-[1000]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeView} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#1f2937] text-[#d0d2d6] rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                  <p className="text-xs text-gray-400">SKU/ID: {selectedProduct._id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadAllImages(selectedProduct)}
                    disabled={downloading || !selectedProduct.images?.length}
                    className="px-3 py-2 rounded bg-[#0d6b54] hover:bg-[#149777] disabled:opacity-60 disabled:cursor-not-allowed"
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

              {/* Body */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-5 max-h-[75vh] overflow-y-auto">
                {/* Images */}
                <div className="lg:col-span-2">
                  <h4 className="text-sm font-semibold mb-3">Images</h4>
                  {selectedProduct.images?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedProduct.images.map((img, idx) => (
                        <div key={idx} className="group relative">
                          <img
                            src={img}
                            alt={`${selectedProduct.name}-img-${idx + 1}`}
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
                  <div className="border p-2 border-gray-200 mt-2 rounded">
                    <h4 className="text-sm md:text-lg font-semibold mb-2 text-teal-500">Description</h4>
                    {selectedProduct.description ? (
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
                      <span className="font-medium">{selectedProduct.category || '-'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Brand</span>
                      <span className="font-medium">{selectedProduct.brand || '-'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Price</span>
                      <span className="font-medium">{selectedProduct.price}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Old Price</span>
                      <span className="font-medium">{selectedProduct.oldPrice || '-'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Discount</span>
                      <span className="font-medium">{selectedProduct.discount || 0}%</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Reselling Price</span>
                      <span className="font-medium">{selectedProduct.resellingPrice || '-'}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Stock</span>
                      <span className="font-medium">{selectedProduct.stock}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Slug</span>
                      <span className="font-medium break-all">{selectedProduct.slug}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-700">
                <button
                  onClick={() => downloadAllImages(selectedProduct)}
                  disabled={downloading || !selectedProduct.images?.length}
                  className="px-3 py-2 rounded bg-[#0d6b54] hover:bg-[#149777] disabled:opacity-60 disabled:cursor-not-allowed"
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

export default AllProducts;