import { useState } from "react";
import { BASE_URL } from "../Urls/Urls";
import axios from "axios";
import { Link } from "react-router-dom";

const LoginModal = ({
  isOpen,
  onClose,
  setUser,
  setCartCount,
  onLoginSuccess,
}) => {
  const [Mobile, setMobile] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          Mobile,
          Password,
        },
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        setUser(response.data.user);
        axios
          .get(`${BASE_URL}/get-cart-count`, { withCredentials: true })
          .then((response) => {
            setCartCount(response.data.cartCount || 0);
          });
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setError(response.data.message || "Invalid mobile or password");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMobile("");
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Login Required
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please login to add items to your cart or wishlist.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mobile
            </label>
            <input
              type="number"
              value={Mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={handleClose}
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
