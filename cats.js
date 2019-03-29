var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cat_db');

var catschema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

var Cat = mongoose.model("Cat",catschema);

var george = new Cat ({
  name: "pranav",
  age:11,
  temperament:"crucky"
});

george.save((error,cat)=>{
  if(error){
    console.log("some error has occured");
  }
  else{
    console.log("cat is saved");
    console.log(cat);
  }
})

// method 2- create better as creates + saves the cat to the database
Cat.create({
  name:"prab",
  age:19,
  temperament:"sad"
},(cat,error)=>{
  if(error){
    console.log(error);
  }
  else{
    console.log(cat);
  }
});
