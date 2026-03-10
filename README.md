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

### 1. Prerequisites
Make sure you have **Node.js** installed on your machine.

### 2. Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rcabugnason025/ChillBitesWstG6.git
   cd ChillBitesWstG6
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment**:
   - Create a `.env` file in the root folder.
   - You can copy the contents from `.env.example`.
   - **Important**: For the database, you can use the connection string I provided in `MENTOR_NOTES.md` or use your own local MongoDB.

4. **Seed the Database** (Optional but recommended):
   - Run this command to populate the menu with initial Filipino dishes and create the default admin account:
     ```bash
     node seed.js
     ```

5. **Run the Server**:
   ```bash
   npm start
   ```
   - The server will start at `http://localhost:5000`.
   - You can open this link in your browser to see the website.

## Features & Requirements (Milestone 2)

- **Authentication**:
  - **Google OAuth**: Users can sign in using their Google accounts (configured via Firebase & Passport).
  - **JWT (JSON Web Tokens)**: Secure session management for logged-in users.
  - **Role-Based Access Control (RBAC)**: Only Admins can access the dashboard to add/delete dishes.

- **File Storage (Cloud Integration)**:
  - **Firebase Storage**: I've integrated Firebase to handle image uploads. When an admin adds a new dish, the image is uploaded to the cloud, and the URL is saved in MongoDB.
  - *Note*: The Firebase configuration is already included in `public/scripts/firebaseConfig.js`.

- **Security**:
  - **Helmet.js**: Added for secure HTTP headers.
  - **Input Validation**: Used `express-validator` to sanitize user inputs (like login forms and menu additions).
  - **Centralized Error Handling**: A dedicated middleware catches errors and sends clean responses.

## Admin Access
To test the Admin features (like adding a new dish):
1. Go to the **Login** page.
2. Sign in with these credentials:
   - **Email**: `admin@chillbites.com`
   - **Password**: `admin`
3. You will be redirected to the Admin Dashboard where you can upload images and manage the menu.

---

## Message for the Mentor

Hi Sir,

I have implemented all the requirements for Milestone 2, including the cloud storage and authentication fixes you mentioned.

- **Firebase Storage**: I switched to Firebase for easier image hosting. The configuration is already in the code, so the upload feature on the Admin page should work right away without you needing to set up anything extra.
- **Database Access**: I've made sure the MongoDB cluster is accessible. I've included the specific connection string and credentials in `MENTOR_NOTES.md` just in case.
- **Google Login**: The "Sign in with Google" button on the login page is fully functional.

I tried to make the setup as smooth as possible for you. Let me know if you encounter any issues running it!

Best regards,
**Rick Cabugnason**
