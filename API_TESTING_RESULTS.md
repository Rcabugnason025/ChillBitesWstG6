# API & Database Testing Results

This document contains the results of testing the API and Database integration for **ChillBites**.

---

## 1. Third-Party API: TheMealDB
**Goal:** Verify that the API returns a random meal object with an image URL.

### **Request Details**
*   **Method:** `GET`
*   **URL:** `https://www.themealdb.com/api/json/v1/1/random.php`

### **Result**
*   **Status:** `200 OK`
*   **Key Field:** `strMealThumb` contains the image URL.
*   **Integration:** Used in the Admin Panel to fetch random food images.

---

## 2. Backend RESTful API (Node.js & Express)
**Goal:** Verify that all CRUD operations for the Menu are functional.

### **TC-001: Get All Menu Items**
*   **Method:** `GET`
*   **URL:** `http://localhost:5000/api/menu`
*   **Status:** `200 OK`
*   **Result:** Returns a JSON array of all dishes stored in MongoDB.

### **TC-002: Add New Dish (Create)**
*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/menu`
*   **Body:** JSON object with `name`, `price`, `desc`, `image`.
*   **Status:** `201 Created`
*   **Result:** Dish is successfully added to the MongoDB collection.

### **TC-003: Update Dish (Update)**
*   **Method:** `PUT`
*   **URL:** `http://localhost:5000/api/menu/:id`
*   **Status:** `200 OK`
*   **Result:** Dish details are updated in the database.

### **TC-004: Delete Dish (Delete)**
*   **Method:** `DELETE`
*   **URL:** `http://localhost:5000/api/menu/:id`
*   **Status:** `200 OK`
*   **Result:** Dish is removed from the database.

---

## 3. Database Connection (MongoDB Atlas)
**Goal:** Verify that the server can connect to the remote MongoDB cluster.

### **Connection Test**
*   **Config:** `backend/config/db.js` using `MONGO_URI` from `.env`.
*   **Log Output:** `MongoDB Connected: group3webtech-shard-00-01.voiaqra.mongodb.net`
*   **Verification:** Data persists across server restarts, confirming that items are stored in Atlas and not locally.

---

## 4. Postman Evidence
All tests were conducted using the provided Postman collection: `ChillBites_API_Tests.postman_collection.json`.

**Tested by:** Rick Cabugnason
**Date:** March 1, 2026
