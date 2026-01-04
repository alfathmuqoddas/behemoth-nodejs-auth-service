# Node.js Authentication Service

This is a Twelve-Factor App compliant authentication service built with Node.js, Express, and Sequelize, using TypeScript. It provides user registration and login functionality using JSON Web Tokens (JWT) signed with RS256 (RSA).

## Features

- **User Registration**: `POST /register` (Supports RBAC with 'user' and 'admin' roles)
- **User Login**: `POST /login`
- **JWT-based Authentication**: Secure RS256 signing using public/private key pairs.
- **Protected Routes**: Middleware to protect endpoints (`/protected/profile`).
- **RBAC**: Admin-only routes (`/protected/admin`).
- **Password Hashing**: Secure hashing using `bcryptjs`.
- **Database**: PostgreSQL integration via Sequelize.
- **Logging**: Structured logging with `pino`.
- **Metrics**: Prometheus metrics exposed at `/metrics`.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT) (RS256), bcryptjs
- **Logging:** Pino, Pino-http
- **Monitoring:** Prometheus (prom-client)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd behemoth-nodejs-auth-service
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Docker

1.  Build the Docker image:
    ```bash
    docker build -t <image-name> .
    ```
2.  Run the Docker image:

    ```bash
    docker run -d -p 3010:3010 --env-file ./.env --network your_shared_network -v /home/alfath/keys:/app/keys --name behemoth-auth-service localhost:5000/behemoth-nodejs-auth-service
    ```

3.  Tips run the development server on docker container (make sure your postgres container is running on the same network)
    ```bash
    docker run --rm -v $(pwd):/app -w /app -p 3010:3010 --network proxy node:lts-alpine sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ```

### Configuration

1.  Create a `.env` file in the root directory based on the following template:

    ```env
    DB_HOST=shared_postgres (make sure the container and postgres container in the same network)
    DB_HOST=localhost (if you are running postgres locally)
    DB_PORT=5432
    DB_NAME=postgres
    DB_USER=postgres
    DB_PASSWORD=your_password
    PORT=3010
    NODE_ENV=development
    DB_DIALECT=postgres
    ```

2.  **Generate RSA Keys:**
    This project uses RS256 for JWTs, requiring a private and public key pair. You must generate these keys in the `keys/` directory.

    ```bash
    # Create keys directory if it doesn't exist (it should exist in the repo)
    mkdir -p keys

    # Generate Private Key
    openssl genrsa -out keys/private.pem 2048

    # Generate Public Key
    openssl rsa -in keys/private.pem -outform PEM -pubout -out keys/public.pem
    ```

### Database Setup

1.  Ensure your PostgreSQL server is running and the database specified in `DB_NAME` exists (or let Sequelize create it if configured).
2.  Run migrations to create the necessary tables:
    ```bash
    npm run db:migrate
    ```

## Available Scripts

- `npm run dev`: Runs the app in development mode with `nodemon`.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` folder.
- `npm start`: Runs the compiled app (requires `npm run build` first).
- `npm run db:migrate`: Runs pending migrations.
- `npm run db:migrate:undo`: Reverts the most recent migration.
- `npm run db:status`: Shows the status of all migrations.

## API Endpoints

### Authentication

#### Register a new user

- **URL:** `/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "role": "user"
  }
  ```
  _Note: `role` is optional and defaults to user logic if not enforced, but the model supports 'admin' or 'user'._

#### Login

- **URL:** `/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Success Response:**
  ```json
  {
    "token": "eyJhbGciOiJSUzI1NiIs..."
  }
  ```

### Protected Routes

Headers required: `Authorization: Bearer <your_jwt_token>`

#### Get User Profile

- **URL:** `/protected/profile`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "message": "Welcome user <user_id>"
  }
  ```

#### Admin Area

- **URL:** `/protected/admin`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "message": "Welcome to the admin area!"
  }
  ```
  _Note: Requires a user with `role: 'admin'`._

### Monitoring

#### Prometheus Metrics

- **URL:** `/metrics`
- **Method:** `GET`
- **Description:** Exposes application metrics for Prometheus scraping.

### Miscelaneous

#### Liveness Check

- **URL:** `/health/liveness`
- **Method:** `GET`
- **Description:** Returns a 200 OK response if the service is live.

#### Readiness Check

- **URL:** `/health/readyness`
- **Method:** `GET`
- **Description:** Returns a 200 OK response if the service is ready.

#### Startup Check

- **URL:** `/health/startup`
- **Method:** `GET`
- **Description:** Returns a 200 OK response if the service is started.
