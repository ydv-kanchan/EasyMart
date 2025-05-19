import React, { useState } from "react";
import { FiHome, FiUser, FiBox, FiClipboard } from "react-icons/fi";
import VendorProfileDetails from "./VendorProfileDetails";
import Dashboard from "./Dashboard";
import VendorProductList from "./VendorProductList";
import IncomingVendorOrders from "./IncomingVendorOrders";

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 w-full rounded-lg font-medium gap-3 transition-all duration-200 ${
      active
        ? "bg-white text-blue-700 shadow-md"
        : "text-white hover:bg-blue-600 hover:shadow"
    }`}
  >
    <Icon className="text-xl" />
    {label}
  </button>
);

const VendorProfile = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return (
          <div className="w-full">
            <Dashboard />
          </div>
        );
      case "profile":
        return (
          <div className="p-4 w-full">
            <VendorProfileDetails />
          </div>
        );
      case "products":
        return (
          <div className="p-4 w-full">
            <VendorProductList />
          </div>
        );
      case "orders":
        return (
          <div className="p-6 w-full">
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M9 16h6"
                />
              </svg>
              <p className="text-xl font-bold text-gray-800">
                Order Management
              </p>
            </div>
            <IncomingVendorOrders />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2cm)] bg-gray-100 p-7 gap-7 overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4 sticky top-7 h-[calc(100vh-2cm)]">
        <h2 className="text-2xl font-bold mb-2">Vendor Panel</h2>
        <SidebarItem
          icon={FiHome}
          label="Dashboard"
          active={selectedTab === "dashboard"}
          onClick={() => setSelectedTab("dashboard")}
        />
        <SidebarItem
          icon={FiUser}
          label="My Profile"
          active={selectedTab === "profile"}
          onClick={() => setSelectedTab("profile")}
        />
        <SidebarItem
          icon={FiBox}
          label="My Products"
          active={selectedTab === "products"}
          onClick={() => setSelectedTab("products")}
        />
        <SidebarItem
          icon={FiClipboard}
          label="Orders"
          active={selectedTab === "orders"}
          onClick={() => setSelectedTab("orders")}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-2cm)] bg-white rounded-2xl shadow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default VendorProfile;
