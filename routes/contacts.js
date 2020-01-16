var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Contacts = require("../models/contacts");
var middleware = require("../middleware");

// =============================
// CONTACTS ROUTE
// =============================

// CONTACTS	 EDIT ROUTE
router.get("/edit", middleware.isLoggedIn, function(req, res) {
	Contacts.findById(req.params.contact_id, function(err, foundContact) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("contacts/edit", {contact: foundContact});
		}
	});
});

// CONTACTS UPDATE ROUTE
router.put("/", middleware.isLoggedIn, function(req, res) {
	Contacts.findByIdAndUpdate(req.params.contact_id, req.body.contact, function(err, updatedContact) {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/users/" + req.params.id);
		}
	});
});

// CONTACT DESTROY ROUTE
router.delete("/", middleware.isLoggedIn, function(req, res) {
	Contacts.findByIdAndRemove(req.params.contact_id, function(err) {
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Contact deleted");
			res.redirect("back");
		}
	});
});

module.exports = router;