
# Skill Share App - Backend API

A backend API for a **Skill Share** platform built with **Node.js**, **Express**, **Sequelize**, and **PostgreSQL**.

This API handles user registration, authentication, offers management, and connects users with service providers.

## Features

- **User Registration**: Allows users to sign up as individual users or companies.
- **User Authentication**: JWT authentication to ensure secure access.
- **Offer Management**: Providers can make offers related to tasks.
- **Role-based Access**: Users and providers have different roles with specific access.

## Tech Stack

- **Node.js**: JavaScript runtime for building scalable network applications.
- **Express**: Web framework for Node.js.
- **Sequelize**: ORM for PostgreSQL that simplifies database interaction.
- **PostgreSQL**: Relational database for data storage.
- **JWT**: JSON Web Token for user authentication.

## Installation

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/skill-share-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd skill-share-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables. Create a `.env` file and add the following:

   ```env
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=3600
   PORT=5000
   NODE_ENV=development
   ```

5. Start the server:

   ```bash
   npm start
   ```

The server will start on port 5000 by default. You can change the port in the `.env` file.

## Endpoints

### `POST /api/register`

Register a new user.

#### Request Body

- `type` (string): "individual" or "company"
- `role` (string): "user" or "provider"
- `firstName` (string): User's first name
- `lastName` (string): User's last name
- `email` (string): User's email
- `password` (string): User's password
- `mobileNumber` (string): User's mobile number
- `streetNumber` (string, optional): User's street number
- `streetName` (string, optional): User's street name
- `city` (string, optional): User's city
- `state` (string, optional): User's state
- `postCode` (string, optional): User's post code
- `companyName` (string, optional): User's company name
- `phoneNumber` (string, optional): User's company phone number
- `businessTaxNumber` (string, optional): User's company business tax number

#### Response

```json
{
  "success": true,
  "message": "User registered successfully.",
  "token":"token",
   "data": {
        "id": "9ea7f86b-f64a-48f4-afd5-5363a3237e23",
        "role": "provider",
        "email": "sample@gmail.com",
        "firstName": "John",
        "lastName": "Doe"
  }
}
```

### `POST /api/login`

User login.

#### Request Body

- `email` (string): User's email
- `password` (string): User's password

#### Response

```json
{
  "success": true,
  "token": "token",
  "data": {
        "id": "9ea7f86b-f64a-48f4-afd5-5363a3237e23",
        "role": "provider",
        "email": "sample@gmail.com",
        "firstName": "John",
        "lastName": "Doe"
   }
}
```
  
### Users Table

The **users** table contains information about users including their role (either 'user' or 'provider'), type (individual or company), personal details, and address.

### Offers Table

The **offers** table tracks offers made by providers for tasks.

## Environment Variables

| Variable         | Description                            |
|------------------|----------------------------------------|
| `DB_NAME`        | The name of the PostgreSQL database    |
| `DB_USER`        | The username for the PostgreSQL database|
| `DB_PASSWORD`    | The password for the PostgreSQL database|
| `DB_HOST`        | Host for the PostgreSQL database       |
| `DB_PORT`        | Port for the PostgreSQL database       |
| `JWT_SECRET`     | Secret key for JWT token signing       |
| `JWT_EXPIRE`     | JWT token expiration time in seconds  |
| `PORT`           | Port to run the server on              |
| `NODE_ENV`       | Node environment (development/production)|

 