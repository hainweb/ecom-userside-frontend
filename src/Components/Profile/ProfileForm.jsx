import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Loader2 } from "lucide-react";

const ProfileForm = ({ user }) => {
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [profileData, setProfileData] = useState({
        Name: user?.Name || "",
        LastName: user?.LastName || "",
        Gender: user?.Gender || "",
        Email: user?.Email || "",
        Mobile: user?.Mobile || "",
        CreatedAt:user?.CreatedAt||''
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateProfileFields = () => {
        const newErrors = {};
        if (!profileData.Name) newErrors.Name = "First name is required.";
        if (!profileData.LastName) newErrors.LastName = "Last name is required.";
        if (!profileData.Gender) newErrors.Gender = "Gender is required.";
        if (!profileData.Email || !/^\S+@\S+\.\S+$/.test(profileData.Email)) {
            newErrors.Email = "Please enter a valid email address.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSave = async () => {
        setLoading(true)
        if (!validateProfileFields()) return;
        try {
            const response = await axios.post(
                `${BASE_URL}/edit-profile`,
                profileData,
                { withCredentials: true }
            );
            if (response.data.status) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again later.");
        }

        setLoading(false)
    };

    return (
        <>



            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white mt-2 sm:mt-0 md:mt-0">Personal Information</h2>
            <form className="space-y-4">
                {/* Form fields */}
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <input
                            type="text"
                            name="Name"
                            value={profileData.Name}
                            onChange={handleProfileChange}
                            placeholder="First Name"
                            className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Name ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                            readOnly={!isEditing}
                        />
                        {errors.Name && <p className="text-red-500 text-xs">{errors.Name}</p>}
                    </div>
                    <div className="w-1/2">
                        <input
                            type="text"
                            name="LastName"
                            value={profileData.LastName}
                            onChange={handleProfileChange}
                            placeholder="Last Name"
                            className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.LastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
                            readOnly={!isEditing}
                        />
                        {errors.LastName && <p className="text-red-500 text-xs">{errors.LastName}</p>}
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Your Gender</label>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="radio"
                                name="Gender"
                                value="Male"
                                checked={profileData.Gender === "Male"}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                            Male
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="radio"
                                name="Gender"
                                value="Female"
                                checked={profileData.Gender === "Female"}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                            Female
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="radio"
                                name="Gender"
                                value="Other"
                                checked={profileData.Gender === "Other"}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                            Other
                        </label>
                    </div>
                    {errors.Gender && <p className="text-red-500 text-xs">{errors.Gender}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                    <input
                        type="email"
                        name="Email"
                        value={profileData.Email}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                        readOnly
                    />
                    {errors.Email && <p className="text-red-500 text-xs">{errors.Email}</p>}
                </div>

                {/* Mobile */}
                <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Mobile</label>
                    <input
                        type="text"
                        name="Mobile"
                        value={profileData.Mobile}
                        className="border p-2 rounded w-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                        readOnly
                    />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
  Created on {new Date(profileData.CreatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
</p>

 
                {/* Action buttons */}
                <div className="flex justify-end mt-4 space-x-2">
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleProfileSave}
                            className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-600 dark:hover:bg-green-700"
                        >
                            {loading ?
                                <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                                :
                                'Save'
                            }
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};

export default ProfileForm;
