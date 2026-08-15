const express = require("express");
const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../utils/cloudinary");
const home = require("../HostController");
const HostRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stayvia-homes",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

HostRouter.get('/add-home', home.getAddHome);
HostRouter.post('/add-home', upload.single('Photo'), home.postAddHome);
HostRouter.get('/host-homes', home.getHostHomes);
HostRouter.get('/edit-home/:homeId', home.getEditHome);
HostRouter.post('/edit-home', upload.single('Photo'), home.postEditHome);
HostRouter.post('/delete-home/:homeId', home.postDeleteHome);

exports.HostRouter = HostRouter;