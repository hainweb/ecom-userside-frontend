import { Loader2 } from "lucide-react";
import React, { useState } from "react";

const AddressForm = ({ addressData, setAddressData, onSubmit, submitButtonText, onCancel, loading }) => {
    const [errors, setErrors] = useState({});

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateAddressFields = () => {
        const newErrors = {};
        if (!addressData.Name) newErrors.Name = "Name is required.";
        if (!addressData.Mobile) newErrors.Mobile = "Mobile is required.";
        if (!addressData.Address) newErrors.Address = "Address is required.";
        if (!addressData.Pincode) newErrors.Pincode = "Pincode is required.";
        if (addressData.Pincode.length<6) newErrors.Pincode = "Enter a valid Pincode";
        if (addressData.Address.length<8) newErrors.Address = "Enter a valid Address";
        if (addressData.Mobile.length<10) newErrors.Mobile = "Enter a valid Mobile";
        if (addressData.City.length<4) newErrors.Pincode = "Enter a valid City";
        if (!addressData.State) newErrors.State = "State is required.";
        if (!addressData.City) newErrors.City = "City is required.";
        if (!addressData.Type) newErrors.Type = "Address type is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateAddressFields()) {
            onSubmit();
        }
    };

    return (
        <div className="mt-2 space-y-4 min-h-screen overflow-y-auto bg-white dark:bg-gray-800 mb-20 sm:mb-20 md:mb-0">

            <div className="w-full">
                <input
                    type="text"
                    name="Name"
                    value={addressData.Name}
                    onChange={handleAddressChange}
                    placeholder="Name"
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                />
                {errors.Name && <p className="text-red-500 text-xs">{errors.Name}</p>}
            </div>

            <input
                type="text"
                name="Mobile"
                value={addressData.Mobile}
                onChange={handleAddressChange}
                placeholder="Mobile"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Mobile ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.Mobile && <p className="text-red-500 text-xs">{errors.Mobile}</p>}

            <textarea
                name="Address"
                value={addressData.Address}
                onChange={handleAddressChange}
                placeholder="Enter your address"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                rows={3}
            />
            {errors.Address && <p className="text-red-500 text-xs">{errors.Address}</p>}

            <input
                type="text"
                name="Pincode"
                value={addressData.Pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Pincode ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.Pincode && <p className="text-red-500 text-xs">{errors.Pincode}</p>}

            <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    State
                </label>
                <select
                    name="State"
                    value={addressData.State}
                    onChange={handleAddressChange}
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.State ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                >
                    <option value="">Select State</option>
                    <option value="kerala">Kerala</option>
                    <option value="tamilnadu">Tamil Nadu</option>
                </select>
                {errors.State && <p className="text-red-500 text-xs">{errors.State}</p>}
            </div>

            <input
                type="text"
                name="City"
                value={addressData.City}
                onChange={handleAddressChange}
                placeholder="City"
                className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.City ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    }`}
            />
            {errors.City && <p className="text-red-500 text-xs">{errors.City}</p>}

            <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Type
                </label>
                <select
                    name="Type"
                    value={addressData.Type}
                    onChange={handleAddressChange}
                    className={`border p-2 rounded w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${errors.Type ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                >
                    <option value="">Select Type</option>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                </select>
                {errors.Type && <p className="text-red-500 text-xs">{errors.Type}</p>}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-600 dark:hover:bg-green-700"
                >
                    {loading ?
                        <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                        :
                        
                        'Submit'
                    }
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-600 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressForm;
