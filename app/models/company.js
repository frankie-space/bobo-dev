var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// Company Mongoose Schema
var CompanySchema = new Schema({
        companyid:{type:String},
        companyname:{type:String},        
        country:{type:String},
        state:{type:String},
        metropolitanarea:{type:String},
        website:{type:String}
});
// CompanySchema.plugin(titlize, {
//   paths: ['companyname']
// });
module.exports = mongoose.model('Company',CompanySchema);// Export User Model for us in API
