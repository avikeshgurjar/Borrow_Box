import React, { useState } from "react";
import { Link } from "react-router-dom";
const PORT = import.meta.env.VITE_PORT;
const API_URL = `http://localhost:${PORT}/api`;

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    enrollmentId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      

      setSuccess("Account created successfully! Redirecting to login...");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7faf9] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-4"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#101817] mb-3">
          Join BorrowBox 📦
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          Create your campus borrowing account
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-5">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Enrollment ID
            </label>
            <input
              type="text"
              name="enrollmentId"
              value={formData.enrollmentId}
              onChange={handleChange}
              placeholder="Enter your URN"
              required
              className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@gmail.com"
              required
              className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              pattern="[0-9]{10}"
              required
              className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                minLength={6}
                required
                className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 pr-14 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-2">At least 6 characters.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600  hover:bg-indigo-700 text-white text-xl font-medium py-4 rounded-2xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
