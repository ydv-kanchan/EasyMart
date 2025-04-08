import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="w-full h-16 flex justify-center items-center bg-white shadow-lg">
      <div className="w-full h-full flex items-center px-16 bg-white shadow-md">
        {/* Logo */}
        <div
          className="h-24 w-24 flex items-center cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Links */}
        <div className="h-full flex items-center w-auto ml-auto space-x-6 relative">
          <Link
            to="/about"
            className="text-black font-extrabold text-l hover:text-gray-600"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-black font-extrabold text-l hover:text-gray-600"
          >
            Contact Us
          </Link>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-200 px-4 py-2 rounded-full text-black font-semibold text-xl hover:bg-gray-300"
            >
              ☰
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-black hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar2;
