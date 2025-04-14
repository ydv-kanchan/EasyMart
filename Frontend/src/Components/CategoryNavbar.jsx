import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const categories = [
  {
    name: "Fashion",
    imageUrl:
      "https://tse4.mm.bing.net/th?id=OIP.K3c4tvaBtVBg5JvI8wlouAHaHG&pid=Api&P=0&h=180",
  },
  {
    name: "Beauty",
    imageUrl:
      "https://tse1.mm.bing.net/th?id=OIP.gUbSbTAAVGz3Qx0YSjJYLgHaHY&pid=Api&P=0&h=180",
  },
  {
    name: "Home",
    imageUrl:
      "https://tse4.mm.bing.net/th?id=OIP.Jt3ihnashSF_wVk3dPCdTQHaHa&pid=Api&P=0&h=180",
  },
  {
    name: "Toy",
    imageUrl:
      "https://tse2.mm.bing.net/th?id=OIP.ehZ02Kph9MbCm1uzewLZXQAAAA&pid=Api&P=0&h=180",
  },
];

const CategoryNavbar = () => {
  return (
    <div className="bg-gray-100 py-2 flex justify-center">
      <div className="bg-white w-[99%] py-4 shadow-md">
        <div className="flex justify-center items-center gap-10">
          {categories.map((category, index) => (
            <React.Fragment key={index}>
              <Link to={`/products/${category.name.toLowerCase()}`}>
                <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                  <div className="w-20 h-20 bg-white overflow-hidden shadow-m">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-m font-medium text-gray-700 mt-2">
                    {category.name}
                  </span>
                </div>
              </Link>

              {/* Vertical Divider (except after last item) */}
              {index !== categories.length - 1 && (
                <div className="w-px h-20 bg-gray-300 self-center"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;
