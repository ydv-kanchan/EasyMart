import React from "react";
import ShopDetails from "./ShopDetails";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <ShopDetails />
      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          📈 Analytics & Trends
        </h2>
        <p className="text-gray-600">
          Charts like orders by category and sales trend visualization.
        </p>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          🕒 Recent Orders
        </h2>
        <p className="text-gray-600">
          List of your latest orders will appear here.
        </p>
      </section>

      {/* Customer Feedback */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          💬 Customer Feedback
        </h2>
        <p className="text-gray-600">
          Reviews and ratings from customers on your products.
        </p>
      </section>
    </div>
  );
};

export default Dashboard;
