var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
 var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin

//User first name validator
var firstnameValidator = [
validate({
  validator: 'matches',
  arguments: /^(([a-zA-Z]{3,30})+)+$/,
  message: "Must be at least 3 characters, max 30,no special characters or space"
}),
validate({
  validator: 'isLength',
  arguments: [3, 30],
  message: 'First Name should be between {ARGS[0]} and {ARGS[1]} characters'
})
];
//User last name validator
var lastnameValidator = [
validate({
  validator: 'matches',
  arguments: /^(([a-zA-Z]{3,30})+)+$/,
  message: "Must be at least 3 characters, max 30, no special characters or space"
}),
validate({
  validator: 'isLength',
  arguments: [3, 30],
  message: 'Last Name should be between {ARGS[0]} and {ARGS[1]} characters'
})
];

// User Mongoose Schema
var ProfileSchema = new Schema({
    title: {type:String},
    email:{type:String, required:true},
    firstname: {type:String, required:true,validate: firstnameValidator },
    nickname: {type:String }, 
    middlename: {type:String}, 
    lastname: {type:String, required:true,validate: lastnameValidator }, 
    degree: {type:String},
    country:{type:String },
    state:{type:String},
    //city:{type:String},
    metropolitanarea:{type:String },
    backgroundImage:{type:String},
    profileImage:{type:String}
});
// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
ProfileSchema.plugin(titlize, {
  paths: ['firstname', 'lastname']
});
module.exports = mongoose.model('Profile',ProfileSchema);// Export User Model for us in API