import React from "react";
import { Outlet } from "react-router-dom";
import Navbar2 from "./Navbar2";

const CustomerLayout = () => {
  return (
    <div>
      <Navbar2 />
      <Outlet />
    </div>
  );
};

export default CustomerLayout;
