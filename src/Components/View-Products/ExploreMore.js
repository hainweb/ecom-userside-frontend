import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";

function ExploreMore({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/explore-products`, {
          withCredentials: true,
        });
        let data = response.data.products;
        console.log("Fetched products:", response);

        // Shuffle the products
        data = data.sort(() => Math.random() - 0.5);
        setAllProducts(data); // Store all products
        setProducts(data.slice(0, visibleCount)); // Initially show 8 products
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

/*   useEffect(() => {
    if (searchQuery) {
      const filteredProducts = allProducts.filter(
        (product) =>
          product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.Description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filteredProducts.slice(0, visibleCount)); // Show filtered products
    } else {
      setProducts(allProducts.slice(0, visibleCount)); // Reset to all products
    }
  }, [searchQuery, allProducts, visibleCount]);
 */
 

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          {/* Desktop: Grid layout  */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {products.map((product) => (
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
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

          {/* Mobile: 2 column grid */}
          <div className="md:hidden grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
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

          {/* "Explore More" Button */}
          <div className="flex justify-center my-4">
            <Link to="/search">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
                Explore More Products
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default ExploreMore;
