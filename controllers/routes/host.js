const express = require("express");
const multer = require('multer');
const home = require("../HostController");
const HostRouter = express.Router();

// store uploads in uploads/ directory
const upload = multer({ dest: 'uploads/' });

// Removed "/store/..." from all URLs as instructed
HostRouter.get('/add-home', home.getAddHome);
HostRouter.post('/add-home', upload.single('Photo'), home.postAddHome);
HostRouter.get('/host-homes', home.getHostHomes);
HostRouter.get('/edit-home/:homeId', home.getEditHome);
HostRouter.post('/edit-home', upload.single('Photo'), home.postEditHome);
HostRouter.post('/delete-home/:homeId', home.postDeleteHome);

exports.HostRouter = HostRouter;