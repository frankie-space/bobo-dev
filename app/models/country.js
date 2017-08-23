var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
// Country Mongoose Schema
var CountrySchema = new Schema({
        name:{type:String},
        code: {type:String}
//     firstname: {type:String, required:true, validate: firstnameValidator },
//     lastname: {type:String, required:true, validate: lastnameValidator },
//    // fullname: {type:String, required:true, validate: nameValidator },   
//     email: { type:String, required: true, unique: true, validate:emailValidator},
//     password: { type: String, required:true, validate: passwordValidator, select: false },
//     active: { type: Boolean, required:true, default:false },
//     temporarytoken:{ type: String, required:true}
});

// var StateSchema = new Schema({
//     country:{type:String},
//     name: {type:String}
// });
// Middleware to ensure password is encrypted before saving user to database
// CountrySchema.pre('save',function(next){
//     var user = this;

//     if(!user.isModified('password')) return next();// If password was not changed or is new, ignore middleware

// // Function to encrypt password 
//     bcrypt.hash(user.password, null, null, function(err,hash){
//         if(err)return next(err);
//         user.password= hash;
//         next();
//     });
// });
// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
CountrySchema.plugin(titlize, {
  paths: ['name','code']
});
// StateSchema.plugin(titlize, {
//   paths: ['country','name']
// });
// // Method to compare passwords in API (when user logs in) 
// UserSchema.methods.comparePassword = function(password){
//     return bcrypt.compareSync(password,this.password);// Returns true if password matches, false if doesn't
// };

//Model name should match with Collection name in DB. Here Country will match with Countries collection
module.exports = mongoose.model('Country',CountrySchema);// Export User Model for us in API
//module.exports = mongoose.model('State',StateSchema);// Export User Model for us in API
