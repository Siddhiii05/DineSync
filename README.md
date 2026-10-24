# 🍽️ DineSync — Restaurant Reservation Platform

DineSync is a MERN stack web application that allows users to explore restaurants and book tables online. It provides restaurant owners with tools to manage their restaurant profiles and reservations, along with an admin dashboard to manage platform operations.

## ✨ Features

### 👤 User Features
- User registration and login.
- Browse and explore restaurants.
- Search and discover restaurants by cuisine and other details.
- View restaurant information and availability.
- Book tables at restaurants.
- View booking confirmations and reservation details.

### 🏪 Restaurant Owner Features
- Owner authentication and protected dashboard.
- Register a restaurant on the platform.
- Upload restaurant images using Cloudinary.
- Manage restaurant information.
- View customer reservations.

### 🛡️ Admin Features
- Admin authentication and protected dashboard.
- View platform statistics.
- Review restaurant registration requests.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- Cloudinary


## ⚙️ Prerequisites

Before running DineSync, make sure you have installed:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB installation
- Cloudinary account for image uploads

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Siddhiii05/DineSync.git
cd DineSync
```

### 2. Set Up the Backend

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and configure the following environment variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholder values with your actual credentials.

**Important:** Never commit your `.env` file or expose your API secrets in a public repository.

Start the backend using the script defined in `server/package.json`. For example, if a `dev` script is configured:

```bash
npm run start
```

### 3. Set Up the Frontend

Open a second terminal and navigate to the client directory:

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, typically:

```text
http://localhost:5173
```

## 🔐 Authentication and Authorization

DineSync uses JSON Web Tokens (JWT) for authentication and bcrypt for password hashing.

Protected routes restrict access to authenticated users. Role-based authorization separates user, restaurant owner, and administrator functionality.

## 🖼️ Image Uploads

Cloudinary is used to store restaurant images. Multer processes uploaded image files on the backend, and the resulting Cloudinary image URLs are stored with restaurant data in MongoDB.

## 🗄️ Database

DineSync uses MongoDB to store application data. Mongoose provides schemas and models for managing database records, including user, restaurant, and booking information.

## 🔮 Future Enhancements

Potential improvements include:

- Online payment integration.
- Email and booking confirmation notifications.
- Restaurant ratings and reviews.
- Advanced restaurant filtering and sorting.
- Improved reservation availability management.
- Deployment with production environment configuration.

## 👩‍💻 Author

**Siddhi Bobade**

GitHub: [Siddhiii05](https://github.com/Siddhiii05)
