# UniSearch - College Discovery Platform

A full-stack web application for discovering IT and Management colleges across India.

## Features

- Search colleges by name, location, or course
- Filter by college type, state, NAAC grade, and fees
- Sort by rating, name, or fees
- Detailed college profiles with contact information
- Responsive design

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Deployment**: Local development

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the connection string in `.env` if needed
   - Default: `mongodb://localhost:27017/unisearch`

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This will populate the database with sample college data.

5. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5000`
   - The app will serve the frontend and API

## API Endpoints

- `GET /api/colleges` - Get all colleges with optional filtering
  - Query parameters: `q` (search), `type`, `state`, `naac`, `feeMin`, `feeMax`, `sort`
- `GET /api/colleges/:id` - Get single college by ID

## Database Schema

The College model includes:
- Basic info: name, location, state, type
- Academic: rating, NAAC grade, courses, affiliation
- Financial: fees
- Contact: phone, email, website
- UI: color, background color

## Adding More Colleges

To add more colleges to the database:

1. Edit `scripts/seed.js` and add college objects to the `colleges` array
2. Run `npm run seed` to update the database

For production use, consider sourcing data from official education portals or APIs.

## Development

- Frontend files: `index.html`, `style.css`, `app.js`
- Backend files: `server.js`, `routes/`, `models/`
- Database seeding: `scripts/seed.js`

## License

MIT License