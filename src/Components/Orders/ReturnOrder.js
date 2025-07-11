import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Urls/Urls";
import { Loader2 } from "lucide-react";

const ReturnOrder = () => {
    const [selectedReason, setSelectedReason] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const proId = queryParams.get("proId");
    const orderId = queryParams.get("orderId");

    const navigate = useNavigate();

    const reasons = [
        "Received wrong item",
        "Item damaged",
        "Quality not as expected",
        "Other",
    ];

    const handleReasonChange = (reason) => {
        setSelectedReason(reason);
        setError(""); // Clear error on selecting a reason
        if (reason !== "Other") {
            setMessage(""); // Clear message if not "Other"
        }
    };

    const validateForm = () => {
        if (!selectedReason) {
            setError("Please select a reason for return.");
            return false;
        }
        if (selectedReason === "Other" && message.trim() === "") {
            setError("Please provide a message for 'Other' reason.");
            return false;
        }
        if (selectedReason === "Other" && message.trim().length < 5) {
            setError("Please provide a valid reason.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return; // Prevent form submission if validation fails
        }

        const returndata = {
            proId,
            orderId,
            reason: selectedReason,
            ...(selectedReason === "Other" && { message: message.trim() }),
        };

        try {
            setLoading(true)
            const response = await axios.post(
                `${BASE_URL}/return-product`,
                { returndata },
                { withCredentials: true }
            );
            setLoading(false)

            if (response.data.status) {
                alert(response.data.message);
                navigate(`/view-orders-products/${orderId}`);
            } else {
                alert("Failed to return the product: " + response.data.message);
            }
        } catch (error) {
            setError("Error returning the product: " + error);
        }

        // Reset form
        setSelectedReason("");
        setMessage("");
        setError("");
    };

    return (
       
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 items-center justify-center">
  <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-md mt-12">
    <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
      Return Product
    </h2>
    <form onSubmit={handleSubmit}>
      <label className="block text-lg font-medium mb-2 text-gray-900 dark:text-gray-200">
        Reason for Return:
      </label>
      <div className="space-y-2 mb-4">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-center">
            <input
              type="radio"
              id={reason}
              name="reason"
              value={reason}
              checked={selectedReason === reason}
              onChange={() => handleReasonChange(reason)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={reason}
              className="ml-2 text-gray-700 dark:text-gray-300"
            >
              {reason}
            </label>
          </div>
        ))}
      </div>

      {selectedReason === "Other" && (
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-lg font-medium mb-2 text-gray-900 dark:text-gray-200"
          >
            Message:
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please provide details for 'Other' reason..."
          />
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
          </div>
        ) : (
          'Submit'
        )}
      </button>
    </form>
  </div>
</div>
    );
};

export default ReturnOrder;
