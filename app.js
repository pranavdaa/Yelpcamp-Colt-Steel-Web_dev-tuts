var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Camp = require("./models/campgrounds")
var Comment = require("./models/comments")
var seedDB = require("./seeds")
seedDB();
mongoose.connect('mongodb://localhost/yelp_camp')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
  res.render('campground/landing.ejs');
})

 // Comment.create({
//   text:"very good stuff they even give complimentry food and related stuff",
//   author:"Prabhat Kumar"
// },
// function(error,Comment){
//   if(error){
//     console.log(error)
//   }
//   else{
//     Comment.Camp.push(Comment);
//     Camp.save();
//   }
// }
// )
//
// app.get("/comment",(req,res)=>{
//      Comment.create({
//       text:"very good stuff they even give complimentry food and related stuff",
//       author:"Prabhat Kumar"
//     },function(err,comm){
//       if(err){
//         console.log(err)
//       }else{
//
//         Camp.Comments.push(comm);
//         Camp.save()
//         res.send("hello")
//       }
//     })
// })

// var Camp = mongoose.model('Camp',yelpcamp_schema)
//
//  Camp.create(
// {
//   name:"Indore",
// image:"https://i.ytimg.com/vi/bgj8-OwcUNE/maxresdefault.jpg",
// describtion:"This is my home town and probably one of the cleanest places"
// },
//  {name:"devas",
//  image:"https://i.ytimg.com/vi/5jbpGJIel6g/maxresdefault.jpg",
// describtion:"This places is near to Indore and has a Famous temple"
// },
//   function(error,Camp){
//     if(error){
//       console.log('This is an error'+ error)
//     }
//     else{
//       console.log(Camp);
//     }
//   }
// )

// var campgrounds = [
//   {name:"Indore",image:"https://i.ytimg.com/vi/bgj8-OwcUNE/maxresdefault.jpg"},
//   {name:"Bhopal",image:"https://upload.wikimedia.org/wikipedia/commons/6/65/Noha_installation_friend_view_from_Bhopal_lake.jpg"},
//   {name:"devas",image:"https://i.ytimg.com/vi/5jbpGJIel6g/maxresdefault.jpg"}
//
// ]
app.get('/campgrounds',(req,res)=>{
Camp.find({},(error,Camp)=>{
  if(error)
  {console.log(error);}
  else{
res.render("campground/index.ejs",{campgrounds:Camp})
  }
})
})
app.post('/campgrounds',(req,res)=>{
  var image = req.body.image;
  var name = req.body.name;
  var describtion = req.body.describtion;
var newCampground = {name: name,image:image,describtion:describtion};
Camp.create(newCampground,(error,Camp)=>{
  if(error){
    console.log(error);
  }
  else{
    res.redirect("/campgrounds")

  }
})

})

app.get('/campgrounds/new',(req,res)=>{
  res.render("campground/new.ejs");
})

app.get('/campgrounds/:id',(req,res)=>{
Camp.findById(req.params.id).populate("comments").exec(function(error,foundCampground){
  if(error){
    console.log(error);
  }
  else{
    console.log(foundCampground);
    res.render("campground/show.ejs",{campgrounds:foundCampground});
  }
})

})

app.get('/campgrounds/:id/comments/new',(req,res)=>{
  Camp.findById(req.params.id,(error,campground)=>{
    if(error){
      console.log(error);
    }
    else{
      res.render("comments/new.ejs",{campgrounds:campground})
    }
  }
  )
})


app.post('/campgrounds/:id/new',(req,res)=>{
  Camp.findById(req.params.id,(error,campground)=>{
    if(error){
      console.log(error);
      // res.redirect("/campgrounds");
    }
    else{
      Comment.create(req.body.comment,function(err,comment){
        if(error){
          console.log(error);
        }
        else{
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id)

        }
      })

    }
  })
})

app.listen(4000);
