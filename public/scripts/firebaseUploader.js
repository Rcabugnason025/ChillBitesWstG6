import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

if (firebaseConfig && firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  window.firebaseUploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const fileRef = ref(storage, `menu/${fileName}`);
    await uploadBytes(fileRef, file, { contentType: file.type });
    return await getDownloadURL(fileRef);
  };

  const finishGoogleLogin = async (user) => {
    const idToken = await user.getIdToken();
    const response = await fetch('/api/users/google-login', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${idToken}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Google Login failed');
    }
    localStorage.setItem('currentUser', JSON.stringify(data));
    window.location.href = data.isAdmin ? 'admin.html' : 'index.html';
  };

  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        return finishGoogleLogin(result.user);
      }
      return null;
    })
    .catch(() => null);

  window.firebaseGoogleLogin = async () => {
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocalhost) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      await finishGoogleLogin(result.user);
    } catch (error) {
      if (error && (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user')) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error('Google Login Error:', error);
      alert('Google Login failed: ' + (error.message || 'Unknown error'));
    }
  };
} else {
  window.firebaseUploadImage = null;
  window.firebaseGoogleLogin = null;
}
