const Home = require("../models/home");
const fs = require("fs");
const path = require('path');
const rootDir = require('../.gitignore/utils/rootpath');

exports.getAddHome = function(req, res, next) {
    res.render("host/edit-home", { pageTitle: "Add Home", editing: false, isLoggedIn: req.session.isLoggedIn, 
    user: req.session.user,});
}

exports.postAddHome = function(req, res, next) {
    console.log(req.body);
    const { HouseName, Price, Location, Rating, PhotoURL, Description } = req.body;
    // If a file was uploaded, use its filename to construct a public URL
    let photoUrlValue = PhotoURL;
    if (req.file) {
        photoUrlValue = `/uploads/${req.file.filename}`;
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
    Home.findById(id).then((home) => {
        if (!home) {
            console.log("Home not found for updating.");
            return res.redirect("/host/host-homes");
        }
        home.HouseName = HouseName;
        home.Price = Price;
        home.Location = Location;
        home.Rating = Rating;
        home.PhotoURL = PhotoURL;
        home.Description = Description;

                if (req.file) {
                // delete previous file if exists (home.PhotoURL stores '/uploads/filename')
                if (home.PhotoURL) {
                        const existing = home.PhotoURL.startsWith('/uploads/') ? home.PhotoURL.replace('/uploads/', '') : path.basename(home.PhotoURL);
                        const existingPath = path.join(rootDir, 'uploads', existing);
                        fs.unlink(existingPath, (err) => {
                            if (err) {
                                console.log("Error while deleting file ", err);
                            }
                        });
                }
                home.PhotoURL = `/uploads/${req.file.filename}`;
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