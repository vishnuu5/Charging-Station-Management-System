# Charging Station Management System

A full-stack web application for managing electric vehicle charging stations built with Node.js, Express, MongoDB, and Vue.js.

## Features

### Backend (Node.js + Express + MongoDB)

- **User Authentication**: JWT-based authentication with register/login
- **CRUD Operations**: Complete CRUD for charging stations
- **Data Validation**: Input validation and sanitization
- **Security**: Helmet, CORS, rate limiting, and secure password hashing
- **Database**: MongoDB with Mongoose ODM

### Frontend (Vue.js 3)

- **Authentication**: Login/Register with JWT token management
- **Dashboard**: Overview of charging stations with statistics
- **Station Management**: Create, read, update, delete charging stations
- **Map View**: Interactive map showing all charging stations using Leaflet
- **Filtering**: Filter stations by status, connector type, and power output
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- helmet
- cors
- express-rate-limit

### Frontend

- Vue.js 3
- Vue Router
- Pinia (State Management)
- Axios (HTTP Client)
- Leaflet (Maps)
- Tailwind CSS
- Vue Toastification

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/vishnuu5/Charging-Station-Management-System.git
cd charging-station-management
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a \`.env\` file in the \`backend\` directory:

```bash
env
# Database
MONGODB_URI=mongodb://localhost:27017/charging-stations

# JWT Secret
JWT_SECRET=your-super-secret

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections.

For MongoDB Atlas (cloud):

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace the \`MONGODB_URI\` in your \`.env\` file

### 5. Start the Application

#### Development Mode (Both servers)

```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 5173).

#### Start Servers Individually

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

### Authentication

- \`POST /api/auth/register\` - Register a new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user (protected)

### Charging Stations

- \`GET /api/charging-stations\` - Get all stations (with filters)
- \`POST /api/charging-stations\` - Create new station (protected)
- \`GET /api/charging-stations/:id\` - Get single station (protected)
- \`PUT /api/charging-stations/:id\` - Update station (protected)
- \`DELETE /api/charging-stations/:id\` - Delete station (protected)

## Usage

### 1. Register/Login

- Create a new account or login with existing credentials
- JWT token is stored in localStorage for authentication

### 2. Dashboard

- View overview statistics of your charging stations
- Quick access to recent stations

### 3. Manage Stations

- Create new charging stations with location, power output, and connector type
- Edit existing stations
- Delete stations you own
- Filter stations by various criteria

### 4. Map View

- View all charging stations on an interactive map
- Click markers to see station details
- Different colors indicate station status (Active: green, Inactive: red, Maintenance: orange)

## Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Create a new app on your chosen platform
2. Set environment variables:
   - \`MONGODB_URI\`
   - \`JWT_SECRET\`
   - \`NODE_ENV=production\`
   - \`FRONTEND_URL\` (your frontend domain)
3. Deploy the \`backend\` folder

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:

```bash
cd client
npm run build
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet for security headers
- Environment variable protection

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
