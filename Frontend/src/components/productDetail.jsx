import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Box, Calendar, User } from "lucide-react";
import Product3DPreviewer from "../3DPreview.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);

  const [requesting, setRequesting] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
          throw new Error("This item is no longer listed.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const requestBorrow = async () => {
    setRequesting(true);
    setRequestError("");
    setRequestMessage("");

    try {
      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send the request.");
      }

      setRequestMessage("Request sent. The owner will accept or decline it.");
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading item...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-700">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to browse
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const isOwner = Boolean(user) && user.id === product.owner?.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to browse
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm overflow-hidden">
            <Product3DPreviewer images={images.map((img) => img.url)} />
          </div>
        </div>

        <div>
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {product.category}
          </span>

          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            {product.title}
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Condition: {product.condition}
          </p>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {product.owner?.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Up to {product.maxBorrowDays} days
            </span>
          </div>

          <p className="mt-6 text-gray-700 whitespace-pre-line">
            {product.description}
          </p>

          <div className="mt-8 pt-6 border-t border-gray-100">
            {product.isAvailable ? (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                Available
              </span>
            ) : (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                Currently borrowed
              </span>
            )}

            {isOwner ? (
              <p className="mt-4 text-sm text-gray-500">
                This is your item, so there is nothing to request.
              </p>
            ) : !user ? (
              <p className="mt-4 text-sm text-gray-500">
                <Link to="/login" className="text-indigo-600 font-medium">
                  Log in
                </Link>{" "}
                to ask for this item.
              </p>
            ) : product.isAvailable ? (
              <button
                onClick={requestBorrow}
                disabled={requesting || Boolean(requestMessage)}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-4 py-2.5 rounded-xl transition"
              >
                {requesting
                  ? "Sending..."
                  : requestMessage
                    ? "Request sent"
                    : `Request to borrow for ${product.maxBorrowDays} days`}
              </button>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                Someone already has this. Check back once it is returned.
              </p>
            )}

            {requestMessage && (
              <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
                {requestMessage}
              </p>
            )}

            {requestError && (
              <p className="mt-3 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">
                {requestError}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
