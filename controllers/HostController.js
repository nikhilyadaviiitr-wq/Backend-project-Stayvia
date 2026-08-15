const Home = require("../models/home");
const cloudinary = require("../utils/cloudinary");

exports.getAddHome = function(req, res, next) {
    res.render("host/edit-home", { pageTitle: "Add Home", editing: false, isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,});
}

exports.postAddHome = function(req, res, next) {
    console.log(req.body);
    const { HouseName, Price, Location, Rating, PhotoURL, Description } = req.body;
    // If a file was uploaded via Cloudinary, req.file.path is the Cloudinary URL
    let photoUrlValue = PhotoURL;
    if (req.file) {
        photoUrlValue = req.file.path;
    }
    const home = new Home({ HouseName, Price, Location, Rating, PhotoURL: photoUrlValue, Description });
    home.save().then(() => {
        console.log("Home Added Successfully");
        res.redirect("/host/host-homes");
    }).catch((error) => {
        console.log("Error adding home", error);
        res.redirect("/host/add-home");
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then((home) => {
        if (!home) {
            console.log("Home not found for editing.");
            return res.redirect("/host/host-homes");
        }

        res.render("host/edit-home", {
            home: home,
            pageTitle: "Edit your Home",
            editing: editing,
            isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,
        });
    }).catch((error) => {
        console.log("Error finding home for editing", error);
        res.redirect("/host/host-homes");
    });
};

exports.postEditHome = function(req, res, next) {
    const { id, HouseName, Price, Location, Rating, PhotoURL, Description } = req.body;
    Home.findById(id).then(async (home) => {
        if (!home) {
            console.log("Home not found for updating.");
            return res.redirect("/host/host-homes");
        }

        home.HouseName = HouseName;
        home.Price = Price;
        home.Location = Location;
        home.Rating = Rating;
        home.Description = Description;

        if (req.file) {
            // Delete old Cloudinary image if it exists
            if (home.PhotoURL && home.PhotoURL.includes("cloudinary.com")) {
                try {
                    const parts = home.PhotoURL.split("/");
                    const fileWithExt = parts[parts.length - 1];
                    const publicId = "stayvia-homes/" + fileWithExt.split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.log("Error while deleting old Cloudinary image", err);
                }
            }
            home.PhotoURL = req.file.path;
        } else if (PhotoURL && PhotoURL.trim() !== '') {
            home.PhotoURL = PhotoURL;
        }

        return home.save();
    }).then(() => {
        res.redirect("/host/host-homes");
    }).catch((error) => {
        console.log("Error while updating", error);
        res.redirect("/host/host-homes");
    });
};

exports.postDeleteHome = function(req, res, next) {
    const homeId = req.params.homeId;
    Home.findByIdAndDelete(homeId).then(() => {
        res.redirect("/host/host-homes");
    }).catch((error) => {
        console.log('Error while deleting ', error);
        res.redirect("/host/host-homes");
    });
}

exports.getHostHomes = function(req, res, next) {
    Home.find().then((registeredHomes) => {
        res.render("host/host-home-list", { registeredHomes: registeredHomes, pageTitle: "Host Homes",isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,});
    }).catch((error) => {
        console.log("Error fetching homes", error);
    });
}