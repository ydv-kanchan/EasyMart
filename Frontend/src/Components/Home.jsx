import React from "react";
import CategoryNavbar from "./CategoryNavbar";
import Slider from "./Slider";
import Navbar2 from "./Navbar2";

const Home = () => {
  return (
    <div>
      <Navbar2 />
      <CategoryNavbar />
      <Slider />
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
