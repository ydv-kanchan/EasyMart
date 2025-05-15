import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import CategoryNavbar from "./CategoryNavbar";
import { FaRedoAlt } from "react-icons/fa";

const ProductList = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please log in to continue.");
      setLoading(false);
      return;
    }

    let url = `http://localhost:3000/api/customerProducts/category/${categoryName}?`;

    if (priceRange.length > 0) {
      url += `priceRange=${priceRange.join(",")}&`;
    }
    if (sortOrder) {
      url += `sortOrder=${sortOrder}&`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      });
  }, [categoryName, priceRange, sortOrder]);

  const handlePriceChange = (range) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const resetFilters = () => {
    setPriceRange([]);
    setSortOrder("");
  };

  const formatTitle = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="min-h-screen p-6 space-y-6">
      
      <h2 className="text-2xl font-bold text-gray-800">
        {formatTitle(categoryName)} Products
      </h2>

      
      {products.length === 0 ? (
        <div className="text-center mt-20">
          <h3 className="text-lg text-gray-600">No products found in this category.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-32">
          {products.map((product) => (
            <div
              key={product.item_id}
              className="bg-white border rounded-2xl p-4 shadow hover:shadow-md transition"
              onClick={() => navigate(`/product/${product.item_id}`)}
            >
              <img
                src={`http://localhost:3000${product.item_image}`}
                alt={product.item_name}
                className="w-full h-64 object-cover rounded-xl mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-700">{product.item_name}</h3>
              <p className="text-sm text-gray-500 mt-1">₹{product.item_price}</p>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
