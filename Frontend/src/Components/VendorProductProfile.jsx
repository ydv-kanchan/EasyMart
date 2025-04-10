import React, { useState } from "react";
import axios from "axios";

const VendorProductProfile = ({ product, onClose }) => {
  if (!product) return null;

  const [form, setForm] = useState({
    name: product.item_name || "",
    description: product.item_desc || "",
    price: product.item_price || "",
    quantity: product.item_stock || "",
    category: product.category_name || "",
    item_type: product.item_type_name || "",
    image: `http://localhost:3000${product.item_image}` || "",
    newImageFile: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        newImageFile: file,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);

      if (form.newImageFile) {
        formData.append("image", form.newImageFile);
      }

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/vendorProducts/edit-product/${product.item_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product updated successfully!");
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product.");
    }
  };

  return (
    <div style={styles.modal}>
      <h2 style={styles.title}>Edit Product</h2>
      <div style={styles.contentWrapper}>
        {/* Left: Image Section */}
        <div style={styles.leftColumn}>
          <img
            src={form.image}
            alt="Product Preview"
            style={styles.imagePreview}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
        </div>

        {/* Right: Form Section */}
        <div style={styles.rightColumn}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            style={styles.input}
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            style={styles.textarea}
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            style={styles.input}
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Stock"
            style={styles.input}
          />
          <input
            type="text"
            name="category"
            value={form.category}
            disabled
            style={styles.input}
          />
          <input
            type="text"
            name="item_type"
            value={form.item_type}
            disabled
            style={styles.input}
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button style={styles.saveButton} onClick={handleSave}>
          Save
        </button>
        <button style={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "800px",
    maxWidth: "95%",
    boxShadow: "0 5px 25px rgba(0,0,0,0.2)",
    zIndex: 1001,
    position: "relative",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
  },
  contentWrapper: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
  },
  leftColumn: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rightColumn: {
    flex: "2",
    display: "flex",
    flexDirection: "column",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "220px",
    objectFit: "contain",
    borderRadius: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  fileInput: {
    width: "100%",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#2d89ef",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#ccc",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default VendorProductProfile;
