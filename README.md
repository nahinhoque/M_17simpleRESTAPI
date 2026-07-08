# Express JWT Auth CRUD API

[Download the project documentation PDF](./docs/TheoryQuestions.pdf)

A complete Node.js + Express + MongoDB project with JWT-based authentication, secure password hashing, and protected CRUD endpoints for users.

## Project Overview

This application provides:

- User registration with encrypted password storage using `bcrypt`
- User login with JWT token issuance via `jsonwebtoken`
- Protected profile endpoint accessible only with a valid token
- CRUD user endpoints including list, get by ID, update name, and delete
- MongoDB connection via `mongoose`
- Environment-based configuration using `dotenv`

## Project Structure

- `server.js` - application entry point and startup logic
- `src/app.js` - Express app configuration and route mounting
- `src/config/db.js` - MongoDB connection logic
- `src/controllers/auth.controller.js` - registration and login handlers
- `src/controllers/user.controller.js` - user profile and CRUD handlers
- `src/routes/auth.route.js` - public auth routes
- `src/routes/user.route.js` - protected user routes
- `src/middleware/auth.js` - JWT authentication middleware

## Dependencies

Installed packages:

- `express`
- `mongoose`
- `jsonwebtoken`
- `dotenv`
- `bcrypt`
- `nodemon` (development)

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. Start the app in development mode:

```bash
npm run dev
```

4. Or start in production mode:

```bash
npm start
```

The server listens on the configured `PORT` (defaults to `5000`).

## Available Scripts

- `npm start` - run the server with Node
- `npm run dev` - run the server with Nodemon for development

## API Endpoints

### Public Endpoints

#### `POST /api/register`

Register a new user.

Request body:

```json
{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "yourpassword"
}
```

Response:

- `201 Created` when registration succeeds
- `409 Conflict` if email already exists

#### `POST /api/login`

Authenticate a user and return a JWT.

Request body:

```json
{
  "email": "you@example.com",
  "password": "yourpassword"
}
```

Response:

- `200 OK` with JSON containing `token` and user details
- `401 Unauthorized` for invalid credentials

### Protected Endpoints

All protected endpoints require the header:

```
Authorization: Bearer <token>
```

Use the token returned by `POST /api/login`.

#### `GET /api/users/profile`

Returns the currently authenticated user’s profile.

#### `GET /api/users`

Returns all users in the database.

> Response excludes the `password` field.

#### `GET /api/users/:id`

Returns a single user by ID.

> This endpoint is secured so only the token owner can access the matching user ID.

#### `PUT /api/users/:id`

Update a user's `name` field.

Request body:

```json
{
  "name": "New Name"
}
```

> Only the authenticated user whose token matches `:id` may update that user.

#### `DELETE /api/users/:id`

Delete a user.

> Only the authenticated user whose token matches `:id` may delete that user.

## Testing with Postman

1. Start the server using `npm run dev`.

2. Create a new Postman collection or use a dedicated environment.

3. Register a user:
   - Method: `POST`
   - URL: `http://localhost:5000/api/register`
   - Body type: `raw` JSON
   - Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123"
}
```

4. Login:
   - Method: `POST`
   - URL: `http://localhost:5000/api/login`
   - Body:

```json
{
  "email": "alice@example.com",
  "password": "Password123"
}
```

5. Copy the `token` from the login response.

6. Test profile access:
   - Method: `GET`
   - URL: `http://localhost:5000/api/users/profile`
   - Header: `Authorization: Bearer <token>`

7. Test user list:
   - Method: `GET`
   - URL: `http://localhost:5000/api/users`
   - Header: `Authorization: Bearer <token>`

8. Test fetching a specific user by ID:
   - Method: `GET`
   - URL: `http://localhost:5000/api/users/<userId>`
   - Header: `Authorization: Bearer <token>`

9. Test updating your user name:
   - Method: `PUT`
   - URL: `http://localhost:5000/api/users/<userId>`
   - Header: `Authorization: Bearer <token>`
   - Body:

```json
{
  "name": "Alice Updated"
}
```

10. Test deleting your user:
    - Method: `DELETE`
    - URL: `http://localhost:5000/api/users/<userId>`
    - Header: `Authorization: Bearer <token>`

## Notes

- `GET /api/users/:id`, `PUT /api/users/:id`, and `DELETE /api/users/:id` require the authenticated token to match the requested user ID.
- `GET /api/users` returns all users, but never includes passwords.
- Keep `JWT_SECRET` secure and never commit `.env` to source control.

## Troubleshooting

- If the app fails to start, ensure `MONGO_URI` is correct and reachable.
- If authentication fails, confirm the request includes `Authorization: Bearer <token>`.
- Use the login response token for all protected endpoints.
