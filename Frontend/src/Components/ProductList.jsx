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
        Authorization: `Bearer ${token}`,
      },
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
    <div className="min-h-screen">
      <CategoryNavbar />

      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-700">
          {formatTitle(categoryName)} Products
        </h2>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        <aside className="w-[15%] min-h-screen p-5 border-r sticky top-0 hidden md:block overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 tracking-wide border-b pb-3">
              Refine Results
            </h3>
            <FaRedoAlt
              className="cursor-pointer text-orange-500 text-xl mt-[-10px]"
              onClick={resetFilters}
              title="Reset"
            />
          </div>

          <div className="mb-7">
            <h4 className="text-md font-semibold mb-4 text-black-700 uppercase">
              Price Range
            </h4>
            <div className="flex flex-col gap-4">
              {["₹0 - ₹500", "₹500 - ₹1000", "Above ₹1000"].map((range, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-500 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="accent-orange-400 w-4 h-4 cursor-pointer"
                    onChange={() => handlePriceChange(range)}
                    checked={priceRange.includes(range)}
                  />
                  {range}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h4 className="text-md font-semibold mb-4 text-black-700 uppercase">
              Sort By
            </h4>
            <div className="flex flex-col gap-4">
              <button
                className={`border text-gray-700 rounded px-4 py-2 text-sm transition ${
                  sortOrder === "lowToHigh"
                    ? "bg-orange-100 border-orange-400"
                    : "border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                }`}
                onClick={() => handleSortChange("lowToHigh")}
              >
                Price: Low to High
              </button>
              <button
                className={`border text-gray-700 rounded px-4 py-2 text-sm transition ${
                  sortOrder === "highToLow"
                    ? "bg-orange-100 border-orange-400"
                    : "border-orange-300 hover:bg-orange-50 hover:border-orange-400"
                }`}
                onClick={() => handleSortChange("highToLow")}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="w-full md:w-[85%] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center mt-20">
              <h3 className="text-lg text-gray-600">
                No products found in this category.
              </h3>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.item_id}
                className="bg-white border rounded-2xl p-4 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/product/${product.item_id}`)}
              >
                <img
                  src={`http://localhost:3000${product.item_image}`}
                  alt={product.item_name}
                  className="w-full h-64 object-cover rounded-xl mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-700">
                  {product.item_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  ₹{product.item_price}
                </p>
              </div>
            ))
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductList;
