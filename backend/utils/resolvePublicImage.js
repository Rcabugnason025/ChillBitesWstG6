const fs = require('fs');
const path = require('path');

let cachedMap = null;

function getImageMap() {
  if (cachedMap) return cachedMap;
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  const map = new Map();
  try {
    const files = fs.readdirSync(imagesDir, { withFileTypes: true });
    for (const dirent of files) {
      if (!dirent.isFile()) continue;
      const name = dirent.name;
      map.set(name.toLowerCase(), name);
    }
  } catch (_) {}
  cachedMap = map;
  return cachedMap;
}

function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function resolvePublicImage(input) {
  const value = normalizeSlashes(input).trim();
  if (!value) return 'images/chillbites-logo.jpg';
  if (/^https?:\/\//i.test(value)) return value;

  const m = /^images\/(.+)$/i.exec(value);
  if (!m) return value;

  const requestedName = m[1];
  const map = getImageMap();
  const actualName = map.get(requestedName.toLowerCase());
  if (actualName) return `images/${actualName}`;

  return 'images/chillbites-logo.jpg';
}

module.exports = resolvePublicImage;
