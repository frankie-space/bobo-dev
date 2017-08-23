var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin

// User Mongoose Schema
var ExpertiseSchema = new Schema({
  email: { type: String },
  mainidea: { type: String },
  //expertisedetails: { type: String },
  expertisedetails: { type: String },
  supportexpertise: { type: [] },
  skillrating: { type: String },
  includeinsearch: {type:Boolean, default:true},
  hideexpertisefrompublic: { type: Boolean, default: false }
});
// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
// ExpertiseSchema.plugin(titlize, {
//   paths: ['mainidea']
// });

//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('Expertise', ExpertiseSchema);// Export User Model for us in API