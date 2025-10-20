# ManosUni Backend

This is the backend for the ManosUni project, built using Express and PostgreSQL. The backend provides RESTful APIs for user authentication and management.

## Project Structure

```
backend
├── src
│   ├── server.js               # Entry point of the application
│   ├── app.js                  # Express application setup
│   ├── config
│   │   └── db.js               # Database connection configuration
│   ├── controllers
│   │   ├── authController.js    # Authentication-related request handlers
│   │   └── userController.js    # User-related request handlers
│   ├── routes
│   │   ├── auth.js              # Authentication routes
│   │   └── users.js             # User management routes
│   ├── models
│   │   └── user.js              # User model and database interactions
│   ├── middleware
│   │   └── auth.js              # Authentication middleware
│   ├── migrations
│   │   └── 001_create_users_table.sql # SQL migration for users table
│   └── utils
│       └── hash.js              # Password hashing utilities
├── .env.example                 # Environment variable template
├── package.json                 # NPM configuration file
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env` and fill in the required values, such as database connection details.

4. **Run migrations**:
   - Ensure you have PostgreSQL running and execute the migration script to create the necessary tables.

5. **Start the server**:
   ```
   npm start
   ```

## Usage

- The backend provides the following endpoints:
  - **Authentication**:
    - `POST /register`: Register a new user.
    - `POST /login`: Log in an existing user.
  - **User Management**:
    - `GET /users`: Retrieve a list of users.
    - `PUT /users/:id`: Update user information.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.