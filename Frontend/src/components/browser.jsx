import React from 'react';


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {  Calendar, Box } from "lucide-react";



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  "All", "Books", "Calculators", "Chargers", "Lab Equipment",
  "Sports", "Formal Clothes", "Tripods", "Other",
];





const Browser = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        fetchProducts();
      }, [category]);
  
  
    const fetchProducts = async () => {
        setLoading(true);
        try {
          const url = category === "All"
            ? `${API_URL}/products`
            : `${API_URL}/products?category=${category}`;
    
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          const data = await response.json();
          setProducts(data);
        } catch (err) {
          console.error("Failed to fetch products:", err);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };


  


  

  
  return(
  <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Browse Items</h1>
            <p className="text-gray-500 text-sm mt-1">
              Find items to borrow from fellow students
            </p>
          </div>
  
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
  
        {loading && (
          <div className="text-center py-20 text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-3 animate-pulse" />
            <p>Loading products...</p>
          </div>
        )}
  
        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Box className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">No items available right now</p>
            <p className="text-sm mt-1">Check back later or list your own items!</p>
          </div>
        )}
  
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Box className="w-16 h-16" />
                    </div>
                  )}
                </div>
  
                <div className="p-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium`}>
                    {product.category}
                  </span>
  
                  <h3 className="font-semibold text-gray-800 mt-2 line-clamp-1">
                    {product.title}
                  </h3>
  
                  <p className="text-sm text-gray-500 mt-1">
                    Condition: {product.condition}
                  </p>
  
                  
  
                  {product.owner && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">{product.owner.name}</span>
                      
                    </div>
                  )}
  
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                    <Calendar className="w-3 h-3" />
                    Max {product.maxBorrowDays} days
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
};

export default Browser ;

