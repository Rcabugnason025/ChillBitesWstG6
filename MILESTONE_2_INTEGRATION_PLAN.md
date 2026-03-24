MO‑IT149 Web Technology Application — Milestone 2 Integration Plan (ChillBites)

Author: Rick Cabugnason (A3101)

Project Summary
ChillBites is a simple food ordering web app. Customers can browse dishes, add multiple items to an order, and place pickup or delivery orders. Admin users can manage the menu (add/edit/delete). This plan explains how I connected the pieces together for Milestone 2: database, auth, storage, APIs, security, and deployment.

1) Technology Stack
• Frontend: HTML, CSS (Bootstrap), vanilla JS  
• Backend: Node.js + Express  
• Database: MongoDB Atlas (Mongoose models)  
• Auth: Email/Password + Google Sign‑in (Firebase Authentication) → app issues its own JWT for API calls  
• File Storage: Firebase Storage (dish images)  
• Deployment: Render (Node app + environment variables)

2) Core Integrations

2.1 Authentication (Email/Password + Google)
• Email/password: POST /api/users/register and /api/users/login return a JWT and user profile (isAdmin).  
• Google sign‑in: Frontend uses Firebase Auth (redirect). After Google returns an ID token, I call POST /api/users/google-login with Authorization: Bearer <idToken>. The backend verifies the token and responds with my app’s JWT.  
• Session: I store the app JWT + user in localStorage as currentUser.

2.2 Role‑Based Access Control (RBAC)
• I check JWT on protected routes using middleware.  
• Admin‑only routes (menu create/update/delete) require isAdmin = true. Non‑admins are blocked with 401/403.

2.3 Menu Management + File Storage
• Admin adds/edits/deletes dishes via the dashboard.  
• Image upload uses Firebase Storage; on success I save the downloadURL into MongoDB. There’s also a URL fallback field if I can’t upload (still saves).  
• Customers see the dishes on menu.html (GET /api/menu).

2.4 Orders (multi‑item)
• Users can add multiple items and quantities. The order modal collects order type (pickup/delivery) and address when needed.  
• POST /api/orders saves items[], shippingAddress, paymentMethod, and totalPrice.  
• Thank‑you page shows the order summary.

3) Backend APIs (high‑level)
• Users  
  - POST /api/users/register  
  - POST /api/users/login  
  - POST /api/users/google-login (requires Firebase ID token)  
• Menu  
  - GET /api/menu (public)  
  - POST /api/menu (admin)  
  - PUT /api/menu/:id (admin)  
  - DELETE /api/menu/:id (admin)  
• Orders  
  - POST /api/orders (user)

4) Database (MongoDB Atlas)
• users: username, email, password, isAdmin, timestamps  
• menus: name, price, desc, image, available, timestamps  
• orders: user, items[{ name, quantity, price, menuItem }], shippingAddress{ address, city, postalCode?, barangay?, landmark? }, paymentMethod, totalPrice, status, timestamps

5) Security & Error Handling
• Helmet enabled (CSP relaxed for OAuth) and CORS configured.  
• JWT validation on protected routes, plus admin check.  
• Input validation on menu and auth (numbers, non‑empty strings).  
• Centralized error handler returns clean JSON messages.  
• I avoid logging secrets and keep credentials in environment variables.

6) Deployment (Render) + Environment Variables
• MONGO_URI: Atlas connection string  
• JWT_SECRET: app secret for signing tokens  
• NODE_ENV=production  
• Optional: ALLOW_NO_DB=false

7) Notes and Decisions
• I used redirect‑based Google sign‑in because it’s more reliable on deployed environments than popups.  
• I added a URL fallback for images in case Storage blocks uploads, so admin can still save dishes.  
• The menu is auto‑seeded on first run if the DB is empty so the page isn’t blank.

8) How to Run (local)
• npm install  
• Set .env (MONGO_URI, JWT_SECRET)  
• npm start → open http://localhost:5000  
• Visit /admin.html and /menu.html in public/ when server is serving static files.

End of Integration Plan
