const Home = require("../models/home");
const User = require("../models/user");

exports.WelcomePage = function (req, res, next) {
    Home.find().then((registeredHomes) => {
        res.render("store/welcome", { registeredHomes: registeredHomes, pageTitle: "Stayvia", isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,});
    }).catch((error) => {
        console.log("Error fetching homes", error);
    });
};

exports.BookingsPage = function (req, res, next) {
    res.render("store/bookings", { pageTitle: "Bookings", isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,});
};

exports.getFavouriteList = function (req, res, next) {
    const UserId=req.session.user._id;
    User.findById(UserId).populate("favourites").then(user=>{
        res.render("store/favourite-list",{
            favourites: user.favourites,
    pageTitle: "My Favourites",
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user,
        });
    })
};

exports.getHomeDetails = function (req, res, next) {
    const homeId = req.params.homeId;
    Home.findById(homeId).then((home) => {
        if (!home) {
            return res.redirect("/store");
        }
        res.render("store/home-details", {
            home: home,
            pageTitle: home.HouseName,
            isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,
        });
    }).catch((error) => {
        console.log("Error finding home", error);
        res.redirect("/store");
    });
};

exports.postFavourites = function (req, res, next) {
    const homeId = req.body.homeId;
    const userId= req.session.user._id;
    User.findById(userId).then(user=>{
        if (!user.favourites.some(id => id.toString() === homeId)) {
    user.favourites.push(homeId);
    return user.save();
}
        return user;
    }).then(()=>{
        res.redirect("/store/favourite-list");
    }).catch(err=>{
        console.log("Error while adding favourites: ",err);
        res.redirect("/store/favourite-list");
    })
};

exports.postDeleteFavourite = async (req, res, next)=> {
    const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/store/favourite-list");
};