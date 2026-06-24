# CodeWave Solution - Student Profile API Documentation

This document describes the API endpoints exposed for the Student Profile Module including View/Edit details, password controls and avatar file integrations.

---

## Base URL
All endpoints are relative to:
`http://localhost:5000/api` (or staging endpoint)

All endpoints listed below require authentication via a JSON Web Token (JWT) provided in the headers:
```http
Authorization: Bearer <jwt_token>
```

---

## 1. Retrieve Student Profile
Gets detailed profile info of the logged-in student including parent details, enrolled course info, and current batch schedule details.

* **URL**: `/auth/student-profile`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "648a72cf5023fa8c919dcb51",
        "fullName": "Om Shivhare",
        "email": "omshivhare666@gmail.com",
        "role": "student",
        "phone": "9876543210",
        "avatar": "data:image/png;base64,iVBOR..."
      },
      "student": {
        "_id": "648a72cf5023fa8c919dcb55",
        "userId": "648a72cf5023fa8c919dcb51",
        "rollNumber": "CW2026-004",
        "fullName": "Om Shivhare",
        "email": "omshivhare666@gmail.com",
        "phone": "9876543210",
        "address": "123 Developers Lane, Tech City",
        "course": {
          "_id": "648a72cf5023fa8c919dcb11",
          "courseName": "Full Stack Web Development",
          "description": "Comprehensive MERN architecture training curriculum.",
          "duration": "6 Months",
          "fees": 45000
        },
        "batch": {
          "_id": "648a72cf5023fa8c919dcb22",
          "batchName": "MERN Batch B",
          "startDate": "2026-01-10T00:00:00.000Z",
          "timing": "Monday - Friday, 6:00 PM - 8:00 PM",
          "assignedTeacher": {
            "_id": "648a72cf5023fa8c919dcb88",
            "name": "Dr. Ramesh Kumar",
            "email": "ramesh@codewave.com"
          }
        },
        "parentName": "Vijay Shivhare",
        "parentPhone": "9876543211",
        "parentEmail": "vijay@parent.com",
        "status": "active",
        "profilePhoto": "data:image/png;base64,iVBOR..."
      }
    }
  }
  ```

---

## 2. Update Student Profile
Updates contact information, parent details, and avatar image.

* **URL**: `/auth/student-profile`
* **Method**: `PUT`
* **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
* **Request Body Parameters**:
  | Name | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `fullName` | String | No | Student's full name (updates both User & Student models) |
  | `phone` | String | No | Contact phone number |
  | `address` | String | No | Residential address |
  | `parentName` | String | No | Guardian's full name |
  | `parentPhone` | String | No | Guardian's contact phone |
  | `parentEmail` | String | No | Guardian's email address |
  | `avatar` | String | No | Base64 encoded image string (or URL) |

* **Request Example**:
  ```json
  {
    "fullName": "Om Shivhare",
    "phone": "9876543210",
    "address": "456 Code Street, Silicon Valley",
    "parentName": "Vijay Shivhare",
    "parentPhone": "9876543211",
    "parentEmail": "vijay@parent.com",
    "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
  ```

* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "648a72cf5023fa8c919dcb51",
        "fullName": "Om Shivhare",
        "email": "omshivhare666@gmail.com",
        "phone": "9876543210",
        "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "role": "student"
      },
      "student": {
        "_id": "648a72cf5023fa8c919dcb55",
        "userId": "648a72cf5023fa8c919dcb51",
        "rollNumber": "CW2026-004",
        "fullName": "Om Shivhare",
        "email": "omshivhare666@gmail.com",
        "phone": "9876543210",
        "address": "456 Code Street, Silicon Valley",
        "parentName": "Vijay Shivhare",
        "parentPhone": "9876543211",
        "parentEmail": "vijay@parent.com",
        "profilePhoto": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "status": "active"
      }
    }
  }
  ```

---

## 3. Change Password
Changes password securely after verifying the old password.

* **URL**: `/auth/change-password`
* **Method**: `PUT`
* **Headers**: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
* **Request Body Parameters**:
  | Name | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `oldPassword` | String | Yes | Student's current active password |
  | `newPassword` | String | Yes | New password (minimum 6 characters) |

* **Request Example**:
  ```json
  {
    "oldPassword": "CodeWave@123",
    "newPassword": "SecurePassword@2026"
  }
  ```

* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

* **Error Responses**:
  * **400 Bad Request (Missing fields)**:
    ```json
    {
      "success": false,
      "message": "Please provide old and new passwords"
    }
    ```
  * **400 Bad Request (Short password)**:
    ```json
    {
      "success": false,
      "message": "New password must be at least 6 characters long"
    }
    ```
  * **400 Bad Request (Incorrect Old password)**:
    ```json
    {
      "success": false,
      "message": "Incorrect old password"
    }
    ```
