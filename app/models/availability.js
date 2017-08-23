var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// Availabilities Mongoose Schema
var AvailabilitySchema = new Schema({
        email:{type:String},
        nooptionselected:{type:Boolean, default:false},        
        contractwork:    {type:Boolean, default:false},
        parttimework:    {type:Boolean, default:false},
        fulltimework:    {type:Boolean, default:false},
        servicework:     {type:Boolean, default:false},
        consultingwork:  {type:Boolean, default:false},
        probonowork:     {type:Boolean, default:false}
});
module.exports = mongoose.model('Availability', AvailabilitySchema);// Export User Model for us in API
