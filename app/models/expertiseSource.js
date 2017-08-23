var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin


// User Mongoose Schema
var ExpertiseSourceSchema = new Schema({
    email: { type: String },
    companyid: {type: String},
    companyname: { type: String },    
});

//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('ExpertiseSource', ExpertiseSourceSchema);// Export User Model for us in API