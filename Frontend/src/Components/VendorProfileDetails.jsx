import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { PiLockKeyLight } from "react-icons/pi";
import axios from "axios";

const VendorProfileDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    username: "",
    phone: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/profile/vendor",
          {
            withCredentials: true,
          }
        );
        setFormData(res.data);
        setOriginalEmail(res.data.email);
      } catch (err) {
        console.error("Error fetching vendor profile:", err);
      }
    };

    fetchVendor();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailChanged(value !== originalEmail);
    }
  };

  const inputBox = (label, name, value) => (
    <div className="flex flex-col gap-1 w-full">
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
            value={value}
            onChange={handleChange}
            className="bg-transparent text-gray-500 w-full text-right outline-none cursor-text"
          />
        ) : (
          <span className="text-gray-800 text-right w-full">{value}</span>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full bg-white shadow-md rounded-2xl flex flex-col justify-between"
    >
      <h2 className="text-2xl font-bold text-gray-800 px-8 pt-8 mb-4">
        Vendor Profile
      </h2>

      <div className="flex-grow text-gray-800 text-[16px] px-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 mb-6">
          {inputBox("First Name", "first_name", formData.first_name)}
          {inputBox("Middle Name", "middle_name", formData.middle_name)}
          {inputBox("Last Name", "last_name", formData.last_name)}
        </div>

        <div className="mb-6">{inputBox("Email", "email", formData.email)}</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          {inputBox("Username", "username", formData.username)}
          {inputBox("Phone", "phone", formData.phone)}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between px-8 pb-8 mt-4 w-full">
        {editMode ? (
          <div className="flex justify-end w-full">
            <button
              onClick={() => {
                alert("Changes saved (UI only)");
                setEditMode(false);
              }}
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
              onClick={() => alert("Change Password")}
              className="w-[30%] py-3 text-lg font-semibold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <PiLockKeyLight className="text-xl" />
              Change Password
            </button>

            <button
              onClick={() => alert("Delete Account")}
              className="w-[30%] py-3 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 hover:shadow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiTrash2 className="text-xl" />
              Delete Account
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default VendorProfileDetails;
