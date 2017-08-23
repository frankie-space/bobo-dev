var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin


// User Mongoose Schema
var EducationSchema = new Schema({
    email: { type: String },
    companyname: { type: String },
    companyCountry: {type: String},
    degree: { type: String },
    currentschool: { type: Boolean },
    major: { type: String },
    graduationyear: { type: String },
    gradyearexpected:{type:String},
    currentschool: { type: Boolean},
});

//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('Education', EducationSchema);// Export User Model for us in API