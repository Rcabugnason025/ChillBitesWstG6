import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

if (firebaseConfig && firebaseConfig.apiKey) {
  let app = null;
  let storage = null;
  let auth = null;
  let googleProvider = null;
  try {
    app = initializeApp(firebaseConfig);
    storage = getStorage(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (e) {
    window.firebaseUploadImage = null;
    window.firebaseGoogleLogin = null;
  }

  window.firebaseUploadImage = async (file) => {
    if (!storage) throw new Error('Firebase is not initialized');
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
    if (!auth || !googleProvider) return;
    await signInWithRedirect(auth, googleProvider);
  };
} else {
  window.firebaseUploadImage = null;
  window.firebaseGoogleLogin = null;
}
