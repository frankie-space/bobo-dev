var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// State Mongoose Schema
var UserConnectionSchema = new Schema({
        email:{type:String},
        connection:{type:[]}
});

module.exports = mongoose.model('UserConnection',UserConnectionSchema);// Export User Model for us in API
