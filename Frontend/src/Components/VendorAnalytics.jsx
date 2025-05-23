import React, { useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";
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
        const token = localStorage.getItem("vendor_token");
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

  const totalRevenue = salesTrendData.reduce(
    (sum, day) => sum + Number(day.total_sales),
    0
  );

  const totalOrders = ordersByCategoryData.reduce(
    (sum, category) => sum + Number(category.order_count),
    0
  );

  // ===== YAxis Scaling Logic =====
  const maxSales = Math.max(
    ...salesTrendData.map((item) => item.total_sales || 0)
  );
  const yAxisMax = Math.ceil(maxSales / 10000) * 10000 + 10000;
  const yAxisTicks = [];
  for (let i = 0; i <= yAxisMax; i += 25000) {
    yAxisTicks.push(i);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
              />
              <YAxis domain={[0, yAxisMax]} ticks={yAxisTicks} />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#8884d8"
                dot={{ r: 3 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Summary</h3>
        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-xl font-semibold text-green-600">
              ₹{totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
            <p className="text-xl font-semibold text-blue-600">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <p className="text-sm text-gray-500 mb-1">Profit / Loss</p>
            <p className="text-base italic text-gray-400">Data not available</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorAnalytics;
