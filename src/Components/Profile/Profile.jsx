import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileForm from "./ProfileForm";
import AddressManager from "./AddressManager";
import { ShoppingCart, Package, Heart, Bell } from "lucide-react";
import PasswordChange from "./PasswordChange";
import ForgotPassword from "../Auth/ForgotPassword";
import PasswordAndSecurity from "./PasswordAndSecurity";
import Coupons from "./Coupons";

const ProfilePage = ({ user }) => {
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || "profile");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col mt-2 items-center">
      <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 mt-36 sm:mt-20 md:mt-20">
        <div
          className={`relative py-4 px-6 transition-all duration-500 ease-out `}
        >
          {/* Main Content Row */}
          <div className="flex items-center justify-between">
            {/* Greeting */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white/90">Welcome back,</span>
              <span className="font-bold text-white">{user.Name}</span>
            </div>

            {/* Interactive Icons */}
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative group">
                <Bell className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                  0
                </span>
              </button>

              {/* Wishlist */}
              <Link to="/wishlist">
                <button className="relative group">
                  <Heart className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />

                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Wishlist
                  </span>
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <button className="relative group">
                  <ShoppingCart className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />

                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Cart
                  </span>
                </button>
              </Link>
            </div>
          </div>

        

          {/* Animated Border */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>

     <div className="w-full max-w-5xl mt-8 md:flex md:h-[calc(100vh-8rem)] relative">
        {/* Sidebar (Mobile always rendered, hidden conditionally) */}
        <Sidebar
          view={view}
          setView={setView}
          isMobileNavOpen={isMobileNavOpen}
          setIsMobileNavOpen={setIsMobileNavOpen}
        />

        {/* Desktop Sidebar wrapper to make it sticky */}
        <div className="hidden md:block md:w-1/8 md:sticky md:top-32 self-start" />

        {/* Main Content Area: Scrollable */}
        <div className="w-full md:w-3/4 overflow-y-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
          {view === "profile" && <ProfileForm user={user} />}
          {(view === "manageAddress" || view === "addAddress") && (
            <AddressManager view={view} setView={setView} user={user} />
          )}
          {view === "PasswordAndSecurity" && (
            <PasswordAndSecurity user={user} view={view} setView={setView} />
          )}
          {view === "PasswordChange" && (
            <PasswordChange user={user} view={view} setView={setView} />
          )}
          {view === "forgot" && (
            <ForgotPassword
              user={user}
              view={view}
              setView={setView}
              loginedUser={user}
            />
          )}
          {view === "coupons" && (
            <Coupons user={user} view={view} setView={setView} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
