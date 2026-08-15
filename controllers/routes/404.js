const express = require("express");
const { err } = require("../error");
const error404 = express.Router();
error404.use("/", err);
module.exports = error404;