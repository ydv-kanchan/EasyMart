import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    item_type: "",
    quantity: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:3000/api/vendorProducts/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error("Error fetching categories:", err));
  }, [token]);

  useEffect(() => {
    if (form.category) {
      axios
        .get(`http://localhost:3000/api/vendorProducts/item-types/${form.category}`)
        .then((res) => setItemTypes(res.data.itemTypes))
        .catch((err) => console.error("Error fetching item types:", err));
    } else {
      setItemTypes([]);
    }
  }, [form.category]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!token) return alert("You must be logged in");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("category", form.category);
    formData.append("item_type", form.item_type);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:3000/api/vendorProducts/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product added successfully!");
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        item_type: "",
        quantity: "",
      });
      setImage(null);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-blue-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Add New Product
        </h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <select
          name="item_type"
          value={form.item_type}
          onChange={handleChange}
          required
          className="w-full mb-4 p-3 border border-blue-300 rounded-lg"
        >
          <option value="">Select Item Type</option>
          {itemTypes.map((type) => (
            <option key={type.item_type_id} value={type.item_type_id}>
              {type.item_type_name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full mb-6"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
