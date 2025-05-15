import React, { useEffect, useState } from "react";

const statusColors = {
  pending: "text-gray-500",
  confirmed: "text-blue-600",
  shipped: "text-purple-600",
  delivered: "text-green-600",
  canceled: "text-red-600",
};

const CustomerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      } else {
        alert(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/orders/cancel/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        // Refresh orders list to reflect change
        fetchOrders();
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error canceling order:", err);
      alert("Error canceling order");
    }
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-500 text-lg">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-6 py-6">
      <div className="max-w-5xl">
        <h2 className="text-3xl font-bold mb-6">Your Orders</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="flex items-center bg-white p-4 rounded shadow max-w-full"
              style={{ maxWidth: "900px" }} // or you can keep max-w-5xl and adjust
            >
              <img
                src={`http://localhost:3000${order.item_image}`}
                alt={order.item_name}
                className="w-24 h-24 object-cover border rounded"
              />

              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{order.item_name}</h3>
                <p className="text-gray-600">
                  ₹{Number(order.item_price).toFixed(2)} × {order.quantity}
                </p>
              </div>

              <div className="text-right min-w-[140px] pr-6">
                <p
                  className={`${
                    statusColors[order.order_status]
                  } font-medium capitalize mb-2`}
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

                {["pending", "confirmed", "shipped"].includes(
                  order.order_status
                ) && (
                  <button
                    onClick={() => handleCancel(order.order_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderList;
