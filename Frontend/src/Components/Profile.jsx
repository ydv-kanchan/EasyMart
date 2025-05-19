import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerOrderList from "./CustomerOrderList";
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
  const [searchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") || "profile";

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
        return <CustomerOrderList />;
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-2cm)] bg-gray-100 p-7 gap-7 overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl shadow-lg flex flex-col gap-4 sticky top-7 h-[calc(100vh-2cm)]">
        <h2 className="text-2xl font-bold mb-2">My Account</h2>
        <SidebarItem
          icon={FiUser}
          label="Profile"
          active={selectedTab === "profile"}
          onClick={() => navigate("/profile?tab=profile")}
        />
        <SidebarItem
          icon={FiBox}
          label="Orders"
          active={selectedTab === "orders"}
          onClick={() => navigate("/profile?tab=orders")}
        />
        <SidebarItem
          icon={FiHeart}
          label="Wishlist"
          active={selectedTab === "wishlist"}
          onClick={() => navigate("/profile?tab=wishlist")}
        />
        <SidebarItem
          icon={FiShoppingCart}
          label="Cart"
          active={selectedTab === "cart"}
          onClick={() => navigate("/profile?tab=cart")}
        />
        <SidebarItem
          icon={FiLogOut}
          label="Logout"
          active={false}
          onClick={handleLogout}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-2cm)] bg-white rounded-2xl shadow p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
