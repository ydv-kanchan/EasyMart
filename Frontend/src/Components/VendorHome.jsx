import React from "react";
import { Link } from "react-router-dom";

const VendorHome = () => {
  return (
    <div className="max-w-[1200px] mx-auto mt-6 text-xl font-semibold text-gray-700">
      <div className="mt-4 space-x-4">
        <Link to="/vendor/profile" className="text-blue-600 underline">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default VendorHome;
