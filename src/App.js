import React, { useEffect, useState, useMemo, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout/layout";
import axios from "axios";

import { BASE_URL } from "./Components/Urls/Urls";
import Search from "./Components/View-Products/Search";
// Lazy load components
const ProductList = React.lazy(() =>
  import("./Components/View-Products/index")
);

const Login = React.lazy(() => import("./Components/Auth/Login"));
const Signup = React.lazy(() => import("./Components/Signup/Signup"));
const Logout = React.lazy(() => import("./Components/Auth/Logout"));
const Cart = React.lazy(() => import("./Components/Cart/Cart"));
const OrderList = React.lazy(() => import("./Components/Orders/Orders"));
const PlaceOrder = React.lazy(() => import("./Components/Orders/PlaceOrders"));
const OrderSuccess = React.lazy(() =>
  import("./Components/Orders/Order-Success")
);
const OrderPage = React.lazy(() =>
  import("./Components/Orders/Ordered-products")
);
const Wishlist = React.lazy(() => import("./Components/Wishlist/Wishlist"));
const ReturnOrder = React.lazy(() => import("./Components/Orders/ReturnOrder"));
const ProfilePage = React.lazy(() => import("./Components/Profile/Profile"));
const Category = React.lazy(() => import("./Components/Category/Category"));
const ProductDisplay = React.lazy(() =>
  import("./Components/View-Products/Products")
);
const Slider = React.lazy(() => import("./Components/View-Products/Slider"));
const ForgotPassword = React.lazy(() =>
  import("./Components/Auth/ForgotPassword")
);
const HelpCenter = React.lazy(() =>
  import("./Components/HelpCenter/HelpCenter")
);
const TermsOfService = React.lazy(() =>
  import("./Components/TermsAndPrivasy/TermsOfServices")
);
const PrivacyPolicy = React.lazy(() =>
  import("./Components/TermsAndPrivasy/PrivacyPolicy")
);

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [isCoupon, setIsCoupon] = useState(false);
  const [couponData, setCouponData] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/home`, {
          withCredentials: true,
        });

        setCartCount(response.data.cartCount);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const ProtectedRoute = ({ component: Component }) => {
    return user ? (
      <Component setCartCount={setCartCount} />
    ) : (
      <Login setUser={setUser} setCartCount={setCartCount} />
    );
  };

  if (loading) {
    return (
      <div className="row">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <br />
            <p>Loading, please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? "dark" : "light"}`}>
      <Router>
        <Layout
          user={user}
          cartCount={cartCount}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  setCartCount={setCartCount}
                  user={user}
                  setUser={setUser}
                />
              }
            />
            <Route
              path="/login"
              element={<Login setCartCount={setCartCount} setUser={setUser} />}
            />
            <Route
              path="/signup"
              element={<Signup setUser={setUser} setCartCount={setCartCount} />}
            />
            <Route
              path="/logout"
              element={<Logout setUser={setUser} setCartCount={setCartCount} />}
            />
            <Route
              path="/cart"
              element={
                user ? (
                  <Cart setCartCount={setCartCount} />
                ) : (
                  <Login setUser={setUser} setCartCount={setCartCount} />
                )
              }
            />
            <Route
              path="/orders"
              element={<ProtectedRoute component={OrderList} />}
            />
            <Route
              path="/place-order"
              element={
                user ? (
                  <PlaceOrder
                    setCartCount={setCartCount}
                    setSuccess={setSuccess}
                    setCouponData={setCouponData}
                    setIsCoupon={setIsCoupon}
                    user={user}
                  />
                ) : (
                  <Login setUser={setUser} setCartCount={setCartCount} />
                )
              }
            />
            <Route
              path="/order-success"
              element={
                success ? (
                  <OrderSuccess isCoupon={isCoupon} couponData={couponData} />
                ) : (
                  <ProductList setCartCount={setCartCount} />
                )
              }
            />
            <Route
              path="/view-orders-products/:Id"
              element={<ProtectedRoute component={OrderPage} />}
            />
            <Route
              path="/wishlist"
              element={<ProtectedRoute component={Wishlist} />}
            />
            <Route path="/category/:thing" element={<Category />} />
            <Route
              path="/return"
              element={<ProtectedRoute component={ReturnOrder} />}
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <ProfilePage user={user} />
                ) : (
                  <Login setUser={setUser} setCartCount={setCartCount} />
                )
              }
            />
            <Route
              path="/search"
              element={
                <Search
                  user={user}
                  darkMode={darkMode}
                  cartCount={cartCount}
                  setDarkMode={setDarkMode}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                user ? (
                  <ProductDisplay setCartCount={setCartCount} />
                ) : (
                  <Login setUser={setUser} setCartCount={setCartCount} />
                )
              }
            />
            <Route path="/slider" element={<Slider />} />
            <Route
              path="/help-center"
              element={<ProtectedRoute component={HelpCenter} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
