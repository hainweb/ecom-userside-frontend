import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';
import { Link } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';

const Wishlist = () => {
    const [loading, setLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishRemove, setWishRemove] = useState({});

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const wishData = await axios.get(`${BASE_URL}/wishlist`, { withCredentials: true });
                setWishlistItems(wishData.data.wishlistItems);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const toggleWishlist = (event, productId) => {
        event.preventDefault();
        event.stopPropagation();

        setWishRemove((prev) => ({ ...prev, [productId]: true }));

        axios
            .get(`${BASE_URL}/add-to-Wishlist/${productId}`, { withCredentials: true })
            .then((response) => {
                if (response.data.status) {
                    setWishlistItems((prevItems) =>
                        prevItems.filter((item) => item.product._id !== productId)
                    );
                }
            })
            .catch((error) => {
                console.error('Error removing from wishlist:', error);
            })
            .finally(() => {
                setWishRemove((prev) => ({ ...prev, [productId]: false }));
            });
    };

    return (
        <section className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 mt-10">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">
                    My Wishlist
                </h2>
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlistItems.map((item) => (
                            item.product && (
                                <div
                                    key={item.product?._id}
                                    className="group bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 relative"
                                >
                                    <button
                                        className="absolute top-2 right-2 z-10 bg-red-500/90 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                                        onClick={(event) => toggleWishlist(event, item.product?._id)}
                                        aria-label="Remove from wishlist"
                                    >
                                        {wishRemove[item.product?._id] ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <X className="w-4 h-4" />
                                        )}
                                    </button>
                                    <Link to={`/product/${item.product?._id}`} className="block">
                                        <div className="aspect-square overflow-hidden rounded-t-xl">
                                            <img
                                                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                                src={item.product?.thumbnailImage}
                                                alt={item.product?.Name}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h5 className="font-semibold text-base md:text-lg text-gray-800 dark:text-gray-100 truncate">
                                                {item.product?.Name}
                                            </h5>
                                            <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                Rs. {item.product?.Price?.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                                {item.product?.Description}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        ))}

                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                            Your wishlist is empty!
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Wishlist;