import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const ProductProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user info for modal address/name
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

  useEffect(() => {
    if (!token) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/customerProducts/item/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    const checkWishlist = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/wishlistRoutes/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const isInWishlist = data.wishlist.some((item) => item.item_id === id);
        setWishlisted(isInWishlist);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };

    fetchProduct();
    checkWishlist();
    fetchUserInfo();
  }, [id, token]);

  // Handle Add to Wishlist
  const handleAddToWishlist = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/wishlistRoutes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: id }),
      });

      const data = await res.json();

      if (res.ok) {
        setWishlisted(true);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to wishlist");
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: id, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartUpdated(true);
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  // On Buy Now click -> open modal instead of direct order
  const handleBuyNow = () => {
    setShowModal(true);
  };

  // Place order from modal form
  const placeOrder = async () => {
    const addressToUse = useDefaultAddress ? defaultAddress : newAddress;
    if (!customerName || !addressToUse) {
      alert("Please enter your name and address.");
      return;
    }

    try {
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
          items: [
            {
              item_id: id,
              item_name:product.item_name,
              quantity: 1,
              price_per_item: product.item_price,
            },
          ],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully!");
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

  if (!token) {
    return (
      <div className="p-10 text-center text-red-500">
        You are not logged in. Please log in to continue.
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
        <div className="flex flex-col md:flex-row max-w-5xl w-full gap-10 bg-white shadow-lg rounded-lg p-8 relative">
          <div className="flex-1 flex justify-center items-center">
            <img
              src={`http://localhost:3000${product.item_image}`}
              alt={product.item_name}
              className="w-full max-w-md h-[57vh] object-cover border-2 border-gray-200 rounded"
            />
          </div>

          <div className="flex-1 space-y-6">
            {/* Title + Close button container */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{product.item_name}</h1>
              <button
                onClick={() => {
                 
                    navigate(-1);
                }}
                aria-label="Back to category"
                className="text-3xl font-bold text-gray-700 hover:text-gray-900"
                style={{ lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <p className="text-2xl text-red-600">₹{product.item_price}</p>
            <p className="text-gray-700">{product.item_description}</p>

            <p>
              <strong>Category:</strong> {product.item_category}
            </p>
            <p>
              <strong>Stock:</strong>{" "}
              {product.item_stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-3 mt-4 rounded hover:bg-blue-800 transition"
                onClick={handleBuyNow}
                disabled={product.item_stock <= 0}
              >
                Buy Now
              </button>

              <button
                className="bg-blue-500 text-white px-6 py-3 mt-4 rounded hover:bg-blue-800 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className={`${
                  wishlisted ? "bg-red-500" : "bg-blue-500"
                } text-white px-6 py-3 mt-4 rounded hover:opacity-90 transition`}
                onClick={handleAddToWishlist}
                disabled={wishlisted}
              >
                {wishlisted ? "Wishlisted ❤️" : "Add to Wishlist"}
              </button>
            </div>

            {cartUpdated && (
              <div className="mt-4 text-blue-500">Item added to cart!</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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
              <h3 className="text-lg font-medium mb-2 text-gray-700">
                Order Summary
              </h3>
              <ul className="text-gray-700 text-sm mb-2">
                <li className="flex justify-between mb-1">
                  <span>{product.item_name} × 1</span>
                  <span>₹{product.item_price}</span>
                </li>
              </ul>
              <div className="flex justify-between font-semibold text-gray-900 text-base border-t pt-2">
                <span>Total</span>
                <span>₹{product.item_price}</span>
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
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="Enter delivery address"
                    rows={3}
                    required={!useDefaultAddress}
                  />
                )}
              </fieldset>
              <p className="mb-6 text-sm text-gray-600">
                Payment Method: <strong>Cash</strong> only
              </p>

              <button
                type="submit"
                className="bg-blue-500 w-full text-white py-3 rounded hover:bg-blue-800 transition"
              >
                Confirm Order
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductProfile;
