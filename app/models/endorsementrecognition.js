var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable

// User Mongoose Schema
var EndorsementRecognitionSchema = new Schema({
  email: { type: String },
  endorseremail: { type: String },  
  creativityRate: { type: String },
  proactivityRate: { type: String },
  reliabilityRate: { type: String },
  managabilityRate: { type: String }
});

//Model name should match with Collection name in DB. Here Endorsement will match with Endorsements collection
module.exports = mongoose.model('EndorsementRecognition', EndorsementRecognitionSchema);// Export User Model for us in API