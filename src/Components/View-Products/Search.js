import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Tag, X, Search, Filter, ChevronLeft, ShoppingCart, LogIn, LogOut, UserPlus } from "lucide-react";
import { Menu, MenuButton } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";

function UserHeader({ cartCount, user, setDarkMode, darkMode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);

  // Filter and Sort States
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("");

  // Available categories (will be populated from products)
  const [availableCategories, setAvailableCategories] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        categories: selectedCategories,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sort: sortBy,
      };

      const response = await axios.get(`${BASE_URL}/products/filter`, {
        params,
        withCredentials: true,
      });

      setFilteredProducts(response.data.products);

      const categories = [
        ...new Set(response.data.products.map((product) => product.Category)),
      ];
      setAvailableCategories(categories);
    } catch (err) {
      console.error("Failed to fetch filtered products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchTerm, selectedCategories, priceRange, sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    setCategorySearch("");
  };

  const getFilteredCategories = () => {
    return availableCategories.filter((category) =>
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const calculateDiscount = (sellingPrice, price) => {
    return Math.round(((sellingPrice - price) / sellingPrice) * 100);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || priceRange.min || priceRange.max || sortBy;

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 z-50 w-full ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } shadow-xl transition-all ease-in-out`}
      >
        <nav className="navbar navbar-expand-lg navbar-light p-4 flex justify-between items-center max-w-screen-xl mx-auto">
          <Link
            className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-200"
            to="/"
          >
            King Cart
          </Link>

          <ul className="hidden sm:flex navbar-nav space-x-4 md:space-x-8">
              
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

          <div className="hidden md:flex w-2/3 mx-8">
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 md:w-9 md:h-9 bg-gray-700 text-white rounded-full hover:bg-gray-800 flex items-center justify-center p-1 overflow-hidden transition duration-300"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 md:w-6 md:h-6" />
              ) : (
                <Moon className="w-4 h-4 md:w-6 md:h-6" />
              )}
            </button>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton
                  className={`inline-flex justify-center items-center p-2 rounded-full ${
                    darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  } shadow-sm ring-1 ring-gray-300 hover:bg-gray-50`}
                >
                  <EllipsisVerticalIcon className="h-4 w-4" />
                </MenuButton>
              </div>

               <Menu.Items
                           className={`absolute right-0 z-[60] mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none ${
                             darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                           }`}
                         >
                           <div className="py-1">
                             <Menu.Item>
                               <a
                                 href="http://localhost:2000"
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

        {/* Mobile Search */}
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={toggleFilters}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                showFilters || hasActiveFilters
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                  {selectedCategories.length +
                    (priceRange.min || priceRange.max ? 1 : 0) +
                    (sortBy ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div
        className={`w-full min-h-screen ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        } transition-all duration-300 flex relative`}
        style={{ paddingTop: "70px", minHeight: "calc(100vh - 70px)" }}
      >
        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={toggleFilters}
          />
        )}

        {/* Left Content - filter */}
        <div
          className={`
    ${showFilters ? "translate-x-0" : "-translate-x-full"}
    fixed md:translate-x-0
    md:top-[70px] md:left-0 md:bottom-0
    md:fixed z-50 md:z-30
    w-80
    h-full
    ${darkMode ? "bg-gray-800" : "bg-white"}
    shadow-lg border-r ${darkMode ? "border-gray-700" : "border-gray-200"}
    overflow-y-auto transition-transform duration-300 ease-in-out
    ${showFilters ? "block" : "hidden"} md:block
  `}
        >
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`text-lg md:text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Filters & Sort
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
                <button
                  onClick={toggleFilters}
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mb-6 md:mb-8">
              <h4
                className={`font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Sort By
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Select sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6 md:mb-8">
              <h4
                className={`font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Price Range (₹)
              </h4>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Minimum price"
                  value={priceRange.min}
                  onChange={(e) =>
                    handlePriceRangeChange("min", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <input
                  type="number"
                  placeholder="Maximum price"
                  value={priceRange.max}
                  onChange={(e) =>
                    handlePriceRangeChange("max", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4
                className={`font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Categories
              </h4>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {getFilteredCategories().map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } flex-1 text-sm`}
                    >
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h5
                  className={`font-medium mb-3 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Active Filters
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {truncateText(category, 12)}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-blue-600"
                        onClick={() => handleCategoryToggle(category)}
                      />
                    </span>
                  ))}
                  {(priceRange.min || priceRange.max) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      ₹{priceRange.min || "0"} - ₹{priceRange.max || "∞"}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-green-600"
                        onClick={() => setPriceRange({ min: "", max: "" })}
                      />
                    </span>
                  )}
                  {sortBy && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                      Sort:{" "}
                      {sortBy
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-purple-600"
                        onClick={() => setSortBy("")}
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Products */}
        <div className="flex-1 overflow-y-auto md:pl-80">
          {loading ? (
            <div className="flex justify-center min-h-screen items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            </div>
          ) : (
            <div className="p-4 md:p-6">
              {/* Results Summary */}
              <div
                className={`mb-4 md:mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Products
                  </h2>
                  <button
                    onClick={toggleFilters}
                    className={`md:hidden px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                      showFilters || hasActiveFilters
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                    {hasActiveFilters && (
                      <span className="bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[18px] text-center">
                        {selectedCategories.length +
                          (priceRange.min || priceRange.max ? 1 : 0) +
                          (sortBy ? 1 : 0)}
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-sm">
                  Showing {filteredProducts.length} products
                  {searchTerm && ` for "${searchTerm}"`}
                  {selectedCategories.length > 0 &&
                    ` in ${selectedCategories.join(", ")}`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id}>
                      <div
                        className={`rounded-lg shadow-lg overflow-hidden ${
                          darkMode ? "bg-gray-800" : "bg-white"
                        } transition-all duration-300 hover:shadow-xl hover:scale-105`}
                      >
                        <div className="relative pt-[100%]">
                          <img
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            alt={product.Name}
                            src={product.thumbnailImage}
                          />
                          {product.SellingPrice > product.Price && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {calculateDiscount(
                                product.SellingPrice,
                                product.Price
                              )}
                              % OFF
                            </div>
                          )}
                        </div>
                        <div className="p-3 md:p-4">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {truncateText(product.Name, 20)}
                          </h3>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-blue-600 font-bold text-base md:text-lg">
                              ₹{product.Price.toLocaleString()}
                            </span>
                            {product.SellingPrice > product.Price && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{product.SellingPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {product.Category}
                          </p>
                          {product.Quantity < 1 && (
                            <p className="text-red-500 mt-2 font-medium text-sm">
                              Out of Stock
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div
                    className={`col-span-full min-h-screen text-center py-12 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <Search
                      className={`w-16 h-16 mx-auto mb-4 ${
                        darkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                    <p className="text-xl mb-2">No products found</p>
                    <p className="text-sm">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserHeader;
