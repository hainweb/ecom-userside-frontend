import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

const BecomeMerchant = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="absolute top-2 right-10 w-16 h-16 bg-blue-300 dark:bg-blue-600 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 left-20 w-12 h-12 bg-purple-300 dark:bg-purple-600 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-indigo-300 dark:bg-indigo-600 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left content */}
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 p-3 rounded-xl shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Start Selling on KingCart
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Join thousands of merchants and grow your business worldwide
              </p>
            </div>
          </div>

          {/* Right CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-center sm:text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Ready to start?
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300">
                No setup fees • Quick approval
              </div>
            </div>

            <a
              href="https://seller.kingcart.shop"
              target="_blank"
              rel="noopener noreferrer"
              className=" bg-gradient-to-r from-gray-500 via-gray-700 to-blue-700 hover:from-blue-700 hover:via-gray-700 hover:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center group whitespace-nowrap"
            >
              Become a Merchant
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMerchant;
