var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// State Mongoose Schema
var StateSchema = new Schema({
        country:{type:String},
        name:{type:String},
        code:{type:String}

});
StateSchema.plugin(titlize, {
  paths: ['country','name']
});
module.exports = mongoose.model('State',StateSchema);// Export User Model for us in API
