# ChillBites

## MS2 Submission Links
- Finalized Integration Plan: https://github.com/Rcabugnason025/ChillBitesWstG6/blob/master/MILESTONE_2_INTEGRATION_PLAN.md
- Testing Results: https://github.com/Rcabugnason025/ChillBitesWstG6/blob/master/MILESTONE_2_TESTING_RESULTS.md
- Deployed App (Render): https://chillbiteswstg6.onrender.com
- Repository: https://github.com/Rcabugnason025/ChillBitesWstG6

Welcome to ChillBites! This is my project for our Web Development course. It's a full-stack food delivery website where I've put together some of my favorite Filipino dishes.

## Terminal Assessment (TA) Submission
- GitHub Repo: https://github.com/Rcabugnason025/ChillBitesWstG6
- Deployed App: https://chillbiteswstg6.onrender.com
- Integration Plan (Google Sheet): https://docs.google.com/spreadsheets/d/1hTh-jT3mp_MpGMEMkA9eRlA61PEbaMxvWZ-AEyJt5vA/edit?usp=sharing
- Database Plan + ERD (Google Doc): https://docs.google.com/document/d/1hc2Qgz0PrOgRKpJGYsyOC1QNCmB4XBSkDXbACceEFNk/edit?usp=sharing
- Test Plan + Internal Testing Results (Google Sheet): https://docs.google.com/spreadsheets/d/1HM_jmW5mtscG2La6WcGPUVCSl8KE7i3V71Sky80mu14/edit?usp=sharing

## Access Provision (Mentor Testing)
- Admin account: admin@chillbites.com / admin
- Admin dashboard: https://chillbiteswstg6.onrender.com/admin.html
- Firebase project: chillbites-final (mentor access provided in Firebase console)
- MongoDB Atlas: connection details provided for mentor testing (same DB used by the deployed app)

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

## Quick Verification (TA)
- Google login: open /login.html → Continue with Google → after consent it returns logged in.
- Admin CRUD: login as admin → /admin.html → add/edit/delete dish → reflects on /menu.html.
- Ordering: add multiple items → select Delivery → fill address → place order → /thank-you.html shows submitted details.
- Order history: login → open /orders.html → shows past orders for the current user.

## Features & Requirements (Milestone 2)

- **Authentication**:
  - **Google Login**: Users can sign in using their Google accounts (Firebase Authentication, then the backend issues a JWT).
  - **JWT (JSON Web Tokens)**: Secure session management for logged-in users.
  - **Role-Based Access Control (RBAC)**: Only Admins can access the dashboard to add/delete dishes.

- **File Storage (Cloud Integration)**:
  - **Firebase Storage**: I've integrated Firebase to handle image uploads. When an admin adds a new dish, the image is uploaded to the cloud, and the URL is saved in MongoDB.
  - *Note*: The Firebase configuration is already included in `public/scripts/firebaseConfig.js`.

- **Payments (Demo-friendly)**:
  - **GCash flow**: shows GCash details + QR on the confirmation page (thank-you) and provides an “Open GCash” link for manual payment.
  - **COD flow**: standard cash-on-delivery order confirmation.

- **Order Experience**:
  - **Receipt**: thank-you page includes a receipt table (items, qty, price, subtotal, total).
  - **Welcome prompt**: after login/signup, the home page shows a short welcome toast.
  - **Image handling**: menu image paths are resolved safely for case-sensitive hosting environments.

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

## Optional: Automatic Email Confirmation (Gmail / SMTP)
The app can send an order confirmation email automatically after a successful order (server-side). This is optional and only works if SMTP variables are set in Render.

### Gmail Setup (Recommended)
Use a Gmail **App Password** (requires 2-Step Verification). Set these env vars on Render:
- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_SECURE=false`
- `SMTP_USER=yourgmail@gmail.com`
- `SMTP_PASS=<gmail_app_password_no_spaces>`
- `SMTP_FROM=ChillBites <yourgmail@gmail.com>`

After saving env vars, redeploy so the service restarts and loads them.

## Message for the Mentor

Hi Sir,

Here are the updates based on your feedback from last time. I’ve implemented all the Milestone 2 requirements:

1.  **Firebase Storage**: I switched to Firebase for handling image uploads. The config is already in the code, so the upload feature in the Admin panel should work automatically for you.
2.  **Database Access**: I double-checked the MongoDB connection. The specific connection string (whitelisted for you) is in `MENTOR_NOTES.md`.
3.  **Google Login**: The "Sign in with Google" button is working on the login page.

I also added you to the Firebase project (check your email for the invite) so you can verify the storage.

Let me know if you run into any issues!

Best regards,
**Rick Cabugnason**
