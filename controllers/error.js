exports.err = function(req, res, next) {
    res.status(404).render("store/error", { pageTitle: "Error!",isLoggedIn: req.session.isLoggedIn,user:req.session.user});
}