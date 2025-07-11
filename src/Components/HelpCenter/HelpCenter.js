import React, { useState } from 'react';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { BASE_URL } from '../Urls/Urls';

const HelpCenter = () => {
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const toggleContactForm = () => {
    setIsContactFormVisible(!isContactFormVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!formData.name || !formData.email || !formData.message) {
      setSubmissionStatus('All fields are required!');
      return; // Ensure all fields are filled
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/contact-form`, formData); // Adjust the endpoint as needed
      if(response.data.status){
      alert('Message sent successfully!');
      setIsContactFormVisible(false)
       
      setFormData({ name: '', email: '', message: '' }); // Clear the form after submission
      }
    } catch (error) {
      setSubmissionStatus('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen mt-12">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-semibold text-white">Help Center</h1>
          <p className="mt-2 text-white">Find answers to your questions or get in touch with support.</p>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">How can I track my order?</h3>
            <p className="text-gray-700 dark:text-gray-300">You can track your order by visiting the "Orders" section of your account , View details. We will send you updates via email as well.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">How do I return a product?</h3>
            <p className="text-gray-700 dark:text-gray-300">To return a product, by going to your order history and View details There is an Option to Retun. You can also contact our support team for assistance.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">What payment methods do you accept?</h3>
            <p className="text-gray-700 dark:text-gray-300">We accept various payment methods including credit cards, debit cards, and online payment services like PayPal and Razorpay.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <h3 className="text-lg font-semibold">How do I cancel my order?</h3>
            <p className="text-gray-700 dark:text-gray-300">You can cancel your order by going to your order history and View details . If the order is still being processed, you will have the option to cancel it.</p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-6">Need Further Assistance?</h2>
        <p className="mb-4">If you need any further assistance, feel free to reach out to our support team!</p>
        <button
          onClick={toggleContactForm}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {isContactFormVisible ? 'Hide Contact Form' : 'Show Contact Form'}
        </button>

        {isContactFormVisible && (
          <form onSubmit={handleSubmit} className="mt-8 p-6 bg-white dark:bg-gray-700 shadow-md rounded-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="mt-2 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submissionStatus && (
              <p className="mt-4 text-red-500">{submissionStatus}</p>
            )}
          </form>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HelpCenter;
