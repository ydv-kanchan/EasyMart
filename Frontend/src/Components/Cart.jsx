import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const Cart = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

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

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/profile/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const addressParts = [
          data.house_no,
          data.street,
          data.landmark,
          data.city,
          data.state,
          data.country,
          data.pincode,
        ].filter(Boolean);

        const fullAddress = addressParts.join(", ");
        setDefaultAddress(fullAddress);
        setCustomerName(data.name || "");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
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
      const res = await fetch(`http://localhost:3000/api/cart/remove/${item_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const placeOrder = async () => {
    const addressToUse = useDefaultAddress ? defaultAddress : newAddress;
    if (!customerName || !addressToUse) {
      alert("Please enter your name and address.");
      return;
    }

    try {
      console.log("Data being sent to buy route");
      const res = await fetch("http://localhost:3000/api/cart/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: customerName,
          address: addressToUse,
          paymentMethod: "Cash",
          items: cartItems.map((item) => ({
            item_id: item.item_id,
            item_name: item.item_name,
            quantity: item.quantity,
            price_per_item: item.item_price,
          })),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully!");
        setCartItems([]);
        setTotalAmount(0);
        setShowModal(false);
        navigate("/home");
      } else {
        alert(data.message || data.error || "Order failed");
        
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Order could not be placed");
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUserInfo();
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center bg-gray-50 px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
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
                    aria-label={`Decrease quantity of ${item.item_name}`}
                  >
                    <IoMdRemove />
                  </button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                    onClick={() => updateQuantity(item.item_id, "increment")}
                    aria-label={`Increase quantity of ${item.item_name}`}
                  >
                    <IoMdAdd />
                  </button>
                </div>

                <button
                  className="ml-4 text-red-600 hover:text-red-800"
                  onClick={() => removeItem(item.item_id)}
                  aria-label={`Remove ${item.item_name} from cart`}
                >
                  <IoClose size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80 sticky top-24 bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Price Details</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
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
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full relative p-6">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              ✕
            </button>

            <h2
              id="modal-title"
              className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-800"
            >
              Enter Order Details
            </h2>

            {/* Order summary */}
            <div className="mb-6 bg-gray-50 p-4 rounded border max-h-40 overflow-y-auto">
              <h3 className="text-lg font-medium mb-2 text-gray-700">Order Summary</h3>
              <ul className="text-gray-700 text-sm mb-2">
                {cartItems.map((item) => (
                  <li key={item.item_id} className="flex justify-between mb-1">
                    <span>
                      {item.item_name} × {item.quantity}
                    </span>
                    <span>₹{item.item_price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-gray-900 text-base border-t pt-2">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder();
              }}
            >
              <label className="block mb-4">
                <span className="block text-gray-700 font-medium mb-1">Name</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue
                  -500"
                  required
                />
              </label>

              <fieldset className="mb-4">
                <legend className="text-gray-700 font-medium mb-2">Address</legend>

                <label className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={useDefaultAddress}
                    onChange={() => setUseDefaultAddress(true)}
                    className="mr-2"
                    name="addressOption"
                  />
                  Use default address
                </label>
                {useDefaultAddress && (
                  <p className="mb-4 p-3 bg-gray-100 rounded text-gray-600 text-sm">
                    {defaultAddress || "No address available."}
                  </p>
                )}

                <label className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!useDefaultAddress}
                    onChange={() => setUseDefaultAddress(false)}
                    className="mr-2"
                    name="addressOption"
                  />
                  Enter new address
                </label>
                {!useDefaultAddress && (
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new address"
                    rows={3}
                    required={!useDefaultAddress}
                  />
                )}
              </fieldset>

              <p className="mb-6 text-sm text-gray-600">
                Payment Method: <strong>Cash</strong> only
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !customerName || (useDefaultAddress ? !defaultAddress : !newAddress)
                  }
                  className={`px-5 py-2 rounded bg-blue-500 text-white hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed`}
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
