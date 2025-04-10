import React from "react";
import { FiPlus } from "react-icons/fi";

const MyProducts = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-all">
          <FiPlus className="text-lg" />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Example Product Card */}
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className="bg-white border rounded-2xl p-4 shadow hover:shadow-md transition"
          >
            <img
              src="https://via.placeholder.com/150"
              alt="Product"
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-700">
              Product Name
            </h3>
            <p className="text-sm text-gray-500 mt-1">₹999</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
