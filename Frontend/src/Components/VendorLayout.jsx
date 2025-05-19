import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavbarVendor from "./NavbarVendor";

const VendorLayout = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) setSelectedTab("dashboard");
    else if (path.includes("details")) setSelectedTab("details");
    else if (path.includes("vendor-product-list")) setSelectedTab("products");
    else if (path.includes("incoming-orders")) setSelectedTab("orders");
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar at the top */}
      <NavbarVendor />


      <div className="flex flex-grow p-7 gap-7 mt-16">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2">Vendor Panel</h2>

          <button
            onClick={() => {
              navigate("/dashboard");
              setSelectedTab("dashboard");
            }}
            className={`px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 text-left ${
              selectedTab === "dashboard"
                ? "bg-white text-blue-700 shadow-md"
                : "text-white hover:bg-blue-600 hover:shadow"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/details");
              setSelectedTab("details");
            }}
            className={`px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 text-left ${
              selectedTab === "details"
                ? "bg-white text-blue-700 shadow-md"
                : "text-white hover:bg-blue-600 hover:shadow"
            }`}
          >
            My Profile
          </button>

          <button
            onClick={() => {
              navigate("/vendor-product-list");
              setSelectedTab("products");
            }}
            className={`px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 text-left ${
              selectedTab === "products"
                ? "bg-white text-blue-700 shadow-md"
                : "text-white hover:bg-blue-600 hover:shadow"
            }`}
          >
            My Products
          </button>

          <button
            onClick={() => {
              navigate("/incoming-orders");
              setSelectedTab("orders");
            }}
            className={`px-4 py-3 w-full rounded-lg font-medium transition-all duration-200 text-left ${
              selectedTab === "orders"
                ? "bg-white text-blue-700 shadow-md"
                : "text-white hover:bg-blue-600 hover:shadow"
            }`}
          >
            Orders
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow p-6 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default VendorLayout;
