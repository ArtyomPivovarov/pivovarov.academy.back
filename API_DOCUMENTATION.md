<div align="center">

# 📚 Pivovarov Academy API

### Complete API Reference & Documentation

[![Version](https://img.shields.io/badge/version-0.0.2-blue.svg)](./package.json)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?logo=openapiinitiative)](./swagger.json)
[![Endpoints](https://img.shields.io/badge/endpoints-35-green.svg)](#api-endpoints)

</div>

---

## 📊 Overview

<table>
  <tr>
    <td align="center" width="25%">
      <h3>35</h3>
      <sub>Total Endpoints</sub>
    </td>
    <td align="center" width="25%">
      <h3>9 🌐</h3>
      <sub>Public</sub>
    </td>
    <td align="center" width="25%">
      <h3>26 🔒</h3>
      <sub>Protected</sub>
    </td>
    <td align="center" width="25%">
      <h3>7</h3>
      <sub>Modules</sub>
    </td>
  </tr>
</table>

## 🔗 Quick Navigation

| Resource | Description | Link |
|----------|-------------|------|
| 🎨 **Interactive Editor** | Test API in browser | [Open Swagger Editor →](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ArtyomPivovarov/pivovarov.academy.back/main/swagger.json) |
| 🚀 **Local Swagger UI** | When app is running | [http://localhost:4200/api →](http://localhost:4200/api) |
| 📋 **OpenAPI Spec** | Download JSON | [swagger.json →](./swagger.json) |
| 📖 **Main README** | Project overview | [README.md →](./README.md) |

---

## 📑 Table of Contents

- [🔐 Authentication](#🔐-authentication) `6 endpoints`
- [👥 Users](#👥-users) `4 endpoints`
- [📚 Lessons](#📚-lessons) `5 endpoints`
- [📖 Learning Modules](#📖-learning-modules) `5 endpoints`
- [💳 Subscriptions](#💳-subscriptions) `7 endpoints`
- [📊 Lesson Progress](#📊-lesson-progress) `3 endpoints`
- [🎥 Videos](#🎥-videos) `5 endpoints`

---

## 🔐 Authentication

> **Base Path**: `/api/auth`  
> **Total Endpoints**: 6 (5 public, 1 protected)

<details open>
<summary><b>📋 🔐 Authentication Endpoints</b></summary>

### POST `/api/auth/login`
🌐 **Public** | Log in

---

### GET `/api/auth/me`
🔒 **Protected** | Get user profile

---

### POST `/api/auth/refresh`
🌐 **Public** | Refresh tokens

---

### POST `/api/auth/register`
🌐 **Public** | Register

---

### POST `/api/auth/resend-verification`
🌐 **Public** | No description

---

### POST `/api/auth/verify-email`
🌐 **Public** | No description

</details>

---

## 👥 Users

> **Base Path**: `/api/user`  
> **Total Endpoints**: 4 (all protected)

<details>
<summary><b>📋 👥 Users Endpoints</b></summary>

### GET `/api/user`
🔒 **Protected** | Get all users

---

### POST `/api/user`
🔒 **Protected** | Create user

---

### GET `/api/user/{id}`
🔒 **Protected** | Get user by id

---

### PATCH `/api/user/{id}`
🔒 **Protected** | Update user by id

</details>

---

## 📚 Lessons

> **Base Path**: `/api/lesson`  
> **Total Endpoints**: 5 (1 public, 4 protected)

<details>
<summary><b>📋 📚 Lessons Endpoints</b></summary>

### GET `/api/lesson`
🔒 **Protected** | Get all lessons

---

### POST `/api/lesson`
🔒 **Protected** | Create lesson

---

### DELETE `/api/lesson/{id}`
🔒 **Protected** | Delete lesson by id

---

### GET `/api/lesson/{id}`
🌐 **Public** | Get lesson by id

---

### PATCH `/api/lesson/{id}`
🔒 **Protected** | Update lesson by id

</details>

---

## 📖 Learning Modules

> **Base Path**: `/api/learning-module`  
> **Total Endpoints**: 5 (2 public, 3 protected)

<details>
<summary><b>📋 📖 Learning Modules Endpoints</b></summary>

### GET `/api/learning-module`
🌐 **Public** | Get all learning modules

---

### POST `/api/learning-module`
🔒 **Protected** | Create learning module

---

### DELETE `/api/learning-module/{id}`
🔒 **Protected** | Delete learning module by id

---

### GET `/api/learning-module/{id}`
🌐 **Public** | Get learning module by id

---

### PATCH `/api/learning-module/{id}`
🔒 **Protected** | Update learning module by id

</details>

---

## 💳 Subscriptions

> **Base Path**: `/api/subscription`  
> **Total Endpoints**: 7 (1 public, 6 protected)

<details>
<summary><b>📋 💳 Subscriptions Endpoints</b></summary>

### GET `/api/subscription`
🔒 **Protected** | Get all subscriptions

---

### POST `/api/subscription`
🔒 **Protected** | Create subscription

---

### GET `/api/subscription/active`
🔒 **Protected** | Get your active subscription

---

### POST `/api/subscription/buy`
🔒 **Protected** | Buy subscription by id

---

### GET `/api/subscription/types`
🌐 **Public** | Get subscription types

---

### GET `/api/subscription/{id}`
🔒 **Protected** | Get subscription by id

---

### PATCH `/api/subscription/{id}`
🔒 **Protected** | Update subscription by id

</details>

---

## 📊 Lesson Progress

> **Base Path**: `/api/lesson-progress`  
> **Total Endpoints**: 3 (all protected)

<details>
<summary><b>📋 📊 Lesson Progress Endpoints</b></summary>

### POST `/api/lesson-progress`
🔒 **Protected** | Create a new lesson progress

---

### DELETE `/api/lesson-progress/{id}`
🔒 **Protected** | Delete lesson progress by ID

---

### GET `/api/lesson-progress/{id}`
🔒 **Protected** | Get lesson progress by ID

</details>

---

## 🎥 Videos

> **Base Path**: `/api/video`  
> **Total Endpoints**: 5 (all protected)

<details>
<summary><b>📋 🎥 Videos Endpoints</b></summary>

### GET `/api/video`
🔒 **Protected** | Get all videos

---

### POST `/api/video`
🔒 **Protected** | Create video

---

### DELETE `/api/video/{id}`
🔒 **Protected** | Delete video by id

---

### GET `/api/video/{id}`
🔒 **Protected** | Get video by id

---

### PATCH `/api/video/{id}`
🔒 **Protected** | Update video by id

</details>

---

## 🔑 Authentication

All protected endpoints require JWT token in the `Authorization` header:

```http
Authorization: Bearer <your_jwt_token>
```

### Getting a Token

1. **Register**: `POST /api/auth/register`
2. **Verify Email**: `POST /api/auth/verify-email`
3. **Login**: `POST /api/auth/login` → Returns `access_token`
4. **Use Token**: Include in all protected requests

---

## 📌 Response Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request succeeded |
| `201` | Created - Resource created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing or invalid token |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |
| `500` | Internal Server Error |

---

## 🛠️ Development Tools

### Export Swagger Documentation
```bash
# Start the application first
pnpm run start:dev

# Export swagger.json
pnpm run export:swagger
```

### Regenerate This Documentation
```bash
pnpm run docs:api
```

---

<div align="center">

### 📝 Additional Resources

[Main README](./README.md) • [OpenAPI Spec](./swagger.json) • [Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ArtyomPivovarov/pivovarov.academy.back/main/swagger.json)

---

**Last Updated**: 2026-02-03 14:46:53  
**API Version**: 0.0.2

</div>