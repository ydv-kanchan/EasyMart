import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    sideImage:
      "https://www.pngmart.com/files/17/Surprised-Woman-Model-PNG-Image.png",
    title: "Mega Deals Are Live!",
    subtitle:
      "Unbeatable prices on fashion, electronics & more — Limited time only!",
    button: "Grab the Deals",
  },
  {
    id: 2,
    sideImage:
      "https://www.tranquilitymarketing.co.uk/wp-content/uploads/2023/03/e-commerce-girl.png",
    title: "All-in-One Shopping Hub",
    subtitle: "Explore top categories, seamless payments & next-day delivery.",
    button: "Start Shopping",
  },
  {
    id: 3,
    sideImage:
      "https://pnghq.com/wp-content/uploads/2023/02/business-man-and-woman-png-7109.png",
    title: "Become a Seller Today",
    subtitle:
      "Join 10K+ sellers growing their business online. Hassle-free onboarding!",
    button: "Start Selling",
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(nextSlide, 2000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex]);

  return (
    <div className="bg-white p-3">
      <div
        className="w-[99%] mx-auto overflow-hidden relative"
        style={{ height: "8cm" }}
      >
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Slide Content with 4cm Margin and blue overlay */}
              <div className="flex justify-between items-center h-full w-full bg-blue-100/80 px-[4cm]">
                {/* Left Content */}
                <div className="text-gray-800 space-y-2 max-w-xl">
                  <h2 className="text-2xl font-bold md:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg">{slide.subtitle}</p>
                  <button className="bg-black text-white px-6 py-2 text-sm md:text-base">
                    {slide.button}
                  </button>
                </div>

                {/* Right Image */}
                <div className="hidden md:block">
                  <img
                    src={slide.sideImage}
                    alt="Slide Visual"
                    className="max-w-[150px] md:max-w-[400px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow - Centered */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow hover:bg-gray-200 z-20"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow - Centered */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded shadow hover:bg-gray-200 z-20"
        >
          <ChevronRight size={20} />
        </button>

        {/* Bottom Slide Dots */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-6 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
