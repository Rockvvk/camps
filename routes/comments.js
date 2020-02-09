//=================COMMENT==SECTION===========================================
//==============================================================

var express = require("express");
var router  = express.Router();
var Campground=require("../models/campground");
var Comment=require("../models/comment");

router.get("/campground/:id/comments/new",isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,camps){
    if(err){
      console.log(err);
    }else{
      res.render("commentNew",{campground:camps});
    }
  });
});

router.post("/campground/:id/comments",isLoggedIn,function(req,res){
  Campground.findById(req.params.id,function(err,camp){
    if(err){
      console.log(err);
    }else{
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
          res.render("/campground");
        }else{
          comment.author.id=req.user._id;
          comment.author.username=req.user.username;
          comment.save();
          camp.comments.push(comment);
          camp.save();
          req.flash("success","Successfully Comment added");
          res.redirect("/campground/"+camp._id);
        }
      });
    }
});
});

//============EDIT COMMENT ===========================  //

router.get("/campground/:id/comments/:comment_id/edit",commentownership,function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundcomment){
    if(err){
      res.redirect("back");
    }else{
      res.render("../views/commentEdit",{campground:req.params.id,comment:foundcomment});
      console.log(req.params.id);
    }
  });
});

//  ============== update Comment  =================================  //

router.put("/campground/:id/comments/:comment_id",commentownership,function(req,res){
 Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
   if(err){
     res.redirect("back");
   }else{
    req.flash("success","Successfully Updated");
     res.redirect("/campground/"+req.params.id);
   }
 });
});

//======= DESTROY SECTION ============================================ //

router.delete("/campground/:id/comments/:comment_id",commentownership,function(req,res){
Comment.findByIdAndRemove(req.params.comment_id,function(err){
  if(err){
    res.redirect("back");
  }else{
    req.flash("success","Successfully Deleted");
    res.redirect("/campground/"+req.params.id);
  }
});
});





// ===== MIDDLEWARE ============ //

function commentownership(req,res,next){
  // console.log(req.params.id.author.id);
  if(req.isAuthenticated())
  {
  Comment.findById(req.params.comment_id,function(err,foundcomment){
    if(err){
      req.flash("error","Comment not Found!");
      res.redirect("/back");
    }else{
      if(foundcomment.author.id.equals(req.user._id)){
        next();
        // res.render("edit",{campground:foundcamp});
      }
      // else if(req.params.id.author.id.equals(req.user._id)){
      //   next();
      //}
      else{
        req.flash("error","Comment not Found!");
        res.redirect("back");
      }
    }
  });
} else{
  req.flash("error","you don't have permission to do that!");
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


//================== exporting  ================
module.exports=router;