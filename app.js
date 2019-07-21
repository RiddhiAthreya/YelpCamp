require("dotenv").config();
var express        =require("express"),
    app            =express(),
    bodyParser     =require("body-parser"),
    Campground     =require("./models/campground"),
    seedDB         =require("./seeds"),
    Comment        =require("./models/comment"),
    passport       =require("passport"),
    localStrategy  =require("passport-local"),
    User=require("./models/user"),
    methodOverride=require("method-override"),
    flash=require("connect-flash"),
    mongoose       =require("mongoose");

// REQUIRING ROUTES    
var commentRoutes=require("./routes/comments"),
    campgroundRoutes=require("./routes/campgrounds"),
    indexRoutes=require("./routes/index");    

//mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Rusty wins cutest dog",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
}); 

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,function(){
    console.log("YelpCamp server has started");
});