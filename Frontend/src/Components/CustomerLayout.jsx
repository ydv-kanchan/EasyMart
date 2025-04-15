import React from "react";
import { Outlet } from "react-router-dom";
import Navbar2 from "./Navbar2";

const CustomerLayout = () => {
  return (
    <div>
      <Navbar2 />
      <div className="mt-[2cm]">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;
