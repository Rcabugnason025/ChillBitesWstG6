MO‑IT149 Web Technology Application — Milestone 2 Testing Results (ChillBites)

Author: Rick Cabugnason (A3101)

Test Environment
• Deployed app on Render: https://chillbiteswstg6.onrender.com  
• Backend: Node.js + Express  
• Database: MongoDB Atlas  
• Auth/Storage: Firebase Authentication + Firebase Storage  
• Browser: Chrome and Edge

Summary
I tested authentication (email/password and Google sign‑in), admin RBAC, menu CRUD, image upload to Firebase, and the order flow with multiple items and delivery address fields. Below are concise notes of what I actually observed.

Test Cases & Actual Results (my notes)
1) Register (Email/Password)  
• Steps: Sign up with a new email, submit.  
• Actual: Account was created; I stayed logged in after submit (JWT saved in localStorage).

2) Login (Email/Password)  
• Steps: Use valid admin credentials.  
• Actual: Logged in and could open the admin dashboard without “Access denied”.

3) Login (Invalid Password)  
• Steps: Enter wrong password.  
• Actual: Received “Invalid email or password” and stayed on the login page.

4) Google Sign‑in (Firebase)  
• Steps: Click Continue with Google → choose account → allow.  
• Actual: Redirected back and I remained logged in. The navbar changed to “Hi, …” and localStorage had currentUser + token.

5) RBAC: Non‑admin blocked from admin page  
• Steps: Login as normal user, open /admin.html.  
• Actual: Access denied and redirected to login.

6) Admin: Add Dish (DB persist)  
• Steps: Fill dish form (name, price, desc, image/url) → Save.  
• Actual: Dish appeared in the admin table immediately; it also showed on menu.html.

7) Admin: Upload Dish Image (Firebase Storage)  
• Steps: Choose an image file and save.  
• Actual: Image loaded on the menu card using a Firebase download URL. If Storage was restricted, I used the Image URL field to save successfully.

8) Place Order (multi‑item + delivery)  
• Steps: Add two dishes, open order modal, set Delivery, fill address, place order.  
• Actual: The modal required address fields for Delivery; the total updated with quantity changes; after submitting, it redirected to the thank‑you page.

Defects Found and Fixes
• Google sign‑in initially returned to login without finishing. I fixed this by refreshing cached scripts, completing redirect login on page load, and showing clear alerts when something fails.  
• When the database was empty, menu items flashed and disappeared. I added auto‑seed so the menu always has data.  
• Image upload can fail if Storage is blocked; I added a URL fallback so dishes can still be saved.

Recommendations
• Keep Firebase authorized domains updated to match the deployed URL.  
• For production, implement password hashing (bcrypt) and stricter validation.

End of Testing Results
