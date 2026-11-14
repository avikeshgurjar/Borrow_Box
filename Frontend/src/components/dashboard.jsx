import React from "react";
import { useState, useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";
import { User, Box, Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  DECLINED: "bg-gray-100 text-gray-600",
  RETURNED: "bg-indigo-50 text-indigo-700",
};

const Dashboard = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [myLendings, setMyLendings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [actionError, setActionError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const productsRes = await fetch(`${API_URL}/myproducts`, {
        credentials: "include",
      });

      const borrowsRes = await fetch(`${API_URL}/myborrows`, {
        credentials: "include",
      });

      const lendingsRes = await fetch(`${API_URL}/mylendings`, {
        credentials: "include",
      });

      if (
        productsRes.status === 401 ||
        borrowsRes.status === 401 ||
        lendingsRes.status === 401
      ) {
        setSessionExpired(true);
        return;
      }

      setSessionExpired(false);

      const products = await productsRes.json();
      const borrows = await borrowsRes.json();
      const lendings = await lendingsRes.json();

      setMyProducts(products);
      setMyBorrows(borrows);
      setMyLendings(lendings);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const act = async (id, action) => {
    setBusyId(id);
    setActionError("");

    try {
      const response = await fetch(`${API_URL}/borrows/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      await fetchAllData();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const signInAgain = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    if (onUserUpdate) {
      onUserUpdate(null);
    }

    navigate("/login");
  };

  if (sessionExpired) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-lg font-semibold text-gray-900">
            Your session has expired
          </p>
          <p className="text-gray-500 mt-2">
            Sign in again to see your listed items, what you have borrowed and
            the requests on your items.
          </p>
          <button
            onClick={signInAgain}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
          >
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.name || "Student"}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
            {user?.enrollmentId && (
              <span className="inline-block mt-2 text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                URN: {user.enrollmentId}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Your Listed Items</h2>
        <Link
          to="/addproduct"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 mb-10">
          Loading your listed items...
        </div>
      ) : !Array.isArray(myProducts) || myProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 mb-10">
          <Box className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>You haven&apos;t listed any items on BorrowBox yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {myProducts.map((product) => {
            const coverImage =
              product.images?.find((img) => img.thumbNail)?.url ||
              product.images?.[0]?.url;
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Box className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {product.category}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          product.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.isAvailable ? "Available" : "Borrowed"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Condition: {product.condition}</span>
                    <span>Max {product.maxBorrowDays} days</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Your Borrowed Products
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading your borrowed products...
        </div>
      )  : !Array.isArray(myBorrows) || myBorrows.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          <Box className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>not borrowed any product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBorrows.map((borrow) => {
            const product = borrow.product;
            const coverImage =
              product?.images?.find((img) => img.thumbNail)?.url ||
              product?.images?.[0]?.url;

            return (
              <div
                key={borrow.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product?.title || "Borrowed item"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Box className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {product?.category || "Item"}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {borrow.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product?.title || "Untitled Item"}
                    </h3>
                    {borrow.owner?.name && (
                      <p className="text-sm text-gray-500 mt-1">
                        Owner: {borrow.owner.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Borrowed:{" "}
                      {new Date(borrow.borrowDate).toLocaleDateString()}
                    </span>
                    <span>
                      Due:{" "}
                      {new Date(borrow.returnDeadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-between items-center mb-6 mt-10">
        <h2 className="text-xl font-bold text-gray-900">
          Requests on Your Items
        </h2>
      </div>

      {actionError && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
          {actionError}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading requests...
        </div>
      ) : !Array.isArray(myLendings) || myLendings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
          <Box className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>Nobody has asked for your items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myLendings.map((lending) => {
            const product = lending.product;
            const coverImage =
              product?.images?.find((img) => img.thumbNail)?.url ||
              product?.images?.[0]?.url;

            return (
              <div
                key={lending.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product?.title || "Your item"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Box className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {product?.category || "Item"}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          STATUS_STYLES[lending.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {lending.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {product?.title || "Untitled Item"}
                    </h3>
                    {lending.borrower?.name && (
                      <p className="text-sm text-gray-500 mt-1">
                        Asked by {lending.borrower.name}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Due:{" "}
                      {new Date(lending.returnDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  {lending.status === "PENDING" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => act(lending.id, "approve")}
                        disabled={busyId === lending.id}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-3 py-2 rounded-xl transition"
                      >
                        {busyId === lending.id ? "Working..." : "Approve"}
                      </button>
                      <button
                        onClick={() => act(lending.id, "decline")}
                        disabled={busyId === lending.id}
                        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-sm font-medium px-3 py-2 rounded-xl transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {lending.status === "APPROVED" && (
                    <button
                      onClick={() => act(lending.id, "return")}
                      disabled={busyId === lending.id}
                      className="mt-3 w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-medium px-3 py-2 rounded-xl transition"
                    >
                      {busyId === lending.id ? "Working..." : "Mark returned"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
