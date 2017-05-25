
var User = require('../models/user');// Import User Model
var jwt = require('jsonwebtoken');// Import JWT Package
var secret = 'expertuser';// Create custom secret for use in JWT
var nodemailer = require('nodemailer');// Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport');// Import Nodemailer Sengrid Transport Package
//Route
module.exports = function(router){
// Start Sendgrid Configuration Settings
var options = {
    auth: {
        api_user: 'apurva.jotangia',// Sendgrid username
        api_key: 'appu1703'// Sendgrid password
    }
}
 var client = nodemailer.createTransport(sgTransport(options));
 //End SendGrid Configuration settings

//http://localhost:8080/users
//USER REGISTRATION ROUTE
router.post('/users', function(req,res){
var user = new User();// Create new User object
user.firstname = req.body.firstname;
user.lastname = req.body.lastname;
//user.fullname = req.body.fullname;// Save name from request to User object
user.email = req.body.email;// Save email from request to User object
user.password=req.body.password;// Save password from request to User object
user.temporarytoken = jwt.sign({firstname:user.firstname,lastname:user.lastname, email:user.email }, secret, {expiresIn:'24h'}); // create a token to activate account through email
//erro handling for user input data
if(req.body.firstname == null || req.body.firstname == ''|| req.body.lastname == null || req.body.lastname == ''||req.body.email == null || 
req.body.email == ''||req.body.password == null|| req.body.password == ''){
    //if firstname, lastname,  email or password is not provided
    res.json({success:false ,message:'Ensure firstname, lastname, email and password are provided!'});
  }else{
      //save new user to db
    user.save(function(err){
    if(err){
        //check if any validation errors exists (from user model)
        if(err.errors != null){
            if(err.errors.firstname){
        res.json({success:false, message: err.errors.firstname.message});
        }else if(err.errors.lastname){
        res.json({success:false, message: err.errors.lastname.message});
            }else if(err.errors.email){
        res.json({success:false, message: err.errors.email.message});// Display error in validation (email)
            }else if(err.errors.password){
        res.json({success:false, message: err.errors.password.message});//Display error in validation (password)
        }else{
        res.json({success:false, message: err});// Display any other errors with validation
            }
        } else if(err){
            //check if duplication error exists
            if(err.code==11000){
               }else if(err.errmsg[61] == "e"){
        res.json({success:false, message: 'That e-mail is already taken'});
    }else{
        res.json({success:false, message: err});
            } 
         }
    }else{
        var email = {
        from: 'Localhost Staff, staff@localhost.com',
        to: user.email, 
        subject: 'BoBo: Your email Verification needed',
        text: 'Hello ' + user.firstname + ', thank you for registering at BoBo.com. Please click on the link below to complete your activation: http://localhost:8080/activate/' + user.temporarytoken, 
        html: 'Hello <strong> ' + user.firstname + '</strong>,<br><br>Thank you for registering at BoBo.com.Please click on the link below to complete your activation: <br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
        };

// Function to send e-mail to the user
    client.sendMail(email, function(err, info) {
    if (err) 
        console.log(err); // If error with sending e-mail, log to console/terminal
});
 res.json({success:true, message:'Account registered. Please check your email for activation link.'}); // send success message back to controller /request
    }
});
    }
});
//Route to check if e-mail chosen on registration page is already taken
router.post('/checkEmail',function(req,res){
    User.findOne({email: req.body.email}).select('email').exec(function(err,user){
        if(err) throw err; //throw err if cannot connect

        if(user){
            res.json({success:false, message: 'This email is already taken'}); // if user is returned then email is taken
        }else{
                res.json({success:true, message:'Valid e-mail'}); // if user is not returned then email is not taken
            }
        });
});
 
//USER LOGIN ROUTE
router.post('/authenticate',function(req,res){
    User.findOne({email:req.body.email}).select('firstname lastname email password active').exec(function(err,user){
        if(err) throw err; // Throw err if cannot connect
        //Check if user is found in the DB ( based on email)
        if(!user){
            res.json({success:false, message: 'Email not found'}); // Email not found in db
        }else if(user){
            //Check if user does exists, then compare password provided by user
            if(!req.body.password){
                 res.json({success:false, message:'No password provided!'});//Password not provided
             }else{
                 var validPassword = user.comparePassword(req.body.password); // check if password matched the password provided by the user
           if(!validPassword){
               res.json({success:false, message:'Could not authenticate password'});//Password does not match password in database
              } else if(!user.active){
               res.json({success:false, message:'Account is not yet activated. Please check your e-mail for activation link.', expired:true});//Account is not activated
           } else{
               var token = jwt.sign({firstname:user.firstname,lastname:user.lastname, email:user.email }, secret, {expiresIn:'24h'}); // Logged in: Give user token
               res.json({success:true, message:'User authenticated!',token: token});//return token in JSON object to controller
           }
        } 
        }

     });
});
//Route to activate the user's account
router.put('/activate/:token', function(req,res){
User.findOne({temporarytoken: req.params.token}, function(err,user){
if(err) throw err; // Throw error if cannot login
var token = req.params.token; // save the token from URL for verification
//function to verify the user's token
 jwt.verify(token, secret, function(err, decoded){
            if(err){
                res.json({success: false, message: 'Activation link has expired'});//otken is expired
            }else if(!user){
               res.json({success: false, message: 'Activation link has expired'});//Token may be valid but does not match any user in the database
            }else{
                user.temporarytoken = false; // remove temporary token
                user.active = true; // change account status to Activated
                //Mongoose method t save user into the database
                user.save(function(err){
                    if(err){
                        console.log(err);//if unable to save user, log error info to console/terminal
                    }else{
                        //if save succeeds, create email object
                    var email = {
                        from: 'Do not reply, staff@localhost.com',
                        to: user.email, 
                        subject: 'BoBo: Welcome to BoBo.com! Your Account Activated',
                        text: 'Hello ' + user.firstname + ', Your account has been successfully activated!', 
                        html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your account has been successfully activated!'
                        };

// Function to send e-mail object to the user
    client.sendMail(email, function(err, info) {
    if (err) {
        console.log(err); // If error with sending e-mail, log to console/terminal
    } else {
        console.log('Message sent: ' + info.response);
    }
});
    res.json({success: true, message: 'Account Activated!'});//Return success message to controller
            }
        });
    }
});
});
});

	// Route to verify user credentials before re-sending a new activation link	
	router.post('/resend', function(req, res) {
		User.findOne({ email: req.body.email }).select('firstname lastname email password active').exec(function(err, user) {
			if (err) throw err; // Throw error if cannot connect

			// Check if username is found in database
			if (!user) {
				res.json({ success: false, message: 'Could not authenticate user' }); // email does not match email found in database
			} else if (user) {
				// Check if password is sent in request
				if (req.body.password) {
					var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
					if (!validPassword) {
						res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
					} else if (user.active) {
						res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
					} else {
						res.json({ success: true, user: user });
					}
				} else {
					res.json({ success: false, message: 'No password provided' }); // No password was provided
				}
			}
		});
	});

	// Route to send user a new activation link once credentials have been verified
	router.put('/resend', function(req, res) {
		User.findOne({ email: req.body.email }).select('firstname lastname email temporarytoken').exec(function(err, user) {
			if (err) throw err; // Throw error if cannot connect
			user.temporarytoken = jwt.sign({firstname:user.firstname, lastname:user.lastname, email: user.email }, secret, { expiresIn: '24h' }); // Give the user a new token to reset password
			// Save user's new token to the database
			user.save(function(err) {
				if (err) {
					console.log(err); // If error saving user, log it to console/terminal
				} else {
					// If user successfully saved to database, create e-mail object
					var email = {
						from: 'Localhost Staff, staff@localhost.com',
						to: user.email,
						subject: 'Localhost Activation Link Request',
						text: 'Hello ' + user.firstname + ', You recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
						html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
					};

					// Function to send e-mail to user
					client.sendMail(email, function(err, info) {
						if (err) console.log(err); // If error in sending e-mail, log to console/terminal
					});
					res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
				}
			});
		});
	});


//Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
router.use(function(req,res,next){
   var token =  req.body.token || req.body.query|| req.headers['x-access-token'];//Check for token in body, URL, or headers

//Check if token is valid and not expired
if(token){
    //Function to verify token
    jwt.verify(token, secret, function(err, decoded){
        if(err) {
            res.json({ success: false, message:'Token invalid'});//token has expired or is in-valid
        }else{
            req.decoded = decoded;//Assign to req. variable to be able to use it in next() route ('/me' route)
            next();//required to leave middleware 
        }
    });
}else{
    res.json({success: false, message: 'No token provided'});//return error if no token was provided
}

});
//route to get the currently looged in user
router.post('/me', function(req,res){
    res.send(req.decoded); // return the token required from middleware
});
return router; // return the router object to server
}
 
  