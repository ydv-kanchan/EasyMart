import React from "react";
import CategoryNavbar from "./CategoryNavbar";
import Slider from "./Slider";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <CategoryNavbar />
      <Slider />
      <Link to="/add-product"> add button</Link>
    </div>
  );
};

export default Home;
