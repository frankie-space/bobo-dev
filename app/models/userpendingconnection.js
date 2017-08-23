var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// State Mongoose Schema
var UserPendingConnectionSchema = new Schema({
        senderemail:{type:String},
        receiveremail:{type:String},
        addconneciton:{type:Boolean}
});

module.exports = mongoose.model('UserPendingConnection',UserPendingConnectionSchema);// Export User Model for us in API
