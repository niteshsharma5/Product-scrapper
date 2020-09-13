var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var favProductSchema = new mongoose.Schema({
	product_name : String,
	site         : String,
    price        : String,
	link         : String,
	links        : String
     });

var UserSchema = new mongoose.Schema({
    username:{
		type:String,
		required:true,
		unique:true
	},
	name:{
		type:String,
		required:true,
		unique:true
	},
	mail:{
		type:String,
		required:true,
		unique:true
	},
	fav_products:[favProductSchema]
});


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("favProducts", favProductSchema);
module.exports = mongoose.model("User", UserSchema);
