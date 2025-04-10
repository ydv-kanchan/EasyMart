import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
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
      const res = await axios.get("http://localhost:3000/api/vendorProducts/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    fetchProducts(); // Refresh product list after edit
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div style={styles.outerContainer}>
      {showModal && (
        <div style={styles.backdrop}>
          <VendorProductProfile product={selectedProduct} onClose={handleModalClose} />
        </div>
      )}
      <div style={styles.app}>
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">My Products</h2>
        {products.length === 0 ? (
          <div style={styles.emptyMessageContainer}>
            <p style={styles.emptyMessageText}>You haven’t added any products yet.</p>
            <p>Start listing items and grow your store!</p>
            <button
              style={styles.addButton}
              onClick={() => window.location.href = "/add-product"}
            >
              Add a Product
            </button>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {products.map((product) => (
              <div key={product.item_id} style={styles.productCard}>
                <img
                  src={`http://localhost:3000${product.item_image}`}
                  alt={product.item_name}
                  style={styles.productImage}
                />
                <h3 style={styles.productBrand}>{product.category_name}</h3>
                <p style={styles.productName}>{product.item_name}</p>
                <p style={styles.itemType}>Type: {product.item_type_name}</p>
                <div style={styles.price}>₹ {product.item_price}</div>
                <div style={styles.stock}>Stock: {product.item_stock}</div>
                <div style={styles.iconWrapper}>
                  <FaEdit
                    style={styles.icon}
                    onClick={() => handleEditClick(product)}
                    title="Edit"
                  />
                  <FaTrash
                    style={{ ...styles.icon, color: "#c0392b" }}
                    onClick={() => handleDeleteClick(product.item_id)}
                    title="Delete"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  app: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "85%",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    textAlign: "center",
    marginTop: "30px",
    color: "#333",
  },
  productGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "30px",
    marginTop: "20px",
  },
  productCard: {
    width: "280px",
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    textAlign: "center",
    padding: "20px",
    height: "360px",
    position: "relative",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  productImage: {
    width: "100%",
    height: "160px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  productBrand: {
    fontSize: "15px",
    margin: "5px 0",
    color: "#444",
  },
  productName: {
    fontSize: "16px",
    color: "black",
    fontWeight: "bold",
    margin: "5px 0",
  },
  itemType: {
    fontSize: "14px",
    color: "#777",
    margin: "5px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "4px",
  },
  stock: {
    fontSize: "14px",
    color: "#2c3e50",
    fontWeight: "500",
    marginBottom: "10px",
  },
  iconWrapper: {
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    gap: "10px",
  },
  icon: {
    cursor: "pointer",
    color:"#6b7280",
    fontSize: "15px",
  },
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  emptyMessageContainer: {
    textAlign: "center",
    marginTop: "250px",
  },
  emptyMessageText: {
    fontSize: "26px",
    color: "#555",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  addButton: {
    padding: "15px 30px",
    backgroundColor: "#60a5fa",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "18px",
    marginTop: "20px",
  },
};

export default VendorProductList;
