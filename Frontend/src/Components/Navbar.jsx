import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-16 flex justify-center items-center bg-white shadow-lg">
      <div className="w-full h-full flex items-center px-16 bg-white shadow-md">
        <div className="h-24 w-24 flex items-center">
          <Link to="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className="h-full flex items-center w-auto ml-auto space-x-6">
          <Link
            to="/about"
            className="text-black font-extrabold text-l hover:text-gray-600"
          >
            About Us
          </Link>
          <Link className="text-black font-extrabold text-l hover:text-gray-600">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
