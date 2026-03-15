# Resume-Build1


This project is a full-stack AI-integrated resume builder. It allows users to create professional resumes with AI-driven content suggestions and exports them as high-quality PDFs.

## Tech Stack Used
- Frontend: React (Vite), Tailwind CSS, Lucide React Icons, JavaScript
- Backend: Node.js, Express, MongoDB, Groq AI SDK
- Deployment: Vercel (Frontend), MongoDB Atlas (Database)

## Features Implemented
- User Authentication: Secure Login and Logout functionality.
- Resume History: View and manage your previous resumes from the Dashboard.
- AI Summary Generation: Automatically generates a professional summary based on resume data.
- AI Description Enhancement: Polishes job and project descriptions for better impact.
- AI Skill Suggestions: Recommends skills based on user experience.
- Dynamic Resume Templates: Multiple professional layouts (Classic, Modern, Minimal).
- Premium Options: Exclusive premium templates available for high-end resume designs.
- Real-time Preview: See changes instantly as the resume is built.
- High-Quality PDF Export: Optimized printing system for clean resume downloads.
- Resume Management: Save, update, and toggle public/private visibility for resumes.

## Project Architecture
The code is written using a modular structure to ensure scalability and maintainability:
- Constants: Centralized configuration and static data (e.g., section definitions).
- Utils: Helper functions and shared logic used across the application.
- API Layer: Dedicated service files for all backend communication.
- React Components: Separated into functional areas like forms, previews, and layouts.

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a .env file with the following variables:
   - PORT=5000
   - MONGO_URI=your_mongodb_connection_string
   - GROQ_API_KEY=your_groq_api_key
   - JWT_SECRET=your_secret_key
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Assumptions Made
- The user has a valid Groq API key (starting with gsk_) for AI features to function.
- A MongoDB database is available for data persistence.
- Resumes are exported using the browser's built-in print-to-PDF functionality.
