var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleWare=require("../middleware/");
var async=require("async");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken:process.env.MAPBOX_TOKEN});



//INDEX
router.get("/", function(req,res){
    Campground.find({},function(err,allCampgrounds){
            if(err){
                console.log("OOPSIE");
            }
            else{
                res.render("campgrounds/index",{campgrounds:allCampgrounds,page:"campgrounds"});
            }
    });  
       
});

//CREATE
router.post("/",middleWare.isLoggedIn,function(req,res){
    geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
        .send()
        .then(response => {
            var name= req.body.name;
        var price=req.body.price;
        var image= req.body.image;
        var desc= req.body.description;
        var location=req.body.location;
        var author={
            id:req.user._id,
            username:req.user.username
        };
           var match = response.body.features[0].geometry.coordinates;
            var newCampground={name:name, image:image, description:desc,author:author,price:price,coordinates:match,location:location};
            Campground.create(newCampground,function(err,newlyCreated){
                    if(err){
                        console.log(err)
                    }
                    else{
                        req.flash("Campground added!");
                        res.redirect("/campgrounds");
                    }
            });
        });
   
})

//NEW
router.get("/new",middleWare.isLoggedIn,function(req,res){
   res.render("campgrounds/new"); 
});

// SHOW
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
             res.render("campgrounds/show", {campground:foundCampground});
        }        
    });
    
});
//EDIT
router.get("/:id/edit",middleWare.checkcampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(err,foundCampground){
                    res.render("campgrounds/edit",{campground:foundCampground});
        });
});

//  UPDATE
router.put("/:id",middleWare.checkcampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Campground edited!")
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id/",middleWare.checkcampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});



module.exports=router;