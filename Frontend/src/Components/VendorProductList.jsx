import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import VendorProductProfile from "./VendorProductProfile";

const VendorProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:3000/api/vendorProducts/my-products",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/vendorProducts/delete-product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.item_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setShowModal(false);
    fetchProducts();
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">Error loading products: {error.message}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <VendorProductProfile product={selectedProduct} onClose={handleModalClose} />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <button
          onClick={() => window.location.href = "/add-product"}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition-all"
        >
          <FiPlus className="text-lg" />
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center mt-40">
          <h3 className="text-xl font-semibold text-gray-600 mb-2">You haven't added any products yet.</h3>
          <p className="text-gray-500">Start listing items and grow your store!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.item_id}
              className="relative bg-white border rounded-2xl p-4 shadow hover:shadow-md transition w-full"
            >
              <img
                src={`http://localhost:3000${product.item_image}`}
                alt={product.item_name}
                className="w-full h-64 object-cover rounded-xl mb-3"
              />
              {/* <h3 className="text-sm font-semibold text-gray-600 mb-1">{product.category_name}</h3> */}
              <p className="text-lg font-bold text-gray-800">{product.item_name}</p>
              {/* <p className="text-sm text-gray-500 mb-1">Type: {product.item_type_name}</p> */}
              <p className="text-md font-semibold text-gray-700 mb-1">₹ {product.item_price}</p>
              {/* <p className="text-sm text-blue-700 font-medium">Stock: {product.item_stock}</p> */}

              {/* Icons */}
              <div className="absolute top-3 right-3 flex gap-3">
                <FaEdit
                  className="text-gray-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => handleEditClick(product)}
                  title="Edit"
                />
                <FaTrash
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDeleteClick(product.item_id)}
                  title="Delete"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProductList;
