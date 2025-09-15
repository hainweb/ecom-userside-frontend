import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  const slideInterval = 3000;

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-sliders`, {
          withCredentials: true,
        });
       
        setSlides(response.data || []);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [slides]);

  return (
    <div className="bg-gray-100 py-4 dark:bg-gray-800 ">
      {/* Slider Section */}

      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl dark:bg-gray-800">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {Array.isArray(slides) &&
            slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <Link to={`/category/${slide.linkTo}`}>
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-24 sm:h-64 object-cover"
                  />
                </Link>
              </div>
            ))}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.isArray(slides) &&
            slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-8 rounded-full transition-all ${
                  activeIndex === i ? "bg-white" : "bg-white/50"
                }`}
              ></button>
            ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={() =>
            setActiveIndex((prevIndex) =>
              prevIndex === 0 ? slides.length - 1 : prevIndex - 1
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-1 sm:p-3 lg:p-4 rounded-full text-white shadow-lg bg-gradient-to-r from-black/30 to-gray-700/30 bg-blend-overlay backdrop-blur-md hover:from-black/50 hover:to-gray-900/50 transition duration-300 ease-in-out"
          aria-label="Previous slide"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={() =>
            setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 p-1 sm:p-3 lg:p-4 rounded-full text-white shadow-lg bg-gradient-to-r from-black/30 to-gray-700/30 bg-blend-overlay backdrop-blur-md hover:from-black/50 hover:to-gray-900/50 transition duration-300 ease-in-out"
          aria-label="Next slide"
        >
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

export default Slider;
