import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdFirstPage, MdLastPage } from "react-icons/md";

const Pagination = ({ pageNumber, setPageNumber, totalItem, perPage, showItem }) => {
  const totalPage = Math.ceil(totalItem / perPage);

  // যদি মোট পেজ সংখ্যা কম হয় (যেমন 10 বা তার কম), তবে সব দেখাও
  if (totalPage <= 10) { 
    return (
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPage)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => setPageNumber(page)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                ${page === pageNumber
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/50'
                  : 'bg-slate-700 text-[#d0d2d6] hover:bg-teal-600 hover:text-white'}`}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  }

  // --- স্ট্যান্ডার্ড প্যাটার্ন লজিক (যখন মোট পেজ বেশি) ---
  const pageNumbers = [];
  
  // 1. প্রথম পেজ যোগ করুন
  pageNumbers.push(1);

  // 2. শুরুর দিকের '...' যোগ করুন
  // যদি কারেন্ট পেজ 1 এবং 2 থেকে বেশি দূরে থাকে
  if (pageNumber > 3) {
    pageNumbers.push('...');
  }

  // 3. মধ্যবর্তী পেজগুলো যোগ করুন (কারেন্ট পেজের আশেপাশে)
  const start = Math.max(2, pageNumber - 1);
  const end = Math.min(totalPage - 1, pageNumber + 1);

  for (let i = start; i <= end; i++) {
    if (i > 1 && i < totalPage) {
      pageNumbers.push(i);
    }
  }
  
  // 4. শেষের দিকের '...' যোগ করুন
  // যদি কারেন্ট পেজ শেষ পেজ থেকে 3 এর বেশি দূরে থাকে
  if (pageNumber < totalPage - 2) {
    pageNumbers.push('...');
  }
  
  // 5. শেষ পেজ যোগ করুন (যদি এটি 1 না হয়)
  if (totalPage > 1 && !pageNumbers.includes(totalPage)) {
    pageNumbers.push(totalPage);
  }
  
  // ডুপ্লিকেট এড়িয়ে ফাইনাল পেজ অ্যারে
  const finalPages = [...new Set(pageNumbers)];


  return (
    <div className="flex justify-center items-center gap-1 mt-4">
      
      {/* First Icon */}
      <button
        onClick={() => setPageNumber(1)}
        disabled={pageNumber === 1}
        className={`p-2 rounded-full transition-colors ${
          pageNumber === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-[#0a0f1a] hover:bg-teal-600/70'
        }`}
      >
        <MdFirstPage size={20} />
      </button>

      {/* Previous Icon */}
      <button
        onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
        disabled={pageNumber === 1}
        className={`p-2 rounded-full transition-colors ${
          pageNumber === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-[#0a0f1a] hover:bg-teal-600/70'
        }`}
      >
        <MdKeyboardArrowLeft size={20} />
      </button>

      {/* Dynamic Page Numbers */}
      {finalPages.map((item) =>
        item === '...' ? (
          <span key={item} className="text-gray-400 text-xl px-1">...</span>
        ) : (
          <button
            key={item}
            onClick={() => setPageNumber(item)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
              item === pageNumber
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/50'
                : 'bg-slate-700 text-[#d0d2d6] hover:bg-teal-600 hover:text-white'
            }`}
          >
            {item}
          </button>
        )
      )}

      {/* Next Icon */}
      <button
        onClick={() => setPageNumber(Math.min(totalPage, pageNumber + 1))}
        disabled={pageNumber === totalPage}
        className={`p-2 rounded-full transition-colors ${
          pageNumber === totalPage ? 'text-gray-400 cursor-not-allowed' : 'text-[#0a0f1a] hover:bg-teal-600/70'
        }`}
      >
        <MdKeyboardArrowRight size={20} />
      </button>
      
      {/* Last Icon */}
      <button
        onClick={() => setPageNumber(totalPage)}
        disabled={pageNumber === totalPage}
        className={`p-2 rounded-full transition-colors ${
          pageNumber === totalPage ? 'text-gray-500 cursor-not-allowed' : 'text-[#0a0f1a] hover:bg-teal-600/70'
        }`}
      >
        <MdLastPage size={20} />
      </button>
    </div>
  );
};

export default Pagination;