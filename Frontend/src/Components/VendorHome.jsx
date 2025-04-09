import React from "react";
import NavbarVendor from "./NavbarVendor";
import { Link } from "react-router-dom";

const VendorHome = () => {
  return (
    <div>
      <NavbarVendor />
      <div className="max-w-[1200px] mx-auto mt-6 text-xl font-semibold text-gray-700">
        <p>Welcome Vendor!</p>
      </div>
      <Link to="/add-product"> add button</Link>
      <Link to="/vendor-product-list"> product list button</Link>
    </div>
  );
};

export default VendorHome;
