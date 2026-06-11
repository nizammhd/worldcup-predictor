# World Cup Prediction Web Application

A full-stack football prediction platform built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## Features
- User login with numeric ID
- Prediction submission before deadline
- Leaderboard and points tracking
- Admin login, user management, fixtures, deadlines, results
- Automatic point calculation when final scores are entered

## Folder structure
- client/ - React + Tailwind frontend
- server/ - Express + Mongoose backend

## Backend API overview
- POST /api/admin/login - Admin login
- POST /api/admin/seed - Create default admin account
- GET /api/admin/users - List users
- POST /api/admin/users - Create user
- PUT /api/admin/users/:id - Edit user
- DELETE /api/admin/users/:id - Delete user
- GET /api/admin/matches - List fixtures
- POST /api/admin/matches - Add fixture
- PUT /api/admin/matches/:id - Edit fixture
- DELETE /api/admin/matches/:id - Delete fixture
- GET /api/admin/settings - Get deadline
- PUT /api/admin/settings - Update deadline
- PUT /api/admin/results/:id - Save final scores and recalc points
- GET /api/predictions/me/:userId - User predictions
- POST /api/predictions - Submit predictions
- GET /api/leaderboard - Leaderboard

## Environment variables
Copy server/.env.example to server/.env and update values.

## Installation
1. cd server && npm install
2. cp .env.example .env
3. npm run dev
4. cd ../client && npm install
5. npm run dev

## Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Ready-to-use deployment setup
1. Deploy the backend on Render using the included render.yaml.
2. Replace the placeholder MongoDB Atlas string in render.yaml if you want to use a different DB.
3. Copy the Render URL and set it as VITE_API_BASE_URL in Vercel.
4. Deploy the frontend on Vercel using the included client/vercel.json.

The frontend now uses VITE_API_BASE_URL for production requests, while the local dev server still uses the existing Vite proxy.

## Default admin
- Username: admin
- Password: admin123

## Notes
- The app uses JWT for admin authentication.
- The backend automatically calculates points when final scores are entered.
