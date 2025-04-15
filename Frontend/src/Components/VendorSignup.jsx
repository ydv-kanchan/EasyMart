import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VendorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone: "",
    businessName: "",
    storeName: "",
    storeDescription: "",
    storeLogo: null,
    productCategories: [],
  });

  const categories = ["Fashion", "Beauty", "Toys", "Home"];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      const updated = prev.productCategories.includes(category)
        ? prev.productCategories.filter((c) => c !== category)
        : [...prev.productCategories, category];
      return { ...prev, productCategories: updated };
    });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      // Append form data fields
      payload.append("first_name", formData.first_name);
      payload.append("middle_name", formData.middle_name);
      payload.append("last_name", formData.last_name);
      payload.append("email", formData.email);
      payload.append("username", formData.username);
      payload.append("password", formData.password);
      payload.append("phone", formData.phone);
      payload.append("businessName", formData.businessName);
      payload.append("storeName", formData.storeName);
      payload.append("storeDescription", formData.storeDescription);
      if (formData.storeLogo) {
        payload.append("storeLogo", formData.storeLogo);
      }
      formData.productCategories.forEach((cat) =>
        payload.append("productCategories[]", cat)
      );

      const response = await axios.post(
        "http://localhost:3000/api/signup/vendors",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Signup successful! Verification email sent.");
      } else {
        alert(response.data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      navigate("/");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          {step === 1
            ? "Personal Info"
            : step === 2
            ? "Business & Store Info"
            : "Product Categories"}
        </h2>

        {errors.length > 0 && (
          <div className="text-red-500 mb-4 text-center">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {step === 1 && (
            <>
              <input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="middle_name"
                placeholder="Middle Name"
                value={formData.middle_name}
                onChange={handleChange}
                className="p-3 border rounded"
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
            </>
          )}

          {step === 2 && (
            <>
              <input
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                name="storeName"
                placeholder="Store Name"
                value={formData.storeName}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <textarea
                name="storeDescription"
                placeholder="Store Description"
                value={formData.storeDescription}
                onChange={handleChange}
                required
                className="p-3 border rounded"
              />
              <input
                type="file"
                name="storeLogo"
                onChange={handleChange}
                className="p-3 border rounded"
              />
            </>
          )}

          {step === 3 && (
            <>
              <p className="font-medium mb-2">Select Product Categories:</p>
              {categories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.productCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
