var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
 var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin

// //User first name validator
// var firstnameValidator = [
// validate({
//   validator: 'matches',
//   arguments: /^(([a-zA-Z]{3,30})+)+$/,
//   message: "Must be at least 3 characters, max 30,no special characters or space"
// }),
// validate({
//   validator: 'isLength',
//   arguments: [3, 30],
//   message: 'First Name should be between {ARGS[0]} and {ARGS[1]} characters'
// })
// ];
// //User last name validator
// var lastnameValidator = [
// validate({
//   validator: 'matches',
//   arguments: /^(([a-zA-Z]{3,30})+)+$/,
//   message: "Must be at least 3 characters, max 30, no special characters or space"
// }),
// validate({
//   validator: 'isLength',
//   arguments: [3, 30],
//   message: 'Last Name should be between {ARGS[0]} and {ARGS[1]} characters'
// })
// ];

// User Mongoose Schema
var EmployerSchema = new Schema({    
    email:{type:String},
    companyname: {type:String},
    //addingnewcompany:{type:Boolean, default:false},
    //country:{type:String, required:true },
    ///state:{type:String},    
    //metropolitanarea:{type:String, required: true},
    titlecategory:{type:String, required:true},
    currentcompany:{type:Boolean, default:false},
    exacttitle:{type:String},
    startyear:{type:String},
    endyear:{type:String},
    hideinfo:{type: Boolean, default:false }    
});
// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
// EmployerSchema.plugin(titlize, {
//   paths: ['titlecategory','exacttitle']
// });

//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('Employment1', EmployerSchema);// Export User Model for us in API