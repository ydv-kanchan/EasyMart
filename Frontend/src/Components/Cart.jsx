import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const Cart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(data.cart);
      setTotalAmount(data.totalPrice);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const updateQuantity = async (item_id, type) => {
    try {
      const res = await fetch(`http://localhost:3000/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id, type }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchCart();
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (item_id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/cart/remove/${item_id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        fetchCart();
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center bg-gray-50 px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.item_id}
                className="flex items-center bg-white p-4 rounded shadow"
              >
                <img
                  src={`http://localhost:3000${item.item_image}`}
                  alt={item.item_name}
                  className="w-24 h-24 object-cover border rounded"
                />

                <div className="ml-4 flex flex-col justify-between flex-grow">
                  <h3 className="text-lg font-semibold">{item.item_name}</h3>
                  <p className="text-gray-600">₹{item.item_price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.item_id, "decrement")}
                    disabled={item.quantity <= 1}
                  >
                    <IoMdRemove />
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.item_id, "increment")}
                  >
                    <IoMdAdd />
                  </button>
                </div>

                <button
                  className="ml-4 text-red-600 hover:text-red-800"
                  onClick={() => removeItem(item.item_id)}
                >
                  <IoClose size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 sticky top-24 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Price Details</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.item_id}
                  className="flex justify-between text-gray-700"
                >
                  <span>
                    {item.item_name} × {item.quantity}
                  </span>
                  <span>₹{item.item_price * item.quantity}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
