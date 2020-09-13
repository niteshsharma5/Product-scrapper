const express             = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
	//search_items          = require("./models/search"),
    LocalStrategy         = require("passport-local"),
	flash                 = require("connect-flash"),
    passportLocalMongoose = require("passport-local-mongoose");
    
    
mongoose.connect("mongodb+srv://product_scrapper:143@Urvashi@cluster1.gab6k.mongodb.net/<main_db>?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>console.log('MongoDB connected....'))
.catch((err)=>console.log(err));
const app = express();
app.set('view engine', 'ejs');//don't need to write .ejs extension everytime
app.use(bodyParser.urlencoded({extended: true}));//for parsing the html page
app.use(express.static('public'));//all static files will be served from this directory
app.use(require("express-session")({
    secret: "This is a secret page.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//middleware for flash messages
app.use(flash());

app.use((req, res, next)=> {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;
	next();
});
// console.log(req.user);
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
app.use('/users',require('./routes/users'));
app.use('/search',require('./routes/search'));
//============
// ROUTES
//============

app.get("/", function(req, res){
    res.render("home");
});
app.get("/home", function(req, res){
    res.render("home");
});

var server = app.listen(process.env.PORT||3000,function(){
var port = server.address().port;
console.log("Express is working on port "+port);
});