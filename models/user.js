var mongoose =require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{type:Boolean, default:false},
    avatar:String,
    firstName:String,
    lastName:String,
    email:String
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",userSchema);