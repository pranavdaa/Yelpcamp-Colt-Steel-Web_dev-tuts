var express = require('express');
var app = express();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
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
app.use(require("express-session")({
  secret:"Rustly is the cutiest dog",
  resave:false,
  saveUnitialized: false

}))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()))
//these methods below  are used for reading the season taking data frm the session and uncoding(deserializeUser) it. and then again coding it(serializeUser)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//through this we dont have to go to every single rout and write about stuff rather it will be automatically added
// app.use((req,res,next)=>{
//   res.local.currentUser = req.user;
//   next();
// })

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
res.render("campground/index.ejs",{campgrounds:Camp,currentUser: req.user})
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

app.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res)=>{
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

app.get('/register',(req,res)=>{
  res.render("register.ejs")
})

app.post("/register",(req,res)=>{
req.body.username
req.body.password

User.register(new User({username:req.body.username}),req.body.password,function(error,user){
  if(error){
    console.log(error);
    console.log("hello")
  }
  passport.authenticate("local")(req,res,function(){
    res.redirect("/campgrounds")
  });
} );
})
app.get("/login",(req,res)=>{
  res.render("login.ejs")
})

app.post("/login", passport.authenticate("local",{
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}) ,(req,res)=>{
  res.send("loged");
})
app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
  return next();
  }
  res.redirect("/login")
}


app.listen(4000);
