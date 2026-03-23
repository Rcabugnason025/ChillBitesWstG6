# Important Notes for Mentor (Milestone 2 Submission)

Hi Sir,

To make it easier for you to check my work, here are the exact steps and credentials you need.

## 1. Database Connection (MongoDB Atlas)
I have whitelisted your IP (0.0.0.0/0) so you should be able to connect from anywhere.
You can use this connection string in your `.env` file to connect directly to my cloud database:

```env
MONGO_URI=mongodb+srv://MarioP_3:WebtechG03@group3webtech.voiaqra.mongodb.net/chillbites?retryWrites=true&w=majority
```

*Note: I also added a user `mpisonjr` for you previously if you prefer that.*

## 2. Admin Credentials
To test the **Admin Dashboard** and **Image Upload (Firebase)** features:
- **Login URL**: `http://localhost:5000/login.html`
- **Email**: `admin@chillbites.com`
- **Password**: `admin`

Once logged in, you can go to the **Admin Panel** to try adding a new dish. The image will be uploaded to my Firebase Storage automatically.

## 3. Google OAuth
Google Login is enabled using Firebase Authentication.
- You can click "Continue with Google" on the login page.
- After signing in, the backend verifies the Firebase ID token and returns the app JWT.
- If needed, set `FIREBASE_PROJECT_ID=chillbites-final` in `.env` (default is already `chillbites-final`).

## 4. Firebase Configuration
You don't need to do anything for this!
I have already included the necessary API keys in `public/scripts/firebaseConfig.js`. The app is connected to my `ChillBites-Final` Firebase project.

---
**Summary of Changes since last feedback:**
- Fixed the MongoDB connection issues.
- Implemented Firebase Storage for image uploads (replacing the AWS attempt).
- Secured the Admin routes with JWT and RBAC.
- Added Google OAuth.

Thank you!
Rick Cabugnason
