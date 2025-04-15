import React from "react";
import CategoryNavbar from "./CategoryNavbar";
import Slider from "./Slider";
import TopPicks from "./TopPicks";
import Footer from "./Footer";

const Home = () => {
  return (
    <div>
      <CategoryNavbar />
      <Slider />
      <TopPicks/>
      <Footer />
    </div>
  );
};

export default Home;
