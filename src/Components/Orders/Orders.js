import React, { useEffect, useState } from 'react';
import { Package, Truck, Home, ChevronRight, Loader2, Clock } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';

const OrderList = () => { 
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get(`${BASE_URL}/view-orders`, { withCredentials: true })
        .then((response) => {
          console.log('res orderlist', response);

          setOrders(response.data.orders);
          setLoading(false);
        });
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Product delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'cancel':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-black dark:bg-gray-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50 text-black dark:bg-gray-900 dark:text-white mt-12 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orders && orders.length > 0 ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Track and manage your recent orders
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg mb-12 overflow-hidden">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border-b border-gray-200 last:border-0 dark:border-gray-700"
                >
                  <Link to={`/view-orders-products/${order._id}`} className="btn btn-primary btn-sm">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Order placed</p>
                        <p className="font-medium">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                        <p className="font-medium">₹{parseFloat(order.total || 0).toFixed(2)}</p>

                      </div>
                      <div>

                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status3
                              ? getStatusColor(order.status3)
                              : getStatusColor(order.status)
                            }`}
                        >
                          {order.status3 || order.status2|| order.status}
                        </span>

                        {order.cancel && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              "cancel"
                            )}`}
                          >
                            Canceled
                          </span>
                        )}


                      </div>
                    </div>

                    <div className="relative">
                      <div className="flex justify-between items-center">
                        {/* Connecting Lines Container */}
                        <div className="absolute top-6 left-[15%] right-[15%] h-0.5 z-0">
                          <div className="h-full relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`
                      absolute top-0 left-0 h-full bg-green-500
                      transition-all duration-1000 ease-in-out
                      ${order.status ? 'w-1/2' : 'w-0'}
                      ${order.status2 ? 'w-full' : ''}
                    `}
                            />
                          </div>
                        </div>

                        {/* Order Placed */}
                        <div className="flex-1 relative z-10">
                          <div className="flex justify-center">
                            <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 transform
                    ${order.status
                                ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse'
                                : 'bg-gray-300 dark:bg-gray-600'}
                  `}>
                              <Clock className={`
                      w-6 h-6 transition-all duration-500
                      ${order.status
                                  ? 'text-white animate-spin-slow'
                                  : 'text-gray-600 dark:text-gray-400'}
                    `} />
                            </div>
                          </div>
                        </div>

                        {/* Shipped */}
                        <div className="flex-1 relative z-10">
                          <div className="flex justify-center">
                            <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 transform
                    ${order.status2
                                ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse'
                                : 'bg-gray-300 dark:bg-gray-600'}
                  `}>
                              <Truck className={`
                      w-6 h-6 transition-all duration-500
                      ${order.status2
                                  ? 'text-white animate-truck'
                                  : 'text-gray-600 dark:text-gray-400'}
                    `} />
                            </div>
                          </div>
                        </div>

                        {/* Delivered */}
                        <div className="flex-1 relative z-10">
                          <div className="flex justify-center">
                            <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 transform
                    ${order.status3
                                ? 'bg-green-500 dark:bg-green-400 scale-110 animate-pulse'
                                : 'bg-gray-300 dark:bg-gray-600'}
                  `}>
                              <Package className={`
                      w-6 h-6 transition-all duration-500
                      ${order.status3
                                  ? 'text-white animate-bounce'
                                  : 'text-gray-600 dark:text-gray-400'}
                    `} />
                            </div>
                          </div>
                        </div>
                      </div>


                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Delivery Address:</span>{' '}
                        {order.deliveryDetails.address}, {order.deliveryDetails.pinncode}
                      </div>
                      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500">
                        <Link to={`/view-orders-products/${order._id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  </Link>

                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You haven't placed any orders yet.
            </p>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default OrderList;
