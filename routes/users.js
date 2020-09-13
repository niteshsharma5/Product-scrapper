const express             = require("express"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("../models/user"),
    LocalStrategy         = require("passport-local"),
	flash                 = require("connect-flash");
    
const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
//middleware flash messages
router.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//isLoggedIn middleware that we have created will be used to authenticate the user 
//if there is no authenticated user, then we will redirect them to login page
router.get("/profile",isLoggedIn, function(req, res){
   res.render("profile"); 
});

// Authorization Routes

//show sign up form
router.get("/register",isNotLoggedIn, function(req, res){
   res.render("register"); 
});
//handling user sign up
router.post("/register",isNotLoggedIn, function(req, res){
	console.log("register here");
	const username1=req.body.username,
		  name1    =req.body.name,
		  mail1    =req.body.mail,
		  password1=req.body.password; 
	var errors=[];
	if(!username1){
		errors.push({message :"username field can't be empty"});
	}
	if(!name1){
		errors.push({message :"Your name field can't be empty"});
	}
	if(!mail1){
		errors.push({message :"E-mail I'D field can't be empty"});
	}
	var flag=true;
	for(var i=0;i<mail1.length;i++){
		if(mail1[i]=='@'){
			flag=false;
			break;
		}
	}
	
	if(flag){
		errors.push({message:"Please enter a valid E-mail address"});
	}
	if(password1.length<6){
		errors.push({message :"Password must be at least 6 characters long"});
	}
	if(errors.length>0)
		res.render('register',{errors});
	else{
		Users=new User({username : req.body.username,name:req.body.name,mail:req.body.mail}); 
    User.register(Users, req.body.password, function(err, user){
        if(err){
            console.log(err),
			req.flash('error_msg', err.message);
            return res.render('register')
        }
        passport.authenticate("local")(req, res, function(){
			req.flash('success_msg', 'Registered successfully! Try searching for some products.');
			res.redirect("/users/profile");
        });
    });
	}
});

// LOGIN ROUTES
//show login form only if no other user is already logged in
router.get("/login",isNotLoggedIn, function(req, res){
	console.log("visited login page");
   res.render("login"); 
});
//login handling through authenticate
//post login,middleware,callback
router.post("/login", passport.authenticate("local", {
	successRedirect: "/users/profile",
	successFlash: 'welcome',
    failureRedirect: "/users/login",
	failureFlash: 'Oops... Invalid username or password. Try Again!!!'
}) ,function(req, res){
	console.log('new user is ${req.username}');
	req.flash('success_msg','welcome');
	res.redirect('profile');
});

router.get("/logout", function(req, res){
    req.logout();
	req.flash('success_msg','Logged out successfully. Good bye!');
    res.redirect("/users/login");
});
router.post("/add",isLoggedIn,(req,res)=>{
	var newObj={
		product_name:req.body.name,
		site        :req.body.site,
		price       :req.body.price,
		link        :req.body.link,
		links       :req.body.links
	};
	var presentUser= req.user;
	presentUser.fav_products.push(newObj);
	presentUser.save((err,user)=>{
		if(err)
		console.log(err);
		else {
		console.log(user);
		res.redirect('/users/profile');
		}
	});
});
//Now we need to create a midlleware that will be used to find out whether some user is logged in or not
//and if a user is not logged in, then we will ask him/her to login first if he/ she wishes to add some 
//product to favourites
//creating a middleware to check if a user is logged in everytime you have to show any secret page

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Please Login first to add the product.');	
    res.redirect("/users/login");
}
//creating a middleware to check that whenever a user wishes to login or sign up, some user should not be logged in
//because we can't have simultaneously two users as logged in
function isNotLoggedIn(req,res,next){
	if(!req.isAuthenticated()){
		return next();
	}
	req.flash('error_msg','You are already logged in!Logout first to sign in or signup again.');
	res.redirect("/users/profile");
}
module.exports=router;
