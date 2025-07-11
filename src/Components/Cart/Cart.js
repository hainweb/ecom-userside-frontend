import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Package,
  ArrowRight,
  Loader2,
  Trash
} from 'lucide-react';

const Cart = ({ products = [], user, setCartCount }) => {
  const [cartProducts, setCartProducts] = useState(products);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [AddingProductId, setAddingProductId] = useState(null);
  const [DecProductId, setDecProductId] = useState(null);
  const [stockmax, setStockmax] = useState(false);
  const [outofstock, setOutofstock] = useState(false);
  const [outofstockInfo, setOutofstockInfo] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const cartInfo = location.state?.info;
  const productOut = location.state?.proId;

  useEffect(() => {
    setTotal(calculateTotal(cartProducts));
    const isOutOfStock = cartProducts.some(item => item.product.Quantity < 1);
    setOutofstock(isOutOfStock);
  }, [cartProducts]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartdata = await axios.get(`${BASE_URL}/cart`, { withCredentials: true });
        setCartProducts(cartdata.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
  }, []);

  function calculateTotal(products) {
    return products.reduce(
      (sum, product) => sum + product.quantity * product.product.Price,
      0
    );
  }

  const incCartQuantity = async (cartId, proId, userId, count, stock) => {
    const currentQuantity = cartProducts.find(p => p.product._id === proId).quantity;
    setAddingProductId(proId);

    if (currentQuantity >= stock) {
      setStockmax(true);
    } else {
      try {
        const response = await axios.post(
          `${BASE_URL}/change-productQuantity`,
          {
            cart: cartId,
            product: proId,
            user: userId,
            count: count,
            quantity: currentQuantity
          },
          { withCredentials: true }
        );

        if (response.data.removeProduct) {
          setCartProducts(cartProducts.filter(item => item.product._id !== proId));
          setCartCount(prevCount => prevCount - 1);
        } else {
          setCartProducts(prevProducts =>
            prevProducts.map(item =>
              item.product._id === proId
                ? { ...item, quantity: item.quantity + count }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    }
    setAddingProductId(null);
  };

  const decCartQuantity = async (cartId, proId, userId, count) => {
    const currentQuantity = cartProducts.find(p => p.product._id === proId).quantity;
    setDecProductId(proId);

    try {
      const response = await axios.post(
        `${BASE_URL}/change-productQuantity`,
        {
          cart: cartId,
          product: proId,
          user: userId,
          count: count,
          quantity: currentQuantity
        },
        { withCredentials: true }
      );

      if (response.data.removeProduct) {
        setCartProducts(cartProducts.filter(item => item.product._id !== proId));
        setCartCount(prevCount => prevCount - 1);
      } else {
        setCartProducts(prevProducts =>
          prevProducts.map(item =>
            item.product._id === proId
              ? { ...item, quantity: item.quantity + count }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
    setDecProductId(null);
  };

  const handlePlaceorder = () => {
    outofstock ? setOutofstockInfo('Some items are OUT OF STOCK') : navigate('/place-order');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white"> Cart</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{cartProducts.length} items</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartProducts.map(item => (
                  <div
                    key={item.product._id}
                    className={`p-6 ${item.product.Quantity < 1 ? 'bg-red-50 dark:bg-red-900/20' : ''
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <Link to={`/product/${item.product._id}`} className="flex-shrink-0">
                        <img
                          src={item.product.thumbnailImage}
                          alt={item.product.Name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product._id}`}>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {item.product.Name}
                          </h3>
                        </Link>

                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ₹{(item.product.Price * item.quantity).toLocaleString()}
                          </span>
                          {item.product.SellingPrice > item.product.Price && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ₹{(item.product.SellingPrice * item.quantity).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {item.product.Quantity < 1 ? (
                          <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Out of Stock</span>
                          </div>
                        ) : item.product.Quantity < 5 ? (
                          <div className="mt-2 flex items-center text-yellow-600 dark:text-yellow-400">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">
                              Only {item.product.Quantity} left!
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center  mb-16 sm:mb-0 md:mb-0 space-x-3">
                        <button
                          onClick={() => decCartQuantity(item._id, item.product._id, user, -1)}
                          disabled={DecProductId === item.product._id}
                          className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {DecProductId === item.product._id ? (
                            <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                          ) : item.quantity <= 1 ? (
                            <Trash className="w-4 h-4 text-red-500 " />
                          ) : (
                            <Minus className="w-4 h-4 dark:text-white " />
                          )}
                        </button>


                        <span className="text-lg font-medium w-8 text-center dark:text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            incCartQuantity(
                              item._id,
                              item.product._id,
                              user,
                              1,
                              item.product.Quantity
                            )
                          }
                          disabled={
                            AddingProductId === item.product._id ||
                            item.product.Quantity <= item.quantity
                          }
                          className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {AddingProductId === item.product._id ? (
                            <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                          ) : (
                            <Plus className="w-4 h-4 dark:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium">Free</span>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {outofstockInfo && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{outofstockInfo}</span>
                  </div>
                )}

                <button
                  onClick={handlePlaceorder}
                  disabled={outofstock}
                  className={`w-full py-4 px-6 text-white font-medium rounded-lg flex items-center justify-center space-x-2 ${outofstock
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    } transition-colors`}
                >
                  <Package className="w-5 h-5" />
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
