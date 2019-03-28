var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
  res.render('landing.ejs');
})
var campgrounds = [
  {name:"Indore",image:"https://i.ytimg.com/vi/bgj8-OwcUNE/maxresdefault.jpg"},
  {name:"Bhopal",image:"https://upload.wikimedia.org/wikipedia/commons/6/65/Noha_installation_friend_view_from_Bhopal_lake.jpg"},
  {name:"devas",image:"https://i.ytimg.com/vi/5jbpGJIel6g/maxresdefault.jpg"}

]
app.get('/campgrounds',(req,res)=>{

res.render("campgrounds.ejs",{campgrounds:campgrounds});
})
app.post('/campgrounds',(req,res)=>{
  var image = req.body.image;
  var name = req.body.name;

var newCampground = {name: name,image:image};
campgrounds.push(newCampground)
res.redirect("/campgrounds")

})

app.get('/campgrounds/new',(req,res)=>{
  res.render("new.ejs");
})

app.listen(3000);
