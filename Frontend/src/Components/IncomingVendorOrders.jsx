import React, { useEffect, useState } from "react";

const statusColors = {
  pending: "text-gray-500",
  confirmed: "text-blue-600",
  shipped: "text-purple-600",
  delivered: "text-green-600",
  canceled: "text-red-600",
};

const tabList = ["pending", "confirmed", "shipped", "delivered", "canceled"];

const tabTitles = {
  pending: "Pending Orders",
  confirmed: "Confirmed Orders",
  shipped: "Shipped Orders",
  delivered: "Delivered Orders",
  canceled: "Canceled Orders",
};

const IncomingVendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const token = localStorage.getItem("token");

  const fetchVendorOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/vendorOrders/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        alert(data.message || "Failed to fetch vendor orders");
      }
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, [token]);

  const handleAction = async (orderId, action) => {
    let endpoint = "";
    if (action === "confirm") {
      endpoint = `http://localhost:3000/api/vendorOrders/orders/confirm/${orderId}`;
    } else if (action === "ship") {
      endpoint = `http://localhost:3000/api/vendorOrders/orders/ship/${orderId}`;
    } else if (action === "deliver") {
      endpoint = `http://localhost:3000/api/vendorOrders/orders/deliver/${orderId}`;
    } else if (action === "cancel") {
      endpoint = `http://localhost:3000/api/vendorOrders/orders/cancel/${orderId}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchVendorOrders();
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(`Error performing ${action} on order:`, err);
    }
  };

  const filteredOrders = orders.filter((o) => o.order_status === activeTab);

  const renderOrderCard = (order) => (
    <div
      key={order.order_id}
      className="flex items-center justify-between bg-white p-4 rounded shadow max-w-full"
      style={{ maxWidth: "900px" }}
    >
      <div className="flex items-center">
        <img
          src={`http://localhost:3000${order.item_image}`}
          alt={order.item_name}
          className="w-24 h-24 object-cover border"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{order.item_name}</h3>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <p className="text-gray-600">
            Price: ₹{Number(order.price_per_item).toFixed(2)}
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            <span className="font-semibold">Customer:</span>{" "}
            {order.customer_name}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Address:</span> {order.address}
          </p>
        </div>
      </div>
      <div className="text-right flex flex-col justify-between min-w-[200px] h-full">
        <div>
          <p
            className={`${
              statusColors[order.order_status]
            } font-medium capitalize mb-1`}
          >
            {order.order_status}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            {new Date(order.order_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex gap-2 justify-end flex-wrap mt-2">
          {order.order_status === "pending" && (
            <>
              <button
                onClick={() => handleAction(order.order_id, "confirm")}
                className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => handleAction(order.order_id, "cancel")}
                className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </>
          )}
          {order.order_status === "confirmed" && (
            <>
              <button
                onClick={() => handleAction(order.order_id, "ship")}
                className="px-3 py-1 bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Ship
              </button>
              <button
                onClick={() => handleAction(order.order_id, "cancel")}
                className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </>
          )}
          {order.order_status === "shipped" && (
            <>
              <button
                onClick={() => handleAction(order.order_id, "deliver")}
                className="px-3 py-1 bg-green-600 text-white hover:bg-green-700 transition"
              >
                Deliver
              </button>
              <button
                onClick={() => handleAction(order.order_id, "cancel")}
                className="px-3 py-1 bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-6 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-8 border-b">
          {tabList.map((tab) => (
            <button
              key={tab}
              className={`capitalize px-6 py-2 font-medium transition border-b-2 ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section content */}
        <h2 className="text-2xl font-bold mb-4">{tabTitles[activeTab]}</h2>
        {filteredOrders.length === 0 ? (
          <p className="text-gray-400">No {activeTab} orders.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => renderOrderCard(order))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingVendorOrders;
