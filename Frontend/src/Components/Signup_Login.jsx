import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp_Login = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("customer");
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/login/${userType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // if using cookies
          body: JSON.stringify({ email: email.trim(), password }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // 🔥 Save both user and token to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token); // store the JWT token

      if (userType === "customer") {
        navigate("/home");
      } else if (userType === "vendor") {
        navigate("/vendorHome");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-100 to-white text-gray-900 p-2">
      <div className="relative bg-white flex w-full max-w-5xl overflow-hidden flex-col md:flex-row shadow-xl rounded-3xl border border-gray-200">
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center bg-white rounded-l-3xl">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            Welcome Back!
          </h2>

          {error && (
            <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-md w-full max-w-md text-center mb-4">
              {error}
            </div>
          )}

          <form className="w-full max-w-md" onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
            </div>

            <div className="mb-5 flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="customer"
                  name="userType"
                  value="customer"
                  checked={userType === "customer"}
                  onChange={() => setUserType("customer")}
                  className="accent-blue-500"
                />
                <label htmlFor="customer" className="text-gray-700">
                  Customer
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="vendor"
                  name="userType"
                  value="vendor"
                  checked={userType === "vendor"}
                  onChange={() => setUserType("vendor")}
                  className="accent-blue-500"
                />
                <label htmlFor="vendor" className="text-gray-700">
                  Seller
                </label>
              </div>
            </div>

            <p
              className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer text-right mb-4"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg shadow-lg transition transform hover:scale-105 ${
                loading
                  ? "bg-blue-200 text-white cursor-not-allowed"
                  : "bg-blue-400 text-white hover:bg-blue-500"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {isMobile && (
            <p className="mt-6 text-gray-600">
              New here?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => navigate("/signup-selection")}
              >
                Sign up now
              </span>
            </p>
          )}
        </div>

        {!isMobile && (
          <div className="absolute inset-y-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex justify-center items-center">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-300 to-blue-500 text-white font-semibold flex items-center justify-center rounded-full shadow-lg border-4 border-white">
              OR
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="w-1/2 flex flex-col justify-center items-center text-white relative bg-gradient-to-r from-blue-200 to-blue-500 p-12 rounded-r-3xl">
            <h2 className="text-4xl font-extrabold mb-4">New Here?</h2>
            <p className="text-lg text-center mb-6">
              Sign up to shop effortlessly while managing your inventory with
              ease!
            </p>
            <button
              className="w-full border-2 border-white text-white py-3 rounded-lg shadow-md hover:bg-white hover:text-blue-500 transition transform hover:scale-105 mb-4"
              onClick={() => navigate("/signup-selection")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp_Login;
