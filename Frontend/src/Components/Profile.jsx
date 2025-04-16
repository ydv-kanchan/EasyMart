
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBox,
  FiHeart,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";
import CustomerProfile from "./CustomerProfile";
import Wishlist from "./Wishlist";
import Cart from "./Cart";

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

const Profile = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");

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
        console.error("Logout failed:", error);
        alert("Something went wrong during logout.");
      }
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "profile":
        return <CustomerProfile />;
      case "orders":
        return (
          <div className="p-6 w-full">
            <h2 className="text-xl font-bold text-gray-800">Your Orders</h2>
            <p className="text-gray-600 mt-2">No recent orders yet.</p>
          </div>
        );
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-2cm)] bg-gray-100 p-7 gap-7">
      {/* Sidebar */}
      <div className="w-full md:w-64 h-[calc(100vh-2cm)] bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2">My Account</h2>
        <SidebarItem
          icon={FiUser}
          label="Profile"
          active={selectedTab === "profile"}
          onClick={() => setSelectedTab("profile")}
        />
        <SidebarItem
          icon={FiBox}
          label="Orders"
          active={selectedTab === "orders"}
          onClick={() => setSelectedTab("orders")}
        />
        <SidebarItem
          icon={FiHeart}
          label="Wishlist"
          active={selectedTab === "wishlist"}
          onClick={() => setSelectedTab("wishlist")}
        />
        <SidebarItem
          icon={FiShoppingCart}
          label="Cart"
          active={selectedTab === "cart"}
          onClick={() => setSelectedTab("cart")}
        />
        <SidebarItem
          icon={FiLogOut}
          label="Logout"
          active={false}
          onClick={handleLogout}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto h-auto min-h-[calc(100vh-2cm)] p-0 md:p-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
