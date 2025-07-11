import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Tag } from "lucide-react";

const Category = () => {
  const { thing } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/find-category-${thing}`);
       
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [thing]);

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  }

  const calculateDiscount = (sellingPrice, price) => {
    return Math.round(((sellingPrice - price) / sellingPrice) * 100);
  }

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-lg text-red-500">{error}</div>;

  return (
    <div className="px-4 py-8 mt-8 bg-white dark:bg-gray-900 min-h-screen">

      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 capitalize">{thing} Products</h1>
        {products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div className={`rounded-lg shadow-lg overflow-hidden  dark:'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl`}>
                  <div className="relative pt-[100%]">
                    <img
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      alt={product.Name}
                      src={product.thumbnailImage}
                    />
                    {product.SellingPrice > product.Price && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {calculateDiscount(product.SellingPrice, product.Price)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {truncateText(product.Name, 20)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {product.Description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">₹{product.Price.toLocaleString()}</span>
                      {product.SellingPrice > product.Price && (
                        <span className="text-gray-500 line-through text-sm">
                          ₹{product.SellingPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.Quantity < 1 && (
                      <p className="text-red-500 mt-2">Out of Stock</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
