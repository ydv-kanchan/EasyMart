import React, { useEffect, useState } from "react";
import axios from "axios";

const ShopDetails = () => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:3000/api/shopDetails/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setShop(res.data);
      })
      .catch((err) => {
        console.error("Error fetching shop details:", err);
      });
  }, []);

  if (!shop) return <div>Loading...</div>;

  return (
    <div className="bg-white p-2 rounded-l shadow flex items-center gap-5 h-[3cm] mb-4">
      <div className="min-w-[80px] min-h-[80px]">
        <img
          src={`http://localhost:3000${shop.logo}`}
          alt="Shop Logo"
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{shop.name}</h2>
        <p className="text-gray-600 text-sm max-w-md">{shop.description}</p>
      </div>
    </div>
  );
};

export default ShopDetails;
