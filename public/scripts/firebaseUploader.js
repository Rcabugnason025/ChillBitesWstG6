import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

if (firebaseConfig && firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  window.firebaseUploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const fileRef = ref(storage, `menu/${fileName}`);
    await uploadBytes(fileRef, file, { contentType: file.type });
    return await getDownloadURL(fileRef);
  };

  window.firebaseGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await fetch('/api/users/google-login', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = 'index.html';
      } else {
        alert('Google Login failed on server: ' + data.message);
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      alert('Google Login failed: ' + error.message);
    }
  };
} else {
  window.firebaseUploadImage = null;
  window.firebaseGoogleLogin = null;
}
