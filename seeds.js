var mongoose= require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var data=[
    {name:"Salmon Creek", 
    image:"https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},

    {name:"Granite Hill" ,
    image:"https://farm4.staticflickr.com/3492/3823130660_0509aa841f.jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},

    {name:"Mountain Goat's rest", 
    image:"https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
    description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"},
    ];

function seedDB(){
    Campground.remove({},function(err){
         if(err){
            console.log(err);
        }
        else{
            console.log("removed campground!");

            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("created new campground!");
                        Comment.create({
                            text:"This place is great but I wish there was internet",
                            author:"Homer"
                        },function(err,comment){
                            if(err){
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("A new comment added!");
                            }
                        });

                    }
                });
            });
        } 
    });

    
}


module.exports=seedDB;