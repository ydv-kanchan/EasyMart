import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStore, FaShoppingCart } from "react-icons/fa";

const SignUpSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleProceed = () => {
    if (selectedRole === "vendor") {
      navigate("/signup/vendor");
    } else if (selectedRole === "user") {
      navigate("/signup/user");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-white to-gray-100 text-gray-900 p-6">
      <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
        Join Us Today
      </h2>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Choose your role and start your journey with us.
      </p>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center">
        <div
          className={`flex flex-col items-center bg-white shadow-lg p-6 md:p-10 rounded-xl w-72 md:w-80 cursor-pointer border transform transition-all duration-300 ${
            selectedRole === "vendor"
              ? "scale-105 shadow-xl border-orange-400"
              : "hover:scale-105 border-gray-200"
          }`}
          onClick={() => handleSelection("vendor")}
        >
          <FaStore className="text-5xl md:text-6xl mb-4 text-orange-500" />
          <h3 className="text-xl md:text-2xl font-bold">Become a Seller</h3>
          <p className="text-gray-600 mt-2 text-center">
            Sell your products and grow your business.
          </p>
        </div>

        <div
          className={`flex flex-col items-center bg-white shadow-lg p-6 md:p-10 rounded-xl w-72 md:w-80 cursor-pointer border transform transition-all duration-300 ${
            selectedRole === "user"
              ? "scale-105 shadow-xl border-green-400"
              : "hover:scale-105 border-gray-200"
          }`}
          onClick={() => handleSelection("user")}
        >
          <FaShoppingCart className="text-5xl md:text-6xl mb-4 text-green-500" />
          <h3 className="text-xl md:text-2xl font-bold">Start Shopping</h3>
          <p className="text-gray-600 mt-2 text-center">
            Explore amazing deals from trusted sellers.
          </p>
        </div>
      </div>
      {selectedRole && (
        <button
          onClick={handleProceed}
          className="mt-6 px-8 py-3 bg-blue-400 text-white text-lg font-semibold uppercase tracking-wide rounded-full shadow-lg transform transition-all duration-300 hover:bg-blue-300 hover:scale-105"
        >
          Continue as {selectedRole === "vendor" ? "Seller" : "Customer"} →
        </button>
      )}

      <p
        className="mt-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-all duration-300"
        onClick={() => navigate("/")}
      >
        Already have an account? <span className="font-semibold">Sign In</span>
      </p>
    </div>
  );
};

export default SignUpSelection;
