import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopPicks = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust key name if different

    axios
      .get('http://localhost:3000/api/customerProducts/top-picks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("in toppicks");
        console.log(res);
        setCategories(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch top picks:', err);
      });
  }, []);

  return (
    <div className="h-[calc(100vh-85px)] flex flex-col md:flex-row justify-between p-4 gap-4 bg-gray-100 mb-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className="bg-white shadow-md w-full md:w-1/3 p-4 flex flex-col"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold md:text-3xl">{category.title}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {category.items.map((item, i) => (
              <div
                key={i}
                className="border border-gray-300 p-2 flex flex-col items-center text-center hover:shadow-md transition h-full"
                onClick={() => navigate(`/product/${item.item_id}`)}
              >
                <img
                  src={`http://localhost:3000${item.img}`}
                  alt={item.name}
                  className="w-full object-cover h-48"
                />
                <p className="text-m font-medium text-gray-700 mt-2">{item.name}</p>
                <p className="text-m font-medium text-gray-700 mt-2">{item.price}</p>
                {/* <p className="text-green-600 text-xs">{item.sub}</p> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopPicks;
