# Kuteeram Tech API

A RESTful API for service management and booking system.

## Live Demo
The application is hosted at: [https://kuteeram-tech.onrender.com/](https://kuteeram-tech.onrender.com/)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [License](#license)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or remote)
- npm or yarn package manager

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Kuteeram-Tech.git
cd Kuteeram-Tech
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=8001
MONGO_URI=mongodb://127.0.0.1:27017/kuteeram
JWT_SECRET=your-secret-key-here
```

4. Start the development server
```bash
npm run dev
```

The server will start at `http://localhost:8001`

## API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
```
Request body:
```json
{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
```
Response:
```json
{
    "_id": "user_id",
    "fullName": "Test User",
    "email": "test@example.com"
}
```

#### Login
```http
POST /api/auth/login
```
Request body:
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```
Response:
```json
{
    "_id": "user_id",
    "fullName": "Test User",
    "email": "test@example.com"
}
```

#### Logout
```http
POST /api/auth/logout
```
Response:
```json
{
    "message": "Logged out successfully"
}
```

#### Check Authentication
```http
GET /api/auth/check
```
Response:
```json
{
    "_id": "user_id",
    "fullName": "Test User",
    "email": "test@example.com"
}
```

### Services

#### Create Service
```http
POST /api/services
```
Request body:
```json
{
    "title": "Service Title",
    "description": "Service Description",
    "price": 100,
    "category": "Category",
    "duration": 60,
    "images": ["image_url1", "image_url2"]
}
```
Response:
```json
{
    "_id": "service_id",
    "title": "Service Title",
    "description": "Service Description",
    "price": 100,
    "category": "Category",
    "duration": 60,
    "provider": "provider_id",
    "isAvailable": true,
    "images": ["image_url1", "image_url2"],
    "rating": 0,
    "reviews": []
}
```

#### Get Services
```http
GET /api/services
```
Query Parameters:
- category: Filter by category
- minPrice: Minimum price
- maxPrice: Maximum price
- search: Search in title and description

Response:
```json
[
    {
        "_id": "service_id",
        "title": "Service Title",
        "description": "Service Description",
        "price": 100,
        "category": "Category",
        "provider": {
            "_id": "provider_id",
            "fullName": "Provider Name",
            "email": "provider@example.com"
        }
    }
]
```

#### Get Service by ID
```http
GET /api/services/:id
```
Response:
```json
{
    "_id": "service_id",
    "title": "Service Title",
    "description": "Service Description",
    "price": 100,
    "category": "Category",
    "provider": {
        "_id": "provider_id",
        "fullName": "Provider Name",
        "email": "provider@example.com"
    },
    "reviews": [
        {
            "user": {
                "_id": "user_id",
                "fullName": "User Name"
            },
            "rating": 5,
            "comment": "Great service!",
            "createdAt": "2024-01-01T00:00:00.000Z"
        }
    ]
}
```

#### Update Service
```http
PUT /api/services/:id
```
Request body:
```json
{
    "title": "Updated Title",
    "description": "Updated Description",
    "price": 150
}
```

#### Delete Service
```http
DELETE /api/services/:id
```

### Bookings

#### Create Booking
```http
POST /api/bookings
```
Request body:
```json
{
    "serviceId": "service_id",
    "bookingDate": "2024-01-01T10:00:00.000Z",
    "notes": "Additional notes"
}
```
Response:
```json
{
    "_id": "booking_id",
    "service": "service_id",
    "user": "user_id",
    "provider": "provider_id",
    "bookingDate": "2024-01-01T10:00:00.000Z",
    "status": "pending",
    "paymentStatus": "pending",
    "amount": 100
}
```

#### Get Bookings
```http
GET /api/bookings
```
Query Parameters:
- status: Filter by status (pending, confirmed, completed, cancelled)

Response:
```json
[
    {
        "_id": "booking_id",
        "service": {
            "_id": "service_id",
            "title": "Service Title",
            "price": 100
        },
        "user": {
            "_id": "user_id",
            "fullName": "User Name",
            "email": "user@example.com"
        },
        "provider": {
            "_id": "provider_id",
            "fullName": "Provider Name",
            "email": "provider@example.com"
        },
        "bookingDate": "2024-01-01T10:00:00.000Z",
        "status": "pending"
    }
]
```

#### Get Booking by ID
```http
GET /api/bookings/:id
```

#### Update Booking Status
```http
PUT /api/bookings/:id/status
```
Request body:
```json
{
    "status": "confirmed",
    "cancellationReason": "Reason for cancellation" // Required only for cancelled status
}
```

#### Add Review
```http
POST /api/bookings/:id/review
```
Request body:
```json
{
    "rating": 5,
    "review": "Great service!"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. The token is stored in an HTTP-only cookie named `jwt`.

### Token Details
- Token is generated upon successful login/signup
- Token expires in 30 days
- Token is automatically sent with each request in cookies
- Protected routes require a valid token

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
    "success": false,
    "statusCode": 400,
    "message": "Error message"
}
```

## Examples

### Using cURL

1. Sign Up:
```bash
curl -X POST http://localhost:8001/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

2. Login:
```bash
curl -X POST http://localhost:8001/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com","password":"password123"}'
```

3. Create Service:
```bash
curl -X POST http://localhost:8001/api/services \
-H "Content-Type: application/json" \
-H "Cookie: jwt=your-jwt-token" \
-d '{"title":"Service Title","description":"Service Description","price":100,"category":"Category","duration":60}'
```

4. Create Booking:
```bash
curl -X POST http://localhost:8001/api/bookings \
-H "Content-Type: application/json" \
-H "Cookie: jwt=your-jwt-token" \
-d '{"serviceId":"service_id","bookingDate":"2024-01-01T10:00:00.000Z"}'
```

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- SameSite cookie policy is set to 'strict'
- Secure cookie flag is enabled in production
- Input validation is performed on all endpoints
- Error messages are generic to prevent information leakage
- Authorization checks for service and booking operations
- Rate limiting can be implemented for production 

## License
This project is open source and available under the [MIT License](LICENSE). 