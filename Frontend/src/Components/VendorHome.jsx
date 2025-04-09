import React from "react";
import NavbarVendor from "./NavbarVendor";

const VendorHome = () => {
  return (
    <div>
      <NavbarVendor />
      <div className="max-w-[1200px] mx-auto mt-6 text-xl font-semibold text-gray-700">
        <p>Welcome Vendor!</p>
      </div>
    </div>
  );
};

export default VendorHome;
