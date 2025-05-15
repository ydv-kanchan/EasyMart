import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

const NavbarVendor = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await fetch("http://localhost:3000/vendorLogout", {
          method: "GET",
          credentials: "include",
        });
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="w-full bg-white shadow fixed top-0 z-50">
      <div className="max-w-[1000px] mx-auto flex items-center justify-between h-20">
        <div
          className="h-24 cursor-pointer flex items-center"
          onClick={() => navigate("/vendorHome")}
        >
          <img src="/logo.png" alt="Logo" className="h-full w-auto" />
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center gap-[0.2cm]">
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="w-44 h-12 px-4 text-m border border-gray-100 rounded-md text-black font-medium hover:bg-gray-100 transition flex items-center justify-center">
              <MdOutlineAccountCircle className="mr-1.5 text-xl" />
              Account
              <span className="ml-1 text-gray-700 text-lg">
                {isDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </button>

         
            <div
              className={`absolute right-0 mt-0 w-56 bg-white rounded-md shadow-md z-50 border border-gray-200 transition-all duration-150 ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <Link
                to="/vendor/profile"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/vendor-product-list"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                My Products
              </Link>
              <Link
                to="/vendor/orders"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

       
          <button
            onClick={handleLogout}
            className="w-44 h-12 px-4 text-m border border-gray-100 rounded-md text-black font-medium hover:bg-red-100 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavbarVendor;
