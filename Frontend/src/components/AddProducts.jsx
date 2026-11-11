import { useState } from "react";
import { Upload } from "lucide-react";
import Product3DPreviewer from "../3DPreview.jsx";



const PORT = import.meta.env.VITE_PORT;
const API_URL = `http://localhost:${PORT}/api`;

const IMAGE_LABELS = ["Cover Photo", "Photo 2", "Photo 3", "Photo 4"];

const CATEGORIES = [
  "Books",
  "Calculators",
  "Chargers",
  "Lab Equipment",
  "Sports",
  "Formal Clothes",
  "Tripods",
  "Other",
];

const CONDITIONS = ["Like New", "Good", "Fair"];

const AddProducts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [condition, setCondition] = useState("Good");
  const [maxBorrowDays, setMaxBorrowDays] = useState(3);

  const [imageFiles, setImageFiles] = useState([null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null, null]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...previewUrls];
    newFiles[index] = null;
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);
    newPreviews[index] = null;
    setImageFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
    const newPreviews = [...previewUrls];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);
    newPreviews[index] = URL.createObjectURL(file);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const filesToUpload = imageFiles.filter((f) => f !== null);

    if (filesToUpload.length === 0) {
      setError("Please upload at least one product photo.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("maxBorrowDays", maxBorrowDays);

      filesToUpload.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to list item.");
      }

      setSuccess("Product listed successfully! 🎉");

      setTitle("");
      setDescription("");
      setCategory("Books");
      setCondition("Good");
      setMaxBorrowDays(3);
      setImageFiles([null, null, null, null]);
      setPreviewUrls([null, null, null, null]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List an Item</h1>
          <p className="mt-2 text-gray-500">
            Share your items with other students on campus.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item title..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, included accessories, notes..."
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {CONDITIONS.map((con) => (
                  <option key={con} value={con}>
                    {con}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max Borrow Days
              </label>
              <input
                type="number"
                value={maxBorrowDays}
                onChange={(e) => setMaxBorrowDays(e.target.value)}
                min={1}
                max={30}
                className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Photos
              </label>
              <p className="text-xs text-gray-500 mb-4">
                Upload up to 4 photos. First photo will be the cover.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {IMAGE_LABELS.map((label, index) => (
                  <div key={label} className="relative">
                    {previewUrls[index] ? (
                      <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-200 shadow-sm">
                        <img
                          src={previewUrls[index]}
                          alt={label}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center justify-center shadow-md transition"
                        >
                          ✕
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                          {label}
                        </div>
                      </div>
                    ) : (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition flex flex-col items-center justify-center text-center">
                        <div className="mb-2">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {label}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(index, e.target.files[0])
                          }
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Listing Item..." : "List Item for Borrowing"}
            </button>
          </form>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
                Live Listing Preview
              </h2>

              <div className="mb-4">
                <Product3DPreviewer images={previewUrls} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
