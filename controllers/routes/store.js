const express = require("express");
const StoreRouter = express.Router();
const home = require("../StoreController");

// All URLs are using "/store/..." as per the instruction
StoreRouter.get('/', home.WelcomePage);
StoreRouter.get("/bookings", home.BookingsPage);
StoreRouter.get("/favourite-list", home.getFavouriteList);
StoreRouter.get("/:homeId", home.getHomeDetails);
StoreRouter.post("/favourite-list", home.postFavourites);
StoreRouter.post("/favourite-list/delete/:homeId", home.postDeleteFavourite);

exports.StoreRouter = StoreRouter;