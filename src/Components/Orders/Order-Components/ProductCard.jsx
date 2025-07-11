import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../Urls/Urls";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Package,
} from "lucide-react";

const ProductCard = ({ products, orderTrack }) => {
  const [error, setError] = useState("");
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    const fetchReviews = async () => {
      const orderedProductIds = products.map((item) => item.product._id); // assuming your data shape

      const res = await axios.post(
        `${BASE_URL}/user-reviews`,
        { productIds: orderedProductIds },
        { withCredentials: true }
      );

      console.log(res.data.reviews);

      if (res.data.reviews) {
        const savedRatings = {};
        const submittedMap = {};
        res.data.reviews.forEach((review) => {
          savedRatings[review.productId] = review.rating;
          submittedMap[review.productId] = true;
        });
        setRatings(savedRatings);
        setSubmitted(submittedMap);
      }
    };
    fetchReviews();
  }, []);

  const handleStarClick = async (productId, rating) => {
    // If a rating exists and new rating is not greater, prevent update
    if (
      submitted[productId] &&
      ratings[productId] !== undefined &&
      rating <= ratings[productId]
    ) {
      return;
    }

    setRatings((prev) => ({ ...prev, [productId]: rating }));

    try {
      const response = await axios.post(
        `${BASE_URL}/submit-rating`,
        { productId, rating },
        { withCredentials: true }
      );

      if (response.data.status) {
        // mark as submitted to prevent future duplicate lower posts
        setSubmitted((prev) => ({ ...prev, [productId]: true }));
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const handleReturn = async (proId) => {
    const returndata = { proId: proId, orderId: Id, check: true };
    try {
      const confirmCancel = window.confirm(
        "Are you sure you want to return this order? This action cannot be undone."
      );
      if (!confirmCancel) return;

      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/return-product`,
        { returndata },
        { withCredentials: true }
      );

      if (response.data.status) {
        navigate(
          `/return?proId=${returndata.proId}&orderId=${returndata.orderId}`
        );
      } else {
        alert("Failed to return the product: " + response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setError("Error returning the product: " + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Order Details
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Review your purchased items and manage returns
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 dark:border-gray-700/20 hover:border-blue-200 dark:hover:border-blue-700 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.product?.thumbnailImage}
                  alt={product.product?.Name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Return Status Overlay */}
                {product.return?.status && (
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/95 to-yellow-400/95 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center text-white p-4 animate-pulse">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-2 drop-shadow-lg" />
                      <p className="font-bold text-lg">Return Requested</p>
                      <p className="text-sm opacity-90">
                        {product.return.date}
                      </p>
                    </div>
                  </div>
                )}

                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {product.product?.Name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.product?.Description}
                </p>

                {/* Price and Return Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{product.product?.Price}
                    </span>
                    {product.product?.SellingPrice && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                        ₹{product.product?.SellingPrice}
                      </span>
                    )}
                  </div>
                  {orderTrack.some((track) => track.status3) &&
                    product.product?.Return &&
                    !product.return?.status && (
                      <button
                        onClick={() => handleReturn(product.product._id)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return
                          </>
                        )}
                      </button>
                    )}
                </div>

                {/* Rating Section */}
                 {orderTrack.some((track) => track.status3) &&
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-start gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rate this product:
                    </p>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          onClick={() =>
                            handleStarClick(product.product._id, star)
                          }
                          className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
                            ratings[product.product._id] >= star
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-gray-300 dark:text-gray-600 hover:text-yellow-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {submitted[product.product._id] && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>You rated {ratings[product.product._id]} ★</span>
                    </div>
                  )}
                </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
