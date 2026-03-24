# Revised Database Plan (MongoDB Atlas)

## 1. Database Overview
ChillBites uses MongoDB Atlas (NoSQL) with Mongoose models. The main collections are:
- Users
- Menus
- Orders

## 2. Collections and Document Structures

### A. users
Used for authentication (email/password + Google login) and admin role control.

Example:
```json
{
  "_id": "65ff...abc",
  "username": "Admin",
  "email": "admin@chillbites.com",
  "password": "admin",
  "isAdmin": true,
  "createdAt": "2026-03-24T00:00:00.000Z",
  "updatedAt": "2026-03-24T00:00:00.000Z"
}
```

Required fields:
- username (string)
- email (string, unique)
- password (string)
- isAdmin (boolean, default false)

### B. menus
Used for dishes shown in `menu.html` and managed by the admin dashboard.

Example:
```json
{
  "_id": "65ff...def",
  "name": "Sizzling Sisig",
  "price": 380,
  "desc": "Crispy pork sisig with onions and special sauce",
  "image": "https://...firebase.../sisig.jpg",
  "available": true,
  "createdAt": "2026-03-24T00:00:00.000Z",
  "updatedAt": "2026-03-24T00:00:00.000Z"
}
```

Required fields:
- name (string)
- price (number)
- desc (string)
- image (string URL)
- available (boolean, default true)

### C. orders
Used to store orders placed by logged-in users. Each order contains multiple items.

Example:
```json
{
  "_id": "65ff...789",
  "user": "65ff...abc",
  "items": [
    {
      "name": "Sizzling Sisig",
      "quantity": 2,
      "price": 380,
      "menuItem": "65ff...def"
    }
  ],
  "shippingAddress": {
    "address": "123 Sample Street",
    "city": "Cebu City"
  },
  "paymentMethod": "cod",
  "totalPrice": 760,
  "status": "Pending",
  "createdAt": "2026-03-24T00:00:00.000Z",
  "updatedAt": "2026-03-24T00:00:00.000Z"
}
```

Required fields:
- user (ObjectId → users)
- items (array)
- items[].name (string)
- items[].quantity (number)
- items[].price (number)
- items[].menuItem (ObjectId → menus)
- shippingAddress.address (string)
- shippingAddress.city (string)
- paymentMethod (string)
- totalPrice (number)
- status (string, default Pending)

## 3. Relationships
- orders.user → users._id
- orders.items[].menuItem → menus._id

## 4. CRUD Operations Summary
- Menu CRUD: Admin only (Create/Update/Delete), public Read
- Orders: Logged-in users can Create; admin can view all (if needed)
- Users: Register/Login/Google login creates user records

