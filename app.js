
var express = require("express");
var app=express();
app.set("view engine","ejs");
var bodyparser=require("body-parser");
 var mongoose=require("mongoose");
 var flash=require("connect-flash");
 mongoose.set('useFindAndModify', false);

var passport=require("passport");
var localstrategy=require("passport-local");
var methodoverride=require("method-override");

 var Campground=require("./models/campground");
 var seedDB=require("./seeds");
 var Comment=require("./models/comment");
 //=================================================================
 // MONGOOSE SERVER CONNECTED
 require('dotenv').config({path:"custom_path_URL_to_your_env_file"});
    mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true,useUnifiedTopology: true});
  //================================================================
  app.use(bodyparser.urlencoded({extended:true}));
  app.use(express.static(__dirname+"/public"));
  app.use(methodoverride("_method"));
  var User=require("./models/user");
  app.use(flash());
  //seedDB();
//============================================================
// ==================  ROUTING  =============================
  var commentRoutes=require("./routes/comments"),
      campgroundRoutes=require("./routes/campgrounds"),
      indexRoutes=require("./routes/index")

//==============================================================
//  Passport CONFIGURATION

app.use(require("express-session")({
secret:"the weather is cold here",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});
// =======================================================
// CONNECTING  ROUTES

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


//  ==============================================================
app.listen(3000,function(){
  console.log("server is working");
});
