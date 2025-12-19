# Node.js Authentication Service

This is a simple authentication service built with Node.js, Express, and Sequelize, using TypeScript. It provides user registration and login functionality using JSON Web Tokens (JWT).

## Features

- User registration (`/api/auth/register`)
- User login (`/api/auth/login`)
- JWT-based authentication
- Protected routes middleware
- Password hashing with bcrypt

## Technologies Used

- **Backend:** Node.js, Express.js
- **ORM:** Sequelize
- **Database:** SQLite (in-memory)
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Monitoring:** Prometheus (prom-client)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd nodejs-auth-service
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root of the project and add the following environment variables. A `.env.example` is provided.

```
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
```

## Available Scripts

In the project directory, you can run the following commands:

### `npm run dev`

Runs the app in development mode using `ts-node` and `nodemon`. The server will automatically restart if you make changes to the code.

### `npm run build`

Builds the app for production to the `dist` folder. It transpiles TypeScript to JavaScript.

### `npm start`

Runs the compiled app in production mode. Make sure you have run `npm run build` first.

## API Endpoints

### Authentication

-   **Register a new user**
    -   **URL:** `/api/auth/register`
    -   **Method:** `POST`
    -   **Body:**
        ```json
        {
          "email": "test@example.com",
          "password": "yourpassword"
        }
        ```

-   **Login a user**
    -   **URL:** `/api/auth/login`
    -   **Method:** `POST`
    -   **Body:**
        ```json
        {
          "email": "test@example.com",
          "password": "yourpassword"
        }
        ```
    -   **Success Response:**
        ```json
        {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```

### Protected Routes

-   **Get user profile**
    -   **URL:** `/api/profile`
    -   **Method:** `GET`
    -   **Headers:**
        -   `Authorization`: `Bearer <your_jwt_token>`
    -   **Success Response:**
        ```json
        {
          "message": "Welcome user <user_id>"
        }
        ```

### Monitoring

-   **Prometheus Metrics**
    -   **URL:** `/metrics`
    -   **Method:** `GET`
    -   **Description:** Exposes application metrics in a format that can be scraped by a Prometheus server.
