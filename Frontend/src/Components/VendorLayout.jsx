import React from "react";
import { Outlet } from "react-router-dom";
import NavbarVendor from "./NavbarVendor";

const VendorLayout = () => {
  return (
    <div>
      <NavbarVendor />
      <div className="mt-[2cm]">
        <Outlet />
      </div>
    </div>
  );
};

export default VendorLayout;
