# Milestone 2: Finalized Integration Plan
**Project:** ChillBites
**Developer:** Rick Cabugnason

---

## 1. Overview
This plan outlines the integration of secure authentication, cloud storage, and backend security features for ChillBites, fulfilling the requirements for Milestone 2.

## 2. Authentication & Authorization
*   **JWT (JSON Web Tokens)**: Implemented for secure, stateless session management. Tokens are issued upon login and required for all protected API calls.
*   **Google OAuth 2.0**: Integrated via Passport.js to allow users to sign in securely using their Google accounts.
*   **RBAC (Role-Based Access Control)**: Middleware-level checks ensure that only users with the `isAdmin` flag can access menu management features (Add/Edit/Delete).

## 3. Cloud File Storage (AWS S3)
*   **Storage Solution**: Firebase Storage is used for storing and serving dish images.
*   **Implementation**: Admin dashboard uploads images to Firebase Storage and saves the returned download URL in MongoDB.
*   **Retrieval**: Images are displayed using the stored download URL.

## 4. Security Enhancements
*   **Helmet.js**: Integrated to secure HTTP headers and protect against common vulnerabilities like XSS and clickjacking.
*   **Input Validation**: Used `express-validator` middleware to sanitize and validate all data sent to the backend (e.g., ensuring prices are numbers, names are non-empty).
*   **Environment Variables**: All sensitive keys (Database URI, AWS Keys, JWT Secret) are managed through a `.env` file.

## 5. Centralized Error Handling
*   **Middleware**: A unified error-handling middleware manages 404 Not Found and 500 Internal Server Error responses consistently across the application.

---
**Rick Cabugnason**
