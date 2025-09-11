import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Urls/Urls";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-user-coupons`, {
          withCredentials: true,
        });
        setCoupons(response.data);
        console.log("Coupons", response);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
   
  };

  const isExpired = (expDate) => {
    return new Date(expDate) < new Date();
  };

  const getCouponStatus = (coupon) => {
    if (coupon.isUsed) return 'used';
    if (isExpired(coupon.expDate)) return 'expired';
    return 'active';
  };

  const filteredCoupons = coupons.filter(coupon => {
    const status = getCouponStatus(coupon);
    if (filter === 'all') return true;
    return status === filter;
  });

  const getStatusBadge = (coupon) => {
    const status = getCouponStatus(coupon);
    
    switch (status) {
      case 'used':
        return (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Used
          </div>
        );
      case 'expired':
        return (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Expired
          </div>
        );
      default:
        return (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Active
          </div>
        );
    }
  };

  const getCardOpacity = (coupon) => {
    const status = getCouponStatus(coupon);
    return status === 'active' ? 'opacity-100' : 'opacity-70';
  };

  const activeCount = coupons.filter(c => getCouponStatus(c) === 'active').length;
  const expiredCount = coupons.filter(c => getCouponStatus(c) === 'expired').length;
  const usedCount = coupons.filter(c => getCouponStatus(c) === 'used').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Coupons
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and use your discount coupons
          </p>
        </div>

        {/* Stats Cards */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{coupons.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Coupons</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-600">{usedCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Used</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expired</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'all', label: 'All Coupons', count: coupons.length },
            { key: 'active', label: 'Active', count: activeCount },
            { key: 'used', label: 'Used', count: usedCount },
            { key: 'expired', label: 'Expired', count: expiredCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === key
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {label}
              <span className={`text-xs px-2 py-1 rounded-full ${
                filter === key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No coupons found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all' ? 'You don\'t have any coupons yet.' : `No ${filter} coupons available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 ${getCardOpacity(coupon)} hover:scale-105`}
              >
                {/* Status Badge */}
                {getStatusBadge(coupon)}

                {/* Coupon Content */}
                <div className="p-6">
                 
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      ₹{coupon.discount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Off on orders above ₹{coupon.minAmount}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                      COUPON CODE
                    </div>
                    <div className="font-mono text-center text-sm font-semibold text-gray-900 dark:text-white break-all">
                      {coupon.code}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(coupon.code)}
                    disabled={coupon.isUsed || isExpired(coupon.expDate)}
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      coupon.isUsed || isExpired(coupon.expDate)
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {coupon.isUsed ? 'Already Used' : isExpired(coupon.expDate) ? 'Expired' : 'Copy Code'}
                  </button>

                  {/* Expiry Date */}
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {isExpired(coupon.expDate) ? 'Expired on' : 'Valid until'} {new Date(coupon.expDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                <div className="absolute -top-3 left-6 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
                <div className="absolute -top-3 right-6 w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;