import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductList = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/customerProducts/category/${categoryName}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data in product list");
        console.log(data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
        setLoading(false);
      });
  }, [categoryName]);

  const formatTitle = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">
        {formatTitle(categoryName)} Products
      </h2>

      {/* Product Grid */}
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
    </div>
  );
};

export default ProductList;
