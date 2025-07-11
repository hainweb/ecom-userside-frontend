import React from "react";
import { Link } from "react-router-dom";
import { LogOut, MenuIcon, X } from "lucide-react";

const Sidebar = ({ view, setView, isMobileNavOpen, setIsMobileNavOpen }) => {
  return (
    <>
      {/* Header */}
      {/* On Mobile device */}
      <header className="md:hidden fixed mt-16 top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          My Dashboard
        </h1>
        <button
          className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          {isMobileNavOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Sidebar */}
      <div
        className={`${
          isMobileNavOpen
            ? "fixed inset-0 z-50 bg-white dark:bg-gray-800 w-64"
            : "hidden"
        } md:block md:w-1/4 md:relative border-r border-gray-300 dark:border-gray-700 pt-4`}
      >
        <Link
          className="md:hidden text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-200 ml-4"
          to="/"
        >
          King Cart
        </Link>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300 mt-10 md:mt-0">
          <Link to="/orders">
            <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
              MY ORDERS
            </li>
          </Link>
          <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400">
            ACCOUNT SETTINGS
          </li>

          <ul className="pl-4 space-y-2 text-sm">
            <li
              className={`cursor-pointer ${
                view === "profile"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={() => {
                setView("profile");
                setIsMobileNavOpen(false);
              }}
            >
              Profile Information
            </li>
            <li
              className={`cursor-pointer ${
                view === "manageAddress"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={() => {
                setView("manageAddress");
                setIsMobileNavOpen(false);
              }}
            >
              Manage Addresses
            </li>
            <li
              className={`cursor-pointer ${
                view === "PasswordAndSecurity"
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={() => {
                setView("PasswordAndSecurity");
                setIsMobileNavOpen(false);
              }}
            >
              Password & Security
            </li>
          </ul>

          <li className="font-bold hover:text-blue-600 dark:hover:text-blue-400">
            PAYMENTS
          </li>
          <ul className="pl-4 space-y-2 text-sm">
            <li
              onClick={() => {
                setView("coupons");
                setIsMobileNavOpen(false);
              }}
              className={`cursor-pointer
            ${
              view === "coupons"
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "hover:text-blue-600 dark:hover:text-blue-400"
            }
            `}
            >
              Coupons
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              Saved UPI
            </li>
            <li className="hover:text-blue-600 dark:hover:text-blue-400">
              Saved Cards
            </li>
          </ul>

          <li className="font-bold flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500">
            <Link to="/logout" className="flex items-center">
              <LogOut className="w-5 mr-2" />
              Sign Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
