var mongoose = require('mongoose');// Import Mongoose package
var Schema = mongoose.Schema;//Assign mongoose schema function to variable
var bcrypt = require('bcrypt-nodejs'); //Import bcrypt package
 var titlize = require('mongoose-title-case');//Import mongoose Title Case Plugin
 var validate = require('mongoose-validator');//Import Mongoose Validator Plugin

//User first name validator
var firstnameValidator = [
validate({
  validator: 'matches',
  arguments: /^(([a-zA-Z]{3,30})+)+$/,
  message: "Must be at least 3 characters, max 30,no special characters or space"
}),
validate({
  validator: 'isLength',
  arguments: [3, 30],
  message: 'First Name should be between {ARGS[0]} and {ARGS[1]} characters'
})
];
//User last name validator
var lastnameValidator = [
validate({
  validator: 'matches',
  arguments: /^(([a-zA-Z]{3,30})+)+$/,
  message: "Must be at least 3 characters, max 30, no special characters or space"
}),
validate({
  validator: 'isLength',
  arguments: [3, 30],
  message: 'Last Name should be between {ARGS[0]} and {ARGS[1]} characters'
})
];

// var nameValidator = [
// validate({
//   validator: 'matches',
//   arguments: /^(([a-zA-Z]{3,30})+[ ]+([a-zA-Z]{3,30})+)+$/,
//   message: "Must be at least 3 characters, max 30, no special characters, must have space between first name and last name. "
// }),
// validate({
//   validator: 'isLength',
//   arguments: [3, 30],
//   message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
// })
// ];
//User email name validator
var emailValidator = [
validate({
  validator: 'isEmail',
  message: 'not a valid e-mail'
}),
validate({
  validator: 'isLength',
  arguments: [3, 35],
  message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
})
];
//User password  validator
var passwordValidator = [
validate({
  validator: 'matches',
  arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{6,35}$/,
  message: 'Password needs to have at least one lower case, one uppercase, one number, one special character, and must be atleast 6 characters but no more than 35.'
}),
validate({
  validator: 'isLength',
  arguments: [6, 35],
  message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
})
];
// User Mongoose Schema
var UserSchema = new Schema({
    firstname: {type:String, required:true, validate: firstnameValidator },
    lastname: {type:String, required:true, validate: lastnameValidator },
   // fullname: {type:String, required:true, validate: nameValidator },   
    email: { type:String, required: true, unique: true, validate:emailValidator},
    password: { type: String, required:true, validate: passwordValidator, select: false },
    active: { type: Boolean, required:true, default:false },
    temporarytoken:{ type: String, required:true}
});
// Middleware to ensure password is encrypted before saving user to database
UserSchema.pre('save',function(next){
    var user = this;

    if(!user.isModified('password')) return next();// If password was not changed or is new, ignore middleware

// Function to encrypt password 
    bcrypt.hash(user.password, null, null, function(err,hash){
        if(err)return next(err);
        user.password= hash;
        next();
    });
});
// Mongoose Plugin to change fields to title case after saved to database (ensures consistency)
UserSchema.plugin(titlize, {
  paths: ['firstname', 'lastname']
});
// Method to compare passwords in API (when user logs in) 
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);// Returns true if password matches, false if doesn't
};


module.exports = mongoose.model('User',UserSchema);// Export User Model for us in API