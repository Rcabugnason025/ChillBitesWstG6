# Milestone 2: Testing Results
**Project:** ChillBites
**Developer:** Rick Cabugnason

---

## 1. Authentication Testing
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Auth-01 | User Login with valid credentials | JWT Token issued and stored in localStorage | PASS |
| Auth-02 | User Login with invalid credentials | 401 Unauthorized error returned | PASS |
| Auth-03 | Google Login (Firebase) | User signs in with Google and backend returns JWT | PASS |

## 2. Security & RBAC Testing
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Sec-01 | Access Admin route without token | 401 Unauthorized error returned | PASS |
| Sec-02 | Access Admin route with non-admin token | 401 Not Authorized as Admin error | PASS |
| Sec-03 | Input Validation (Invalid Price) | 400 Bad Request with validation error messages | PASS |

## 3. Cloud Storage Testing
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Store-01 | Image upload to Firebase Storage | Image uploaded and download URL saved to MongoDB | PASS |
| Store-02 | Non-image file upload attempt | Upload is blocked or fails (image-only expected) | PASS |

## 4. Reliability Testing
| Test Case | Description | Expected Result | Status |
|-----------|-------------|-----------------|--------|
| Rel-01 | Request non-existent page (404) | JSON error message: "Not Found - /url" | PASS |
| Rel-02 | Database Connection Timeout | Server stays up and provides UI preview | PASS |

---
**Verified by:** Rick Cabugnason
**Date:** March 1, 2026
