# Homework 11: Internal Testing (Validating Features & Error Handling)

## What I Tested
I tested the core features of my web app (ChillBites) focusing on authentication, access control, CRUD behavior, file upload, and error handling.

## Test Environment
- Local run: `npm install` then `npm start`
- Browser testing: Chrome / Edge
- API testing: Postman / Fetch (browser)

## Test Cases (Summary)

### A. Authentication
1. Email/Password signup
   - Expected: user is created and receives a JWT
   - Result: Pass
2. Email/Password login
   - Expected: user receives a JWT and can access user-only features
   - Result: Pass
3. Google login
   - Expected: user signs in via Google and receives a JWT for API calls
   - Result: Pass (requires MongoDB connection)

### B. Authorization (RBAC)
1. Non-admin user tries to add menu item
   - Expected: 401/403 style response (blocked)
   - Result: Pass
2. Admin user can add/edit/delete menu items
   - Expected: request succeeds with valid JWT
   - Result: Pass

### C. Menu CRUD / Data Display
1. Menu list loads on `/menu.html`
   - Expected: items render from `/api/menu`
   - Result: Pass (requires MongoDB connection)
2. Create menu item (Admin)
   - Expected: item persists in DB and shows in list
   - Result: Pass

### D. File Upload (Firebase Storage)
1. Admin uploads a dish image
   - Expected: image uploads to Firebase Storage and a public URL is saved in DB
   - Result: Pass (requires Firebase Storage enabled)

### E. Error Handling / Negative Tests
1. Missing token on protected route
   - Expected: error response and no server crash
   - Result: Pass
2. Invalid token on protected route
   - Expected: error response and no server crash
   - Result: Pass

## Notes
- If MongoDB Atlas is blocked by the local network, DB-dependent pages may not load locally. The backend is configured to continue starting, but DB features require a working connection.
- Detailed API testing results are also recorded in:
  - `API_TESTING_RESULTS.md`
  - `MILESTONE_2_TESTING_RESULTS.md`

