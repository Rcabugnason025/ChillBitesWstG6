# Test Plan with Internal Testing Results

## Overview
This document lists the internal tests performed for ChillBites, covering authentication, access control, menu CRUD, file storage, and ordering.

## Test Environment
- Local: `npm install` then `npm start`
- Deployed: Render URL
- Browser: Chrome / Edge

## Test Cases

### A. Authentication
| ID | Scenario | Steps | Expected Result | Result |
|---|---|---|---|---|
| AUTH-01 | Register (Email/Password) | Sign up with valid details | User created, JWT returned | PASS |
| AUTH-02 | Login (Email/Password) | Login with valid credentials | JWT returned, user stored in localStorage | PASS |
| AUTH-03 | Login (Wrong Password) | Login with invalid password | 401 + message | PASS |
| AUTH-04 | Google Login (Firebase) | Click Continue with Google → allow permissions | Backend returns JWT and user is logged in | PASS |

### B. Authorization (RBAC)
| ID | Scenario | Steps | Expected Result | Result |
|---|---|---|---|---|
| RBAC-01 | Admin route blocked | Open admin page without login | Redirect to login / access denied | PASS |
| RBAC-02 | Non-admin blocked | Login as non-admin → try add menu via API | 401/403 style block | PASS |
| RBAC-03 | Admin allowed | Login as admin → add/edit/delete dish | Success | PASS |

### C. Menu CRUD + Display
| ID | Scenario | Steps | Expected Result | Result |
|---|---|---|---|---|
| MENU-01 | Menu list | Open `menu.html` | Items load from DB | PASS |
| MENU-02 | Create dish | Admin adds dish | Dish saved to MongoDB, appears on menu | PASS |
| MENU-03 | Update dish | Admin edits dish | Dish updated, reflects on UI | PASS |
| MENU-04 | Delete dish | Admin deletes dish | Dish removed, UI refreshes | PASS |

### D. File Storage (Firebase Storage)
| ID | Scenario | Steps | Expected Result | Result |
|---|---|---|---|---|
| FILE-01 | Upload image | Admin selects file and saves dish | Upload succeeds, URL saved in MongoDB | PASS |

### E. Orders
| ID | Scenario | Steps | Expected Result | Result |
|---|---|---|---|---|
| ORD-01 | Place order (multi-item) | Add multiple dishes → open modal → submit | Order saved to MongoDB | PASS |
| ORD-02 | Delivery fields | Select Delivery | Address fields appear and required | PASS |

## Notes
- JWT is stored in localStorage and used for protected API requests.
- The deployed service can cold-start; first request may be slower.

