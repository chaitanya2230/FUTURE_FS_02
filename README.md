# Mini CRM MERN Stack

A complete Client Lead Management System (Mini CRM) built using MongoDB, Express.js, React.js, and Node.js.

## Features
- Admin login with JWT Authentication
- Dashboard with metric cards (Total, New, Contacted, Converted)
- Leads table with search and filtering
- Color-coded status badges
- Add/Edit/Delete leads with slide-in detail panel

## Tech Stack
**Frontend:** React, Tailwind CSS, Lucide React, React Router
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repository_url>
cd future_interns_task2
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd server
npm install
\`\`\`
- Copy the `.env.example` file to `.env` in the `server` directory and update the `MONGO_URI` and `JWT_SECRET` if needed.
\`\`\`bash
cp ../.env.example .env
\`\`\`
- Start the development server
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

### 4. Usage
- First time running: A default admin user is not created automatically. You can either create an API endpoint to register an admin, or manually insert one into MongoDB.
*(For testing, you might need to use Postman to hit a registration endpoint if you add one, or insert a hashed password directly).*
- The client runs on `http://localhost:5173`
- The server runs on `http://localhost:5000`

## Default Admin Credentials
To easily test the system, you can seed the database or manually register an admin.
*(Note: A register route is not exposed in the frontend for security, but the backend includes a simple script or you can use Postman to register an admin).*
