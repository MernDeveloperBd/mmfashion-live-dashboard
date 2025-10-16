import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_category,
  categoryUpdate,
  categoryDelete,
  messageClear,
} from "../store/Reducers/categoryReducer";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, loader, successMessage, errorMessage, totalCategory } =
    useSelector((state) => state.category);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null); // {_id, name, image, slug}

  useEffect(() => {
    dispatch(get_category({ page, perPage, searchValue }));
  }, [dispatch, page, perPage, searchValue]);

  // toast-ish feedback
  useEffect(() => {
    if (successMessage || errorMessage) {
      const t = setTimeout(() => dispatch(messageClear()), 2000);
      return () => clearTimeout(t);
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleEditOpen = (cat) => {
    setSelected(cat);
    setEditOpen(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this category?");
    if (!ok) return;
    dispatch(categoryDelete(id));
  };

  const totalPages = useMemo(() => {
    if (!totalCategory) return 1;
    return Math.max(1, Math.ceil(totalCategory / perPage));
  }, [totalCategory, perPage]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Categories</h2>

        <div className="flex items-center gap-2">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name..."
            className="px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => dispatch(get_category({ page: 1, perPage, searchValue }))}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
      </div>

      {(successMessage || errorMessage) && (
        <div
          className={`mb-3 px-4 py-2 rounded-md ${
            successMessage ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-md border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length ? (
              categories.map((c) => (
                <tr key={c._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-10 w-10 rounded object-cover border"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-slate-500">{c.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditOpen(c)}
                        className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        disabled={loader}
                        className="px-3 py-1.5 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
                      >
                        {loader ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan="4">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-600">
          Total: {totalCategory} • Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-60"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && selected ? (
        <EditCategoryModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          category={selected}
        />
      ) : null}
    </div>
  );
};

export default CategoryList;

const EditCategoryModal = ({ open, onClose, category }) => {
  const dispatch = useDispatch();
  const { loader } = useSelector((s) => s.category);

  const [name, setName] = useState(category?.name || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(category?.image || "");

  useEffect(() => {
    setName(category?.name || "");
    setPreview(category?.image || "");
    setFile(null);
  }, [category]);

  // preview for new file
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!category?._id) return;
    dispatch(categoryUpdate({ id: category._id, name, image: file })).unwrap()
      .then(() => onClose())
      .catch(() => {});
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Category</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Category name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
            />
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="mt-3 h-20 w-20 rounded object-cover border"
              />
            ) : null}
            <p className="text-xs text-slate-500 mt-1">
              নতুন ইমেজ না দিলে পূর্বের ইমেজই থাকবে।
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loader}
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loader ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};