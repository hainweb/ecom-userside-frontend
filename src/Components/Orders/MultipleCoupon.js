import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";
import { AlertCircle, Loader2, X, Tag, Trash2 } from "lucide-react";

const PlaceOrderForm = ({
  user,
  setSuccess,
  setCartCount,
  setIsCoupon,
  setCouponData,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [total, setTotal] = useState(0);
  const [originalTotal, setOriginalTotal] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponMessage, setCouponMessage] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { proId } = location.state || {};

  useEffect(() => {
    if (proId) {
      setProductLoading(true);
      axios
        .post(`${BASE_URL}/buy-product`, { proId }, { withCredentials: true })
        .then((response) => {
          setTotal(response.data.total);
          setOriginalTotal(response.data.total);
          setProduct(response.data.product);
          setProductLoading(false);
        });
    } else {
      axios
        .get(`${BASE_URL}/place-order`, { withCredentials: true })
        .then((response) => {
          setTotal(response.data.total);
          setOriginalTotal(response.data.total);
        });
    }

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-address`, {
          withCredentials: true,
        });
        const addressList = response.data.userAddress || [];
        setAddresses(addressList);
        if (addressList.length > 0) {
          setSelectedAddress(addressList[0]._id);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (paymentMethod === "ONLINE") {
      setAvailabilityMessage("Not available online payment at this time");
    } else {
      setAvailabilityMessage("");
    }
  }, [paymentMethod]);

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCouponApply = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    // Check if the coupon is already applied
    const alreadyApplied = appliedCoupons.some(
      (coupon) => coupon.code === code
    );
    if (alreadyApplied) {
      setCouponMessage("Coupon already applied.");
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/apply-coupon`,
        { code },
        { withCredentials: true }
      );

      if (response.data.status) {
        const newCoupon = response.data.coupon;

        // Apply new coupon and update total based on all discounts
        const updatedCoupons = [...appliedCoupons, newCoupon];
        const totalDiscount = updatedCoupons.reduce(
          (acc, c) => acc + c.discount,
          0
        );
        const newTotal = Math.max(0, originalTotal - totalDiscount);

        setAppliedCoupons(updatedCoupons);
        setTotal(newTotal);
        setCouponMessage("Coupon applied successfully!");
        setCouponInput("");
      } else {
        setCouponMessage(response.data.message || "Invalid coupon.");
      }
    } catch (error) {
      console.error("Coupon error:", error);
      setCouponMessage("Error applying coupon.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = (couponCode) => {
    const updatedCoupons = appliedCoupons.filter(
      (coupon) => coupon.code !== couponCode
    );
    const totalDiscount = updatedCoupons.reduce(
      (acc, c) => acc + c.discount,
      0
    );
    const newTotal = Math.max(0, originalTotal - totalDiscount);

    setAppliedCoupons(updatedCoupons);
    setTotal(newTotal);
    setCouponMessage("Coupon removed successfully!");
  };

  const handleClearAllCoupons = () => {
    setAppliedCoupons([]);
    setTotal(originalTotal);
    setCouponMessage("All coupons cleared!");
  };

  const getTotalDiscount = () => {
    return appliedCoupons.reduce((acc, coupon) => acc + coupon.discount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select an address before placing the order.");
      return;
    }

    setSuccess(true);
    try {
      const requestData = {
        addressId: selectedAddress,
        paymentMethod,
        ...(proId && { proId, buyNow: true }),
      };
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/place-order`,
        requestData,
        { withCredentials: true }
      );

      if (response.data.status) {
        setIsCoupon(false);
        setCouponData({});
        if (!proId) setCartCount(0);
        alert("Ordered successfully");
        if (response.data.isCoupon) {
          setIsCoupon(true);
          setCouponData(response.data.coupon);
        }
        navigate("/order-success");
      } else {
        navigate("/cart", {
          state: { info: response.data.message, proId: response.data.product },
        });
        alert(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order, please try again.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 mb-10 md:mb-0 mt-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Product display */}
        {productLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : product ? (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Product Details
              </h4>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src={product.thumbnailImage}
                alt={product.Name}
                className="w-20 h-20 rounded-lg object-cover shadow-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {product.Name}
                </h3>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{product.Price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.SellingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          {/* Address Section */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Select Delivery Address
            </h4>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20"
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address._id}
                      className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={selectedAddress === address._id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    />
                    <div className="text-gray-800 dark:text-gray-300">
                      <div className="font-medium">{address.Name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {`${address.Address}, ${address.City}, ${address.State}, ${address.Pincode}`}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                onClick={() =>
                  navigate("/profile", { state: { view: "manageAddress" } })
                }
              >
                Add Address
              </button>
            )}
          </div>

          {/* Coupon Section */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Apply Coupon
              </h4>
              {appliedCoupons.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllCoupons}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={handleCouponApply}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                {applyingCoupon ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            
            {couponMessage && (
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                {couponMessage}
              </p>
            )}
            
            {appliedCoupons.length > 0 && (
              <div className="space-y-2">
                {appliedCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-800 dark:text-green-200 uppercase">
                        {coupon.code}
                      </span>
                      <span className="text-sm bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 font-semibold px-2 py-1 rounded-full">
                        ₹{coupon.discount} OFF
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoupon(coupon.code)}
                      className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total and Payment */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            {/* Order Summary */}
            <div className="mb-6">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Order Summary
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    ₹{originalTotal.toLocaleString()}
                  </span>
                </div>
                
                {getTotalDiscount() > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 dark:text-green-400">
                      Total Discount ({appliedCoupons.length} coupon{appliedCoupons.length > 1 ? 's' : ''})
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -₹{getTotalDiscount().toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  {getTotalDiscount() > 0 && (
                    <div className="text-right">
                      <span className="text-sm text-green-600 dark:text-green-400">
                        You saved ₹{getTotalDiscount().toLocaleString()}!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <p className="text-gray-800 dark:text-gray-300 mb-3 font-medium">
                Payment Method
              </p>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20">
                  <input
                    type="radio"
                    name="payment-method"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={handlePaymentChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 dark:text-gray-300 font-medium">
                    Cash on Delivery (COD)
                  </span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-900/20">
                  <input
                    type="radio"
                    name="payment-method"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={handlePaymentChange}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 dark:text-gray-300 font-medium">
                    Online Payment
                  </span>
                </label>
              </div>
              {availabilityMessage && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {availabilityMessage}
                </div>
              )}
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={!selectedAddress || paymentMethod === "ONLINE"}
            >
              {loading ? (
                <div className="flex justify-center items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Complete Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PlaceOrderForm;