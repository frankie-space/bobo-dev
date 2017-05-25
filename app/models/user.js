var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); 
 var titlize = require('mongoose-title-case');
 var validate = require('mongoose-validator');

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

var UserSchema = new Schema({
    firstname: {type:String, required:true, validate: firstnameValidator },
    lastname: {type:String, required:true, validate: lastnameValidator },
   // fullname: {type:String, required:true, validate: nameValidator },   
    email: { type:String, required: true, unique: true, validate:emailValidator},
    password: { type: String, required:true, validate: passwordValidator, select: false },
    active: { type: Boolean, required:true, default:false },
    temporarytoken:{ type: String, required:true}
});

UserSchema.pre('save',function(next){
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function(err,hash){
        if(err)return next(err);
        user.password= hash;
        next();
    });
});

UserSchema.plugin(titlize, {
  paths: ['firstname', 'lastname']
});


UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};


module.exports = mongoose.model('User',UserSchema);