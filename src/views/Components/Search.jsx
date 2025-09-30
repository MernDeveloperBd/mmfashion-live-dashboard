

const Search = ({setPerPage,searchValue, setSearchValue}) => {
    return (
         <div className="flex justify-between items-center">
                            <select onChange={(e) => setPerPage(parseInt(e.target.value))} className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046]  border border-slate-700 rounded-md text-[#d0d2d6]">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                            <input onChange={(e)=>setSearchValue(e.target.value)} value={searchValue} type="text" placeholder="Search" className="inputField" />
                        </div>
    );
};

export default Search;