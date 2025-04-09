import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const SignUp_Login = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [userType, setUserType] = useState("customer");

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

    try {
      const response = await fetch(
        `http://localhost:3000/api/login/${userType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }
      navigate("/home");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-100 to-white text-gray-900 p-2">
      <div className="relative bg-white flex w-full max-w-5xl overflow-hidden flex-col md:flex-row shadow-xl rounded-3xl border border-gray-200">
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center bg-white rounded-l-3xl">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            Welcome Back!
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <p className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer text-right mb-4">
              Forgot Password?
            </p>
            <button
              type="submit"
              className="w-full bg-blue-300 text-gray py-3 rounded-lg shadow-lg hover:bg-blue-400 transition transform hover:scale-105"
            >
              Sign In
            </button>
          </form>

          {/* <div className="flex items-center my-6 w-full max-w-md">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div> */}

          {/* <button className="w-full max-w-md border border-gray-400 py-3 flex items-center justify-center gap-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-105">
            <FcGoogle className="text-3xl" />
            <span className="text-gray-700 font-semibold">
              Sign in with Google
            </span>
          </button> */}

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
            {/* <button className="w-full border border-white py-3 flex items-center justify-center gap-3 rounded-lg hover:bg-blue-300 transition transform hover:scale-105">
              <FcGoogle className="text-3xl" />
              <span className="text-white font-semibold">
                Sign up with Google
              </span>
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp_Login;
