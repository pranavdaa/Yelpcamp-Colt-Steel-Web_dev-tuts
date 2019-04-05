var mongoose = require("mongoose");

var comment_schema = mongoose.Schema({
   text :String,
   author:String
});

module.exports =  mongoose.model('Comment',comment_schema)
