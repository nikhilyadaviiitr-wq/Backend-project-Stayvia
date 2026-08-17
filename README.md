# Stayvia

Stayvia is a full-stack property rental platform where Guests can browse, favourite, and book listed homes, and Hosts can list, edit, and manage their own properties. It features role-based authentication, cloud-hosted image uploads, and a custom dark-themed UI — deployed live on Vercel.

**Live Demo:** [stayvia.vercel.app](https://backend-project-stayvia.vercel.app)

## Features

- **Authentication & Authorization**
  - Secure signup/login with bcrypt password hashing
  - Session-based auth persisted in MongoDB (`express-session` + `connect-mongo`)
  - Role-based access — separate experiences for Guests and Hosts
  - Server-side form validation with `express-validator`

- **Host Dashboard**
  - Add, edit, and delete property listings
  - Upload property photos directly to the cloud (Cloudinary)

- **Guest Experience**
  - Browse all listed properties
  - View detailed property pages
  - Save properties to a personal Favourites list
  - Book properties

- **UI/UX**
  - Fully responsive, server-rendered interface (EJS)
  - Custom dark, glassmorphic design system built with Tailwind CSS

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Templating | EJS |
| Database | MongoDB Atlas with Mongoose ODM |
| Authentication | express-session, connect-mongo, bcryptjs, express-validator |
| Image Storage | Cloudinary (via Multer) |
| Styling | Tailwind CSS |
| Deployment | Vercel (serverless) |
| Dev Tools | Nodemon, dotenv |

## Project Structure

```
stayvia/
├── app.js                     # App entry point
├── vercel.json                 # Vercel deployment config
├── controllers/
│   ├── HostController.js       # Host-side logic (add/edit/delete listings)
│   ├── StoreController.js      # Guest-side logic (browse/favourite/book)
│   ├── AuthController.js       # Signup/login/logout logic
│   ├── error.js                # 404 handler
│   └── routes/                 # Express routers (host, store, auth, 404)
├── models/                     # Mongoose schemas (Home, User, Favourite)
├── views/
│   ├── partials/                # Shared components (head, nav)
│   ├── store/                   # Guest-facing pages
│   ├── host/                    # Host-facing pages
│   └── auth/                    # Login/signup pages
├── public/                      # Static assets (Tailwind output, images)
└── utils/                       # Helper utilities (DB connection, Cloudinary config, root path)
```

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (or a local MongoDB instance)
- A Cloudinary account for image uploads

### Installation

```bash
git clone https://github.com/nikhilyadaviiitr-wq/Backend-project-Stayvia.git
cd Backend-project-Stayvia
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running Locally

```bash
npm start
```

This runs the Express server (via Nodemon) and the Tailwind CSS watcher concurrently.

```
http://localhost:3000
```

## Deployment

This project is configured for deployment on **Vercel** as a serverless function. Key considerations for serverless deployment:
- MongoDB connection uses **MongoDB Atlas** (cloud-hosted) rather than a local instance
- File uploads are handled via **Cloudinary** instead of local disk storage, since serverless functions have a read-only filesystem
- All environment variables must be configured in the Vercel dashboard under **Settings → Environment Variables**

## Future Improvements

- Payment integration for bookings
- Reviews and ratings from guests
- Search and filter functionality for listings
- Email verification on signup

## License

This project is open source and available for learning purposes.
