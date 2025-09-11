import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

import {
  Heart,
  Share2,
  ShoppingCart,
  Check,
  CircleOff,
  ClockAlert,
  Clock,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Star,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const ProductDisplay = ({ setCartCount }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-product/${id}`, {
          withCredentials: true,
        });
        setProduct(response.data);
        console.log("product", product);

        if (response.data.CustomOptions?.length) {
          setSelectedOption(response.data.CustomOptions[0].value);
        }
        if (response.data.isInWishlist) {
          setIsWishlisted(true);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = (productId) => {
    axios
      .get(`${BASE_URL}/add-to-cart/${productId}`, { withCredentials: true })
      .then((response) => {
        console.log("resokdjd", response);

        if (response.data.status) {
          setCartCount((prevCount) => prevCount + 1);
        }
        setNotificationMessage(response.data.message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addToWishlist = () => {
  
    const newWishlistedState = !isWishlisted;
    setIsWishlisted(newWishlistedState);

   
    axios
      .get(`${BASE_URL}/add-to-Wishlist/${product._id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("res wish", response);
        if (!response.data.status) {
         
          setIsWishlisted(!newWishlistedState);
        }
      })
      .catch(() => {
        
        setIsWishlisted(!newWishlistedState);
      });
  };

  const handleBuyNow = (proId) => {
    setNotificationMessage("Proceeding to checkout...");
    setShowNotification(true);

   
    setTimeout(() => setShowNotification(false), 3000);

    
    navigate("/place-order", { state: { proId } });
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const SliderArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
      style={{ [direction === "prev" ? "left" : "right"]: "1rem" }}
    >
      {direction === "prev" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "document.title",
          text: "Check out this page!",
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
     
      alert(
        "System sharing is not supported on this browser. Please copy the link manually."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 mt-16 mb-14 sm:mb-0">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-16 left-1/2 z-50 max-w-md bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in flex items-center gap-2 transform -translate-x-1/2">
          <Check className="w-5 h-5" />
          {notificationMessage}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative aspect-square group">
              <img
                src={product.images[activeImageIndex]}
                alt={product.Name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <SliderArrow direction="prev" onClick={handlePrevImage} />
              <SliderArrow direction="next" onClick={handleNextImage} />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeImageIndex === index
                        ? "bg-blue-500 w-8"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            {/* Product Title and Category */}
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-500" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {product.Name}
                </h1>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {showFullDescription ? (
                  <>
                    <span className="font-medium">{product.Description}</span>
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-blue-500 text-sm ml-1"
                    >
                      show less
                    </button>
                  </>
                ) : (
                  <span className="font-medium block overflow-hidden whitespace-nowrap text-ellipsis">
                    {product.Description}
                  </span>
                )}
                {!showFullDescription && (
                  <button
                    onClick={() => setShowFullDescription(true)}
                    className="text-blue-500 text-sm ml-1"
                  >
                    show more
                  </button>
                )}
              </div>

              <div className="mt-4 flex items-center gap-4">
                <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  {product.Category}
                </span>
              </div>
            </div>

            {/* Price and Action Icons */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{product.Price.toLocaleString()}
                  </span>
                  <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.SellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      {Math.round(
                        ((product.SellingPrice - product.Price) /
                          product.SellingPrice) *
                          100
                      )}
                      % OFF
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Save ₹
                      {(product.SellingPrice - product.Price).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">EMI</span> starts at ₹
                    {Math.round(product.Price / 12).toLocaleString()}/mo
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <Clock className="w-4 h-4" />
                    <span>Limited time offer!</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToWishlist}
                  className={`p-3 rounded-full border ${
                    isWishlisted
                      ? "text-red-500 border-red-500"
                      : "text-gray-500 border-gray-300 dark:border-gray-600"
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                >
                  <Heart
                    className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                      isWishlisted ? "fill-current scale-125" : "scale-100"
                    }`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Options and Quantity */}
            <div className="space-y-4">
              {product.CustomOptions && product.CustomOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {product.CustomOptions[0].name}
                  </label>
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mt-1 block w-full text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-400"
                  >
                    {product.CustomOptions[0].values.map((val, index) => (
                      <option
                        key={index}
                        value={val}
                        className="font-medium text-gray-800 dark:text-white"
                      >
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700"
                disabled={product.Quantity === 0} 
              >
                <ShoppingCart className="w-6 h-6" />
                {product.Quantity === 0 ? "Stock Out" : "Add to Cart"}
              </button>

              <button
                onClick={() => handleBuyNow(product._id)}
                className={`h-12 text-white text-lg font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                  product.Quantity === 0
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={product.Quantity === 0} 
              >
                {product.Quantity === 0 ? (
                  <CircleOff className="w-6 h-6" /> 
                ) : (
                  <Check className="w-6 h-6" />
                )}
                {product.Quantity === 0 ? "Stock Out" : "Buy Now"}
              </button>
            </div>

            {/* Stock Quantity Indicator */}
            {product.Quantity < 5 && product.Quantity > 0 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                <ClockAlert className="w-6 h-6" />
                Only {product.Quantity} left !
              </p>
            )}

            {/* Product Guarantees */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Truck className="w-5 h-5" />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <RefreshCw className="w-5 h-5" />
                <span className="text-sm">Easy Returns</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Specifications
                </h2>
                <div className="mt-4 space-y-2">
                  {product.Specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b dark:border-gray-700"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {spec.key}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  Highlights
                </h2>
                <ul className="mt-4 space-y-2">
                  {product.Highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Return Policy */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <RefreshCw className="w-6 h-6" />
                  Return Policy
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {product.Return}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
