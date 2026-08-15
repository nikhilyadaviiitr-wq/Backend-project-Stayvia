const express= require("express");
const AuthRouter= express.Router();
const AuthController= require("../AuthController");

AuthRouter.get("/login",AuthController.getLogin);
AuthRouter.post("/login",AuthController.postLogin);
AuthRouter.post("/logout",AuthController.postLogout);
AuthRouter.get("/signup",AuthController.getSignUp)
AuthRouter.post("/signup",AuthController.postSignUp)

exports.AuthRouter = AuthRouter;