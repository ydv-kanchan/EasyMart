import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle, MdOutlineStorefront } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { IoChevronDown, IoChevronUp, IoSearchOutline } from "react-icons/io5";

const Navbar2 = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        await fetch("http://localhost:3000/logout", {
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
    <div className="w-full bg-white shadow">
      <div className="max-w-[1200px] mx-auto px-4 py-0 flex items-center justify-between">
        <div className="flex items-center justify-center w-full gap-[.5rem]">
          {/* Logo */}
          <div
            className="h-20 w-50 cursor-pointer flex items-center"
            onClick={() => navigate("/home")}
          >
            <img src="/logo.png" alt="Logo" className="h-full w-full" />
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-grow max-w-2xl bg-blue-50 px-3 py-3 shadow-sm rounded-md ml-[0.5rem]">
            <IoSearchOutline className="text-xl text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search for Products, Categories, more"
              className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Account Dropdown WRAPPER */}
          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            {/* Button */}
            <button className="w-44 h-12 px-4 text-m border border-gray-100 rounded-md text-black font-medium hover:bg-gray-100 transition flex items-center justify-center">
              <MdOutlineAccountCircle className="mr-1.5 text-xl" />
              Account
              <span className="ml-1 text-gray-700 text-lg">
                {isDropdownOpen ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-0 w-56 bg-white rounded-md shadow-md z-50 border border-gray-200 transition-all duration-150 ${
                isDropdownOpen ? "block" : "hidden"
              }`}
            >
              <Link
                to="/profile"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                My Profile
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                Orders
              </Link>
              <Link
                to="/wishlist"
                className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100"
              >
                Wishlist
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="w-44 h-12 px-4 text-m border border-gray-100 rounded-md text-black font-medium hover:bg-gray-100 transition flex items-center justify-center"
          >
            <FiShoppingCart className="mr-1.5 text-lg" />
            Cart
          </Link>

          {/* Become a Seller */}
          <Link
            to="/signup/vendor"
            className="w-44 h-12 px-4 text-m border border-gray-100 rounded-md text-black font-medium hover:bg-gray-100 transition flex items-center justify-center"
          >
            <MdOutlineStorefront className="mr-1.5 text-lg" />
            Become a Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
