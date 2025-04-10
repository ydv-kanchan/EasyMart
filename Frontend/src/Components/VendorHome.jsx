import React from "react";
import { Link } from "react-router-dom";

const VendorHome = () => {
  return (
    <div className="max-w-[1200px] mx-auto mt-6 text-xl font-semibold text-gray-700">
      <p>Welcome Vendor!</p>
      <div className="mt-4 space-x-4">
        <Link to="/add-product" className="text-blue-600 underline">
          Add Product
        </Link>
        <Link to="/vendor-product-list" className="text-blue-600 underline">
          View Product List
        </Link>
      </div>
    </div>
  );
};

export default VendorHome;
