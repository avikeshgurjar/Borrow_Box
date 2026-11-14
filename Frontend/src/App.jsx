import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3456/api";

import Navbar from "./components/navbar";
import SignUp from "./components/signup";
import Login from "./components/login";
import AddProducts from "./components/AddProducts";
import Browser from "./components/browser";
import Dashboard from "./components/dashboard";
import GuestRoute from "./components/GuestRoute";
import ProductDetail from "./components/productDetail";

function AuthRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("failed to fetch user from localStorage:", err.message);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <Routes className="flex-1">
        <Route path="/" element={<Browser user={user} />} />
        <Route path="/product/:id" element={<ProductDetail user={user} />} />
        <Route path="/products/:id" element={<ProductDetail user={user} />} />
        <Route
          path="/login"
          element={
            <GuestRoute user={user}>
              <Login onLogin={handleLogin} />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute user={user}>
              <SignUp />
            </GuestRoute>
          }
        />

        
        <Route
          path="/addproduct"
          element={
            <AuthRoute user={user}>
              <AddProducts />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute user={user}>
              <Dashboard user={user} onUserUpdate={handleLogin} />
            </AuthRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
