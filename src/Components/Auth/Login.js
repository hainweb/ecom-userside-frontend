import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = ({ setUser, setCartCount }) => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    Mobile: '',
    Password: '',
  });
  const [errors, setErrors] = useState({
    Mobile: '',
    Password: '',
  });
  const [loginErr, setLoginErr] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { Mobile: '', Password: '' };

    // Mobile validation
    if (!formData.Mobile) {
      newErrors.Mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.Mobile)) {
      newErrors.Mobile = 'Please enter a valid 10-digit mobile number';
      isValid = false;
    }

    // Password validation
    if (!formData.Password) {
      newErrors.Password = 'Password is required';
      isValid = false;
    } 

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    axios
      .post(`${BASE_URL}/login`, formData, { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          setUser(response.data.user);
          axios
            .get(`${BASE_URL}/products`, { withCredentials: true })
            .then((cartResponse) => {
              setCartCount(cartResponse.data.cartCount);
            })
            .catch((error) => console.error('Error fetching cart count:', error));
          navigate('/');
        } else {
          if (response.data.timeLeft) {
            setTimeLeft(response.data.timeLeft);
          } else {
            setLoginErr(response.data.message || 'Invalid mobile or password');
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoginErr('Something went wrong!');
        setLoading(false);
      });
  };
  

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orb */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-300/70 dark:from-cyan-600/50 to-transparent blur-xl opacity-20"
          style={{
            transform: `translate(${mousePosition.x / 10}px, ${mousePosition.y / 10}px)`,
          }}
        />

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(56,189,248,0.05)_95%),linear-gradient(90deg,transparent_95%,rgba(56,189,248,0.05)_95%)] dark:bg-[linear-gradient(transparent_95%,rgba(56,189,248,0.02)_95%),linear-gradient(90deg,transparent_95%,rgba(56,189,248,0.02)_95%)] bg-[length:40px_40px] animate-[grid-move_20s_linear_infinite]" />

        {/* Floating Elements */}
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-br from-blue-100/10 dark:from-blue-500/5 to-transparent rounded-full blur-lg animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              animationDelay: `${Math.random() * -10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Login</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-10 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 dark:text-gray-200"
              type="number"
              name="Mobile"
              value={formData.Mobile}
              onChange={handleChange}
              placeholder="Mobile"
            />
            
          </div>
          {errors.Mobile && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.Mobile}</p>
            )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 dark:text-gray-200"
              type={showPassword ? "text" : "password"}
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
           
          </div>
           {errors.Password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.Password}</p>
            )}

          {loginErr && !timeLeft && (
            <p className="text-red-500 dark:text-red-400 text-sm">{loginErr}</p>
          )}
          {timeLeft !== null && timeLeft > 0 && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              Too many failed attempts. Please try again in {timeLeft} seconds.
            </p>
          )}

          <Link to="/signup" className="block text-center text-blue-500 dark:text-blue-400 text-sm hover:underline">
            Don't have an account? Sign up
          </Link>
          <Link to="/forgot-password" className="block text-center text-blue-500 dark:text-blue-400 text-sm hover:underline">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 dark:bg-blue-600 text-white font-bold rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none flex justify-center items-center disabled:opacity-50"
            disabled={loading || (timeLeft !== null && timeLeft > 0)}
          >
            {loading ? (
              <div className="flex space-x-1">
                 <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
