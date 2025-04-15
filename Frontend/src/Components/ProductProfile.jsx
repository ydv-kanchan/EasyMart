import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";

const ProductProfile = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/customerProducts/item/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        const res = await fetch("http://localhost:3000/api/wishlist/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const isInWishlist = data.wishlist.some((item) => item.item_id == id); // Check for item_id
        setWishlisted(isInWishlist);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    };

    fetchProduct();
    checkWishlist();
  }, [id, token]);

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

  if (!token) {
    return (
      
      <div className="p-10 text-center text-red-500">
        You are not logged in. Please log in to continue.
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row max-w-5xl w-full gap-10 bg-white shadow-lg rounded-lg p-8">
        <div className="flex-1 flex justify-center items-center">
          <img
            src={`http://localhost:3000${product.item_image}`}
            alt={product.item_name}
            className="w-full max-w-md h-[57vh] object-cover border-2 border-gray-200 rounded"
          />
        </div>

        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold">{product.item_name}</h1>
          <p className="text-2xl text-red-600">₹{product.item_price}</p>
          <p className="text-gray-700">{product.item_description}</p>

          <p>
            <strong>Category:</strong> {product.item_category}
          </p>
          <p>
            <strong>Stock:</strong>{" "}
            {product.item_stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <div className="flex gap-4">
            <button
              className="bg-blue-400 text-white px-6 py-3 mt-4 rounded hover:bg-blue-800 transition"
              onClick={() => alert("Add to cart functionality coming soon!")}
            >
              Add to Cart
            </button>
            <button
              className={`${
                wishlisted ? "bg-red-500" : "bg-blue-400"
              } text-white px-6 py-3 mt-4 rounded hover:opacity-90 transition`}
              onClick={handleAddToWishlist}
              disabled={wishlisted}
            >
              {wishlisted ? "Wishlisted ❤️" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ProductProfile;
