# ChillBites

Welcome to ChillBites! This is my project for our Web Development course. It's a full-stack food delivery website where I've put together some of my favorite Filipino dishes.

## Project Structure (MVC)

I've organized the project using the MVC (Model-View-Controller) pattern to keep the backend logic separate from the frontend.

- **backend/**: This is where all the server-side code lives.
  - **models/**: Defines the data structure for Users, Menu, and Orders using Mongoose.
  - **controllers/**: Contains the actual logic for handling what happens when someone hits an API endpoint.
  - **routes/**: Maps the URLs to the controllers.
  - **config/**: Just the database connection setup.
- **public/**: All the frontend files like HTML, CSS, JS, and images.
- **server.js**: The main file that starts up the whole application.
- **.env**: Where I keep my secret stuff like the database link and port number.

## How to Run it on Your Machine

### 1. What you need
Make sure you have Node.js installed and access to a MongoDB database (local or Atlas).

### 2. Getting started
1. Clone the repo:
   ```bash
   git clone https://github.com/Rcabugnason025/ChillBitesWstG6.git
   cd ChillBitesWstG6
   ```
2. Install the packages:
   ```bash
   npm install
   ```
3. Setup your environment:
   Create a `.env` file in the root and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ALLOW_NO_DB=false
   
   ```
   You can copy from `.env.example` then fill in the values.

   For file storage (Milestone 2), this project supports Firebase Storage from the Admin page:
   - Open `public/scripts/firebaseConfig.js`
   - Paste your Firebase Web App config there (Firebase Console → Project Settings → Your apps → Web app)
   - Enable Storage (Firebase Console → Build → Storage)
   - Optional: add your mentor as a viewer/editor in Firebase Console so they can check your Storage
4. Seed the data:
   Run this to add the initial menu items and admin user to your database:
   ```bash
   node seed.js
   ```

### 3. Run the server
- Just run `npm start` to get it going.
- If you have nodemon, you can use `npm run dev`.

The site should be up at `http://localhost:5000`.

## Features I've Added

- **Backend CRUD**: All menu items are stored in MongoDB and can be managed through our API.
- **Login System**: Users and admins can log in to their accounts (now including Google OAuth).
- **Admin Panel**: Admins can add, edit, or delete dishes.
- **File Storage (Firebase Storage)**: Upload dish images and store the download URL in MongoDB.
- **Security & Validation**: Integrated Helmet.js for secure headers and express-validator for safe input handling.
- **JWT Authentication & RBAC**: Protected routes ensure only authorized users can perform sensitive actions.
- **Centralized Error Handling**: Improved stability with a unified way to handle errors.

## Admin Access

If you want to check out the admin features:
1. Go to the login page.
2. Use these details:
   - **Email**: `admin@chillbites.com`
   - **Password**: `admin`
3. It will take you straight to the admin dashboard.

---

## Note for Mentor (Rick)

Hey Rick, I've fixed the access issues from the last feedback:

1. **Project Access**: I've invited you to the project in MongoDB Atlas. Please check your email for the invite so you can see the cluster.
2. **Database User**: I also added a database user `mpisonjr` for you.
3. **Connection Link**: 
   `mongodb+srv://<dbuser>:<password>@group3webtech.voiaqra.mongodb.net/chillbites`

Let me know if you still have trouble seeing it!

---
**Author**: Rick Cabugnason
