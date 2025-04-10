import React from "react";

const ShopDetails = () => {
  return (
    <div className="bg-white p-2 rounded-l shadow flex items-center gap-5 h-[3cm]">
      {/* Shop Logo */}
      <div className="min-w-[80px] min-h-[80px]">
        <img
          src="https://via.placeholder.com/80" // You can replace with your shop logo URL
          alt="Shop Logo"
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow"
        />
      </div>

      {/* Shop Info */}
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-700 mb-1">
          Elegant Emporium
        </h2>
        <p className="text-gray-600 text-sm max-w-md">
          Your one-stop shop for all things classy and timeless. Discover a
          handpicked collection of premium products just for you.
        </p>
      </div>
    </div>
  );
};

export default ShopDetails;
