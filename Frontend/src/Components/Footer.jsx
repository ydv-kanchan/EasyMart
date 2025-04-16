import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <footer className="bg-blue-50 text-gray-800 py-10 px-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8">
        <div className="min-w-[200px] flex-1 mb-6">
          <h4 className="font-semibold text-lg mb-4">EXPLORE</h4>
          <ul className="space-y-2">
            <li
              className="cursor-pointer hover:text-blue-700"
              onClick={() => navigateToCategory("Fashion")}
            >
              Fashion
            </li>
            <li
              className="cursor-pointer hover:text-blue-700"
              onClick={() => navigateToCategory("Beauty")}
            >
              Beauty
            </li>
            <li
              className="cursor-pointer hover:text-blue-700"
              onClick={() => navigateToCategory("Home")}
            >
              Home
            </li>
            <li
              className="cursor-pointer hover:text-blue-700"
              onClick={() => navigateToCategory("Toys")}
            >
              Toys
            </li>
          </ul>
        </div>

        <div className="min-w-[200px] flex-1 mb-6">
          <h4 className="font-semibold text-lg mb-4">EASYMART</h4>
          <ul className="space-y-2">
            <li
              className="cursor-pointer hover:text-blue-700"
              onClick={() => navigate("/about")}
            >
              About Us
            </li>
            <li className="cursor-pointer hover:text-blue-700">
              Customer Support
            </li>
            <li className="cursor-pointer hover:text-blue-700">
              Secure Shopping
            </li>
          </ul>
        </div>

        {!isSmallScreen && (
          <div className="min-w-[200px] flex-1 mb-6">
            <h4 className="font-semibold text-lg mb-4">CONNECT WITH US</h4>
            <div className="flex gap-6 text-2xl">
              <a
                href="https://www.facebook.com"
                className="hover:text-blue-700"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com"
                className="hover:text-blue-700"
              >
                <FaInstagram />
              </a>
              <a href="https://www.twitter.com" className="hover:text-blue-700">
                <FaTwitter />
              </a>
              <a
                href="mailto:support@ecoconcious.com"
                className="hover:text-blue-700"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        )}

        {!isSmallScreen && (
          <div className="min-w-[200px] flex-1 mb-6">
            <h4 className="font-semibold text-lg mb-4">CONTACT US</h4>
            <p className="mb-1">Call: +1 (800) 123 4567</p>
            <p className="mb-1">Email: support@easymart.com</p>
            <p>Hours: Mon–Fri, 10 AM – 6 PM</p>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
