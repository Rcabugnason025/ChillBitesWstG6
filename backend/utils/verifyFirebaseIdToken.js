const https = require('https');
const crypto = require('crypto');
 
let cachedCerts = null;
let cachedCertsExpiresAt = 0;
 
function base64UrlToBuffer(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}
 
function parseJwtPart(part) {
  return JSON.parse(base64UrlToBuffer(part).toString('utf8'));
}
 
function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const cacheControl = res.headers['cache-control'] || '';
            const match = /max-age=(\d+)/.exec(cacheControl);
            const maxAgeSeconds = match ? parseInt(match[1], 10) : 3600;
            resolve({ json: JSON.parse(data), maxAgeSeconds });
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}
 
async function getFirebaseCerts() {
  const now = Date.now();
  if (cachedCerts && now < cachedCertsExpiresAt) return cachedCerts;
 
  const { json: certs, maxAgeSeconds } = await getJson(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );
  cachedCerts = certs;
  cachedCertsExpiresAt = now + maxAgeSeconds * 1000;
  return cachedCerts;
}
 
async function verifyFirebaseIdToken(idToken, projectIdOrIds) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Missing Firebase ID token');
  }
  const allowedProjectIds = (Array.isArray(projectIdOrIds) ? projectIdOrIds : [projectIdOrIds])
    .map((x) => (x ? String(x).trim() : ''))
    .filter(Boolean);
  if (!allowedProjectIds.length) {
    throw new Error('Missing Firebase projectId');
  }
 
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid Firebase ID token format');
  }
 
  const header = parseJwtPart(parts[0]);
  const payload = parseJwtPart(parts[1]);
 
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp <= nowSeconds) {
    throw new Error('Firebase ID token expired');
  }
 
  const expectedIssuers = allowedProjectIds.map((id) => `https://securetoken.google.com/${id}`);
  if (!allowedProjectIds.includes(payload.aud) || !expectedIssuers.includes(payload.iss)) {
    throw new Error('Firebase ID token has invalid audience or issuer');
  }
 
  const certs = await getFirebaseCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error('Firebase ID token has unknown kid');
  }
 
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${parts[0]}.${parts[1]}`);
  verifier.end();
 
  const signature = base64UrlToBuffer(parts[2]);
  const ok = verifier.verify(cert, signature);
  if (!ok) {
    throw new Error('Firebase ID token signature invalid');
  }
 
  return payload;
}
 
module.exports = verifyFirebaseIdToken;
