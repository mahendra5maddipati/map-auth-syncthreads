# SyncThreads Map Authentication Project

This project is a full-stack application that provides user authentication, a dashboard for managing cards, and an interactive map view. It is built using the following technologies:

- **Frontend**: React, React Router, Leaflet, Material-UI
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Project Structure

```
syncthreads/
├── backend_map_auth/       # Backend code
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
├── frontend_map_auth/      # Frontend code
│   ├── public/             # Public assets
│   ├── src/                # React source code
│   ├── .gitignore          # Ignored files for frontend
│   └── package.json        # Frontend dependencies
└── .gitignore              # Ignored files for the entire project
```

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB database
- A `.env` file with the following variables:
  ```
  MONGO_URI=<your-mongodb-uri>
  PORT=5000
  JWT_SECRET=<your-secret-key>
  ```

### Backend Setup

1. Navigate to the `backend_map_auth` directory:
   ```bash
   cd backend_map_auth
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend_map_auth` directory:
   ```bash
   cd frontend_map_auth
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm start
   ```

### Running the Application

1. Ensure the backend server is running on `http://localhost:5000`.
2. Open the frontend application in your browser at `http://localhost:3000`.

## Features

- **User Authentication**: Register and login functionality with JWT-based authentication.
- **Dashboard**: Manage cards (add, delete, and view details).
- **Map View**: Interactive map with marker management.