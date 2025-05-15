import React, { useEffect, useState } from "react";

const statusColors = {
  pending: "text-gray-500",
  confirmed: "text-blue-600",
  shipped: "text-purple-600",
  delivered: "text-green-600",
  canceled: "text-red-600",
};

const IncomingVendorOrders = () => {
  const [orders, setOrders] = useState([]);
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
    const endpoint =
      action === "confirm"
        ? `http://localhost:3000/api/vendorOrders/orders/confirm/${orderId}`
        : `http://localhost:3000/api/vendorOrders/orders/ship/${orderId}`;

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

  const pendingAndConfirmed = orders.filter(
    (o) => o.order_status === "pending" || o.order_status === "confirmed"
  );
  const shippedAndOthers = orders.filter(
    (o) =>
      o.order_status === "shipped" ||
      o.order_status === "delivered" ||
      o.order_status === "canceled"
  );

  const renderOrderCard = (order) => (
    <div
      key={order.order_id}
      className="flex items-center bg-white p-4 rounded shadow max-w-full"
      style={{ maxWidth: "900px" }}
    >
      <img
        src={`http://localhost:3000${order.item_image}`}
        alt={order.item_name}
        className="w-24 h-24 object-cover border"
      />

      <div className="ml-4 flex-1">
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

      <div className="text-right min-w-[160px] pr-4">
        <p className={`${statusColors[order.order_status]} font-medium capitalize mb-2`}>
          {order.order_status}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          {new Date(order.order_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        {order.order_status === "pending" && (
          <button
            onClick={() => handleAction(order.order_id, "confirm")}
            className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 transition mb-2"
          >
            Confirm
          </button>
        )}

        {order.order_status === "confirmed" && (
          <button
            onClick={() => handleAction(order.order_id, "ship")}
            className="px-3 py-1 bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            Ship
          </button>
        )}
      </div>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-500 text-lg">No incoming orders right now.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-20rem)] bg-gray-100 px-6 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Section: Incoming Orders */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-6">Incoming Orders</h2>
          {pendingAndConfirmed.length === 0 ? (
            <p className="text-gray-500">No pending or confirmed orders.</p>
          ) : (
            <div className="space-y-4">
              {pendingAndConfirmed.map((order) => renderOrderCard(order))}
            </div>
          )}
        </div>

        {/* Section: Processed Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-700">Processed Orders</h2>
          {shippedAndOthers.length === 0 ? (
            <p className="text-gray-400">No shipped or completed orders yet.</p>
          ) : (
            <div className="space-y-4">
              {shippedAndOthers.map((order) => renderOrderCard(order))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingVendorOrders;
