import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Urls/Urls";
import { User, Lock, Phone, Mail, ShoppingCart, X, EyeOff, Eye, Loader2 } from "lucide-react";

const Signup = ({ setUser, setCartCount }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({

    Name: "",
    Name: "", 
    LastName: "",
    Gender: "",
    Email: "",
    Mobile: "",
    Password: "",
    ConfirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [info, setInfo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Show notification for 3 seconds
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 300000);
  };

  // Rest of the existing helper functions...
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validateStep1 = () => {
    if (!formData.Name.trim()) {
      setInfo("First Name is required");
      return false;
    }
    if (!formData.Gender) {
      setInfo("Please select a gender");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      setInfo("Enter a valid email");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Mobile)) {
      setInfo("Mobile must be 10 digits");
      return false;
    }
    if (formData.Password.length < 6) {
      setInfo("Password must be at least 6 characters");
      return false;
    }
    if (formData.Password !== formData.ConfirmPassword) {
      setInfo("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      setInfo("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/send-otp`, formData);
      console.log('response snd sms',response);
      
      if (response.data.status) {
        setStep(3);
        showNotification(`OTP sent successfully to ${formData.Email}`);
        setResendCooldown(60);
      } else {
        setInfo(response.data.message || "Error sending OTP.");
      }
    } catch (error) {
      setInfo("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/send-otp`, formData);
      console.log('rejndjnd', response);
      if (response.data.status) {
        showNotification(`OTP resent successfully to ${formData.Email}`);
        setResendCooldown(6);
      } else {
        setNotification({ show: true, message: response.data.message, type: "error" });

        setInfo(response.data.message || "Error resending OTP.");
      }
    } catch (error) {
      setInfo("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      showNotification("Please enter OTP", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/verify-otp`, { otp, ...formData },   {withCredentials:true});
      console.log('rejndjnd', response);

      if (response.data.status) {
        setNotification({ show: true, message: "Otp Verified Successfully!", type: "success" });

        setTimeout(() => {
          setUser(response.data.user);
          setCartCount(0);
          navigate("/");
        }, 1500); // Wait for notification to be visible before redirect
      } else {
        // Show error notification instead of setting info
        setNotification({ show: true, message: response.data.message, type: "error" });


        setOtp(""); // Clear OTP input on error
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Something went wrong. Please try again.",
        "error"
      );
      setOtp(""); // Clear OTP input on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-8 min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 font-sans overflow-hidden">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 mt-16 z-50 w-full flex justify-center items-center">
          <div className="animate-notification-slide-in max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <div className="h-6 w-6 text-green-500 animate-bounce">
                      {/* Success SVG */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-6 w-6 text-blue-400 animate-pulse">
                      {/* Info SVG */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div
                  className={`${notification.type === "error" ? "text-red-400" : "text-green-300"
                    } ml-2`}
                >
                  {notification.message}
                </div>

              </div>
            </div>
            <div className="flex border-l border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotification({ show: false, message: "", type: "" })}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg
                  className="h-5 w-5 hover:rotate-90 transition-transform duration-200"
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
          </div>
        </div>
      )}


      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-sm w-full p-6 z-10">
        <div className="text-center mb-6">
          <ShoppingCart className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {step === 1 ? "Basic Info" : step === 2 ? "Contact Info" : "Verify OTP"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {step === 1
              ? "Enter your basic information"
              : step === 2
                ? "Complete your registration"
                : "Enter the OTP sent to your email"}
          </p>
        </div>

        {/* Form sections remain the same but with dark mode classes added */}
        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                placeholder="Last Name (Optional)"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="Gender"
                    value="Male"
                    checked={formData.Gender === "Male"}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="Gender"
                    value="Female"
                    checked={formData.Gender === "Female"}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="Gender"
                    value="Other"
                    checked={formData.Gender === "Other"}
                    onChange={handleChange}
                  />
                  Other
                </label>
              </div>
            </div>
            {info && <p className="text-red-500 text-sm">{info}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="number"
                name="Mobile"
                value={formData.Mobile}
                onChange={handleChange}
                placeholder="Mobile"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type={showPassword ? "text" : "password"}
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type={showConfirmPassword ? "text" : "password"}
                name="ConfirmPassword"
                value={formData.ConfirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {info && <p className="text-red-500 text-sm">{info}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-200"
            >
              {loading ? <div className="flex justify-center items-center">
                <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
              </div> : "Send OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">OTP has been sent to {formData.Email}</p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition duration-200"
            >
              {loading ? <div className="flex justify-center items-center">
                <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
              </div> : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendCooldown > 0}
              className={`w-full py-2 mt-2 ${resendCooldown > 0
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-lg font-bold transition duration-200`}
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </form>
        )}

        {step !== 3 && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="block text-center text-blue-500 dark:text-blue-400 text-sm hover:underline"
            >
              Already have an account?
            </Link>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our
              <Link
                to="/terms"
                className="text-blue-500 dark:text-blue-400 hover:underline ml-1"
              >
                Terms of Service
              </Link>
              <span className="mx-1">and</span>
              <Link
                to="/privacy"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
