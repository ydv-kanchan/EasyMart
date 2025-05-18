import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const VendorAnalytics = () => {
  const [ordersByCategoryData, setOrdersByCategoryData] = useState([]);
  const [salesTrendData, setSalesTrendData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("vendor_token"); // or get from cookies/headers
        const res = await fetch(
          "http://localhost:3000/api/analytics/analytics",
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();
        setOrdersByCategoryData(data.ordersByCategoryData);
        setSalesTrendData(data.salesTrendData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Orders by Category Chart */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Orders by Category</h3>
        <PieChart width={300} height={250}>
          <Pie
            dataKey="order_count"
            data={ordersByCategoryData}
            nameKey="category_name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {ordersByCategoryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
        <LineChart width={400} height={250} data={salesTrendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="total_sales" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default VendorAnalytics;
