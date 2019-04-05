var mongoose = require("mongoose");
var yelpcamp_schema = new mongoose.Schema({
  name:String,
  image:String,
  describtion: String,
  //linking the two seperate collections in a database
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },


  ]
});

module.exports =  mongoose.model('Camp',yelpcamp_schema)
