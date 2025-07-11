import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../Urls/Urls";
import { useParams } from "react-router-dom";
import OrderTracking from "./Order-Components/OrderTracking";
import ProductCard from "./Order-Components/ProductCard";
import { generateInvoice } from "../../utils/generateInvoice";

const OrderPage = () => {
  const [orderTrack, setOrderTrack] = useState([]);
  const [products, setProducts] = useState([]);
  const { Id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/view-orders-products/${Id}`,
          {
            withCredentials: true,
          }
        );
        console.log("view ordered pro", response.data.products);

        setProducts(response.data.products);
        setOrderTrack(response.data.ordertrack);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchData();
  }, [Id]);

  if (loading) {
    return (
      <div className="row">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <br />
            <p>Loading, please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <OrderTracking orderTrack={orderTrack} setOrderTrack={setOrderTrack} />

      <div className="mx-auto bg-white dark:bg-gray-800 shadow-xl ">
        <div className="container mx-auto bg-white dark:bg-gray-800 flex justify-center items-center">
          <button
            onClick={() => generateInvoice(orderTrack, products)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white mb-8 px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            Download Invoice
          </button>
        </div>
      </div>

      <ProductCard products={products} orderTrack={orderTrack} />
    </>
  );
};

export default OrderPage;
