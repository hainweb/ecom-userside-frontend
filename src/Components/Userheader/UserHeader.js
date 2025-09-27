import React from "react";
import { Link } from "react-router-dom";
import {
  CircleUserRound,
  Heart,
  House,
  LogIn,
  LogOut,
  Moon,
  Package2,
  ShoppingCart,
  Sun,
  UserPlus,
} from "lucide-react";
import { Menu } from "@headlessui/react"; 
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"; 

function UserHeader({ cartCount, user, darkMode, setDarkMode }) {
  
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full ${
        darkMode
          ? "bg-gray-900 text-white shadow-lg shadow-gray-800/100"
          : "bg-white text-gray-800 shadow-lg shadow-gray-200/100"
      } transition-all ease-in-out`}
    >
      <nav className="navbar navbar-expand-lg navbar-light p-4 flex justify-between items-center max-w-screen-xl mx-auto">
        {/* Left Section */}
        <div className="flex items-center">
          <Link
            className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-200"
            to="/"
          >
            King Cart
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User Info / Login */}
          <div className="hidden sm:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/038/027/758/small/new-user-modern-icon-illustration-vector.jpg"
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                  />
                  <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                    {user.Name}
                  </span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
                <nav className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-1 text-sm font-medium transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <CircleUserRound className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-1 text-sm font-medium transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Package2 className="w-4 h-4" />
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="flex items-center space-x-1 text-sm font-medium transition hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Heart className="w-4 h-4 hover:text-red-500" />
                    <span>Wishlist</span>
                  </Link>
                </nav>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className={`px-6 py-2 rounded-full transition duration-300 border-2 border-solid ${
                    darkMode
                      ? "text-white border-blue-500 hover:border-blue-600"
                      : "text-black border-blue-500 hover:border-blue-700"
                  }`}
                >
                  Login / Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Cart */}
          <ul className="hidden sm:flex space-x-4">
            <li>
              <Link
                className={`text-lg hover:text-blue-600 transition duration-300 ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
                to="/cart"
              >
                <div className="relative">
                  <ShoppingCart color={darkMode ? "#ffffff" : "#0d0d0d"} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full px-1 text-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          </ul>

          {/* Search */}
          <Link to="/search">
            <span
              className={`group inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-300
    ${
      darkMode
        ? "bg-gray-800 text-white hover:bg-gray-700"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
    shadow-sm hover:shadow-md`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 transition-colors duration-200 group-hover:text-blue-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <span className="hidden md:block">Products</span>
            </span>
          </Link>

          {/* Dark Mode */}
          <div
            onClick={toggleDarkMode}
            className="w-9 h-9 bg-gray-700 text-white rounded-full hover:bg-gray-800 flex items-center justify-center p-1 overflow-hidden transition duration-300 cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </div>

          {/* Ellipsis Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                className={`inline-flex justify-center items-center p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-50"
                } shadow-sm ring-1 ring-gray-300`}
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Menu.Button>
            </div>
            <Menu.Items
              className={`absolute right-0 z-[60] mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="py-1">
                <Menu.Item>
                  <a
                    href="https://seller.kingcart.shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <button
                      className={`
        w-full flex items-center justify-center space-x-2
        px-6 py-3 rounded-2xl shadow-lg
        transition-transform duration-200 ease-out
        transform hover:-translate-y-1 hover:shadow-2xl
        font-semibold
         bg-gradient-to-r from-gray-500 via-gray-700 to-blue-600 text-white
      `}
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Become a Seller</span>
                    </button>
                  </a>
                </Menu.Item>

                <Menu.Item>
                  {({ active }) =>
                    user ? (
                      <Link to="/logout">
                        <button
                          className={`mt-2 px-4 py-2 flex text-sm w-full text-left rounded-md transition-colors duration-200 ease-in-out ${
                            active
                              ? darkMode
                                ? "bg-gray-800 text-white hover:bg-red-100 hover:text-red-600 font-bold"
                                : "bg-gray-900 text-white hover:bg-red-100 hover:text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          <LogOut size={18} className="mr-1" /> Logout
                        </button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <button
                          className={`block px-4 py-2 flex text-sm w-full text-left rounded-md transition-colors duration-200 ease-in-out ${
                            active
                              ? darkMode
                                ? "bg-gray-800 text-white hover:bg-blue-200 hover:text-blue-600 font-bold"
                                : "bg-gray-900 text-white hover:bg-blue-200 hover:text-blue-600 font-bold"
                              : ""
                          }`}
                        >
                          <LogIn size={18} className="mr-1" /> Login
                        </button>
                      </Link>
                    )
                  }
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </nav>

      {/* Overlays */}
      <div className="fixed top-18 left-0 w-full h-8 bg-transparent dark:bg-gradient-to-b dark:from-gray-900 dark:to-transparent pointer-events-none z-50"></div>
      <div className="fixed bottom-16 mb-2 sm:mb-0 md:mb-0 left-0 w-full h-6 bg-gradient-to-b from-transparent  dark:from-transparent dark:to-gray-900 pointer-events-none z-50 sm:bottom-0"></div>

      {/* Bottom navigation for mobile view */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 w-full py-4 ${
          darkMode
            ? "bg-gray-900 shadow-lg shadow-gray-800/100"
            : "bg-white shadow-lg shadow-gray-200/100"
        }`}
      >
        <ul className="flex justify-around items-center">
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? "text-white" : "text-gray-700"
              } hover:text-blue-600`}
              to="/"
            >
              <House color={darkMode ? "#ffffff" : "#0d0d0d"} strokeWidth={2} />
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? "text-white" : "text-gray-700"
              } hover:text-blue-600`}
              to="/cart"
            >
              <div className="relative">
                <ShoppingCart color={darkMode ? "#ffffff" : "#0d0d0d"} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full px-1 text-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? "text-white" : "text-gray-700"
              } hover:text-blue-600`}
              to="/orders"
            >
              <Package2 color={darkMode ? "#ffffff" : "#0d0d0d"} />
              Orders
            </Link>
          </li>
          <li>
            <Link
              className={`flex flex-col items-center transition duration-300 ${
                darkMode ? "text-white" : "text-gray-700"
              } hover:text-blue-600`}
              to="/profile"
            >
              <CircleUserRound color={darkMode ? "#ffffff" : "#0d0d0d"} />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default UserHeader;
