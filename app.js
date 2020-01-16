var express 		= require("express"),
	app 			= express(),
	bodyParser		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport    	= require("passport"),
	LocalStrategy   = require("passport-local"),
	methodOverride  = require("method-override"),
	flash			= require("connect-flash"),
	Contacts  		= require("./models/contacts"),
	User			= require("./models/user");
	// seedDB			= require("./seeds");

var userRoutes = require("./routes/users");
var	contactRoutes	 = require("./routes/contacts");
var indexRoutes		 = require("./routes/index");

app.use(express.static(__dirname + "/public"));

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// seedDB(); // seed the database

app.use(flash());
// This has to come before passport configuration

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I want a good life lol",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// mongoose.connect("mongodb://localhost:27017/hackathon");
mongoose.connect("mongodb+srv://Lisa2:hello@cluster0-ulpnb.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("Error: ", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
	// send it to all the html templates as they need the js objects to be sent to access it
});

// // requiring routes
app.use("/users", userRoutes);
app.use("/users/:id/:contact_id", contactRoutes);
app.use("/", indexRoutes);


app.listen(process.env.PORT || 3000, function() {
	console.log("The Hackathon Server Has Started!");
});