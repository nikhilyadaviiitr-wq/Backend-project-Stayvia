require("dotenv").config();

const express = require("express");
const connectDB = require("./utils/databaseUtil");
const rootDir = require("./utils/rootpath");
const path = require("path");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo;
const multer = require("multer");
const cloudinary = require("./utils/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { StoreRouter } = require("./controllers/routes/store");
const { HostRouter } = require("./controllers/routes/host");
const { AuthRouter } = require("./controllers/routes/auth");
const error404 = require("./controllers/routes/404");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayvia-homes",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage, fileFilter
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET || "hello",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/airbnb",
        collectionName: "sessions"
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use("/store/favourite-list", (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
});

app.get("/", (req, res) => {
    res.redirect("/store");
});

app.use("/store", StoreRouter);

app.use("/host", (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
    next();
});

app.use("/host", HostRouter);

app.use(AuthRouter);

app.use("/", error404);

const port = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log("APP STARTED !!");
    });
};

startServer();

module.exports = app;