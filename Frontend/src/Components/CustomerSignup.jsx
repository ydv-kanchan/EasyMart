import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState([]);
  const inputRefs = useRef({});

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const requiredFieldsByStep = {
    1: [
      "firstName",
      "email",
      "username",
      "password",
      "confirmPassword",
      "phone",
    ],
    2: ["houseNo", "street", "landmark", "city", "state", "country", "pincode"],
  };

  const isStepValid = () => {
    return requiredFieldsByStep[step].every((field) => {
      return !!formData[field]?.trim();
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleKeyDown = (e, field) => {
    const fieldList = getStepFields();
    const index = fieldList.indexOf(field);

    if (e.key === "Enter") {
      e.preventDefault();
      for (let i = index + 1; i < fieldList.length; i++) {
        const nextField = fieldList[i];
        if (inputRefs.current[nextField]) {
          inputRefs.current[nextField].focus();
          return;
        }
      }
      if (isStepValid() && step < 3) {
        setStep((prev) => prev + 1);
      }
    }

    if (e.key === "Backspace" && formData[field] === "") {
      for (let i = index - 1; i >= 0; i--) {
        const prevField = fieldList[i];
        if (inputRefs.current[prevField]) {
          inputRefs.current[prevField].focus();
          return;
        }
      }
    }

    if (e.key === "ArrowRight" && isStepValid() && step < 3) {
      e.preventDefault();
      setStep((prev) => prev + 1);
    }

    if (e.key === "ArrowLeft" && step > 1) {
      e.preventDefault();
      setStep((prev) => prev - 1);
    }
  };

  const nextStep = () => {
    if (!isStepValid()) {
      setErrors([`Please fill all required fields in Step ${step}`]);
      return;
    }
    setErrors([]);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await fetch(
        "http://localhost:3000/api/signup/customers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors.map((err) => err.msg));
        } else {
          setErrors([data.message || data.error || "Signup failed"]);
        }
        return;
      }
      alert("Signup successful! A verification email has been sent.");
      navigate("/");
    } catch (error) {
      setErrors(["Something went wrong. Please try again."]);
    }
  };

  const getStepFields = () => {
    if (step === 1) {
      return [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "username",
        "password",
        "confirmPassword",
        "phone",
      ];
    } else if (step === 2) {
      return [
        "houseNo",
        "street",
        "landmark",
        "city",
        "state",
        "country",
        "pincode",
      ];
    }
    return [];
  };

  useEffect(() => {
    const stepFields = getStepFields();
    setTimeout(() => {
      const firstFocusable = stepFields.find((f) => inputRefs.current[f]);
      inputRefs.current[firstFocusable]?.focus();
    }, 100);
  }, [step]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-10 transition-all">
        <h2 className="text-3xl font-bold text-center mb-6">
          {step === 1
            ? "Create Account"
            : step === 2
            ? "Address Details"
            : "Confirm Details"}
        </h2>

        {errors.length > 0 && (
          <div className="text-red-600 text-center mb-4">
            {errors.map((err, idx) => (
              <p key={idx}>{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div className="flex gap-3">
                {["firstName", "middleName", "lastName"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    ref={(el) => (inputRefs.current[field] = el)}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    value={formData[field]}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, field)}
                    className="w-1/3 p-3 border rounded-md"
                    required={field === "firstName"}
                  />
                ))}
              </div>

              {["email", "username", "password", "confirmPassword"].map(
                (field) => (
                  <input
                    key={field}
                    name={field}
                    ref={(el) => (inputRefs.current[field] = el)}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    type={field.includes("password") ? "password" : "text"}
                    value={formData[field]}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, field)}
                    className="w-full p-3 border rounded-md"
                    required
                  />
                )
              )}

              <PhoneInput
                country="in"
                value={formData.phone}
                onChange={handlePhoneChange}
                inputProps={{
                  name: "phone",
                  required: true,
                  onKeyDown: (e) => handleKeyDown(e, "phone"),
                  onFocus: (e) => (inputRefs.current["phone"] = e.target),
                }}
                inputExtraProps={{
                  ref: (el) => (inputRefs.current["phone"] = el),
                }}
                containerClass="!w-full relative"
                inputClass="!w-full !pl-16 !p-3 !h-[48px] !text-base !border !rounded-md !box-border"
                buttonStyle={{
                  borderRight: "1px solid #ccc",
                  borderRadius: "8px 0 0 8px",
                  height: "48px",
                  backgroundColor: "white",
                  padding: "0 8px",
                  zIndex: 2,
                }}
                dropdownStyle={{
                  top: "auto",
                  bottom: "calc(100% + 4px)",
                  left: "0",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 3,
                }}
              />
            </>
          )}

          {step === 2 && (
            <>
              {[
                "houseNo",
                "street",
                "landmark",
                "city",
                "state",
                "country",
                "pincode",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  ref={(el) => (inputRefs.current[field] = el)}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={formData[field]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  className="w-full p-3 border rounded-md"
                  required
                />
              ))}
            </>
          )}

          {step === 3 && (
            <div className="text-center">
              <p className="text-lg font-medium mb-3">
                Please review your information:
              </p>
              <pre className="text-left text-sm bg-gray-100 p-4 rounded-md max-h-48 overflow-auto">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Finish
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;
