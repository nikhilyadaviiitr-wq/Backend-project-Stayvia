const express = require("express");
const connectDB = require("./.gitignore/utils/databaseUtil");
const rootDir = require("./.gitignore/utils/rootpath");
const path = require("path");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo;
const multer = require("multer");

const { StoreRouter } = require("./controllers/routes/store");
const { HostRouter } = require("./controllers/routes/host");
const { AuthRouter } = require("./controllers/routes/auth");
const error404 = require("./controllers/routes/404");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
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
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))

app.use(session({
    secret: "hello",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/airbnb",
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

const port = 3000;

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log("APP STARTED !!");
    });
};

startServer();