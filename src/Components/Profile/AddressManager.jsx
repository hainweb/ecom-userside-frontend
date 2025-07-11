import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu } from "@headlessui/react";
import { Loader2, MoreVertical } from "lucide-react";
import { BASE_URL } from "../Urls/Urls";
import AddressForm from "./AddressForm";

const AddressManager = ({ view, setView, user }) => {
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressData, setAddressData] = useState({
    Name: user?.Name || "",
    Mobile: user?.Mobile || "",
    Address: "",
    Pincode: "",
    State: "",
    City: "",
    Type: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);

      try {
        setLoading(true);
        setAddressLoading(true);
        const response = await axios.get(`${BASE_URL}/get-address`, {
          withCredentials: true,
        });
        setLoading(false);
        if (response.data.status) {
          setAddresses(response.data.userAddress);
          setAddressLoading(false);
        }
        setLoading(false);
      } catch (error) {
        setAddressLoading(false);
        console.error("Error fetching addresses:", error);
        alert("Failed to fetch addresses. Please try again later.");
      }
      setLoading(false);
    };
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/delete-address`,
          { addressId },
          { withCredentials: true }
        );
        if (response.data.status) {
          setAddresses(response.data.Address);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address. Please try again later.");
      }
      setLoading(false);
    }
  };

  const startEditingAddress = (address) => {
    setEditingAddressId(address._id);
    setAddressData({
      Name: address.Name,
      Mobile: address.Mobile,
      Address: address.Address,
      Pincode: address.Pincode,
      State: address.State,
      City: address.City,
      Type: address.Type,
    });
  };

  return (
    <>
      {view === "manageAddress" ? (
        <>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 sm:mt-0 md:mt-0">
            Manage Addresses
          </h2>
          {addressLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white" />
          ) : (
            ""
          )}
          <ul className="mt-4 space-y-4">
            {Array.isArray(addresses) && addresses.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No addresses available.
              </p>
            ) : (
              Array.isArray(addresses) &&
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingAddressId === addr._id ? (
                    <AddressForm
                      addressData={addressData}
                      setAddressData={setAddressData}
                      loading={loading}
                      onSubmit={async () => {
                        setLoading(true);
                        try {
                          const response = await axios.post(
                            `${BASE_URL}/edit-user-address`,
                            { ...addressData, _id: editingAddressId },
                            { withCredentials: true }
                          );
                          if (response.data.status) {
                            setAddresses(response.data.updatedAddress);
                            setEditingAddressId(null);
                            setAddressData({
                              Name: user?.Name || "",
                              Mobile: user?.Mobile || "",
                              Address: "",
                              Pincode: "",
                              State: "",
                              City: "",
                              Type: "",
                            });
                          }
                        } catch (error) {
                          console.error("Error updating address:", error);
                          alert(
                            "Failed to update address. Please try again later."
                          );
                        }
                        setLoading(false);
                      }}
                      submitButtonText="Update Address"
                      onCancel={() => {
                        setEditingAddressId(null);
                        setAddressData({
                          Name: user?.Name || "",
                          Mobile: user?.Mobile || "",
                          Address: "",
                          Pincode: "",
                          State: "",
                          City: "",
                          Type: "",
                        });
                      }}
                    />
                  ) : (
                    <AddressCard
                      address={addr}
                      onEdit={() => startEditingAddress(addr)}
                      onDelete={() => handleDeleteAddress(addr._id)}
                      loading={loading}
                    />
                  )}
                </div>
              ))
            )}
          </ul>

          <button
            className="mt-4 bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => setView("addAddress")}
          >
            Add Address
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 sm:mt-0 md:mt-0">
            Add Address
          </h2>
          <AddressForm
            addressData={addressData}
            setAddressData={setAddressData}
            onSubmit={async () => {
              try {
                const response = await axios.post(
                  `${BASE_URL}/add-address`,
                  addressData,
                  { withCredentials: true }
                );
                console.log("reghbbns", response);

                if (response.data.status) {
                  setAddresses(response.data.address);
                  setAddressData({
                    Name: user?.Name || "",
                    Mobile: user?.Mobile || "",
                    Address: "",
                    Pincode: "",
                    State: "",
                    City: "",
                    Type: "",
                  });
                  setView("manageAddress");
                } else {
                  alert(response.data.message);
                }
              } catch (error) {
                console.error("Error adding address:", error);
                alert("Failed to add address. Please try again later.");
              }
            }}
            submitButtonText="Save Address"
          />
        </>
      )}
    </>
  );
};

const AddressCard = ({ address, onEdit, onDelete, loading }) => (
  <li className="border-b last:border-b-0 pb-4 border-gray-200 dark:border-gray-600">
    <div className="flex justify-between items-start">
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Type: {address.Type}
        </p>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {address.Name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {address.Mobile}
        </p>
      </div>
      <Menu as="div" className="relative">
        <Menu.Button className="inline-flex justify-center items-center p-2 rounded-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500">
          <MoreVertical className="h-4 w-4" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-600" : ""
                } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                onClick={onEdit}
              >
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100 dark:bg-gray-600" : ""
                } group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                onClick={onDelete}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin dark:text-white" />
                ) : (
                  "Delete"
                )}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
    <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
      <p>
        {address.Pincode} | {address.City}, {address.State}
      </p>
      <p>{address.Address}</p>
    </div>
  </li>
);

export default AddressManager;
