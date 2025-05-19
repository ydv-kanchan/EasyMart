import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VendorSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

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
    setErrors([]);
    setSuccessMsg("");
    try {
      const payload = new FormData();
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

      // Backend returns status 201 on success
      if (response.status === 201) {
        setSuccessMsg(response.data.message || "Signup successful! Verification email sent.");
        setErrors([]);
        // Optionally reset form or redirect user after success
        // navigate("/login"); // or another route
      } else {
        // Handle unexpected success status
        setErrors([response.data.message || "Signup failed"]);
      }
    } catch (err) {
      if (err.response) {
        // Backend responded with error status code
        const data = err.response.data;
        if (data.errors) {
          // If validation errors array is sent
          setErrors(data.errors.map((err) => err.msg));
        } else if (data.message) {
          setErrors([data.message]);
        } else if (data.error) {
          setErrors([data.error]);
        } else {
          setErrors(["Signup failed due to unknown error"]);
        }
      } else {
        // Network or other errors
        setErrors(["Something went wrong. Please try again."]);
      }
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

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="text-red-600 mb-4 text-center">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="text-green-600 mb-4 text-center font-semibold">
            {successMsg}
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
                className="p-3 border rounded"
                rows={4}
              />
              <input
                type="file"
                name="storeLogo"
                onChange={handleChange}
                accept="image/*"
                className="p-3 border rounded"
              />
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-2">
              <p>Select Product Categories:</p>
              <div className="flex gap-4 flex-wrap">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
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
