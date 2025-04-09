import React, { useEffect, useState } from "react";
import axios from "axios";


const VendorProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/api/vendorProducts/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <div style={styles.outerContainer}>
      <div style={styles.app}>
        <h2>My Product</h2>
        <div style={styles.productGrid}>
          {products.length === 0 ? (
            <p>You haven't added any products yet.</p>
          ) : (
            products.map((product) => (
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  outerContainer: {
    backgroundColor: "#f9f9f9",
  },
  app: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    width: "80%",
    margin: "0 auto",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1450px",
    margin: "0 auto",
  },
  productCard: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    overflow: "hidden",
    textAlign: "center",
    padding: "30px",
    height: "330px",
    transition: "box-shadow 0.3s ease",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    paddingBottom: "40px",
  },
  productImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "8px",
  },
  productBrand: {
    fontSize: "16px",
    margin: "10px 0",
    color: "#333",
  },
  productName: {
    fontSize: "16px",
    color: "black",
    margin: "5px 0",
    fontWeight: "700",
  },
  itemType: {
    fontSize: "14px",
    color: "#777",
    margin: "5px 0",
  },
  price: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#777",
  },
};

export default VendorProductList;
