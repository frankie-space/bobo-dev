var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin


// User Mongoose Schema
var EmploymentSchema = new Schema({
    //employments: { type: [{ exacttitle: { type: String }, position: { type: Number } }] }    
    email: { type: String },
    //companyId: { type: String },
    companyname: { type: String },
    companyCountry: {type: String},
    //addingnewcompany: { type: Boolean, default: false },
    //country: { type: String, required: true },
    //state: { type: String },
    //metropolitanarea: { type: String, required: true },
    titlecategory: { type: String },
    currentcompany: { type: Boolean},
    exacttitle: { type: String },
    startyear: { type: String },
    endyear: { type: String },
    hideinfo: { type: Boolean }
});


//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('Employment', EmploymentSchema);// Export User Model for us in API