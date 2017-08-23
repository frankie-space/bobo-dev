var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// State Mongoose Schema
var MetropolitanSchema = new Schema({
        name:{type:String},
        code:{type:String},
});
MetropolitanSchema.plugin(titlize, {
  paths: ['name']
});
module.exports = mongoose.model('Metropolitan',MetropolitanSchema);// Export User Model for us in API
