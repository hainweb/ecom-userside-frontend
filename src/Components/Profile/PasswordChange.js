import React, { useEffect, useState } from 'react';
import { EyeIcon, EyeOffIcon, Loader2, LockIcon } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';

const PasswordChange = ({ user, setView, isForgot }) => {
    const [ loading, setLoading ] = useState(false)
    const [formData, setFormData] = useState({
        previousPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        previous: false,
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        requirements: {
            length: false,
            lowercase: false
        }
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const userId = user._id;

    const validatePasswordStrength = (password) => {
        const requirements = {
            length: password.length >= 6,
            lowercase: /[a-z]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;
        setPasswordStrength({ score, requirements });
        return score;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'newPassword') {
            validatePasswordStrength(value);
        }
    };

    useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev <= 1 ? 0 : prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (passwordStrength.score < 2) {
            setError('Password must meet all the criteria: at least 6 characters, one uppercase letter, one number, and one special character');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New Password and Confirm Password do not match');
            return;
        }

        if (!isForgot && formData.newPassword === formData.previousPassword) {
            setError('New password must be different from the previous password');
            return;
        }
        setLoading(true)
        try {
            const payload = isForgot
                ? { userId, isForgot, newPassword: formData.newPassword }
                : { userId, previousPassword: formData.previousPassword, newPassword: formData.newPassword };

            const response = await axios.post(`${BASE_URL}/change-password`, payload);

            if (response.data.status) {
                setSuccessMessage(response.data.message);
                setFormData({ previousPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordStrength({ score: 0, requirements: { length: false, lowercase: false } });
                setShowSuccessModal(true);
            } else {
                setError(response.data.message || 'An error occurred.');
                if (response.data.remainingTime) {
                    setTimeLeft(response.data.remainingTime);
                }
            }
        } catch (err) {
            console.error('Error:', err);
            setError('An error occurred while changing your password. Please try again.');
        }
        setLoading(false)
    };

    const getStrengthColor = () => {
        const colors = ['bg-green-500', 'bg-yellow-500'];
        return colors[passwordStrength.score] || colors[0];
    };

    return (
        <div className=" bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-8 mb-12 sm:mb-0 p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <LockIcon className="w-6 h-6" />
                        Change Password
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                            {error}
                        </div>
                    )}
                    {timeLeft !== null && timeLeft > 0 && (
                        <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
                            Too many attempts. Please wait {timeLeft} seconds.
                        </div>
                    )}

                    {!isForgot && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Previous Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.previous ? "text" : "password"}
                                    name="previousPassword"
                                    value={formData.previousPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, previous: !prev.previous }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                >
                                    {showPasswords.previous ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            <button onClick={()=>setView('forgot')} className="block text-center text-blue-500 dark:text-blue-400 text-sm hover:underline">
                                        Forgot Password?
                                      </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                {showPasswords.new ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-1 h-1">
                                {[...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-full w-full rounded-full transition-colors ${i < passwordStrength.score ? getStrengthColor() : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                            <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                                <li className={passwordStrength.requirements.length ? 'text-green-500' : ''}>
                                    ✓ At least 6 characters
                                </li>
                                <li className={passwordStrength.requirements.lowercase ? 'text-green-500' : ''}>
                                    ✓ At least one lowercase letter
                                </li>

                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                {showPasswords.confirm ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>     
        
                    <button
    type="submit"
    disabled={timeLeft > 0 || passwordStrength.score < 2}
    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex justify-center items-center"
> 
    {loading ? 
        <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
        : 
        'Change Password'
    }
</button>
                            
                        
                    
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Password Changed Successfully
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            You can now log in with your new password or return to the homepage.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to='/logout'
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            >
                                Login
                            </Link>
                            <Link
                                to='/'
                                className="w-full py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                            >
                                Go to Home
                            </Link>
                        </div>
                        {!isForgot ? (
                            <p onClick={() => setShowSuccessModal(false)} className="block cursor-pointer text-center text-blue-500 text-sm hover:underline">
                                Stay here!
                            </p>
                        ) : ''}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordChange;
