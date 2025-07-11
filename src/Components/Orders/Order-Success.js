import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Link,useNavigate } from "react-router-dom";

const OrderConfirmation = ({ isCoupon, couponData }) => {
  const [showCoupon, setShowCoupon] = useState(false);

  const navigate=useNavigate()
  useEffect(() => {
    if (isCoupon && couponData) {
      const timer = setTimeout(() => {
        setShowCoupon(true);
      }, 1000); 

      return () => clearTimeout(timer); // clean up
    }
  }, [isCoupon, couponData]);

  useEffect(() => {
    function createDots() {
      const container = document.querySelector(".icon-container");
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        container.appendChild(dot);
        animateDot(dot);
      }
    }

    function animateDot(dot) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 40;
      const startX = Math.cos(angle) * radius;
      const startY = Math.sin(angle) * radius;
      const endX = startX + (Math.random() - 0.5) * 20;
      const endY = startY + (Math.random() - 0.5) * 20;

      dot.style.left = `calc(50% + ${startX}px)`;
      dot.style.top = `calc(50% + ${startY}px)`;

      setTimeout(() => {
        dot.style.transition = "all 2s ease-out";
        dot.style.left = `calc(50% + ${endX}px)`;
        dot.style.top = `calc(50% + ${endY}px)`;
        dot.style.opacity = "1";
      }, Math.random() * 1000);

      setTimeout(() => {
        dot.style.opacity = "0";
      }, 1500 + Math.random() * 500);

      setTimeout(() => animateDot(dot), 2000 + Math.random() * 1000);
    }

    createDots();

    const startConfetti = () => {
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 100);
    };

    const stopConfetti = () => {
      setTimeout(() => {
        confetti.reset();
      }, 5000);
    };

    startConfetti();
    stopConfetti();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-105">
        <div className="relative h-32 mb-8" style={{ perspective: "1000px" }}>
          <div className="icon-container absolute inset-0 flex items-center justify-center">
            <div className="relative w-20 h-20">
              <div className="circle absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="checkmark text-3xl text-white transform scale-150">
                  ✓
                </span>
              </div>
            </div>
          </div>
          <style jsx>{`
            .dot {
              position: absolute;
              width: 4px;
              height: 4px;
              background: #22c55e;
              border-radius: 50%;
              opacity: 0;
            }
          `}</style>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Thank you for ordering!
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Thank you for choosing Our Services. We appreciate your business and
          look forward to serving you again!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="flex-1">
            <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              VIEW ORDER
            </button>
          </Link>

          <Link to="/" className="flex">
            <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-semibold rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </div>
      {showCoupon && couponData && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/50 to-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-modalSlideIn border border-gray-200/50 dark:border-gray-700/50">
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>

            {/* Close button */}
            <button
              onClick={() => setShowCoupon(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:scale-110"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center relative z-10">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
                🎉 Coupon Unlocked!
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Congratulations! You've earned a special discount
              </p>

              {/* Coupon Code */}
              <div className="relative mb-6">
                <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-dashed border-green-300 dark:border-green-600 shadow-inner">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    COUPON CODE
                  </div>
                  <div className="font-mono text-green-700 dark:text-green-300 mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-shimmer break-all text-center">
                    <div className="text-lg font-bold tracking-wide">
                      {couponData.code}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(couponData.code)
                    }
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 mx-auto hover:scale-105 transform duration-200"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    Tap to copy
                  </button>
                </div>

                {/* Decorative corner cuts */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white dark:bg-gray-900 rounded-full"></div>
              </div>

              {/* Savings info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                  <span className="font-semibold">
                    Save ₹{couponData.discount}
                  </span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  on orders above ₹{couponData.minAmount}
                </p>
              </div>

              {/* Expiry */}
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Valid until{" "}
                {new Date(couponData.expDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              {/* Action button */}
              <button
                onClick={() => navigate('/')}
                className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Start Shopping
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes modalSlideIn {
              0% {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
              }
              100% {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes shimmer {
              0%,
              100% {
                background-position: -200% 0;
              }
              50% {
                background-position: 200% 0;
              }
            }

            .animate-modalSlideIn {
              animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
                forwards;
            }

            .animate-shimmer {
              background: linear-gradient(
                90deg,
                transparent,
                rgba(34, 197, 94, 0.1),
                transparent
              );
              background-size: 200% 100%;
              animation: shimmer 3s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
