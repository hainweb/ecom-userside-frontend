import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../Urls/Urls';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function BestOfElectronic() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/find-category-Mobile`);
        let data = response.data;
       
        data = data.sort(() => Math.random() - 0.5).slice(0, 8);
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <section className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 capitalize">
            Best Of Mobile Products
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <>
              {/* Desktop view with arrows */}
              <div className="hidden md:block relative">
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="dark:text-white"/>
                </button>

                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="dark:text-white"/>
                </button>

                <div ref={scrollRef} className="overflow-hidden  p-2">
                  <div className="flex gap-4 min-w-max transition-all duration-300">
                    {products.map((product) => (
                      <div
                        className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                        key={product._id}
                      >
                        <Link to={`/product/${product._id}`}>
                          <div className="rounded-lg overflow-hidden">
                            <div className="relative pt-[100%]">
                              <img
                                className="absolute top-0 left-0 w-full h-full object-cover"
                                alt={product.Name}
                                src={product.thumbnailImage}
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                {truncateText(product.Name, 20)}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                {product.Description}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-blue-600 font-bold">
                                  ₹{product.Price.toLocaleString()}
                                </span>
                                {product.SellingPrice > product.Price && (
                                  <span className="text-gray-500 line-through text-sm">
                                    ₹{product.SellingPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden overflow-x-auto pb-4">
                <div className="flex gap-4">
                  {products.map((product) => (
                    <div
                      className="w-56 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                      key={product._id}
                    >
                      <Link to={`/product/${product._id}`}>
                        <div className="rounded-lg overflow-hidden">
                          <div className="relative pt-[100%]">
                            <img
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              alt={product.Name}
                              src={product.thumbnailImage}
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                              {truncateText(product.Name, 20)}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {product.Description}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-600 font-bold text-sm">
                                ₹{product.Price.toLocaleString()}
                              </span>
                              {product.SellingPrice > product.Price && (
                                <span className="text-gray-500 line-through text-xs">
                                  ₹{product.SellingPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default BestOfElectronic;
