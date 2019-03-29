var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yelp_camp')
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
  res.render('landing.ejs');
})


var yelpcamp_schema = ({
  name:String,
  image:String,
  describtion: String
})

var Camp = mongoose.model('Camp',yelpcamp_schema)
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
res.render("index.ejs",{campgrounds:Camp})
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
  res.render("new.ejs");
})

app.get('/campgrounds/:id',(req,res)=>{
Camp.findById(req.params.id, function(error,foundCampground){
  if(error){
    console.log(error);
  }
  else{
    res.render("show.ejs",{campgrounds:foundCampground});
  }
})

})

app.listen(3000);
