import React from "react";
import CategoryNavbar from "./CategoryNavbar";
import Slider from "./Slider";
import TopPicks from "./TopPicks";

const Home = () => {
  return (
    <div>
      <CategoryNavbar />
      <Slider />
      <TopPicks/>
    </div>
  );
};

export default Home;
