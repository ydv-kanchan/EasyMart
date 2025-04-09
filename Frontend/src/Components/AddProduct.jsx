import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/vendor/categories")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    for (let key in form) productData.append(key, form[key]);
    if (image) productData.append("image", image);

    try {
      await axios.post("/api/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-blue-200"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">Add New Product</h2>

        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          rows={4}
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          name="category"
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full mb-6 text-blue-600"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
