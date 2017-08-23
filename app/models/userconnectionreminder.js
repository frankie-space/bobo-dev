var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// State Mongoose Schema
var UserConnectionReminderSchema = new Schema({
        toemail: { type: String },
        fromemail: { type: String },
        datetime: { type: Date },
        keepreminding: { type: Boolean }
});

module.exports = mongoose.model('UserConnectionReminder', UserConnectionReminderSchema);// Export User Model for us in API
