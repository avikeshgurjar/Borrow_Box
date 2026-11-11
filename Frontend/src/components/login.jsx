
import { useState } from "react";
import { Link } from "react-router-dom";

const PORT = import.meta.env.VITE_PORT;
const API_URL = `http://localhost:${PORT}/api`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");





  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccess("logged in successfully....");


      // console.log("logged in successfully...");
      

      // window.location.href = "/";
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
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-5"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#101817] mb-3">
          Welcome back
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          Sign in to your BorrowBox account
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
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-[#dce3e0] rounded-2xl px-5 py-3.5 pr-14 text-lg outline-none focus:border-[#00845e] focus:ring-2 focus:ring-[#00845e]/10 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-medium py-4 rounded-2xl transition duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>

        </div>
        

        
      </form>
      
    </div>
  );
};

export default Login;
