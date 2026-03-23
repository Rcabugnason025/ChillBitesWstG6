# Homework 12: Deploying the Web App

## Deployment Goal
Deploy the full-stack ChillBites web app (Express backend + static frontend in `/public`) so it can be accessed online.

## Recommended Platform
I recommend **Render** (works well for Node.js + MongoDB Atlas).

## Deployment Steps (Render)
1. Push the latest code to GitHub.
2. Go to Render → **New** → **Web Service**.
3. Connect your GitHub repo: `Rcabugnason025/ChillBitesWstG6`.
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables in Render:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any strong random string
   - `FIREBASE_PROJECT_ID` = `chillbites-final`
   - `ALLOW_NO_DB` = `false`
6. Click **Deploy**.

## Post-Deploy Checklist
- Open the deployed URL and verify:
  - Home page loads
  - Menu page loads and shows items (requires MongoDB working)
  - Login works (email/password)
  - Google login works (requires Firebase Authentication enabled)
  - Admin functions work (requires admin JWT)

## Notes
- The frontend uses the same domain as the backend because Express serves the `/public` folder.
- Firebase Storage is used for image hosting (Admin uploads).

