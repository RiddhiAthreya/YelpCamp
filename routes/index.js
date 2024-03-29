var express=require("express");
var router=express.Router();
var passport=require("passport");
var Campground=require("../models/campground");
var async=require("async");
var nodemailer=require("nodemailer");
var crypto=require("crypto");
var User=require("../models/user");

//ROUTE ROUTE
router.get("/", function(req,res){
    res.render("landing");
 });
  
 //REGISTER FORM ROUTE
 router.get("/register",function(req,res){
     res.render("register",{page:"register"});
 });
 
 //SIGN UP LOGIC ROUTE
 router.post("/register",function(req,res){
     var newUser= new User({
         username:req.body.username,
         firstName:req.body.firstName,
         lastName:req.body.lastName,
         avatar:req.body.avatar,
         email:req.body.email 
        });

     if(req.body.adminCode==="secretcode123"){
         newUser.isAdmin=true;
     }

     User.register(newUser,req.body.password,function(err,user){
         if(err){
             req.flash("error",err.message);
             return res.redirect("/register");
         }
         passport.authenticate("local")(req,res,function(){
             req.flash("success","Welcome to YelpCamp ,"+user.username+"!");
             res.redirect("/campgrounds");
         });
     });
 });
 
 //LOGIN FORM ROUTE
 router.get("/login",function(req,res){
     res.render("login",{page:"login"});
 });

 //HANDLES LOGIN LOGIC
 router.post("/login",passport.authenticate("local",{
     successRedirect:"/campgrounds",
     failureRedirect:"/login"
 }),function(req,res){    
 });
 
 //LOGOUT ROUTE
 router.get("/logout",function(req,res){
     req.logOut();
     req.flash("success","Logged you out!");
     res.redirect("/campgrounds");
 });

//FORGOT PASSWORD
router.get("/forgot",function(req,res){
    res.render("forgot");
});

// USER PROFILE
router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error","Something went wrong");
            res.redirect("/");
        }
        else{
            Campground.find().where("author.id").equals(foundUser._id).exec(function(err,campgrounds){
                if(err){
                 req.flash("error","Something went wrong");
                res.redirect("/");
                }
                else{
                    res.render("users/show",{user:foundUser,campgrounds:campgrounds});
                }
            });
           
        }
    })
}); 
 
 module.exports=router;