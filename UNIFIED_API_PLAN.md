# ChillBites API & Database Plan

This is my plan for the API and database integration for ChillBites.

---

## Milestone 2: Secure Web App with Authentication and File Storage

In Milestone 2, I've added several key features to secure the application and improve its functionality.

### 1. User Authentication (Google OAuth)
Instead of just basic login, users can now sign in using their Google accounts.
*   **How it works:** I integrated `passport-google-oauth20` to allow users to securely authenticate via Google. This retrieves their profile information and saves them to our MongoDB.
*   **Tokens:** I use `jsonwebtoken` (JWT) to issue secure tokens upon login, which are then used to validate requests for protected routes.

### 2. Role-Based Access Control (RBAC)
I've implemented a system to restrict what users can do based on their roles.
*   **Roles:** We have `user` and `admin` roles.
*   **Protection:** Routes like adding or deleting dishes are now protected. Only admins with a valid token can perform these actions.

### 3. File Storage and Retrieval (AWS S3)
To handle dish images properly, I've moved away from static links to cloud storage.
*   **Cloud Storage:** I'm using **AWS S3** to store images.
*   **Multer Integration:** I'm using `multer` and `multer-s3` to handle the file uploads directly from our backend to the S3 bucket.

### 4. Security Enhancements
To keep the app safe from common web attacks:
*   **Helmet.js:** I've integrated `helmet` to set secure HTTP headers.
*   **Input Validation:** I use `express-validator` to ensure that data sent to our API is correct and safe (e.g., checking if price is a number).

### 5. Centralized Error Handling
I've added a centralized middleware to handle all errors consistently across the application. This ensures that the user gets a meaningful error message and the correct HTTP status code.

---

## API Endpoints (Updated)

*   **Menu API:**
    *   `GET /api/menu`: Public
    *   `POST /api/menu`: Admin only (Protected)
    *   `PUT /api/menu/:id`: Admin only (Protected)
    *   `DELETE /api/menu/:id`: Admin only (Protected)
*   **User API:**
    *   `POST /api/users/login`: Public (JWT Issued)
    *   `POST /api/users`: Public (JWT Issued)
    *   `POST /api/users/google-login`: Public (Firebase Google Sign-In → JWT Issued)
*   **Order API:**
    *   `POST /api/orders`: User only (Protected)

---

## Mentor Access
Rick, I've updated the project for Milestone 2. All security features and cloud integrations are now in place. You can test the protected routes by logging in as an admin and checking the headers for the JWT token.

---
**Rick Cabugnason**
