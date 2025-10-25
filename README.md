# User Frontend | Multi-Role E-Commerce Platform

This repository contains the **User Panel Frontend** for the **Multi-Role E-Commerce Platform** built using the **MERN Stack**.  
It provides a seamless shopping experience with advanced product discovery, category-based browsing, real-time order tracking, and user reviews — all wrapped in a modern, responsive interface.

---

## Features

### Authentication
- OTP-based signup and password reset via email  
- Secure login using **JWT** and **Express Session**  
- Persistent session management for smooth UX  

---

### User Experience
- **Dynamic Homepage**
  - Auto-updating banners and category sliders (managed by Super Admin)
  - Each category navigates dynamically to its dedicated page  
- Fully responsive design using **TailwindCSS**
- Dark/Light mode toggle for accessibility and customization  

---

### Shopping & Product Discovery

- **Advanced Product Discovery Page**
  - Powerful **search**, **filter**, and **sorting** options (price, rating, popularity, etc.)
  - Pagination and lazy loading for smooth browsing  

- **Category-based Product View**
  - Clickable category and offer slider that dynamically loads respective product listings
  - **Detailed Product Pages**: Clicking a product opens a complete product detail page

- **User Reviews & Ratings**
  - Users can review and rate products only after purchase  
  - Reviews displayed on product detail pages  

---

### Cart, Wishlist & Checkout
- Add, remove, and manage items in **Cart** and **Wishlist** seamlessly
- **Real-time stock updates**: incrementing/decrementing cart items instantly adjusts available stock
- **Auto-generated coupons** based on Super Admin rules
- Integrated **Razorpay** payment gateway for secure transactions
- Download **PDF invoices** after order completion  

---

### Order Management
- Real-time **order tracking** and status updates  
- Options for **order cancellation** and **product returns**
- Delivery updates fetched dynamically from the delivery panel  

---

### Profile Management
- Edit personal information and profile picture  
- Manage multiple **delivery addresses**  
- View **order history** and product reviews  

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend Framework** | React.js |
| **State Management** | Context API, Local state |
| **Styling** | TailwindCSS |
| **Routing** | React Router DOM |
| **API Communication** | Axios |
| **Payments** | Razorpay Integration |
| **Authentication** | Express Session |

---


## Environment Variables

Create a `.env` file in the **root directory** of the project with the following variables:

```env
# Base URL of your backend API
# Use full URL in development (e.g., localhost), and '/api' in production
# Example for development:
REACT_APP_BASE_URL=http://localhost:5000/api
# Example for production:
# REACT_APP_BASE_URL=/api

# Analytics API endpoint
REACT_APP_ANALYTICS_URL=https://hain-analytics-backend.onrender.com/api/analytics/log

```

---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/hainweb/ecom-userside-frontend.git

# Navigate to project directory
cd ecom-userside-frontend

# Install dependencies
npm install

# Start the development server
npm start
