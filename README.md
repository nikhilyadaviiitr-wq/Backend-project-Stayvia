# Stayvia

Stayvia is a full-stack Airbnb-inspired web application built with Node.js, Express, EJS, and MongoDB. It lets guests browse and book listed homes, save favourites, and lets hosts list, edit, and manage their own properties — complete with authentication and role-based access.

## Features

- **User Authentication** — Sign up and log in securely with hashed passwords (bcrypt) and session-based auth
- **Role-Based Access** — Separate experiences for Guests and Hosts
- **Host Dashboard**
  - Add, edit, and delete home listings
  - Upload property photos
- **Guest Experience**
  - Browse all listed homes
  - View detailed home pages
  - Save homes to Favourites
  - Book homes
- **Responsive UI** — Styled with Tailwind CSS, dark modern theme
- **Persistent Sessions** — Sessions stored in MongoDB so logins persist across server restarts

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Templating | EJS |
| Database | MongoDB with Mongoose |
| Authentication | express-session, connect-mongo, bcryptjs |
| File Uploads | Multer |
| Styling | Tailwind CSS |
| Dev Tools | Nodemon |

## Project Structure

```
stayvia/
├── app.js                 # App entry point
├── controllers/            # Route handlers (Store, Host, Auth)
│   └── routes/             # Express routers
├── models/                 # Mongoose schemas (Home, User)
├── views/                  # EJS templates
│   ├── partials/           # Shared components (head, nav)
│   ├── store/               # Guest-facing pages
│   └── host/                # Host-facing pages
├── public/                  # Static assets (CSS, uploaded images)
└── utils/                   # Helper utilities (DB connection, etc.)
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (or a MongoDB Atlas connection string)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stayvia.git
cd stayvia

# Install dependencies
npm install
```

### Running the app

```bash
npm start
```

This runs the Express server (via Nodemon) and the Tailwind CSS watcher together. The app will be available at:

```
http://localhost:3000
```

### Environment Setup

Make sure MongoDB is running locally, or update the connection string in `utils/databaseUtil.js` to point to your MongoDB Atlas cluster.

## Screenshots

*(Add screenshots of the homepage, home details page, and host dashboard here)*

## Future Improvements

- Payment integration for bookings
- Reviews and ratings from guests
- Search and filter functionality
- Email verification on signup

## License

This project is open source and available for learning purposes.
