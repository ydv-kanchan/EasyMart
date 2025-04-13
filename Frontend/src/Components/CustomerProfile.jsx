import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { PiLockKeyLight } from "react-icons/pi";
import ChangePassword from "./ChangePassword";

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [emailChanged, setEmailChanged] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile/customer", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        setFormData(res.data);
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Track if email is changed
    if (name === "email" && value !== user.email) {
      setEmailChanged(true);
    } else if (name === "email") {
      setEmailChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:3000/api/profile/customer/update",
        formData,
        { withCredentials: true }
      );

      if (res.data?.requiresVerification) {
        alert(
          "Verification email sent to the new email address. Please verify to complete the change."
        );
        setEditMode(false);
        return;
      }

      alert("Details updated successfully");
      window.location.reload();
    } catch (err) {
      if (err.response?.data?.errors) {
        const errObj = {};
        err.response.data.errors.forEach((e) => {
          errObj[e.path] = e.msg;
        });
        setErrors(errObj);
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  if (!user)
    return <div className="text-gray-600 text-sm mt-10">Loading...</div>;

  const formattedPhone = user.phone.replace(/^(\+\d{1,4})(\d{5,})$/, "$1 - $2");

  const inputBox = (label, name, value) => (
    <div className="flex flex-col gap-1">
      {errors[name] && (
        <div className="text-red-600 text-sm -mb-1">{errors[name]}</div>
      )}
      <div
        className="bg-blue-50 shadow-sm px-4 py-3 border-b-2 border-blue-300 flex justify-between items-center w-full cursor-text"
        onClick={() => document.getElementById(name)?.focus()}
      >
        <label
          htmlFor={name}
          className="font-medium text-gray-600 mr-4 w-[40%]"
        >
          {label}:
        </label>
        {editMode ? (
          <input
            type="text"
            name={name}
            id={name}
            value={formData[name] || ""}
            onChange={handleChange}
            className="bg-transparent text-gray-500 w-full text-right outline-none cursor-text"
          />
        ) : (
          <span className="text-gray-800 text-right w-full">{value}</span>
        )}
      </div>
    </div>
  );

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      )
    )
      return;

    try {
      await axios.delete("http://localhost:3000/api/profile/delete", {
        withCredentials: true,
      });

      alert("Account deleted successfully.");
      window.location.href = "/"; // or redirect to login/home
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Error deleting account. Please try again later.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full bg-white shadow-md rounded-2xl flex flex-col justify-between"
    >
      <h2 className="text-2xl font-bold text-gray-800 px-8 pt-8 mb-4">
        Profile
      </h2>

      {showChangePassword ? (
        <div className="px-8 pb-8">
          <ChangePassword
            role="customer"
            onClose={() => setShowChangePassword(false)}
          />
        </div>
      ) : (
        <>
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 text-[16px] px-8 pb-4">
            {inputBox("First Name", "first_name", user.first_name)}
            {inputBox("Middle Name", "middle_name", user.middle_name || "")}
            {inputBox("Last Name", "last_name", user.last_name || "")}
            {inputBox("Username", "username", user.username)}
            {inputBox("Email", "email", user.email)}
            {inputBox("Phone", "phone", formattedPhone)}
            {inputBox("House No", "house_no", user.house_no)}
            {inputBox("Street", "street", user.street)}
            {inputBox("Landmark", "landmark", user.landmark)}
            {inputBox("City", "city", user.city)}
            {inputBox("State", "state", user.state)}
            {inputBox("Country", "country", user.country)}
            {inputBox("Pincode", "pincode", user.pincode)}
          </div>

          <div className="flex justify-between px-8 pb-8 mt-4 w-full">
            {editMode ? (
              <div className="flex justify-end w-full">
                <button
                  onClick={handleSave}
                  disabled={false}
                  className={`w-[30%] py-3 text-lg font-semibold ${
                    emailChanged
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white rounded-lg hover:shadow transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  {emailChanged ? "Save & Verify Email" : "Save Changes"}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="w-[30%] py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiEdit className="text-xl" />
                  Edit Details
                </button>

                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-[30%] py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <PiLockKeyLight className="text-xl" />
                  Change Password
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-[30%] py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiTrash2 className="text-xl" />
                  Delete Account
                </button>
              </>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CustomerProfile;
