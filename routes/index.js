var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Contacts = require("../models/contacts");
var seedDB = require("../seeds");
var middleware = require("../middleware");

router.get("/", function(req, res) {
	res.render("landing");
})

// =============================
// AUTH ROUTES
// =============================

// show register form
router.get("/register", function(req, res) {
	res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username, email: req.body.email});
	seedDB(newUser);
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			req.flash("error", err.message);
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to AreaSafety1 " + user.username + "!");
			res.redirect("/users");
		});
	});
});

// show login form
router.get("/login", function(req, res) {
	res.render("login");
});
// handling login logic
// router.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local", {
		 successRedirect: "/users",
		 failureRedirect: "/login"
	}), function(req, res) {
});

// logout route
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

module.exports = router;