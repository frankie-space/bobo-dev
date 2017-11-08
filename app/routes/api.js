
var User = require('../models/user');// Import User Model
var UserConnection = require('../models/userconnection');// Import UserConnection Model
var UserPendingConnection = require('../models/userpendingconnection');
var UserConnectionReminder = require('../models/userconnectionreminder');

var Country = require('../models/country');
var State = require('../models/state');
var Metropolitan = require('../models/metropolitan');
var Profile = require('../models/profile');//Import profile model
//var Employer = require('../models/employer');//Import employer model
var Employment = require('../models/employment');//Import employment model
var Company = require('../models/company');//Import Company model
var Education = require('../models/education')//Import education model
var Availability = require('../models/availability')//Import availability model
var Expertise = require('../models/expertise')//Import expertise model
var ExpertiseSource = require('../models/expertiseSource')
var Hobby = require('../models/hobbies')//Import hobbies model
var EndorsementExpertise = require('../models/endorsementexpertise')
var EndorsementRecognition = require('../models/endorsementrecognition')


var jwt = require('jsonwebtoken');// Import JWT Package
var secret = 'expertuser';// Create custom secret for use in JWT
var nodemailer = require('nodemailer');// Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport');// Import Nodemailer Sengrid Transport Package
var smtpTransport = require('nodemailer-smtp-transport');
var validator = require('validator');
var multer = require('multer');
const Storage = require('@google-cloud/storage');
var ObjectId = (require('mongoose').Types.ObjectId);


//Route
module.exports = function (router) {
    // Start Sendgrid Configuration Settings
    var options = {
        auth: {
            api_user: 'apurva.jotangia',// Sendgrid username
            api_key: 'appu1703'// Sendgrid password
        }
    }
    var client = nodemailer.createTransport(sgTransport(options));
    var composeclient = nodemailer.createTransport(sgTransport(options));
//     var transporter = nodemailer.createTransport(smtpTransport({
//    host: 'localhost',
//    port: 25,
//    auth: {
//        user: 'username',
//        pass: 'password'
//    }
// }));
//  var transporter = nodemailer.createTransport('smtps://user%myDomain.com:pass@smtp.gmail.com');
 
    //End SendGrid Configuration settings


    //Header Profile Image upload Multer. This is used by router.post('/upload')
    var upload = multer({
        storage: multer.MemoryStorage,        
        limits: {
            //fileSize: 50 * 1024 * 1024 // no larger than 50mb
        }
    }).single('myfile'); //should match the name in input type in html 

    //Header Profile Image upload
    router.post('/upload', function (req, res) {
        //start time
        upload(req, res, function (err) {
            //console.log("Image Original Name " + req.file.originalname);  
            if (err) {
                if (err.code === 'filetype') {
                    res.json({ success: false, message: 'File type is invalid. Must be jpeg/pg/png type only' });
                } else {
                    res.json({ success: false, message: 'File was not able to be uploaded' });
                }
            } else {

                const GCLOUD_PROJECT = "bobo-167921";
                const CLOUD_BUCKET = "bobo-0518";

                const storage = Storage({
                    projectId: GCLOUD_PROJECT                    
                });
                const bucket = storage.bucket(CLOUD_BUCKET);
                console.log("GC Image upload started...");
                if (!req.file) {
                    console.log("GC Storage File not found");
                    //return next();
                }

                // const gcsname = Date.now() + req.file.originalname;
                const gcsname = req.file.originalname;
                const file = bucket.file(gcsname);

                const stream = file.createWriteStream({
                    metadata: {
                        contentType: req.file.mimetype
                    }
                });

                stream.on('error', (err) => {
                    console.log("Something wrong in GC Storage: " + err);
                    req.file.cloudStorageError = err;
                    // next(err);
                });

                stream.on('finish', () => {
                    //end time
                    //diff: end time - start time
                    console.log("GC Storage Image Upload Finished: " + gcsname);
                    // Returns the public, anonymously accessable URL to a given Cloud Storage object.
                    // The object's ACL has to be set to public read.
                    // [START public_url] 
                    // req.file.cloudStorageObject = gcsname;
                    // file.makePublic().then(() => {
                    //     req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
                    //     next();
                    // });
                    // [END public_url]
                    res.json({ success: true, profileImageName: gcsname, message: 'File was uploaded' });
                });
                stream.end(req.file.buffer);
            }

        });
    });

    router.post('/sendEmail', function (req, res) {
        var toemail = req.body.toemail;
        var fromemail = req.body.fromemail;
        var subject = req.body.subject;
        var body = req.body.emailbody;
        var emailOptions = {
            from: fromemail,
            to: toemail,
            subject: subject,
            html: body
        };

        UserConnectionReminder.findOne({ toemail: toemail, fromemail: fromemail }).select({}).exec(function (err, userConnectionReminder) {
            if (err) throw err; //throw err if cannot connect
            if (userConnectionReminder) {
                userConnectionReminder = this.setUserConnectionReminder(userConnectionReminder, req)
            } else {
                var userConnectionReminder = new UserConnectionReminder();
                userConnectionReminder = this.setUserConnectionReminder(userConnectionReminder, req)
            }

            userConnectionReminder.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
        // Function to send e-mail to the user
        composeclient.sendMail(emailOptions, function (err, info) {
            if (err)
                //console.log(err); // If error with sending e-mail, log to console/terminal
                res.json({ success: false, message: "Error Endorsement Email Request Sent!" });
            else {
                res.json({ success: true, message: "Sucessfully Endorsement Email Request Sent!" });
            }
        });
    });

    router.post('/sendConnectionRequestEmail', function (req, res) {
        var senderEmail = req.body.senderEmail;
        var receiverEmail = req.body.receiverEmail;
        var subject = "Connection Request";
        var body = "Please add me to your connection";
        var emailOptions = {
            from: senderEmail,
            to: receiverEmail,
            subject: subject,
            html: body
        };

        // Function to send e-mail to the user
        composeclient.sendMail(emailOptions, function (err, info) {
            if (err)
                console.log(err); // If error with sending e-mail, log to console/terminal
            else {
                res.json({ success: true, message: "User Connection Request Sent!" });
            }
        });
    });
    
    this.setUserConnectionReminder = function (userConnectionReminder, req) {
        userConnectionReminder.toemail = req.body.toemail;
        userConnectionReminder.fromemail = req.body.fromemail;
        var datetime = new Date();
        userConnectionReminder.datetime = datetime;
        userConnectionReminder.keepreminding = false;
        return userConnectionReminder;
    }
/**************************************START OF Availability SECTION**************************************************************** */
this.setAvailability = function (availability, req) {
        availability.email = req.body.email;
        availability.nooptionselected = req.body.nooptionselected;
        availability.contractwork = req.body.contractwork;
        availability.parttimework = req.body.parttimework;
        availability.fulltimework = req.body.fulltimework;
        availability.servicework = req.body.servicework;
        availability.consultingwork = req.body.consultingwork;
        availability.probonowork = req.body.probonowork;

    return availability;
}







router.post('/createAvailabilities', function (req, res) {

        //check if email exists, then update profiles document
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }
         Availability.findOne({ email: email }).select({}).exec(function (err, availability) {

                if (err) throw err; //throw err if cannot connect
                //update existing profile
                if (availability) {
                    availability = this.setAvailability(availability, req)
                } else {
                    //create Availability object 
                    var availability = new Availability();
                    availability = this.setAvailability(availability, req)
                }
                // console.log("What is availabilities???? "+ availability);
                //save data entered by user in eep to availabilities collection in db
                availability.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // console.log("What is availabilities" + availability);
                        res.json({ success: true, message: "Availabilities Saved!" });
                    }
                });
            });
    });

    router.post('/getAvailabilities', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        Availability.findOne({ email: email }).select({}).exec(function (err, availabilities) {
            if (err) throw err; //throw err if cannot connect
            //if availabilities exists then assign availabilities to availableData
            // console.log("availabilities"+availabilities);
            if (availabilities) {
                res.json({ success: true, availableData: availabilities });

            } else {
                res.json({ success: false, message: 'Availabilities not found' });
            }
        });
    });


/**************************************END OF Availability SECTION**************************************************************** */



/**************************************START OF HOBBIES SECTION**************************************************************** */
this.setHobbies = function (hobby, req) {
        hobby.email = req.body.email;
        //general indoor
        hobby.generalindoor = req.body.hobgeneralindoor;
        hobby.generalindoorImage = req.body.hobgeneralImage;
        //general outdoor
        hobby.generaloutdoor = req.body.hobgeneraloutdoor;
        //hobby.generaloutdoorImage = req.body.hobgeneraloutdoorImage;
        //collection indoor
        hobby.collectionindoor = req.body.hobcollectionindoor;
        hobby.collectionindoorImage = req.body.hobcollectionindoorImage;
        //collection outdoor
        hobby.collectionoutdoor = req.body.hobcollectionoutdoor;
        hobby.collectionoutdoorImage = req.body.hobcollectionoutdoorImage;
        //competition indoor
        hobby.competitionindoor = req.body.hobcompetitionindoor;
        hobby.competitionindoorImage = req.body.hobcompetitionindoorImage;
        //competition outdoor
        hobby.competitionoutdoor = req.body.hobcompetitionoutdoor;
        hobby.competitionoutdoorImage = req.body.hobcompetitionoutdoorImage;
        //observation indoor
        hobby.observationindoor = req.body.hobobservationindoor;
        hobby.observationindoorImage = req.body.hobobservationindoorImage;
        //observation outdoor
        hobby.observationoutdoor = req.body.hobobservationoutdoor;
        hobby.observationoutdoorImage = req.body.hobobservationoutdoorImage;
        //new hobby
        hobby.newhobby = req.body.hobnewhobby;
        
        return hobby;
    }

    router.post('/createHobbies', function (req, res) {

        //check if email exists, then update profiles document
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }
         Hobby.findOne({ email: email }).select({}).exec(function (err, hobby) {

                if (err) throw err; //throw err if cannot connect
                //update existing profile
                if (hobby) {
                    hobby = this.setHobbies(hobby, req)
                } else {
                    //create Profile object 
                    var hobby = new Hobby();
                    hobby = this.setHobbies(hobby, req)
                }
                // console.log("What is hobby? "+ hobby);
                //save data entered by user in eep to profiles collection in db
                hobby.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // console.log("What is hobbies" + hobby);
                        res.json({ success: true, message: "Hobbies Saved!" });
                    }
                });
            });
    });
    //Get Hobbies data from db
    router.post('/getHobbies', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        Hobby.findOne({ email: email }).select({}).exec(function (err, hobbies) {
            if (err) throw err; //throw err if cannot connect
            //if hobbies exists then assign hobbies to hobbyData
            // console.log("hobbies"+hobbies);
            if (hobbies) {
                res.json({ success: true, hobbyData: hobbies });

            } else {
                res.json({ success: false, message: 'Hobbies not found' });
            }
        });
    });



/***************************************END OF HOBBIES SECTION*************************************************************** */

/***************************************START OF ENDORSEMENT SECTION************************************************************************************ */

    router.post('/createEndorsementExpertise', function (req, res) {
        var endorseremail;
        if (req.body.email) {
            endorseremail = req.body.endorseremail;
        }
        EndorsementExpertise.findOne({ endorseremail: endorseremail }).select({}).exec(function (err, endorsementexpertise) {
            if (err) throw err; //throw err if cannot connect
            if (endorsementexpertise) {
                endorsementexpertise = this.setEndorsementExpertise(endorsementexpertise, req)
            } else {
                var endorsementexpertise = new EndorsementExpertise();
                endorsementexpertise = this.setEndorsementExpertise(endorsementexpertise, req)
            }
            console.log(endorsementexpertise);
            endorsementexpertise.save(function (err) {
                if (err) {
                    res.json({ success: false, message: "Error on Endorsement Expertise Saved!" });
                }
                else {
                    res.json({ success: true, message: "Endorsement Expertise Saved!" });
                }
            });
        });
    });

    this.setEndorsementExpertise = function (endorsementexpertise, req) {
        endorsementexpertise.email = req.body.email;
        endorsementexpertise.endorseremail = req.body.endorseremail;
        endorsementexpertise.expertiseid = req.body.expertiseid;
        endorsementexpertise.rateskill = req.body.rateskill;
        endorsementexpertise.comment = req.body.comment;
        return endorsementexpertise;
    }

    this.setEndorsementRecognition = function (endorsementrecognition, req) {
        endorsementrecognition.email = req.body.email;
        endorsementrecognition.endorseremail = req.body.endorseremail;        
        endorsementrecognition.creativityRate = req.body.creativityRate;
        endorsementrecognition.proactivityRate = req.body.proactivityRate;
        endorsementrecognition.reliabilityRate = req.body.reliabilityRate;
        endorsementrecognition.managabilityRate = req.body.managabilityRate;
        return endorsementrecognition;
    }
    router.post('/createEndorsementRecognition', function (req, res) {
        var endorseremail;
        if (req.body.email) {
            endorseremail = req.body.endorseremail;
        }
        
        EndorsementRecognition.findOne({ endorseremail: endorseremail }).select({}).exec(function (err, endorsementrecognition) {
            if (err) throw err; //throw err if cannot connect
            console.log(endorsementrecognition);
            if (endorsementrecognition) {
                endorsementrecognition = this.setEndorsementRecognition(endorsementrecognition, req)
            } else {
                var endorsementrecognition = new EndorsementRecognition();
                endorsementrecognition = this.setEndorsementRecognition(endorsementrecognition, req)
                console.log(endorsementrecognition);
            }
            
            endorsementrecognition.save(function (err) {
                if (err) {
                    res.json({ success: false, message: "Error on Endorsement Recognition Saved!" });
                }
                else {
                    res.json({ success: true, message: "Endorsement Recognition Saved!" });
                }
            });
        });
    });    
/***************************************END OF ENDORSEMENT SECTION*************************************************************** */
/***************************************START OF EXPERTISE SECTION************************************************************************************ */
   router.post('/createExpertise', function (req, res) {
        //check if email exists, then update educations document
        var email;

        if (req.body.email) {
            email = req.body.email;
        }

        if (req.body.expertiseid) {
            expertiseid = req.body.expertiseid;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }        
        if (req.body.expertiseid) {
            //Find with email Id AND companyId, then UPDATE all input employment information.
            Expertise.findOne({ email: email, _id: new ObjectId(expertiseid) }).select({}).exec(function (err, expert) {
                //if (err) throw err;                
                if (expert) {
                    if (!req.body.clearExpertise) {                        
                        this.validateExpertise(req, errorMessage);
                        if (errorMessage.error) {                            
                            res.json({ success: false, message: errorMessage.message + ' are provided!' });
                        } else {
                            expert = this.setExpertise(expert, req);                            
                            //save data entered by user in eep to profiles collection in db
                            expert.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: "Expertise Not Saved!" });
                                }
                                else {
                                    res.json({ success: true, message: "Expertise Saved!" });
                                }
                            });
                        }
                    } else {
                        Expertise.remove({ email: email, _id: new ObjectId(expertiseid) }, function (err, expert) {
                            if (err) {
                                res.json({ success: false, message: "Expertise Not Saved!" });
                            }
                            else {
                                res.json({ success: true, message: "Expertise Removed!" });
                            }
                        });
                        // expert = this.setExpertise(expert, req);                        
                        // //save data entered by user in eep to profiles collection in db
                        // expert.save(function (err) {
                        //     if (err) {
                        //         res.json({ success: false, message: "Expertise Not Saved!" });
                        //     }
                        //     else {
                        //         res.json({ success: true, message: "Expertise Saved!" });
                        //     }
                        // });
                    } 
                    
                } else {
                    //backend side Validatation for expertise
                    this.validateExpertise(req, errorMessage);
                    //if error exists or if required fields are not filled show error
                    if (errorMessage.error) {
                        res.json({ success: false, message: errorMessage.message + ' are provided!' });
                    } else {
                        var expert = new Expertise();
                        expert = this.setExpertise(expert, req)
                        //console.log("New " + expert);
                        //save data entered by user in eep to expertises collection in db
                        expert.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: "Expertise Not Saved!" });
                            }
                            else {
                                res.json({ success: true, message: "Expertise Saved!" });
                            }
                        });
                    }                    
                }                
            });
        } else {
            //backend side Validatation for expertise
            this.validateExpertise(req, errorMessage);
            //if error exists or if required fields are not filled show error
            if (errorMessage.error) {
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                var expert = new Expertise();
                expert = this.setExpertise(expert, req);
                //console.log("New  expertise" + expert);

                //save data entered by user in eep to profiles collection in db
                expert.save(function (err, newlyCreatedExpertise) {
                    if (err) {
                        res.json({ success: false, message: "Expertissesss Not Saved!" });
                    }
                    else {
                        if (newlyCreatedExpertise) {
                            // console.log("expertise: " + newlyCreatedExpertise);
                            companies = {};

                            // console.log("Newly Created Id for expertise: " + newlyCreatedExpertise.id);
                            expData = {
                                expertiseid: '',
                                expmainidea: '',
                                Text: '',
                                selectedExpertiseSource: '',
                                exprateskill: '',
                                exphidefrompublic: '',
                                expincludeinsearch: ''

                            }

                            if (newlyCreatedExpertise.supportexpertise) {
                                var expertiseSourceList = newlyCreatedExpertise.supportexpertise; //newlyCreatedExpertise.supportexpertise.split(',');
                                expData.selectedExpertiseSource = expertiseSourceList;
                            }
                            expData.expertiseid = newlyCreatedExpertise.id;
                            expData.expmainidea = newlyCreatedExpertise.mainidea;
                            expData.Text = newlyCreatedExpertise.expertisedetails;
                            // expData.expertiseSource = newlyCreatedExpertise.supportexpertise;
                            expData.exprateskill = newlyCreatedExpertise.skillrating;
                            expData.exphidefrompublic = newlyCreatedExpertise.hideexpertisefrompublic;
                            expData.expincludeinsearch = newlyCreatedExpertise.includeinsearch;
                            companies[newlyCreatedExpertise.id] = expData;
                        }
                        res.json({ success: true, expertiseData: companies, message: "Expertise Saved!" });
                    }
                });
            }
        }

    });
router.post('/getCurrentExpertise', function (req, res) {
    
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.expertiseid) {
            expertiseid = req.body.expertiseid;
        } 
          
        else{
            console.log("Is this error?");
        }
        // console.log("Expertisesss coming?: "+ req.body.expertiseid);
        //find with respect to email and store all information             
        Expertise.findOne({ email: email, _id: new ObjectId(expertiseid) }).select({}).exec(function (err, expertise) {

            if (err) throw err;

            if (expertise) {
                // console.log("emp: " + employments);
                companies = {};

                // console.log("Expertisesss: " + expertise);
                expData = {
                       expertiseid: '',
                       expmainidea: '',
                       Text: '',
                       selectedExpertiseSource: '',
                       exprateskill: '',
                       exphidefrompublic: '',
                       expincludeinsearch:''

                   }
                    if (expertise.supportexpertise) {
                        var expertiseSourceList = expertise.supportexpertise; //expertise.supportexpertise.split(',');
                        expData.selectedExpertiseSource = expertiseSourceList;
                    }

                   expData.expertiseid = expertise.id;
                   expData.expmainidea = expertise.mainidea;
                   expData.Text = expertise.expertisedetails;
                //    expData.expertiseSource = expertise.supportexpertise;
                   expData.exprateskill = expertise.skillrating;
                   expData.exphidefrompublic = expertise.hideexpertisefrompublic;
                   expData.expincludeinsearch = expertise.includeinsearch;
                   companies[expertise.id] = expData;
                //    console.log("All expertise: " + expData);
                //console.log(companies);
                res.json({ success: true, expertiseData: companies });
            } else {
              res.json({ success: false, message: 'Expertise not found' });
            }            
        });
    });


    router.post('/getExpertiseSource', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }

        var expertiseData = {
            id: 1,
            name: "Self-Educated",
            countryname: ""
        }
        var companies = [];
        companies.push(expertiseData);
        i = 1;
        // ExpertiseSource.find({ email: email }).select({}).exec(function (err, expertisesources) {
        Employment.find({ email: email }).select({}).exec(function (err, employments) {
            if (err) throw err; //throw err if cannot connect

            if (employments) {
                employments.forEach(function (employment) {
                    var expertiseData = {
                        id: employment.id,
                        name: employment.companyname,
                        countryname: employment.companyCountry
                    }
                    // companies[employment.id] = expertiseData;
                    companies.push(expertiseData);
                    i++;
                });
            }
            
            // ExpertiseSource.find({ email: email }).select({}).exec(function (err, expertisesources) {
            // if (err) throw err; //throw err if cannot connect

            // if (expertisesources) {
            //     expertisesources.forEach(function (expertisesource) {
            //         var expertiseData = {
            //             //id: employment.id,
            //             name: expertisesource.companyname
            //         }
            //         // companies[employment.id] = expertiseData;
            //         companies.push(expertiseData);
            //         i++;
            //     });
            // }
            

            Education.find({ email: email }).select({}).exec(function (err, educations) {

                if (educations) {
                    educations.forEach(function (education) {

                        var expertiseData = {
                            id: education.id,
                            name: education.companyname,
                            countryname: education.companyCountry
                        };
                        // companies[education.id] = expertiseData;
                        companies.push(expertiseData);
                        i++;
                    });
                    //console.log(companies);
                    res.json({ success: true, expertiseSourceData: companies });
                }
                else {
                    res.json({ success: false, message: 'expertise source not found' });
                }
            });
        });

    });


   router.post('/getExpertise', function (req, res) {
       //router.post('/getEmployer', function (req, res) {
       var email;
       if (req.body.email) {
           email = req.body.email;
       }
       // console.log(email);
       Expertise.find({ email: email }).select({}).exec(function (err, expertises) {
           if (err) throw err; //throw err if cannot connect
           // console.log("All Com: "+employments);
           if (expertises) {
               // console.log("emp: " + employments);
               companies = {};

               expertises.forEach(function (expertise) {
                   expData = {
                       expertiseid: '',
                       expmainidea: '',
                       Text: '',
                       selectedExpertiseSource: '',
                       exprateskill: '',
                       exphidefrompublic: '',
                       expincludeinsearch:''

                   }
                   if (expertise.supportexpertise) {
                       var expertiseSourceList = expertise.supportexpertise; //expertise.supportexpertise.split(',');                       
                       expData.selectedExpertiseSource = expertiseSourceList;
                   }
                   expData.expertiseid = expertise.id;
                   expData.expmainidea = expertise.mainidea;
                   expData.Text = expertise.expertisedetails;
                   //expData.expertiseSource = expertise.supportexpertise;
                   expData.exprateskill = expertise.skillrating;
                   expData.exphidefrompublic = expertise.hideexpertisefrompublic;
                   expData.expincludeinsearch = expertise.includeinsearch;
                   companies[expertise.id] = expData;                   
               });

            //    console.log("All expertise: " + companies);
               res.json({ success: true, expertiseData: companies });
           } else {
               res.json({ success: false, message: 'Expertise not found' });
           }
       });
   }); 


   router.post('/getExpertExpertise', function (req, res) {
       var email;
       if (req.body.email) {
           email = req.body.email;
       }
       var expertCompanies = {};
        
    //    Expertise.find({ email: email }).select({}).exec(function (err, expertises) {
        Expertise.find({ email: email }, function (err, expertises) {
           if (err) throw err;

           if (expertises) {
               //expertCompanies = {};
               expertises.forEach(function (expertise) {
                   var expData = {
                       expertiseid: '',
                       expmainidea: '',
                       Text: '',
                       selectedExpertiseSource: [],
                       selectedExpertCompanies: [],
                       exprateskill: '',
                       exphidefrompublic: '',
                       expincludeinsearch: ''
                   }

                   if (expertise.supportexpertise) {
                       var supportexpertise = expertise.supportexpertise;
                       //expData.selectedExpertiseSource = supportexpertise;

                       if (supportexpertise == "Self-Educated") {
                           expData.selectedExpertCompanies = { supportexpertise };
                       }
                       var supportexpertiseList = [];
                       supportexpertise.forEach(function (str) {
                           str = str.replace(/\s+/g, '-').toLowerCase();
                           supportexpertiseList.push(str);
                       });
                       expData.selectedExpertiseSource = supportexpertiseList;

                       //companyArr = [];
                       expertCompanyDb = {};
                       var expDataArr = { mydata:'' };
                       Company.find( { companyid: { $in: supportexpertiseList } }, function (err, companies) {
                            
                           companies.forEach(function (company) {
                               companyMap = {
                                   display: '',
                                   country: ''
                               }
                               companyMap.display = company.companyname;
                               companyMap.country = company.country;
                               //    companyMap = {
                               //        display: company.companyname,
                               //        country: company.country
                               //    }
                               expertCompanyDb[expertise.id] = companyMap;
                            //    expData.selectedExpertCompanies.push(companyMap);
                            //    expDataArr[expertise.id] = expData;
                            

                               //companyArr.push(companyMap);
                               //    expData.selectedExpertCompanies.push(companyMap);
                               //    console.log(expData.selectedExpertCompanies);
                           });
                           expDataArr.mydata = expertCompanyDb;
                           
                           //    return companyArr;
                           // myexpData.selectedExpertCompanies = companyArr;
                           // console.log(myexpData);
                           //    selectedExpertCompanies[company] = companyArr;
                           //    expertCompanies[company].selectedExpertCompanies = companyArr;
                           //expertCompanies[company] = myexpData;
                           //    console.log(selectedExpertCompanies[company]);
                       });
                       //    console.log(companyArr);
                   }
                   
                   expData.expertiseid = expertise.id;
                   expData.expmainidea = expertise.mainidea;
                   expData.Text = expertise.expertisedetails;
                   expData.exprateskill = expertise.skillrating;
                   expData.exphidefrompublic = expertise.hideexpertisefrompublic;
                   expData.expincludeinsearch = expertise.includeinsearch;
                   expertCompanies[expertise.id] = expData;
                   //    console.log(expData);
               })
               //console.log(expertCompanies);
               res.json({ success: true, expertiseData: expertCompanies });
           }
           //console.log(expertCompanies);
           //    selectedExpertCompanies = [];
           //    for (company in expertCompanies) {
           //        myexpData = expertCompanies[company];
           //        //    console.log(company);
           //        var mysupportexpertiseList = myexpData.selectedExpertiseSource;
           //        //    console.log(mysupportexpertiseList);

           //        //    expData.selectedExpertiseSource = supportexpertiseList;
           //        Company.find({ "companyid": { $in: mysupportexpertiseList } }, function (err, companies) {
           //            companyArr = [];
           //            companyMap = {
           //                logo: "",
           //                display: "",
           //                country: "",
           //                companyid: ""
           //            }
           //            if (err) throw err; //throw err if cannot connect

           //            companies.forEach(function (company) {
           //                companyMap = {
           //                    display: company.companyname,
           //                    logo: company.companyname + "_" + company.country + ".png",
           //                    country: company.country,
           //                    companyid: company.companyid
           //                }
           //                companyArr.push(companyMap);
           //            });

           //            // myexpData.selectedExpertCompanies = companyArr;
           //            // console.log(myexpData);
           //            selectedExpertCompanies[company] = companyArr;
           //            //    expertCompanies[company].selectedExpertCompanies = companyArr;
           //            //expertCompanies[company] = myexpData;
           //            //    console.log(selectedExpertCompanies[company]);
           //        });
           //    }
           //    console.log(selectedExpertCompanies);
           //    res.json({ success: true, expertiseData: expertCompanies, companiesData: selectedExpertCompanies });



           //     else {
           //        res.json({ success: false, message: 'Expertise not found' });
           //    }
       });
   }); 
    //End of Create Expertise

    router.post('/getCompanyByName', function (req, res) {
        var companyname;
        if (req.body.companyname) {
            companyname = req.body.companyname;
        }
        var companyId;
        if (req.body.companyId) {
            companyId = req.body.companyId;
        }
        Company.findOne({ "companyname": companyname }, function (err, company) {
            if (company) {
                var companyMap = {
                    logo: "",
                    display: "",
                    country: "",
                    companyid: ""
                }
                companyMap.display= company.companyname;
                companyMap.logo= company.companyname + "_" + company.country + ".png";
                companyMap.country= company.country;
                companyMap.companyid= company.companyid;

                res.json({ success: true, companyData: companyMap, companyIdData: companyId });
            } else {
                res.json({ success: false, message: 'Company not found' });
            }
        });
    }); 

   router.post('/getCompanyByIds', function (req, res) {

       var supportexpertiseList;
       if (req.body.companies) {
           supportexpertiseList = req.body.companies;
       }
       var expertiseId;
       if(req.body.expertiseId) {
            expertiseId = req.body.expertiseId;
       }
       Company.find({ "companyid": { $in: supportexpertiseList } }, function (err, companies) {
           companyArr = [];
           var companyMap = {
               logo: "",
               display: "",
               country: "",
               companyid: ""
           }
           if (err) throw err; //throw err if cannot connect

           companies.forEach(function (company) {
               var companyMap = {
                   display: company.companyname,
                   logo: company.companyname + "_" + company.country + ".png",
                   country: company.country,
                   companyid: company.companyid
               }
               companyArr.push(companyMap);
           });
           if (companies) {
               res.json({ success: true, companyData: companyArr, expertiseIdData: expertiseId });
           } else {
               res.json({ success: false, message: 'Company not found' });
           }
       });
   });

    
    
    this.validateExpertise = function (req, errorMessage1) {
        errorMessage1.message = "Ensure ";
        //erro handling for educations Header input data        
        
        if (req.body.expmainidea == null || req.body.expmainidea == '') {
            errorMessage1.message += ' Main idea ';
            errorMessage1.error = true;
        }
       if (req.body.Text == null || req.body.Text == '') {
                errorMessage1.message += ' Detailed Description required  ';
                errorMessage1.error = true;
        }   
        if (req.body.expertiseSource == null || req.body.expertiseSource == '') {
                errorMessage1.message += ' Support Expertise  ';
                errorMessage1.error = true;
        }
        if (req.body.exprateskill == null || req.body.exprateskill == '') {
                errorMessage1.message += ' Rate your Skills  ';
                errorMessage1.error = true;
        }                         
    }

    //set Expertise in db with data entered in db
    this.setExpertise = function (expert, req) {
        expert.email = req.body.email;//Save first name from request to Profile object
        expert.mainidea = req.body.expmainidea;//Save title from request to Profile object
        expert.expertisedetails = req.body.Text;//Save title from request to Profile object
        expert.supportexpertise = req.body.expertiseSource;
        expert.skillrating = req.body.exprateskill;
        expert.hideexpertisefrompublic = req.body.exphidefrompublic;//Save title from request to Profile object
        expert.includeinsearch = req.body.expincludeinsearch;
        
        return expert;
    }
    /***************************************END OF EXPERTISE SECTION************************************************************************************ */

    /***************************************START OF EDUCATION SECTION************************************************************************************ */
  /******create eductation route******************* */
    router.post('/createEducation', function (req, res) {
        //check if email exists, then update educations document
        var email;

        if (req.body.email) {
            email = req.body.email;
        }

        if (req.body.companyid) {
            companyid = req.body.companyid;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }

        //New Company section        
        if (req.body.addnewcompany) {
            this.validateNewCompanyForEducation(req, errorMessage);
            if (errorMessage.error) {
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                var eduCompanyNew = new Company();
                eduCompanyNew = this.setNewCompanyForEducation(eduCompanyNew, req);
                //console.log(companyNew);
                eduCompanyNew.save(function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        }
        if (req.body.companyid) {
            //Find with email Id AND companyId, then UPDATE all input employment information.
            Education.findOne({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err, educate) {

                //if (err) throw err;

                if (educate) {
                    oldCompanyName = educate.companyname;                    
                    if (!req.body.clearEducation) {
                        this.validateEducation(req, errorMessage);
                        if (errorMessage.error) {
                            res.json({ success: false, message: errorMessage.message + ' are provided!' });
                        } else {
                            educate = this.setEducation(educate, req);
                            educate.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: "Education Not Saved!" });
                                }
                                else {
                                    //edit
                                    // this.removeOldCompanyFromExpertise(email,oldCompanyName);
                                    res.json({ success: true, oldCompany:oldCompanyName, message: "Education Saved!" });
                                }
                            });
                        }
                    } else {
                        //remove
                        Education.remove({ email: email, _id: new ObjectId(companyid) }, function (err, educate) {
                            if (err) {
                                res.json({ success: false, message: "Education Not Saved!" });
                            }
                            else {
                                // this.removeOldCompanyFromExpertise(email,oldCompanyName);
                                res.json({ success: true, oldCompany:oldCompanyName, message: "Education Removed!" });
                            }
                        });
                    }
                    
                } else {
                    //backend side Validatation for education
                    this.validateEducation(req, errorMessage);
                    //if error exists or if required fields are not filled show error
                    if (errorMessage.error) {
                        res.json({ success: false, message: errorMessage.message + ' are provided!' });
                    } else {
                        var educate = new Education();
                        educate = this.setEducation(educate, req)
                        //console.log("New " + educate);
                        //save data entered by user in eep to educations collection in db
                        educate.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: "Education Not Saved!" });
                            }
                            else {
                                res.json({ success: true, message: "Education Saved!" });
                            }
                        });
                    }                    
                }                
            });
        } else {
            //backend side Validatation for education
            this.validateEducation(req, errorMessage);
            //if error exists or if required fields are not filled show error
            if (errorMessage.error) {
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                var educate = new Education();
                educate = this.setEducation(educate, req);
                // console.log("New " + educate);

                //save data entered by user in eep to profiles collection in db
                educate.save(function (err, newlyCreatedEducation) {
                    if (err) {
                        res.json({ success: false, message: "Educationnnnn Not Saved!" });
                    }
                    else {
                        if (newlyCreatedEducation) {
                            // console.log("emp: " + employments);
                            educations = {};

                            //console.log("Newly Created Id: " + newlyCreatedEducation.id);
                            eduData = {
                                educompanyid: '',
                                empcompanyCode: '', searchText: '',
                                edupresent: '',
                                edudegree: '',
                                edumajor: '',
                                edugradyear: '',
                                edugradyearexpected: ''
                            }
                            eduData.educompanyid = newlyCreatedEducation.id;
                            eduData.empcompanyCode = newlyCreatedEducation.companyname;
                            eduData.searchText = newlyCreatedEducation.companyname;
                            eduData.edupresent = newlyCreatedEducation.currentschool;
                            eduData.edumajor = newlyCreatedEducation.major;
                            eduData.edudegree = newlyCreatedEducation.degree;
                            eduData.edugradyear = newlyCreatedEducation.graduationyear;
                            eduData.edugradyearexpected = newlyCreatedEducation.gradyearexpected;
                            educations[newlyCreatedEducation.id] = eduData;
                        }
                        res.json({ success: true, educationData: educations, message: "Education Saved!" });
                    }
                });
            }
        }

    });
    this.validateNewCompanyForEducation = function (req, errorMessage) {
        errorMessage.message = "Ensure ";
        //erro handling for profile Header input data        
    
        if (req.body.newcompany == null || req.body.newcompany == '') {
            errorMessage.message += ' New company Name ';
            errorMessage.error = true;
        }
        if (req.body.newcountry == null || req.body.newcountry == '') {
            errorMessage.message += ' Country  ';
            errorMessage.error = true;
    }
 }

    this.setNewCompanyForEducation = function (eduCompanyNew, req) {
        eduCompanyNew.companyname = req.body.newcompany;
        eduCompanyNew.country = req.body.newcountry;
        eduCompanyNew.website = req.body.newurl;
        return eduCompanyNew;
    }
    this.validateEducation = function (req, errorMessage1) {
        errorMessage1.message = "Ensure ";
        //erro handling for educations Header input data        
        if (req.body.companyname == null || req.body.companyname == '') {
            errorMessage1.message += ' University/College/School Name ';
            errorMessage1.error = true;
        }
        if (req.body.edumajor == null || req.body.edumajor == '') {
            errorMessage1.message += ' Major ';
            errorMessage1.error = true;
        }
        if (req.body.edudegree == null || req.body.edudegree == '') {
            errorMessage1.message += ' Degree ';
            errorMessage1.error = true;
        }
        if (req.body.edupresent == null || req.body.edupresent == '') {
            if (req.body.graduationyear == null || req.body.graduationyear == '') {
                errorMessage1.message += ' Graduation Year  ';
                errorMessage1.error = true;
            }                        
        } else {
            if (req.body.gradyearexpected == null || req.body.gradyearexpected == '') {
                errorMessage1.message += ' Expected Graduation Year  ';
                errorMessage1.error = true;
            }            
        }
    }

    //set Education in db with data entered in db
    this.setEducation = function (educate, req) {
        educate.email = req.body.email;//Save first name from request to Profile object
        educate.companyname = req.body.companyname;//Save title from request to Profile object
        educate.companyCountry = req.body.eduCompanyCountry;
        educate.addnewcompany = req.body.addnewcompany;
        educate.major = req.body.edumajor;//Save title from request to Profile object
        educate.degree = req.body.edudegree;
        educate.currentschool = req.body.edupresent;
        educate.graduationyear = req.body.graduationyear;//Save title from request to Profile object
        educate.gradyearexpected = req.body.gradyearexpected;//Save title from request to Profile object
        return educate;
    }

    //EEP Specific Education Route
    router.post('/getCurrentEducation', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.companyid) {
            companyid = req.body.companyid;
        } 
        else{
            console.log("Is this error?");
        }
        // else {
        //     throw err;
        // }

        //find with respect to email and store all information             
        Education.findOne({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err, education) {

            if (err) throw err;

            if (education) {
                // console.log("emp: " + employments);
                companies = {};

                //console.log("Education: " + education);
                eduData = {
                        educompanyid: '',
                        empcompanyCode: '', searchText: '',
                        edupresent:'',
                        edudegree:'',
                        edumajor:'',
                        edugradyear:'',
                        edugradyearexpected:''
                    }

                    eduData.educompanyid = education.id;
                    eduData.empcompanyCode = education.companyname;
                    eduData.searchText = education.companyname;
                    eduData.edupresent = education.currentschool;
                    eduData.edumajor = education.major;
                    eduData.edudegree = education.degree;
                    eduData.edugradyear = education.graduationyear;
                    eduData.edugradyearexpected = education.gradyearexpected;
                    companies[education.id] = eduData;

                //console.log(companies);
                res.json({ success: true, educationData: companies });
            } else {
              res.json({ success: false, message: 'Education not found' });
            }            
        });
    });

    //EEP User EDUCATION Route
    router.post('/getEducation', function (req, res) {
        //router.post('/getEmployer', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        // console.log(email);
        Education.find({ email: email }).select({}).exec(function (err, educations) {
            if (err) throw err; //throw err if cannot connect
            if (educations) {            
                // console.log("emp: " + employments);
                companies = {};
                
                educations.forEach(function (education) {
                    eduData = {
                        educompanyid: '',
                        empcompanyCode: '', searchText: '',
                        edupresent:'',
                        edudegree:'',
                        edumajor:'',
                        edugradyear:'',
                        edugradyearexpected:'',
                        educompany:''
                    }

                    eduData.educompanyid = education.id;
                    eduData.empcompanyCode = education.companyname;
                    eduData.searchText = education.companyname;
                    eduData.edupresent = education.currentschool;
                    eduData.edumajor = education.major;
                    eduData.edudegree = education.degree;
                    eduData.edugradyear = education.graduationyear;
                    eduData.edugradyearexpected = education.gradyearexpected;
                    companies[education.id] = eduData;
                });
                
                //console.log("All education: "+ companies);
                res.json({ success: true, educationData: companies });
            } else {
                res.json({ success: false, message: 'Education not found' });
            }
        });
    });
    router.post('/deleteCurrentEducation', function (req, res) {        
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.companyid) {
            companyid = req.body.companyid;
        } 
       else{
            console.log("Is this error here?");
        }
        //find with respect to email and store all information             
        Education.findOneAndRemove({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err) {
            if (err) {
                //console.log("what is coming here " + err );
                res.json({ success: false, message: 'Error deleting' });
            } else {
                res.json({ success: true });
            }
        });
 });
 router.post('/deleteEducationByEmail', function(req,res){
    var email;
    if(req.body.email){
        email = req.body.email;
    }
    else{
        console.log("error in education here???");
    }
    Education.findOneAndRemove({email:email}).select({}).exec(function(err){
        if(err){
            res.json({ success: false, message: 'Error deleting education' });
        }else {
                res.json({ success: true });
        }
    })
});
 

/*******************************************************END OF EDUCATION SECTION******************************************************************** */
   router.post('/createEmployment', function (req, res) {
        //check if email exists, then update profiles document
        var email;

        if (req.body.email) {
            email = req.body.email;
        }
        //console.log("Company Id: " + req.body.companyid);
        if (req.body.companyid) {
            companyid = req.body.companyid;
            //console.log("Company Id: " + companyid);   
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }

        //New Company section        
        if (req.body.addnewcompany) {            
            this.validateNewCompany(req, errorMessage);
            if (errorMessage.error) {            
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                var companyNew = new Company();
                companyNew = this.setNewCompany(companyNew, req);
                //console.log(companyNew);
                companyNew.save(function (err) {
                    if (err) {
                        throw err;                        
                    }
                });
            }
        }

        
        //if error exists or if required fields are not filled show error
        if (req.body.companyid) {
            //Find with email Id AND companyId, then UPDATE all input employment information.
            Employment.findOne({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err, employer) {

                if (err) throw err;

                //If Employment found                
                if (employer) {
                    oldCompanyName = employer.companyname;
                    //If clear employment clicked, don't validate employment                    
                    if (!req.body.clearEmployment) {                        
                        this.validateEmployer(req, errorMessage);
                        if (errorMessage.error) {
                            res.json({ success: false, message: errorMessage.message + ' are provided!' });
                        } else {                            
                            employer = this.setEmployer(employer, req);
                            employer.save(function (err) {
                                if (err) {
                                    res.json({ success: false, message: "Employment Not Saved!" });
                                }
                                else {
                                    //edit
                                    //remove oldCompanyName from expertise.supportexpertise
                                    if(oldCompanyName!= employer.companyname) {
                                        this.removeOldCompanyFromExpertise(email,oldCompanyName);
                                    }
                                    

                                    //edit expertSource
                                    // ExpertiseSource.remove({ email: email, companyid: companyid }, function (err, employer) {
                                    //     if (err) {
                                    //         console.log("expertiseSource Remove error: ");
                                    //         // res.json({ success: false, message: "Employment Not Saved!" });
                                    //     }
                                    //     else {
                                    //         // res.json({ success: true, message: "Employment Removed!" });
                                    //         var expertiseSource = new ExpertiseSource();
                                    //         expertiseSource.email = email;
                                    //         expertiseSource.companyid = companyid;
                                    //         expertiseSource.companyname = req.body.companyname;
                                    //         console.log("expertiseSource.companyname: "+ expertiseSource.companyname);
                                    //         //save data entered by user in eep to profiles collection in db
                                    //         expertiseSource.save(function (err, newlyCreatedEmployment) {
                                    //             if (err) {
                                    //                 console.log("ExpertiseSource Edit/Save Error");
                                    //                 //res.json({ success: false, message: "Employment Not Saved!" });
                                    //             } else {
                                    //                 //remove oldCompanyName from expertise.supportexpertise
                                    //                 console.log("oldCompanyName: "+ oldCompanyName);
                                    //                 Expertise.find({ email: email, supportexpertise: oldCompanyName }).select({}).exec(function (err, expertises) {
                                    //                     if(err) {
                                    //                         console.log("Expertises Find Error");
                                    //                     }
                                    //                     if (expertises) {                                                            
                                    //                         expertises.forEach(function (expertise) {
                                    //                             //Remove oldCompany from expertisesource.supportexpertise array
                                    //                             var index = expertise.supportexpertise.indexOf(oldCompanyName);
                                    //                             console.log("index: "+ index);
                                    //                             console.log(expertise);
                                    //                             if(index>-1) {
                                    //                                 expertise.supportexpertise.splice(index, 1);
                                    //                             }
                                    //                             console.log("new expertise: ");
                                    //                             console.log(expertise);
                                    //                             //Save expertise                                                                
                                    //                             expertise.save(function (err) {
                                    //                                 if (err) {
                                    //                                     console.log("Expertises Save Error");
                                    //                                 } else {
                                    //                                     console.log("Expertises updated");
                                    //                                 }                                                                    
                                    //                             });
                                    //                         });
                                    //                     }
                                    //                 });
                                    //             }
                                    //         });  
                                    //     }
                                    // });          
                                    console.log("clear emp: " + req.body.clearEmployment);                          
                                    res.json({ success: true, oldCompany:oldCompanyName,  message: "Employment Saved!" });
                                }
                            });
                        }
                    } else {
                        //remove
                        Employment.remove({ email: email, _id: new ObjectId(companyid) }, function (err, employer) {
                            if (err) {
                                res.json({ success: false, message: "Employment Not Saved!" });
                            }
                            else {
                                //remove oldCompanyName from expertise.supportexpertise
                                this.removeOldCompanyFromExpertise(email,oldCompanyName);
                                // ExpertiseSource.remove({ email: email, companyid: companyid }, function (err, employer) {
                                //     if (err) {
                                //         console.log("ExpertiseSource Delete Error");
                                //     }
                                // });
                                res.json({ success: true, oldCompany:oldCompanyName, message: "Employment Removed!" });
                            }
                        });
                      } 
                    
                }
                    // } else {
                    //     //Edit employment
                    //     employer = this.setEmployer(employer, req);
                    //     //save data entered by user in eep to profiles collection in db
                    //     employer.save(function (err) {
                    //         if (err) {
                    //             res.json({ success: false, message: "Employment Not Saved!" });
                    //         }
                    //         else {
                    //             res.json({ success: true, message: "Employment Saved!" });
                    //         }
                    //     });
                    // }                    
                 else {                    
                    this.validateEmployer(req, errorMessage);
                    if (errorMessage.error) {
                        res.json({ success: false, message: errorMessage.message + ' are provided!' });
                    } else {
                        //Create new employment
                        var employer = new Employment();
                        employer = this.setEmployer(employer, req);
                        //save data entered by user in eep to profiles collection in db
                        employer.save(function (err) {
                            if (err) {
                                res.json({ success: false, message: "Employment Not Saved!" });
                            }
                            else {
                                res.json({ success: true, message: "Employment Saved!" });
                            }
                        });
                    }
                }                
            });
        } else {
            //Validate employment
            this.validateEmployer(req, errorMessage);
            if (errorMessage.error) {
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                // Create new employment
                var employer = new Employment();
                employer = this.setEmployer(employer, req)

                //save data entered by user in eep to profiles collection in db
                employer.save(function (err, newlyCreatedEmployment) {
                    if (err) {
                        res.json({ success: false, message: "Employment Not Saved!" });
                    }
                    else {
                        if (newlyCreatedEmployment) {
                            // console.log("emp: " + employments);
                            companies = {};

                            // console.log("Newly Created Id: " + newlyCreatedEmployment);
                            empData = {
                                empcompanyid: '',
                                empcompanyCode: '', searchText: '',
                                emppresent: '',
                                emptitlecategory: '',
                                empexacttitle: '',
                                empstartyear: '',
                                empendyear: '',
                                emphideinfo: ''
                            }
                            empData.empcompanyid = newlyCreatedEmployment.id;
                            empData.empcompanyCode = newlyCreatedEmployment.companyname;
                            empData.searchText = newlyCreatedEmployment.companyname;
                            empData.emppresent = newlyCreatedEmployment.currentcompany;
                            empData.emptitlecategory = newlyCreatedEmployment.titlecategory;
                            empData.empexacttitle = newlyCreatedEmployment.exacttitle;
                            empData.empstartyear = newlyCreatedEmployment.startyear;
                            empData.empendyear = newlyCreatedEmployment.endyear;
                            empData.emphideinfo = newlyCreatedEmployment.hideinfo;
                            companies[newlyCreatedEmployment.id] = empData;

                            //Create neew ExpertiseSource for this employment
                            // var expertiseSource = new ExpertiseSource();
                            // expertiseSource.email = email;
                            // expertiseSource.companyid = newlyCreatedEmployment.id;
                            // expertiseSource.companyname = newlyCreatedEmployment.companyname;                            

                            // //save data entered by user in eep to profiles collection in db
                            // expertiseSource.save(function (err, newlyCreatedEmployment) {
                            //     if (err) {
                            //         console.log("ExpertiseSource Error?");
                            //         //res.json({ success: false, message: "Employment Not Saved!" });
                            //     }   
                            // });                             
                            res.json({ success: true, employmentData: companies, message: "Employment Saved!" });
                        }
                    }
                });
            }
        }
        
    });
    
   //remove oldCompanyName from expertise.supportexpertise
   this.removeOldCompanyFromExpertise = function (email,oldCompanyName) {       
       console.log("module oldCompanyName: " + oldCompanyName);
       Expertise.find({ email: email, supportexpertise: oldCompanyName }).select({}).exec(function (err, expertises) {
           if (err) {
               console.log("Expertises Find Error");
           }
           if (expertises) {
               expertises.forEach(function (expertise) {
                   //Remove oldCompany from expertisesource.supportexpertise array
                   var index = expertise.supportexpertise.indexOf(oldCompanyName);
                   if (index > -1) {
                       expertise.supportexpertise.splice(index, 1);
                   }
                   expertise.save(function (err) {
                       if (err) {
                           console.log("Expertises Save Error");
                       }
                   });
               });
           }
       });
   }

    //EEP Specific Employment Route
    router.post('/getCurrentEmployment', function (req, res) {
        //router.post('/getEmployer', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.companyid) {
            companyid = req.body.companyid;
        } 
        else{
            console.log("Is this error?");
        }
        // else {
        //     throw err;
        // }

        //find with respect to email and store all information             
        Employment.findOne({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err, employment) {

            if (err) throw err;

            if (employment) {
                // console.log("emp: " + employments);
                companies = {};

                // console.log("Employment: " + employment);
                empData = {
                    empcompanyid: '',
                    empcompanyCode: '', searchText: '',
                    emppresent: '',
                    emptitlecategory: '',
                    empexacttitle: '',
                    empstartyear: '',
                    empendyear: '',
                    emphideinfo: ''
                }

                empData.empcompanyid = employment.id;
                empData.empcompanyCode = employment.companyname;
                empData.searchText = employment.companyname;
                empData.emppresent = employment.currentcompany;
                empData.emptitlecategory = employment.titlecategory;
                empData.empexacttitle = employment.exacttitle;
                empData.empstartyear = employment.startyear;
                empData.empendyear = employment.endyear;
                empData.emphideinfo = employment.hideinfo;
                companies[employment.id] = empData;


                //console.log(companies);
                res.json({ success: true, employmentData: companies });
            } else {
              res.json({ success: false, message: 'Employment not found' });
            }            
        });
    });
    //delete profile image
    router.post('/deleteProfileImage', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        Profile.findOne({ email: email }).select({}).exec(function (err, profile) {
            if (err) {
                res.json({ success: false, message: 'Error deleting profile image' });
            }
            if (profile) {
                profile.profileImage = '';
            }
            profile.save(function (err) {
                if (err) {
                    res.json({ success: false });
                } else {
                    res.json({ success: true });
                }
            });
        })
    });

router.post('/deleteEmploymentByEmail', function(req,res){
    var email;
    if(req.body.email){
        email = req.body.email;
    }
    else{
        console.log("error here???");
    }
    Employment.findOneAndRemove({email:email}).select({}).exec(function(err){
        if(err){
            res.json({ success: false, message: 'Error deleting' });
        }else {
                res.json({ success: true });
        }
    })
});

 router.post('/deleteCurrentEmployment', function (req, res) {        
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        if (req.body.companyid) {
            companyid = req.body.companyid;
        } 
       else{
            console.log("Is this error here?");
        }
        // else {
        //     throw err;
        // }
        //find with respect to email and store all information             
        Employment.findOneAndRemove({ email: email, _id: new ObjectId(companyid) }).select({}).exec(function (err) {

            if (err) {
                //console.log("what is coming here " + err );
                res.json({ success: false, message: 'Error deleting' });
            } else {
                //console.log("what is coming here????????????????????? ");
                res.json({ success: true });
            }
        });
 });

    //EEP User Employment Route
    router.post('/getEmployment', function (req, res) {
        //router.post('/getEmployer', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        // console.log(email);
        //Employment.find({ email: email,   companyname: { $ne: "" }  }).select({}).exec(function (err, employments) {
        Employment.find({ email: email }).select({}).exec(function (err, employments) {
            if (err) throw err; //throw err if cannot connect
            // console.log("All Com: "+employments);
            if (employments) {
                // console.log("emp: " + employments);
                companies = {};
                
                employments.forEach(function (employment) {
                    // empData = {testTitle:''}
                    // empData.testTitle = employment.exacttitle;
                    // companies[employment.exacttitle] = empData;
                    //console.log("Employment: " + employment);
                    empData = {
                        empcompanyid: '',
                        empcompanyCode: '', searchText: '',
                        emppresent: '',
                        emptitlecategory: '',
                        empexacttitle: '',
                        empstartyear: '',
                        empendyear: '',
                        emphideinfo: '',
                        empcompany:''
                    }
                    empData.empcompanyid = employment.id;
                    empData.empcompanyCode = employment.companyname;
                    empData.searchText = employment.companyname;
                    empData.emppresent = employment.currentcompany;
                    empData.emptitlecategory = employment.titlecategory;
                    empData.empexacttitle = employment.exacttitle;
                    empData.empstartyear = employment.startyear;
                    empData.empendyear = employment.endyear;
                    empData.emphideinfo = employment.hideinfo;
                    companies[employment.id] = empData;
                });
                
                //console.log("All Employments: "+ companies);
                res.json({ success: true, employmentData: companies });
            } else {
                res.json({ success: false, message: 'Employment not found' });
            }
        });
    });

    //Routes for saving employment section information
    router.post('/employmentInfo', function (req, res) {
        //check if email exists, then update profiles document
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }

        //New Company section
        if (req.body.addnewcompany) {

            this.validateNewCompany(req, errorMessage);
            if (errorMessage.error) {
                console.log("any error?");
                res.json({ success: false, message: errorMessage.message + ' are provided!' });
            } else {
                var companyNew = new Company();
                companyNew = this.setNewCompany(companyNew, req);
                
                console.log(companyNew);
                companyNew.save(function (err) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        console.log("any error here?");
                    }
                });
            }
        }

        //backend side Validatation for profile               
        this.validateEmployer(req, errorMessage);
        //if error exists or if required fields are not filled show error
        if (errorMessage.error) {
            res.json({ success: false, message: errorMessage.message + ' are provided!' });
        } else {
            //find with respect to email and store all information 
            Employer.findOne({ email: email }).select({}).exec(function (err, employer) {

                if (err) throw err; //throw err if cannot connect
                //update existing profile
                //console.log(employer);
                if (employer) {
                    employer = this.setEmployer(employer, req)
                } else {
                    //create Profile object 
                    var employer = new Employer();
                    employer = this.setEmployer(employer, req)
                }
                //save data entered by user in eep to profiles collection in db
                employer.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.json({ success: true, message: "User Employment Saved!" });
                    }
                });
            });
        }
    });

    this.validateNewCompany = function (req, errorMessage) {
        errorMessage.message = "Ensure ";
        //erro handling for profile Header input data        
    
        if (req.body.newcompany == null || req.body.newcompany == '') {
            errorMessage.message += ' New company Name ';
            errorMessage.error = true;
        }
        

        if (req.body.newcountry == null || req.body.newcountry == '') {
            errorMessage.message += ' Country  ';
            errorMessage.error = true;
        }else if (req.body.newcountry == 'us' || req.body.newcountry == 'ca') {
            if (req.body.newstate == null || req.body.newstate == '') {
                errorMessage.message += '  State ';
                errorMessage.error = true;
            }
        }
        if (req.body.newmetropolitanarea == null || req.body.newmetropolitanarea == '') {
            errorMessage.message += ' Metropolitan area ';
            errorMessage.error = true;
        }
        // if (req.body.newurl == null || req.body.newurl == '') {
        //     errorMessage.message += ' Company URL ';
        //     errorMessage.error = true;
        // }

    }

    this.setNewCompany = function (companyNew, req) {
        companyNew.companyname = req.body.newcompany;
        companyNew.country = req.body.newcountry;
        companyNew.state = req.body.newstate;
        companyNew.metropolitanarea = req.body.newmetropolitanarea,
        companyNew.website = req.body.newurl;
        return companyNew;
    }

    //validate employment information
    this.validateEmployer = function (req, errorMessage1) {
        errorMessage1.message = "Ensure ";
        //erro handling for profile Header input data        

        if (req.body.companyname == null || req.body.companyname == '') {
            errorMessage1.message += ' Company Name ';
            errorMessage1.error = true;
        }
        if (req.body.titlecategory == null || req.body.titlecategory == '') {
            errorMessage1.message += ' Title category ';
            errorMessage1.error = true;
        }
        
        if (req.body.startyear == null || req.body.startyear == '') {
            errorMessage1.message += ' Start Year  ';
            errorMessage1.error = true;
        }
        if (req.body.emppresent == null || req.body.emppresent == '') {
            if (req.body.endyear == null || req.body.endyear == '') {
                errorMessage1.message += ' End Year  ';
                errorMessage1.error = true;
            }
        }
    }

    //set Employment in db with data entered in db
    this.setEmployer = function (employer, req) {
        employer.email = req.body.email;//Save first name from request to Profile object
        //employer.companyId = req.body.email+"_"+req.body.companyname+"_"+req.body.titlecategory+"_"+req.body.startyear;
        employer.companyname = req.body.companyname;//Save title from request to Profile object
        employer.companyCountry = req.body.companyCountry;
        //employer.companyname = req.body.empnewcompany;
        employer.addnewcompany = req.body.addnewcompany;
        //employer.country = req.body.country; //Save country from request to Profile object
       // employer.state = req.body.state; //Save state from request to Profile object
        //employer.metropolitanarea = req.body.metropolitan; //Save metropolitan from request to Profile object
        employer.titlecategory = req.body.titlecategory;//Save title from request to Profile object
        employer.currentcompany = req.body.emppresent;
        employer.exacttitle = req.body.exacttitle;//Save title from request to Profile object
        employer.startyear = req.body.startyear;//Save title from request to Profile object
        employer.endyear = req.body.endyear;//Save title from request to Profile object
        employer.hideinfo = req.body.hideinfo;
        return employer;
    }

    //EEP User Employment Route
    router.post('/getEmployer', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        Employment.findOne({ email: email }).select({}).exec(function (err, employments) {
            if (err) throw err; //throw err if cannot connect
            if (employments) {
                // console.log("emp: " + employments);
                res.json({ success: false, employerData: employments });
            } else {
                res.json({ success: true, message: 'Employment not found' });
            }
        });
    });



    //Routes for saving User Profile
    router.post('/profileUser', function (req, res) {

        //check if email exists, then update profiles document
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        //error mesage object
        var errorMessage = {
            error: false,
            message: ""
        }
        //backend side Validatation for profile               
        this.validateProfile(req, errorMessage);
        //if error exists or if required fields are not filled show error
        if (errorMessage.error) {
            res.json({ success: false, message: errorMessage.message + ' are provided!' });
        } else {
            //find with respect to email and store all information 
            Profile.findOne({ email: email }).select({}).exec(function (err, profile) {

                if (err) throw err; //throw err if cannot connect
                //update existing profile
                if (profile) {
                    profile = this.setProfile(profile, req)
                } else {
                    //create Profile object 
                    var profile = new Profile();
                    profile = this.setProfile(profile, req)
                }
                //save data entered by user in eep to profiles collection in db
                profile.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.json({ success: true, message: "User Profile Saved!" });
                    }
                });
            });
        }
    });
    //validate profile information
    this.validateProfile = function (req, errorMessage) {
        errorMessage.message = "Ensure ";
        //erro handling for profile Header input data        

        if (req.body.firstname == null || req.body.firstname == '') {
            errorMessage.message += ' First Name ';
            errorMessage.error = true;
        }
        if (req.body.lastname == null || req.body.lastname == '') {
            errorMessage.message += ' Last Name ';
            errorMessage.error = true;
        }
        if (req.body.country == null || req.body.country == '') {
            errorMessage.message += ' Country ';
            errorMessage.error = true;
        } else if (req.body.country == 'us' || req.body.country == 'ca') {
            if (req.body.state == null || req.body.state == '') {
                errorMessage.message += ' State ';
                errorMessage.error = true;
            }
        }
        if (req.body.metropolitanarea == null || req.body.metropolitanarea == '') {
            errorMessage.message += ' Metropolitan area ';
            errorMessage.error = true;
        }
    }
    //set profile in db with data entered in db
    this.setProfile = function (profile, req) {
        profile.title = req.body.title;//Save title from request to Profile object
        profile.email = req.body.email;//Save first name from request to Profile object
        profile.firstname = req.body.firstname; //Save first name from request to Profile object
        profile.lastname = req.body.lastname; //Save last name from request to Profile object
        profile.nickname = req.body.nickname; //Save nick name from request to Profile object
        profile.middlename = req.body.middlename; //Save middle name from request to Profile object
        profile.degree = req.body.degree; //Save degree from request to Profile object
        profile.country = req.body.country; //Save country from request to Profile object
        profile.state = req.body.state; //Save state from request to Profile object
        //profile.city = req.body.city; //Save city from request to Profile object
        profile.metropolitanarea = req.body.metropolitanarea; //Save metropolitan from request to Profile object
        profile.backgroundImage = req.body.backgroundImage;
        profile.profileImage = req.body.profileImage;
        return profile;
    }

    //EEP User Profile Route
    router.post('/getProfile', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }

        Profile.findOne({ email: email }).select({}).exec(function (err, profiles) {
            if (err) throw err; //throw err if cannot connect

            if (profiles) {
                if (profiles.metropolitanarea) {
                    Metropolitan.findOne({ "code": profiles.metropolitanarea }, function (err, metropolitan) {
                        if (err) throw err; //throw err if cannot connect
                        if(metropolitan) {
                            res.json({ success: false, profileData: profiles, metropolitanData: metropolitan });
                        }
                    });
                } else {
                    res.json({ success: false, profileData: profiles, metropolitanData: "" });
                }
            } else {
                res.json({ success: true, message: 'Profile not found' });
            }
        });
    });

    //Country ROUTE
    router.post('/getCountry', function (req, res) {
        Country.find({}, function (err, countries) {
            var countryMap = {};
            if (err) throw err; //throw err if cannot connect
            //insert countries document in countryMap object
            countries.forEach(function (country) {
                countryMap[country.code] = country;
            });
            //if countries exists then assign countryMap object to countryData
            if (countries) {
                res.json({ success: false, countryData: countryMap });
            } else {
                res.json({ success: true, message: 'Country not found' });
            }
        });
    });
    //State Route
    router.post('/getState/:countryCode', function (req, res) {
        var countryCode;
        if (req.params.countryCode == "us") {
            countryCode = "USA"
        } else if (req.params.countryCode == "ca") {
            countryCode = "Canada"
        }
        State.find({ "country": countryCode }, function (err, states) {
            var stateMap = {};

            if (err) throw err; //throw err if cannot connect
            //insert states document in stateMap object 
            //console.log("states "+ states[0].code);
            states.forEach(function (state) {
                stateMap[state.code] = state;
            });
            if (states) {
                //  console.log("sfdsfs "+ stateMap['ca']);
                res.json({ success: false, stateData: stateMap });

            } else {
                res.json({ success: true, message: 'State not found' });
            }
        });
    });
    //Metropolitan Route
    router.post('/getMetropolitan/:countryStateCode', function (req, res) {
        var countryStateCode = req.params.countryStateCode;
        var re = new RegExp(countryStateCode, 'i');
        Metropolitan.find({ "code": { $regex: re } }, function (err, metropolitans) {
            var metropolitanMap = {};
            if (err) throw err; //throw err if cannot connect
            //insert metropolitans document metropolitanMap object
            metropolitans.forEach(function (metro) {
                metropolitanMap[metro.code] = metro;
            });
            //if metropolitans exists then assign metropolitanMap object to metropolitanData
            if (metropolitans) {
                res.json({ success: false, metropolitanData: metropolitanMap });
            } else {
                res.json({ success: true, message: 'Metropolitan not found' });
            }
        });
    });

    
    //MetropolitanName Route
    router.post('/getMetropolitanByCode/:metroCode', function (req, res) {
        // for(index in req.params) {
        //     console.log(index);
        //     console.log(req.params[index]);
        // }
        var metroCode = req.params.metroCode;
        console.log("metroCode: "+ metroCode);
        // var re = new RegExp(countryStateCode, 'i');
        Metropolitan.findOne({ "code": metroCode }, function (err, metropolitan) {
            
            if (err) throw err; //throw err if cannot connect
            //insert metropolitans document metropolitanMap object
            //var metropolitan = metropolitan;
            //if metropolitans exists then assign metropolitanMap object to metropolitanData
            if (metropolitan) {
                res.json({ success: false, metropolitanData: metropolitan });
            } else {
                res.json({ success: true, message: 'Metropolitan Name not found' });
            }
        });
    });

    //Company ROUTE
    router.get('/getCompany:searchText', function (req, res) {
        var searchText = req.params.searchText;
        /* '^' is used for searching company with starting 3 words. For eg. lim will display 'Limited etc' but not 'Abc limited etc'
        * 'i' is used for case insensitive. For eg Uni search word will display univeristy as well UNIVERSITY or University or uNiversity etc. 
        */
        var regEx = new RegExp('^'+searchText, 'i');    
        Company.find({ "companyname": { $regex: regEx } }, function (err, companies) {
            var companyArr = [];
            var companyMap = {
                logo: "",
                display: "",
                country: "",
                companyid:""
            }
            if (err) throw err; //throw err if cannot connect
            //<img ng-src="https://storage.googleapis.com/bobo-0518/Logos_Sample_20000-1/{{item.logo}}" height="20" width="40" alt="New Company"/>
            //insert countries document in countryMap object
            companies.forEach(function (company) {
                var companyMap = {
                    display: company.companyname,
                    logo: company.companyname + "_" + company.country + ".png",
                    country: company.country,
                    companyid: company.companyid
                }                
                companyArr.push(companyMap);
            });
            //if countries exists then assign companyMap object to countryData
            if (companies) {
                res.json({ success: true, companyData: companyArr });
            } else {
                res.json({ success: false, message: 'Country not found' });
            }
        }).limit(101);// limits the search result, i.e. limits the amount of search items in the dropdown list (in future we will keep 101), this shows only 10 items in the dropdown scroll menu, user should type more to narrow down his search more

    });

    /*
    router.post('/createReminderUser', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }

        var endorsement = new Endorsement();
        endorsement = this.setEndorsement(endorsement, req)
        console.log(endorsement);
        endorsement.save(function (err) {
            if (err) {
                res.json({ success: false, message: "Error on Endorsement Saved!" });
            }
            else {
                res.json({ success: true, message: "Endorsement Saved!" });
            }
        });        
    });
    */
    
    //http://localhost:8080/users
    //USER REGISTRATION ROUTE
    router.post('/users', function (req, res, next) {
        var user = new User();// Create new User object
        user.firstname = req.body.firstname;// Save first name from request to User object
        user.lastname = req.body.lastname;// Save last name from request to User object
        //user.fullname = req.body.fullname;// Save name from request to User object
        user.email = req.body.email;// Save email from request to User object
        user.password = req.body.password;// Save password from request to User object
        user.temporarytoken = jwt.sign({ firstname: user.firstname, lastname: user.lastname, email: user.email }, secret, { expiresIn: '24h' }); // create a token to activate account through email
        //erro handling for user input data
        if (req.body.firstname == null || req.body.firstname == '' || req.body.lastname == null || req.body.lastname == '' || req.body.email == null ||
            req.body.email == '' || req.body.password == null || req.body.password == '') {
            //if firstname, lastname,  email or password is not provided
            res.json({ success: false, message: 'Ensure firstname, lastname, email and password are provided!' });
        } else {
            //save new user to db
            user.save(function (err) {
                if (err) {
                    //check if any validation errors exists (from user model)
                    if (err.errors != null) {
                        if (err.errors.firstname) {
                            res.json({ success: false, message: err.errors.firstname.message });
                        } else if (err.errors.lastname) {
                            res.json({ success: false, message: err.errors.lastname.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });// Display error in validation (email)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });//Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err });// Display any other errors with validation
                        }
                    } else if (err) {
                        //check if duplication error exists
                        if (err.code == 11000) {
                        } else if (err.errmsg[61] == "e") {
                            res.json({ success: false, message: 'That e-mail is already taken' });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'BoBo: Your email Verification needed',
                        text: 'Hello ' + user.firstname + ', thank you for registering at BoBo.com. Please click on the link below to complete your activation: https://bobo-167921.appspot.com/activate/' + user.temporarytoken,
                        html: 'Hello <strong> ' + user.firstname + '</strong>,<br><br>Thank you for registering at BoBo.com.Please click on the link below to complete your activation: <br><br><a href="https://bobo-167921.appspot.com/activate/' + user.temporarytoken + '">https://bobo-167921.appspot.com/activate/</a>'
                    };

                    // Function to send e-mail to the user
                    client.sendMail(email, function (err, info) {
                        if (err)
                            console.log(err); // If error with sending e-mail, log to console/terminal
                    });

                    var profile = new Profile();
                    profile.firstname = req.body.firstname;
                    profile.lastname = req.body.lastname;
                    profile.email = req.body.email;
                    //save data entered by user in eep to profiles collection in db
                    profile.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.json({ success: true, message: 'Account registered. Please check your email for activation link.' }); // send success message back to controller /request
                }
            });
        }
    });
    //Route to check if e-mail chosen on registration page is already taken
    router.post('/checkEmail', function (req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) throw err; //throw err if cannot connect

            if (user) {
                res.json({ success: false, message: 'This email is already taken' }); // if user is returned then email is taken
            } else {
                res.json({ success: true, message: 'Valid e-mail' }); // if user is not returned then email is not taken
            }
        });
    });

    

    //USER LOGIN ROUTE
    router.post('/authenticate', function (req, res) {
        User.findOne({ email: req.body.email }).select('firstname lastname email password active').exec(function (err, user) {
            if (err) throw err; // Throw err if cannot connect
            //Check if user is found in the DB ( based on email)
            if (!user) {
                res.json({ success: false, message: 'Email not found' }); // Email not found in db
            } else if (user) {
                //Check if user does exists, then compare password provided by user
                if (!req.body.password) {
                    res.json({ success: false, message: 'No password provided!' });//Password not provided
                } else {
                    var validPassword = user.comparePassword(req.body.password); // check if password matched the password provided by the user
                    if (!validPassword) {
                        res.json({ success: false, message: 'Could not authenticate password' });//Password does not match password in database
                    } else if (!user.active) {
                        res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true });//Account is not activated
                    } else {
                        var token = jwt.sign({ firstname: user.firstname, lastname: user.lastname, email: user.email }, secret, { expiresIn: '24h' }); // Logged in: Give user token
                        res.json({ success: true, message: 'User authenticated!', token: token });//return token in JSON object to controller
                    }
                }
            }

        });
    });
    //Route to activate the user's account
    router.put('/activate/:token', function (req, res) {
        User.findOne({ temporarytoken: req.params.token }, function (err, user) {
            if (err) throw err; // Throw error if cannot login
            var token = req.params.token; // save the token from URL for verification
            //function to verify the user's token
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired' });//otken is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired' });//Token may be valid but does not match any user in the database
                } else {
                    user.temporarytoken = false; // remove temporary token
                    user.active = true; // change account status to Activated
                    //Mongoose method t save user into the database
                    user.save(function (err) {
                        if (err) {
                            console.log(err);//if unable to save user, log error info to console/terminal
                        } else {
                            //if save succeeds, create email object
                            var email = {
                                from: 'Do not reply, staff@localhost.com',
                                to: user.email,
                                subject: 'BoBo: Welcome to BoBo.com! Your Account Activated',
                                text: 'Hello ' + user.firstname + ', Your account has been successfully activated!',
                                html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>Your account has been successfully activated!'
                            };

                            // Function to send e-mail object to the user
                            client.sendMail(email, function (err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });
                            res.json({ success: true, message: 'Account Activated!' });//Return success message to controller
                        }
                    });
                }
            });
        });
    });

    // Route to verify user credentials before re-sending a new activation link	
    router.post('/resend', function (req, res) {
        User.findOne({ email: req.body.email }).select('firstname lastname email password active').exec(function (err, user) {
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
    router.put('/resend', function (req, res) {
        User.findOne({ email: req.body.email }).select('firstname lastname email temporarytoken').exec(function (err, user) {
            if (err) {
                throw err; // Throw error if cannot connect
            }
            user.temporarytoken = jwt.sign({ firstname: user.firstname, lastname: user.lastname, email: user.email }, secret, { expiresIn: '24h' }); // Give the user a new token to reset password
            // Save user's new token to the database
            user.save(function (err) {
                if (err) {
                    console.log(err); // If error saving user, log it to console/terminal
                } else {
                    // If user successfully saved to database, create e-mail object
                    var email = {
                        from: 'Localhost Staff, staff@localhost.com',
                        to: user.email,
                        subject: 'Localhost Activation Link Request',
                        text: 'Hello ' + user.firstname + ', You recently requested a new account activation link. Please click on the following link to complete your activation: https://bobo-167921.appspot.com/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.firstname + '</strong>,<br><br>You recently requested a new account activation link. Please click on the link below to complete your activation:<br><br><a href="https://bobo-167921.appspot.com/activate/' + user.temporarytoken + '">https://bobo-167921.appspot.com/activate/</a>'
                    };

                    // Function to send e-mail to user
                    client.sendMail(email, function (err, info) {
                        if (err) console.log(err); // If error in sending e-mail, log to console/terminal
                    });
                    res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!' }); // Return success message to controller
                }
            });
        });
    });


    //Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];//Check for token in body, URL, or headers

        //Check if token is valid and not expired
        if (token) {
            //Function to verify token
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' });//token has expired or is in-valid
                } else {
                    req.decoded = decoded;//Assign to req. variable to be able to use it in next() route ('/me' route)
                    next();//required to leave middleware 
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });//return error if no token was provided
        }

    });

    //route to get the currently looged in user
    router.post('/me', function (req, res) {
        res.send(req.decoded); // return the token required from middleware
    });

    router.get('/getUsers', function(req,res){
        User.find({}, function(err,users){
            if(err) throw err;
            User.findOne({email:req.decoded.email}, function(err,mainUser){
                if(err) throw err;
                if(!mainUser){
                    res.json({success: false, message:"NO user found"});
                }
                else{
                    res.json({success: true, users:users});
                }
            })
        });
    });

    router.get('/expertprofile/:id', function(req,res){
        var getUser = req.params.id;
        User.findOne({email: req.decoded.email}, function(err,mainUser){
            if(err) throw err;
            if(!mainUser){
                res.json({success:false, message:'No user found'});
            }else {
                User.findOne({_id: getUser}, function(err,user){
                    if(err) throw err;
                    if(!user){
                        res.json({success:false, message:'No user found'});
                    }else{
                        res.json({success:true, user: user});
                    }
                });
            }
        });
    });

    router.post('/getUserConnections', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        UserConnection.findOne({ email: email }, function (err, userconnection) {
            if (err) throw err;
            if (userconnection) {
                User.find({ "email": { $in: userconnection.connection } }, function (err, users) {
                    if (err) throw err;
                    //console.log(users);
                    if (users) {
                        res.json({ success: true, userconnectionData: users });
                    }
                    else {
                        res.json({ success: false, message: "NO user connection found" });
                    }
                });
            }
        });
    });

    
    router.post('/getUserPendingConnection', function (req, res) {
        var email;
        if (req.body.email) {
            email = req.body.email;
        }
        UserPendingConnection.find({ receiveremail: email }, function (err, userPendingConnections) {
            if (err) throw err;
            var pendingUsers = [];
            if (userPendingConnections) {
                userPendingConnections.forEach(function (userPendingConnection) {
                    pendingUsers.push(userPendingConnection.senderemail);
                });
                User.find({ "email": { $in: pendingUsers } }, function (err, users) {
                    if (err) throw err;
                    //console.log(users);
                    if (users) {
                        res.json({ success: true, userPendingData: users });
                    } else {
                        res.json({ success: false, message: "NO user connection found" });
                    }
                });
            }
        });
    });
    
    this.addUserConnection = function (email, connection) {
        UserConnection.findOne({ email: email }, function (err, userconnection) {
            if (err) throw err;
            if (userconnection) {
                userconnection.connection.push(connection);
            } else {
                var userconnection = new UserConnection();
                var connections = [];
                connections.push(connection);
                userconnection.email = email;
                userconnection.connection = connections;
            }
            userconnection.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("User Connection Added!");
                }
            });
        });
    }

    router.post('/deleteUser', function (req, res) {
        var receiveremail;
        var pendingEmail;
        if (req.body.receiveremail) {
            receiveremail = req.body.receiveremail;
        }
        if (req.body.pendingEmail) {
            pendingEmail = req.body.pendingEmail;
        }
        // Remove from User Pending Connection
        UserPendingConnection.findOneAndRemove({ receiveremail: receiveremail, senderemail: pendingEmail }).select({}).exec(function (err) {
            if (err) throw err;
        });
        // User Pending Connection
        UserPendingConnection.find({ receiveremail: receiveremail }, function (err, userPendingConnections) {
            if (err) throw err;
            var pendingUsers = [];
            if (userPendingConnections) {
                userPendingConnections.forEach(function (userPendingConnection) {
                    pendingUsers.push(userPendingConnection.senderemail);
                });
                User.find({ "email": { $in: pendingUsers } }, function (err, users) {
                    if (err) throw err;
                    if (users) {
                        res.json({ success: true, userPendingData: users });
                    }
                    else {
                        res.json({ success: false, message: "No Pending connection found!" });
                    }
                });
            }
        });
    });

    router.post('/approveUser', function (req, res) {
        var receiveremail;
        var pendingEmail;
        if (req.body.receiveremail) {
            receiveremail = req.body.receiveremail;
        }
        if (req.body.pendingEmail) {
            pendingEmail = req.body.pendingEmail;
        }
        // Add to  User Connection
        addUserConnection(receiveremail, pendingEmail);
        // Remove from User Pending Connection
        UserPendingConnection.findOneAndRemove({ receiveremail: receiveremail, senderemail: pendingEmail }).select({}).exec(function (err) {
            if (err) throw err;
        });
        var usersPending = false;
        // Both User Connection and User Pending Connection
        UserConnection.findOne({ email: receiveremail }, function (err, userconnection) {
            if (err) throw err;
            UserPendingConnection.find({ receiveremail: receiveremail }, function (err, userPendingConnections) {
                if (err) throw err;
                var pendingUsers = [];
                if (userPendingConnections) {
                    userPendingConnections.forEach(function (userPendingConnection) {
                        pendingUsers.push(userPendingConnection.senderemail);
                    });
                    User.find({ "email": { $in: pendingUsers } }, function (err, users) {
                        if (err) throw err;
                        if (users) {
                            usersPending = users;
                            console.log(usersPending);
                        }
                    });
                }
            });
            if (userconnection) {
                userconnection.connection.push(pendingEmail);
                //console.log(userconnection.connection);
                User.find({ "email": { $in: userconnection.connection } }, function (err, users) {
                    if (err) throw err;
                                        
                    console.log(usersPending);
                    if (users) {
                        res.json({ success: true, userconnectionData: users, userPendingData: usersPending });
                    }
                    else {
                        res.json({ success: false, message: "NO user connection found" });
                    }
                });
            }
        });
    });

    router.post('/createUserPendingConnection', function (req, res) {
        var senderEmail;
        var receiverEmail;
        if (req.body.senderEmail) {
            senderEmail = req.body.senderEmail;
        }
        if(req.body.receiverEmail) {
            receiverEmail = req.body.receiverEmail;
        }
        UserPendingConnection.findOne({ senderemail: senderEmail, receiveremail: receiverEmail }).select({}).exec(function (err, userPendingConnection) {
            if (err) throw err; //throw err if cannot connect
            if (userPendingConnection) {
                userPendingConnection.senderemail = senderEmail;
                userPendingConnection.receiveremail = receiverEmail;
                userPendingConnection.addconneciton = req.body.addconneciton;
            } else {
                var userPendingConnection = new UserPendingConnection();
                userPendingConnection.senderemail = senderEmail;
                userPendingConnection.receiveremail = receiverEmail;
                userPendingConnection.addconneciton = req.body.addconneciton;
            }
            userPendingConnection.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ success: true, message: "User Connection Request Sent!" });
                }
            });
        });
    });


    return router; // return the router object to server
};

