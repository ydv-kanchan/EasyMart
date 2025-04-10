import React from "react";
import { Outlet } from "react-router-dom";
import NavbarVendor from "./NavbarVendor";

const VendorLayout = () => {
  return (
    <div>
      <NavbarVendor />
      <Outlet />
    </div>
  );
};

export default VendorLayout;
