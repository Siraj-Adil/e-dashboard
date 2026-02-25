# 🖥️ SafeMart – Secured Full-Stack Platform

**SafeMart** SafeMart is a MERN full-stack CRUD application for managing a personal e-commerce product list.
Users can add, update, and delete products. It features a **React 18 frontend** and a **Node.js/Express backend**, with secure authentication and data handling.  
This project demonstrates advanced security practices including **JWT-based authentication**, **HTTP-only refresh tokens**, **bcrypt password hashing**, and **role-based access control**.

---

## 🚀 Features

- RESTful APIs with **Node.js/Express**  
- JWT authentication with **access & refresh tokens**  
- Automatic session expiration and secure logout  
- Authorization middleware enforcing user-specific access  
- Password hashing with **bcrypt**  
- Protected frontend routes with centralized auth state  
- React dashboard with interactive components, notifications, and routing  
- MongoDB & MySQL integration for flexible data storage  
- CORS and cookie-parser for secure API communication  

---

## 👨‍💻 Technologies Used

### Frontend
- **React 18** with functional components and hooks  
- **React Router DOM v7** for navigation  
- **Styled Components** for CSS-in-JS styling  
- **React Hot Toast** for user-friendly notifications  
- **Vite** for fast development and bundling  
- **ESLint** for code linting  

### Backend
- **Node.js & Express** for API and server  
- **MongoDB** and **MySQL** for database management  
- **Mongoose** for MongoDB object modeling  
- **dotenv** for environment variable management  
- **bcrypt** for password hashing  
- **jsonwebtoken** for secure authentication  
- **cookie-parser** and **CORS** for secure request handling  

---

## Setup Instructions

1. Clone the repo:
```bash
git clone https://github.com/Siraj-Adil/e-dashboard.git
cd e-dadhboard
```

2. Setup Backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev 
```

3. Setup Frontend:
```bash
cd ../frontend
npm install
npm run dev
```

Backend runs on [http://localhost:5000](http://localhost:5000)
Frontend runs on [http://localhost:5173](http://localhost:5173)

---

Note:
Both frontend and backend must run simultaneously.
Ensure .env variables are set correctly.
JWT access & refresh tokens enforce secure session handling.
Backend supports multiple databases depending on your configuration.

Created by **Siraj Adil**