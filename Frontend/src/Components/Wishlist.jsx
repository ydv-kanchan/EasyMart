import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Footer from "./Footer";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    return (
      <div className="p-10 text-center text-red-500">
        You are not logged in. Please log in to continue.
      </div>
    );
  }

  useEffect(() => {
    fetch("http://localhost:3000/api/wishlistRoutes/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist);
        } else {
          setError("Failed to load wishlist.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist.");
        setLoading(false);
      });
  }, [token]);

  const handleRemoveFromWishlist = (itemId) => {
    fetch(`http://localhost:3000/api/wishlistRoutes/remove/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Item removed from wishlist") {
          setWishlist(wishlist.filter((item) => item.item_id !== itemId));
        } else {
          alert(data.message);
        }
      })
      .catch(() => alert("Something went wrong!"));
  };

  const handleAddToCart = async (itemId) => {
    try {
      const res = await fetch("http://localhost:3000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ item_id: itemId, quantity: 1 }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Item added to cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Content */}
      <div className="flex-grow p-4">
        <div className="max-w-5xl w-full mx-auto space-y-6">
          <h1 className="text-3xl font-bold  mb-6">Your Wishlist</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                Your wishlist is empty. Add some products!
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.item_id}
                  className="bg-white shadow-lg rounded-lg p-4 relative"
                >
                  {/* Remove Icon */}
                  <IoClose
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800 cursor-pointer text-xl"
                    onClick={() => handleRemoveFromWishlist(item.item_id)}
                    title="Delete"
                  />

                  {/* Product Image */}
                  <div className="flex justify-center">
                    <img
                      src={`http://localhost:3000${item.item_image}`}
                      alt={item.item_name}
                      className="w-full h-48 object-cover border-2 border-gray-200 rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold">{item.item_name}</h3>
                    <p className="text-lg text-gray-600">₹{item.item_price}</p>
                    <p className="text-sm text-gray-700">
                      {item.item_category}
                    </p>
                    <div className="mt-4 flex justify-center items-center">
                      <button
                        className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
                        onClick={() => handleAddToCart(item.item_id)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer always at the bottom */}
      <Footer />
    </div>
  );
};

export default Wishlist;
