import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../Urls/Urls';
import { Loader2, Lock } from 'lucide-react';
import PasswordChange from '../Profile/PasswordChange';

const ForgotPassword = ({ loginedUser }) => {
  const [Mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const [user, setUser] = useState()

  const [stage2, setStage2] = useState(false)
  const [stage3, setStage3] = useState(false)
  const [stage4, setStage4] = useState(false)
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false)

  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleInputChange = (e) => {
    setMobile(e.target.value);
  };

  useEffect(() => {
    if (loginedUser) {
      setUser(loginedUser);
      setStage2(true)
    }
  }, [loginedUser]);


  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 300000);
  };

  const handleFormSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    // Simulate an API call
    if (Mobile.length === 10) {

      axios.post(`${BASE_URL}/find-user`, { Mobile }, { withCredentials: true }).then((response) => {
        console.log('find acc', response);
        if (response.data.status) {
          setUser(response.data.user)

          setMessage('')
          setStage2(true)
          console.log('user', user);
          setLoading(false)
        } else {
          setLoading(false)
          setMessage(response.data.message)
        }


      })




    } else {
      setLoading(false)
      setMessage('Please enter a valid 10-digit mobile number.');
    }


  };

  const sendOtpToEmail = () => {
    setLoading(true)
    // Add logic to send OTP
    console.log("OTP sent to", user.Email);
    axios.post(`${BASE_URL}/forgot-send-otp`, user, { withCredentials: true }).then((response) => {
      console.log('send otp', response);

      if (response.data.status) {
        setStage3(true)
        setLoading(false)
      } else {
        setNotification(response.data.message || "Error sending OTP.");
        setMessage(response.data.message || "Error sending OTP.")
         setLoading(false)
      }
    }) 
   
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setNotification("Please enter OTP", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/verify-otp`, { otp, ...user, forgot: true });
      console.log('rejndjnd', response);

      if (response.data.status) {
        setNotification({ show: true, message: "Otp Verified Successfully!", type: "success" });
        setStage4(true)
        setLoading(false)
      } else {
        // Show error notification instead of setting info
        setNotification({ show: true, message: response.data.message, type: "error" });


        setOtp(""); // Clear OTP input on error
      }
    } catch (error) {
      setNotification(
        error.response?.data?.message || "Something went wrong. Please try again.",
        "error"
      );
      setOtp(""); // Clear OTP input on error
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={`min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 transition-colors duration-300`}>

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

      <div className="max-w-md w-full p-8 border rounded-lg shadow-lg bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Forgot Password</h2>
        </div>


        {stage4 ? (

          <PasswordChange user={user} isForgot={true} />

        ) :
          stage3 ? (

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">OTP has been sent to {user.Email}</p>
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
                </div>
                  : "Verify OTP"}
              </button>

              <div className="p-4 text-center text-sm">
                <p>{message}</p>
              </div>

            </form>

          ) : stage2 ? (
            <>
              <p className="mt-4 text-sm font-medium">Account Details</p>

              {/* User Name */}
              <div className="mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Name:</span> {user?.Name || "N/A"}
                </p>
              </div>

              {/* User Mobile */}
              <div className="mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Mobile:</span> {user?.Mobile || "N/A"}
                </p>
              </div>

              {/* User Email */}
              <div className="mt-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Email:</span>{" "}
                  {user?.Email
                    ? `${user.Email[0]}****${user.Email.slice(-12)}`
                    : "N/A"}
                </p>
              </div>

              <div className="p-4 text-center text-sm">
                <p className='text-red-600'>{message}</p>
              </div>

              {/* Send OTP Button */}
              <button
                className="mt-6 w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-200"
                onClick={sendOtpToEmail}
              >
                {loading ? <div className="flex justify-center items-center">
                  <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                </div>
                  :
                  'Send OTP to Email'
                }
              </button>



            </>
          ) : (
            <div className="max-w-md w-full p-8  bg-white text-gray-900 dark:bg-gray-900 dark:text-white">


              <p className="mt-4 text-sm">
                Enter your mobile number, and we'll send a OTP to your email.
              </p>

              <form onSubmit={handleFormSubmit} className="mt-6">
                <div className="mb-4">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    id="Mobile"
                    name="Mobile"
                    value={Mobile}
                    onChange={handleInputChange}
                    className="mt-2 w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter your mobile number"
                  />
                </div>

                {message && (
                  <div className="p-4 text-red-600 text-center text-sm">
                    <p>{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {loading ?
                    <div className="flex justify-center items-center">
                      <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                    </div>

                    :
                    ' Find My Account'
                  }
                </button>
              </form>
            </div>
          )}
      </div>
    </div>

  );
};

export default ForgotPassword;
