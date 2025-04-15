import React, { useState } from "react";
import { FiHome, FiUser, FiBox, FiClipboard, FiLogOut } from "react-icons/fi";
import VendorProfileDetails from "./VendorProfileDetails"; // UI-only profile details
import Dashboard from "./Dashboard";
import MyProducts from "./MyProducts";
import VendorProductList from "./VendorProductList";

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
          <div className=" w-full">
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
            <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
            <p className="text-gray-600 mt-2">
              Track customer orders and delivery status here.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-2cm)] bg-gray-100 p-7 gap-7">
      {/* Sidebar */}
      <div className="w-full md:w-64 h-[calc(100vh-2cm)] bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4">
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
        <SidebarItem
          icon={FiLogOut}
          label="Logout"
          active={false}
          onClick={() => alert("Logout clicked (UI-only)")}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-auto min-h-[calc(100vh-2cm)] bg-white rounded-2xl shadow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default VendorProfile;
