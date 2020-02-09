  var express = require("express");
  var router  = express.Router();
  var Campground=require("../models/campground");
  // var NodeGeocoder = require('node-geocoder');
 
// var options = {
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: process.env.GEOCODER_API_KEY,
//   formatter: null
// };
 
// var geocoder = NodeGeocoder(options);
 
  router.get("/campground",function(req,res){
  Campground.find({},function(err,allcamp)
  {
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("index",{campgrounds:allcamp});
    }
  });
});
//==============================================================
//==============================================================

router.post("/campground",isLoggedIn,function(req,res){
  var name=req.body.name;
  var image=req.body.image;
  var price=req.body.price;
  var desc=req.body.description;
  var author={
    id:req.user._id,
    username:req.user.username
  };
  
  // geocoder.geocode(req.body.location, function (err, data) {
  //   if (err || !data.length) {
  //     console.log(data);
  //     req.flash('error', 'Invalid address');
  //     console.log(err);
  //     return res.redirect('back');
  //   }
    // var lat = data[0].latitude;
    // var lng = data[0].longitude;
     var location = req.body.location;

  var newDATA={name:name,image:image,description:desc,author:author,price:price,location: location};
  Campground.create(newDATA,function(err,newd)
  {
    if(err)
    {
      console.log(err);
    }
    else{
      req.flash("success","Successfully Campground added");
      console.log(newd);
      res.redirect("/campground");
    }
  });
 
});

router.get("/new",isLoggedIn,function(req,res){
  res.render("newData");
});

//==============================================================
//==============================================================

router.get("/campground/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcamp){
      if(err)
      {
        console.log(err);
      }
      else{
        
        res.render("show",{finddata:foundcamp}); 
      }
    });   
});
//  ============== EDIT SECTION  =================================  //
 
router.get("/campground/:id/edit",ownership,function(req,res){
  Campground.findById(req.params.id,function(err,foundcamp){
    res.render("edit",{campground:foundcamp});
});
});


//  ============== update SECTION  =================================  //

router.put("/campground/:id",ownership,function(req,res){
    // geocoder.geocode(req.body.location, function (err, data) {
    //   if (err || !data.length) {
     
    //     req.flash('error', 'Invalid address');
      //   return res.redirect('back');
      // }
      // req.body.campground.lat = data[0].latitude;
      // req.body.campground.lng = data[0].longitude;
      // req.body.campground.location = data[0].formattedAddress;
     
  Campground.findOneAndUpdate(req.params.id,req.body.camps,function(err,foundData){
    if(err){
      res.redirect("/campground");
    }else{
      req.flash("success","Successfully Updated");
      res.redirect("/campground/"+req.params.id);
    }
  });
});


//======= DESTROY SECTION ============================================ //

router.delete("/campground/:id",ownership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campground");
    }else{
      req.flash("success","Successfully Deleted");
      res.redirect("/campground");
    }
  });
});


function ownership(req,res,next){
  if(req.isAuthenticated())
  {
  Campground.findById(req.params.id,function(err,foundcamp){
    if(err){
      req.flash("error","Campground not Found");
      res.redirect("/back");
    }else{
      if(foundcamp.author.id.equals(req.user._id)){
        next();
        // res.render("edit",{campground:foundcamp});
      }
      else{
        req.flash("error","Campground not Found");
        res.redirect("back");
      }
    }
  });
} else{
  req.flash("error","Permission Denied!");
  res.redirect("back");
}
}


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.flash("error","please login first");
  res.redirect("/login");
}

module.exports=router;
