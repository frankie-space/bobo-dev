var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable

// User Mongoose Schema
var EndorsementExpertiseSchema = new Schema({
  email: { type: String },
  endorseremail: { type: String },
  expertiseid: { type: String },
  rateskill: { type: String },
  comment: { type: String }  
});

//Model name should match with Collection name in DB. Here Endorsement will match with Endorsements collection
module.exports = mongoose.model('EndorsementExpertise', EndorsementExpertiseSchema);// Export User Model for us in API