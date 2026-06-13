# Freelance Bid Portal for Students

A MERN stack portal where students post project work, bid as freelancers, manage assignments, receive notifications, and exchange reviews.

## Stack

- React, React Router, Zustand, Axios, Tailwind CSS
- Node.js, Express, JWT, MongoDB, Mongoose
- Cloudinary-ready profile upload config

## Core Modules

- Auth with JWT cookies/headers, bcrypt password hashing, and client/freelancer/admin roles
- User profiles with optional Cloudinary image, bio, GitHub, LinkedIn, portfolio URL, skills, education, rating, completed projects, cancelled projects, and reliability score
- Projects with `open`, `assigned`, `in_progress`, `submitted`, `completed`, `cancelled`, and `overdue` statuses
- Bids with submit, update, withdraw, accept, and reject flows
- Freelancer profile view from bid cards, including social links and reviews
- Completion flow where freelancers submit work and clients approve or request revisions
- Reviews, ratings, notifications, and dashboard statistics

## Run Locally

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api`.

## Backend `.env`

```env
PORT=5000
DB_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```
