var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Contacts = require("../models/contacts");
var middleware = require("../middleware");
// index is always the default file received when we require a directory


router.get("/", middleware.isLoggedIn, function(req, res) {
	res.render("users/main");
});

router.get("/:id", middleware.isLoggedIn, function(req, res) {
	User.findById(req.params.id).populate("contacts").exec(function(err, foundUser) {
		if(err || !foundUser) {
			console.log(err);
			req.flash('error', 'Sorry, that user does not exist!');
			return res.redirect('/users');
		} else {
			res.render("users/show", {user: foundUser});
		}
	});
});


router.get("/:id/new", middleware.isLoggedIn, function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.render("contacts/new", {user: user});
		}
	});  
});

router.post("/:id", middleware.isLoggedIn, function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(err) {
			console.log(err);
			res.redirect("/users");
		} else {
			Contacts.create(req.body.contact, function(err, contact) {
				if(err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					contact.save();
					user.contacts.push(contact);
					user.save();
					req.flash("success", "Successfully added contact");
					res.redirect("/users/" + user._id);
				}
			});
		}
	});
});

// // CREATE - add new campground to DB
// router.post("/", middleware.isLoggedIn, function(req, res) {
// 	var name = req.body.name;
// 	var image = req.body.image;
// 	var desc = req.body.description;
// 	var author = {
// 		id: req.user._id,
// 		username: req.user.username
// 	}
// 	var price = req.body.price;
// 	var newCampground = {name: name, image: image, description: desc, author: author, price: price};
// 	// campgrounds.push(newCampground);
// 	// Create a new campground and save to DB
// 	Campground.create(newCampground, function(err, campground) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	});
// 	// res.redirect("/campgrounds");
// });

// // NEW - show form to create new campground
// router.get("/new", middleware.isLoggedIn, function(req, res) {
// 	res.render("campgrounds/new");
// });

// // SHOW - shows more info about one campground
// router.get("/:id", function(req, res) {
// 	// find campground with provided Id
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
// 		if(err || !foundCampground) {
// 			console.log(err);
// 			req.flash('error', 'Sorry, that campground does not exist!');
// 			return res.redirect('/campgrounds');
// 		} else {
// 			// render show template with that campground
// 			res.render("campgrounds/show", {campground: foundCampground});
// 		}
// 	});
// });

// // EDIT CAMPGROUND ROUTE
// router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, function(req, res) {
// 	Campground.findById(req.params.id, function(err, foundCampground) {
// 		// we are not checking for error as that is handled in the used middleware
// 		res.render("campgrounds/edit", {campground: foundCampground});
// 	});
// });

// // UPDATE CAMPGROUND ROUTE
// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
// 	// find and update correct campgrouonds
// 	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
// 		if(err) {
// 			res.redirect("/campgrounds");
// 		} else {
// 			res.redirect("/campgrounds/" + req.params.id);
// 		}
// 	});
// 	// redirect somewherre(show page)
// });

// // DESTROY CAMPGROUND
// router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
// 	// res.send("DELETE!");
// 	Campground.findByIdAndRemove(req.params.id, function(err) {
// 		if(err) {
// 			res.redirect("/campgrounds");
// 		} else {
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

module.exports = router;