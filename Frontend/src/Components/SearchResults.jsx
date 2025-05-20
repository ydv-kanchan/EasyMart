import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import SideFilter from "./SideProductFilter";

const SearchResults = () => {
  const { searchTerm } = useParams();
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

    let url = `http://localhost:3000/api/customerProducts/search/${searchTerm}?`;

    if (priceRange.length > 0) {
      url += `priceRange=${priceRange.join(",")}&`; // <-- join array into comma-separated string
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
  }, [searchTerm, priceRange, sortOrder]);

  if (loading)
    return <p className="text-center py-10">Searching for products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="min-h-screen">
      <div className="px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">
          Results for "{decodeURIComponent(searchTerm)}"
        </h2>
      </div>

      <div className="flex">
        <SideFilter
          priceRange={priceRange}
          sortOrder={sortOrder}
          onPriceChange={setPriceRange}
          onSortChange={setSortOrder}
          onReset={() => {
            setPriceRange([]);
            setSortOrder("");
          }}
        />

        <main className="w-full md:w-[85%] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center mt-20">
              <h3 className="text-lg text-gray-600">
                No products found for this search.
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

export default SearchResults;
