import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js?v=7";

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

  const getSafeRedirectTarget = () => {
    const fromQuery = new URLSearchParams(window.location.search).get('redirect');
    const fromSession = sessionStorage.getItem('postLoginRedirect');
    const candidate = (fromQuery || fromSession || '').trim();
    if (!candidate) return null;
    if (!candidate.endsWith('.html')) return null;
    if (candidate.includes('login.html')) return null;
    return candidate;
  };

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
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }
    if (!response.ok) {
      const message = data && data.message ? data.message : `Google Login failed (${response.status})`;
      throw new Error(message);
    }
    localStorage.setItem('currentUser', JSON.stringify(data));
    sessionStorage.removeItem('postLoginRedirect');
    sessionStorage.removeItem('googleLoginInProgress');
    sessionStorage.removeItem('googleLoginCompleting');
    const redirectTo = data.isAdmin ? 'admin.html' : (getSafeRedirectTarget() || 'index.html');
    window.location.href = redirectTo;
  };

  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        return finishGoogleLogin(result.user);
      }
      return null;
    })
    .catch((err) => {
      const msg = err && err.message ? err.message : 'Google login did not finish.';
      alert(`Google login failed: ${msg}`);
    });

  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    const inProgress = sessionStorage.getItem('googleLoginInProgress') === '1';
    if (!inProgress) return;
    const completing = sessionStorage.getItem('googleLoginCompleting') === '1';
    if (completing) return;
    sessionStorage.setItem('googleLoginCompleting', '1');
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem('currentUser'));
    } catch (_) {
      stored = null;
    }
    const sameAccount = stored && stored.email && user.email && stored.email.toLowerCase() === user.email.toLowerCase();
    const hasAppToken = stored && typeof stored.token === 'string' && stored.token.length > 0;
    if (sameAccount && hasAppToken) {
      sessionStorage.removeItem('googleLoginCompleting');
      sessionStorage.removeItem('googleLoginInProgress');
      return;
    }

    finishGoogleLogin(user).catch((err) => {
      sessionStorage.removeItem('googleLoginCompleting');
      const msg = err && err.message ? err.message : 'Google login failed.';
      alert(`Google login failed: ${msg}`);
    });
  });

  window.firebaseGoogleLogin = async () => {
    if (!auth || !googleProvider) return;
    const redirectTarget = new URLSearchParams(window.location.search).get('redirect');
    if (redirectTarget) sessionStorage.setItem('postLoginRedirect', redirectTarget);
    sessionStorage.setItem('googleLoginInProgress', '1');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result && result.user) {
        await finishGoogleLogin(result.user);
        return;
      }
    } catch (err) {
      const code = err && err.code ? String(err.code) : '';
      if (code !== 'auth/popup-blocked' && code !== 'auth/popup-closed-by-user') {
        const msg = err && err.message ? err.message : 'Google login failed.';
        alert(`Google login failed: ${msg}`);
        return;
      }
    }
    await signInWithRedirect(auth, googleProvider);
  };

  window.firebaseLogout = async () => {
    try {
      sessionStorage.removeItem('googleLoginInProgress');
      sessionStorage.removeItem('googleLoginCompleting');
      if (auth) await signOut(auth);
    } catch (_) {}
  };
} else {
  window.firebaseUploadImage = null;
  window.firebaseGoogleLogin = null;
  window.firebaseLogout = null;
}
