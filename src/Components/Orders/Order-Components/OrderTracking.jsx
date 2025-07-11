import axios from "axios";
import React, {  useState } from "react";
import { BASE_URL } from "../..//Urls/Urls";
import {
  Truck,
  Package,
  XCircle,
  Clock,
  Loader2,
  Copy,
  Check,
  Tag,
  Gift,
  ReceiptIndianRupee,
} from "lucide-react";



const OrderTracking = ({ orderTrack, setOrderTrack }) => {
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCancelOrder = async (orderId) => {
    try {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      );
      if (!confirmCancel) return;
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/cancel-order`,
        { orderId },
        { withCredentials: true }
      );
      if (response.data.status) {
        setOrderTrack(response.data.orderTrack);
        alert(response.data.message || "Order canceled successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order");
    }
  };

  const isWithin8Hours = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const diffInMs = now - orderTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours >= 2;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="mx-auto bg-white dark:bg-gray-800 shadow-xl p-1 md:p-6 mt-12">
      <div className="container mx-auto bg-white dark:bg-gray-800 p-2 md:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 transition-colors duration-300">
          <div className="space-y-12">
            {orderTrack.map((track, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center">
                  {/* Connecting Lines Container */}
                  <div className="absolute top-6 left-[15%] right-[15%] h-0.5 z-0">
                    <div
                      className={`h-full relative overflow-hidden bg-gray-200 dark:bg-gray-700 transition-all duration-700`}
                    >
                      <div
                        className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000 ease-in-out ${
                          track.status ? "w-1/2" : "w-0"
                        } ${track.status2 ? "w-full" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Order Placed */}
                  <div className="flex-1 relative z-10">
                    <div
                      className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                        track.status ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                          track.status
                            ? "bg-green-500 dark:bg-green-400 scale-110 animate-pulse"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <Clock
                          className={`w-6 h-6 transition-all duration-500 ${
                            track.status
                              ? "text-white animate-spin-slow"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <p
                          className={`font-semibold transition-colors duration-500 ${
                            track.status
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Ordered
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
                          {track.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipped */}
                  <div className="flex-1 relative z-10">
                    <div
                      className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                        track.status2 ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                          track.status2
                            ? "bg-green-500 dark:bg-green-400 scale-110 animate-pulse"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <Truck
                          className={`w-6 h-6 transition-all duration-500 ${
                            track.status2
                              ? "text-white animate-truck"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <p
                          className={`font-semibold transition-colors duration-500 ${
                            track.status2
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Shipped
                        </p>
                        {track.status2 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
                            {track.shipedDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="flex-1 relative z-10">
                    <div
                      className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                        track.status3 ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                          track.status3
                            ? "bg-green-500 dark:bg-green-400 scale-110 animate-pulse"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <Package
                          className={`w-6 h-6 transition-all duration-500 ${
                            track.status3
                              ? "text-white animate-bounce"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <p
                          className={`font-semibold transition-colors duration-500 ${
                            track.status3
                              ? "text-green-500 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          Delivered
                        </p>
                        {track.status3 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in">
                            {track.deliveredDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Order Overlay */}
                  {track.cancel && (
                    <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-500 z-20 backdrop-blur-sm">
                      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                        <XCircle className="w-12 h-12 text-red-500 dark:text-red-400 animate-bounce" />
                        <p className="mt-2 text-red-600 dark:text-red-400 font-semibold">
                          Order Canceled
                        </p>
                        <p className="text-sm text-red-500 dark:text-red-400">
                          {track.canceledTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancel Button */}
                {!track.cancel && !track.status2 && (
                  <div className="flex justify-center mt-6">
                    <button
                      className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform ${
                        isWithin8Hours(track.date)
                          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          : "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700 hover:shadow-lg dark:hover:shadow-red-700/25 hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                      onClick={() => handleCancelOrder(track._id)}
                      disabled={track.status2 || isWithin8Hours(track.date)}
                    >
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                        </div>
                      ) : (
                        " Cancel Order"
                      )}
                    </button>
                  </div>
                )}

                {index < orderTrack.length - 1 && (
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {orderTrack.length > 0 && (
          <div className="mt-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <ReceiptIndianRupee className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Coupon Code Section */}

              {orderTrack[0].couponCode && (
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                      Applied Coupon
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Coupon Code
                        </span>
                      </div>
                      <div className="font-mono text-sm sm:text-base bg-white dark:bg-gray-800 dark:text-white p-3 rounded-lg border border-gray-200 dark:border-gray-600 break-all">
                        {orderTrack[0].couponCode}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(orderTrack[0].couponCode)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 min-w-fit"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Discount Info */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Savings Applied
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Coupon Discount
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                          −₹{orderTrack[0].couponDiscount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Totals */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Order Total
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          ₹{orderTrack[0].subtotal || orderTrack[0].total || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          −₹{orderTrack[0].couponDiscount || 0}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-600 my-3"></div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          Final Total
                        </span>
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          ₹{orderTrack[0].total || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Badge */}
              {orderTrack[0].couponCode && (
                <div className="hidden md:block mt-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold">
                      You saved ₹{orderTrack[0].couponDiscount || 0} with this
                      coupon!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes truck {
          0% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(10px);
          }
          100% {
            transform: translateX(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-truck {
          animation: truck 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderTracking