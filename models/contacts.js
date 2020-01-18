var mongoose = require("mongoose");

var contactSchema = mongoose.Schema({
    name: String,
	phonenumber: String,
	email: String
});

module.exports = mongoose.model("Contacts_AreaSafety1", contactSchema);