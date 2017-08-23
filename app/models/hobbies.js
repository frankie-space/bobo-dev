var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
//var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
var validate = require('mongoose-validator');//Import Mongoose Validator Plugin


// User Mongoose Schema
var HobbySchema = new Schema({
    email: { type: String },
    generalindoor:{type:String},
    generalindoorImage:{type:String},

    generaloutdoor:{type:String},
    generaloutdoorImage:{type:String},
    
    collectionindoor:{type:String},
    collectionindoorImage:{type:String},

    collectionoutdoor:{type:String},
    collectionoutdoorImage:{type:String},

    competitionindoor:{type:String},
    competitionindoorImage:{type:String},

    competitionoutdoor:{type:String},
    competitionoutdoorImage:{type:String},

    observationindoor:{type:String},
    observationindoorImage:{type:String},
    
    observationoutdoor:{type:String},
    observationoutdoorImage:{type:String},

    newhobby:{type:String}
   });


//Model name should match with Collection name in DB. Here Employment will match with Employments collection
module.exports = mongoose.model('Hobby', HobbySchema);// Export User Model for us in API