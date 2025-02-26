import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    businessName: "",
    businessType: "",
    businessRegNo: "",
    businessAddress: "",
    website: "",
    storeName: "",
    storeDescription: "",
    storeLogo: null,
    storeBanner: null,
    productCategories: "",
    shippingPolicy: "",
    returnPolicy: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleSubmit = (e) => e.preventDefault();

  const stepTitles = [
    "Basic Information",
    "Business Details",
    "Store Details",
    "Product Categories",
    "Shipping & Returns",
    "Confirm Details",
  ];

  const inputFields = {
    1: ["fullName", "email", "phone", "password", "confirmPassword"],
    2: [
      "businessName",
      "businessType",
      "businessRegNo",
      "businessAddress",
      "website",
    ],
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-orange-50 to-orange-100 text-gray-900 p-6">
      <div
        className={`bg-white flex flex-col w-full shadow-xl rounded-2xl p-10 relative transition-all duration-300 transform hover:scale-[1.02] ${
          step === 6 ? "max-w-lg min-h-[500px]" : "max-w-2xl min-h-[550px]"
        }`}
      >
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-5">
          {stepTitles[step - 1]}
        </h2>

        {/* Step Indicators */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-5">
            {[...Array(6)].map((_, num) => (
              <div
                key={num}
                className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  step > num
                    ? "bg-orange-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {num + 1}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {inputFields[step] &&
            inputFields[step].map((field) => (
              <input
                key={field}
                type={field.includes("password") ? "password" : "text"}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
            ))}

          {step === 1 && (
            <>
              <div className="flex justify-end mt-auto">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  Next
                </button>
              </div>

              <div className="flex items-center my-3">
                <hr className="flex-grow border-gray-300" />
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Signup Button */}
              <button className="w-full border border-gray-400 py-3 flex items-center justify-center gap-3 rounded-lg hover:bg-gray-100 transition transform hover:scale-105 text-lg font-medium">
                <FcGoogle className="text-2xl" />
                <span className="text-gray-700">Signup with Google</span>
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="text"
                name="storeName"
                placeholder="Store Name"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
              <textarea
                name="storeDescription"
                placeholder="Store Description"
                value={formData.storeDescription}
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
              <input
                type="file"
                name="storeLogo"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
              <input
                type="file"
                name="storeBanner"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
              />
            </>
          )}

          {step === 4 && (
            <textarea
              name="productCategories"
              placeholder="Main Product Categories"
              value={formData.productCategories}
              onChange={handleChange}
              className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
              required
            />
          )}

          {step === 5 && (
            <>
              <textarea
                name="shippingPolicy"
                placeholder="Shipping Policy"
                value={formData.shippingPolicy}
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
              <textarea
                name="returnPolicy"
                placeholder="Return & Refund Policy"
                value={formData.returnPolicy}
                onChange={handleChange}
                className="w-full p-3 border mb-3 rounded-md focus:ring-2 focus:ring-green-400 transition-all"
                required
              />
            </>
          )}

          {step === 6 && (
            <>
              {Object.entries(formData)
                .slice(0, 6)
                .map(([key, value]) => (
                  <p key={key} className="text-gray-700">
                    <strong>{key.replace(/([A-Z])/g, " $1").trim()}:</strong>{" "}
                    {value}
                  </p>
                ))}
            </>
          )}

          <div className="flex justify-between mt-auto">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
              >
                Back
              </button>
            )}

            {step > 1 && step < 6 && (
              <button
                type="button"
                onClick={nextStep}
                className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Next
              </button>
            )}

            {step === 6 && (
              <button
                type="submit"
                className="bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;
