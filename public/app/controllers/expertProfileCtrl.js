angular.module('expertProfileControllers', ['userconnectionServices','userpendingconnectionServices', 'userServices', 'authServices', 'endorsementServices', 'countryServices', 'stateServices', 'profileServices', 'companyServices', 'fileModelDirective', 'maximumWordsValidation', 'uploadFileServices', 'employerServices', 'educationServices', 'expertiseServices', 'hobbyServices', 'availabilityServices', 'ngMaterial', 'ngRightClick' ])

    // .controller('expertProfileCtrl', function (Auth, $http, $location, $timeout, $q, $log, Country, State, Profile,Endorsement, Company, $scope, uploadFile, Employer, Education, Expertise, Hobby, Availability) {
    .controller('expertProfileCtrl', function (Auth, $http, $timeout, $scope, Expertise, State, Profile, EndorsementExpertise,EndorsementRecognition, Hobby,Employer,Education, Company, User,Availability, UserConnection, UserPendingConnection, $routeParams) {
        var app = this;
        app.loading = true;
        app.errorM = false;
        $scope.rating = 0;
        $scope.ratings = [{
            current: 5,
            max: 10
        }, {
            current: 3,
            max: 5
        }];

        var temp = $routeParams.email;
        var data = temp.split('&');
        //console.log(data);
        if (data.length > 1) {
            $routeParams.email = data[0];
            $scope.regData = {
                email: atob(data[1])
            }            
            //console.log($scope.regData);
            window.open('/register/'+temp, this.target, 'left=300,top=90,height=670,width=800');
            // User.checkEmail($scope.regData).then(function (data) {
            //     if (data.data.success) {
            //         window.open('/register', this.target, 'left=300,top=90,height=670,width=800');
            //     }
            // });
        }
        

        $scope.getSelectedRating = function (rating) {
            console.log(rating);
        }
        // User.getUsers().then(function(data){
        //     if(data.data.success){
        //         app.users = data.data.users;
        //         app.loading = false;
        //     }else{
        //         app.errorM = data.data.message;
        //     }
        // });
        // User.getUser($routeParams.id).then(function(id){
        //     if(data.data.success){
        //         $scope.newprofile = data.data.user;
        //     }
        // })
        //right click menuitems callback functions respectively
        $scope.isApproved = function () {
            $scope.pendingUser = {
                receiveremail: $scope.main.email,
                pendingEmail: $scope.pendingUserEmail
            }
            UserPendingConnection.approveUser($scope.pendingUser).then(function (data) {
                if (data.data.success) {
                    var pendingUserArr = [];
                    //console.log(data.data.userPendingData);
                    for (userIndex in data.data.userPendingData) {
                        var encodedEmail = btoa(data.data.userPendingData[userIndex].email);
                        data.data.userPendingData[userIndex].encodedEmail = encodedEmail;
                        pendingUserArr.push(data.data.userPendingData[userIndex]);
                    }
                    app.pendingUsers = pendingUserArr;
                    
                    var usersArr = [];
                    //console.log(data.data.userconnectionData);
                    for (userIndex in data.data.userconnectionData) {
                        var encodedEmail = btoa(data.data.userconnectionData[userIndex].email);
                        data.data.userconnectionData[userIndex].encodedEmail = encodedEmail;
                        usersArr.push(data.data.userconnectionData[userIndex]);
                    }
                    app.users = usersArr;
                } else {
                    app.errorPendingUserMsg = data.data.message;
                }
            });
        };
        $scope.isDeleted = function () {
            $scope.pendingUser = {
                receiveremail: $scope.main.email,
                pendingEmail: $scope.pendingUserEmail
            }
            UserPendingConnection.deleteUser($scope.pendingUser).then(function (data) {
                if (data.data.success) {
                    var pendingUserArr = [];
                    //console.log(data.data.userPendingData);
                    for (userIndex in data.data.userPendingData) {
                        var encodedEmail = btoa(data.data.userPendingData[userIndex].email);
                        data.data.userPendingData[userIndex].encodedEmail = encodedEmail;
                        pendingUserArr.push(data.data.userPendingData[userIndex]);
                    }
                    //console.log(pendingUserArr);
                    app.pendingUsers = pendingUserArr;
                    
                    // var usersArr = [];
                    // console.log(data.data.userconnectionData);
                    // for (userIndex in data.data.userconnectionData) {
                    //     var encodedEmail = btoa(data.data.userconnectionData[userIndex].email);
                    //     data.data.userconnectionData[userIndex].encodedEmail = encodedEmail;
                    //     usersArr.push(data.data.userconnectionData[userIndex]);
                    // }
                    // app.users = usersArr;
                } else {
                    app.errorPendingUserMsg = data.data.message;
                }
            });
        };
        $scope.isBlocked = function () {
            alert("You have Blocked ");
        };
        $scope.someFunction = function(pendingUser) {
            // console.log("Apoorva: "+ pendingUser.email);
            // console.log("main: "+ $scope.main.email);
            $scope.pendingUserEmail = pendingUser.email;
        }
        //Right click menuItems array with objects
        $scope.menuItems = [
            {
                text: "Approve", //menu option text 
                callback: $scope.isApproved,  //$scope is required to call "sayHello" method
                disabled: false //No click event. Grayed out option. 

            },
            {
                text: "Delete",
                callback: $scope.isDeleted, //function to be called on click  
                disabled: false
            },
            {
                text: "Block",
                callback: $scope.isBlocked, //function to be called on click  
                disabled: false
            },
        ];
        
        $scope.showConnectionRequestButton = true;
        $scope.currentEmail = atob($routeParams.email);
        $scope.mainEmail = $scope.main.email;
        if($scope.currentEmail == $scope.mainEmail) {
            $scope.showConnectionRequestButton = false;
        } 

        $scope.showEndorsementRequestButton = false;
        $scope.showEndorsementProfile = false;
        // console.log("current Email: "+ $scope.currentEmail);
        // console.log("main Email: "+ $scope.mainEmail);
        if($scope.currentEmail != $scope.mainEmail) {
            $scope.showEndorsementRequestButton = true;
        }

        this.getUserConnection = function () {
            // var temp = $routeParams.email;
            // var data = temp.split('&');
            // console.log("data length: "+ data.length);
            // if(data.length>1) {
            //     console.log("open popup");
            //     window.open('/register', this.target,'left=300,top=90,height=400,width=800');
            // }
            $scope.userData = {
                //email: $scope.main.email
                //email: atob($scope.main.encodedEmail)                
                email: atob($routeParams.email)
            }
            //console.log($scope.userData.email);
            UserConnection.getUserConnections($scope.userData).then(function (data) {
                if (data.data.success) {
                    var tempUsers = [];
                    for (userIndex in data.data.userconnectionData) {
                        var email = data.data.userconnectionData[userIndex].email;
                        if(email == $scope.mainEmail) {
                            $scope.showConnectionRequestButton = false;
                        }
                        var encodedEmail = btoa(email);                        
                        data.data.userconnectionData[userIndex].encodedEmail = encodedEmail;
                        tempUsers.push(data.data.userconnectionData[userIndex]);
                    }
                    app.users = tempUsers;
                } else {
                    app.errorM = data.data.message;
                }
            });
        }
        this.getUserPendingConnection = function() {
            $scope.userData = {
                email: atob($routeParams.email)
            }
            UserPendingConnection.getUserPendingConnection($scope.userData).then(function (data) {
                if (data.data.success) {
                    var tempUsers = [];
                    for (userIndex in data.data.userPendingData) {
                        var email = data.data.userPendingData[userIndex].email;
                        if(email == $scope.currentEmail) {
                            $scope.showConnectionRequestButton = false;
                        }
                        var encodedEmail = btoa(email);
                        data.data.userPendingData[userIndex].encodedEmail = encodedEmail;
                        tempUsers.push(data.data.userPendingData[userIndex]);
                    }
                    app.pendingUsers = tempUsers;
                } else {
                    app.errorPendingUserMsg = data.data.message;
                }
            });
        }

        this.getAvailabilities = function () {
            $scope.availableData = {
                email: atob($routeParams.email)
            }
            //$scope.country.nooptionselected = false;
            Availability.getAvailabilities($scope.availableData).then(function (data) {
                if (data.data.success) {
                    //console.log(data.data.availableData);
                    if (data.data.availableData) {
                        app.nooptionselected = data.data.availableData.nooptionselected;
                        app.contractwork = data.data.availableData.contractwork;
                        app.parttimework = data.data.availableData.parttimework;
                        app.fulltimework = data.data.availableData.fulltimework;
                        app.servicework = data.data.availableData.servicework;
                        app.consultingwork = data.data.availableData.consultingwork;
                        app.probonowork = data.data.availableData.probonowork;
                    }
                }
                else {
                    app.availabilityMsg = data.data.message;
                }
            });
        }

        this.getEmployment = function () {
            $scope.employerData = {
                email: atob($routeParams.email)
            }
            Employer.getEmployment($scope.employerData).then(function (data) {
                if (data.data.success) {
                    if (Object.keys(data.data.employmentData).length == 0) {
                        app.employmentMsg = "Employment not available yet";
                    } else {
                        app.employments = data.data.employmentData;
                        for (index in app.employments) {
                            var cmpData = {
                                companyname: app.employments[index].empcompanyCode,
                                companyId: index
                            }
                            Company.getCompanyByName(cmpData).then(function (data) {
                                if (data.data.success) {
                                    app.employments[data.data.companyIdData].empcompany = data.data.companyData;
                                }
                            });
                        }
                    }
                } else {
                    app.employmentMsg = data.data.message;
                }
            });
        }

        this.getEducation = function () {
            $scope.educationData = {
                email: atob($routeParams.email)
            }
            app.educationMsg = false;
            Education.getEducation($scope.educationData).then(function (data) {
                if (data.data.success) {
                    if(Object.keys(data.data.educationData).length==0) {
                        app.educationMsg = "Education not available yet";
                    } else {
                        app.educations = data.data.educationData;
                        for (index in app.educations) {
                            var cmpData = {
                                companyname: app.educations[index].empcompanyCode,
                                companyId: index
                            }
                            Company.getCompanyByName(cmpData).then(function (data) {
                                if (data.data.success) {
                                    app.educations[data.data.companyIdData].educompany = data.data.companyData;
                                }
                            });
                        }
                    }
                } else {
                    app.educationMsg = data.data.message;
                }
            });
        }
        
        this.getProfile = function () {
            // console.log(atob($routeParams.email));
            // console.log("Ritesh: "+ atob($scope.main.encodedEmail));
            $scope.profileData = {
                //email: $scope.main.email
                //email: atob($scope.main.encodedEmail)
                email: atob($routeParams.email)
            }
            
            Profile.getProfile($scope.profileData).then(function (data) {
                app.profileImage = false;
                if (data.data.profileData) {

                    app.title = data.data.profileData.title;
                    app.firstname = data.data.profileData.firstname;
                    app.lastname = data.data.profileData.lastname;
                    app.nickname = data.data.profileData.nickname;
                    app.middlename = data.data.profileData.middlename;
                    app.degree = data.data.profileData.degree;
                    // app.countryCode = data.data.profileData.country;
                    app.stateCode = data.data.profileData.state;
                    // app.metroCode = data.data.profileData.metropolitanarea;
                    var countryCode = data.data.profileData.country;
                    var stateCode = data.data.profileData.state;
                    var metroCode = data.data.profileData.metropolitanarea;
                    app.backgroundImage = data.data.profileData.backgroundImage;
                    app.profileImage = data.data.profileData.profileImage;
                    app.profileImageUploaded = data.data.profileData.profileImage;
                    getDegree(app.degree);
                    // getLocation(countryCode, stateCode, metroCode);
                    
                    if (countryCode == "us") {
                        app.countryCode = "USA";
                    }
                    else if (countryCode == "ca") {
                        app.countryCode = "Canada";
                    } else {
                        app.stateCode = "";
                    }
                    
                    app.metroCode = data.data.metropolitanData.name;
                    // State.getMetropolitanByCode(metroCode).then(function (data) {
                    //     if (data.data.metropolitanData) {
                    //         app.metroCode = data.data.metropolitanData.name;
                    //     } else {
                    //         app.metroCode = data.data.message;
                    //     }
                    // });
                } else {
                    app.profileMsg = data.data.message;
                }
            });
        }


        function getDegree(degree) {
            var degreeArr = degree.split("/");
            app.degreelist = degreeArr.join(", ");
        }

        function getLocation(countryCode, stateCode, metroCode) {
            if (countryCode == "us") {
                app.countryCode = "USA";
            }
            else if (countryCode == "ca") {
                app.countryCode = "Canada";
            } else {
                app.stateCode = "";
            }
            getMetropolitanByCode(metroCode);
        }

        function getMetropolitanByCode(metroCode) {
            State.getMetropolitanByCode(metroCode).then(function (data) {
                if (data.data.metropolitanData) {
                    app.metroCode = data.data.metropolitanData.name;
                } else {
                    app.metroCode = data.data.message;
                }
            });
        }

        this.sendConnectionRequest = function () {
        
            $scope.pendingConnectionData = {
                senderEmail : $scope.main.email,
                receiverEmail : atob($routeParams.email),
                addconneciton : false
            }
            // console.log($scope.pendingConnectionData);
            UserPendingConnection.createUserPendingConnection($scope.pendingConnectionData).then(function (data) {
                if (data.data.success) {
                    UserPendingConnection.sendConnectionRequestEmail($scope.pendingConnectionData).then(function (data) {
                        app.connectionRequestMsg = data.data.message;
                        $timeout(function () {
                            app.connectionRequestMsg = false;
                        }, 2000);
                    });
                }
            });
        };

        this.sendEndorsementRequest = function () {
            $scope.showEndorsementProfile = true;
            document.getElementById("expertEndorseme").value = "Endorsement Available";
        };


        this.getExpertise = function () {
            $scope.expertData = {
                //email: $scope.main.email
                //email: atob($scope.main.encodedEmail)
                email: atob($routeParams.email)
            }
            //var experties = [];
            app.expertise = false;
            Expertise.getExpertExpertise($scope.expertData).then(function (data) {
                if (data.data.success) {
                    if (Object.keys(data.data.expertiseData).length == 0) {
                        app.expertise = false;
                    } else {
                        app.expertise = data.data.expertiseData;
                        //console.log(app.expertise);
                        for(index in app.expertise) {
                            // console.log(app.expertise[index].selectedExpertiseSource[0]);
                            var cmpData = {
                                companies: app.expertise[index].selectedExpertiseSource,
                                expertiseId: index
                            }
                            Company.getCompanyByIds(cmpData).then(function(data){
                                if (data.data.success) {
                                    app.expertise[data.data.expertiseIdData].selectedExpertCompanies = data.data.companyData;
                                }
                            });
                        }
                    }
                    // app.expertiseSource = data.data.companiesData;
                }
            });
        }

        
        $scope.printCompany = function (cmp) {
            console.log("ritesh");
            // console.log(cmp);
        }
        this.printCompany1 = function (cmp) {

            $scope.expertData = {
                // companies: expertiseSource.selectedExpertiseSource
                companies: cmp
            }
            var expertCompanies = [];
            // Company.getCompanyByIds($scope.expertData).then(function (data) {
            //     if (data.data.success) {
            //         app.expertCompanies = data.data.companyData;
            //         // return data.data.companyData;
            //     }
            // });
        }

        this.submitRecognitionEndorsement = function () {

            // console.log($scope.expertprofile.creativeRadio);
            // console.log($scope.expertprofile.creativityRate);
            var creativityRate = "";
            var proactivityRate = "";
            var reliabilityRate = "";
            var managabilityRate = "";

            if($scope.expertprofile.creativityRate) {
                creativityRate = $scope.expertprofile.creativityRate
            } 
            if($scope.expertprofile.proactivityRate) {
                proactivityRate = $scope.expertprofile.proactivityRate
            } 
            if($scope.expertprofile.reliabilityRate) {
                reliabilityRate = $scope.expertprofile.reliabilityRate
            } 
            if($scope.expertprofile.managabilityRate) {
                managabilityRate = $scope.expertprofile.managabilityRate
            }

            $scope.recognitionData = {
                email: atob($routeParams.email),
                endorseremail: $scope.main.email,
                creativityRate: creativityRate,
                proactivityRate: proactivityRate,
                reliabilityRate: reliabilityRate,
                managabilityRate: managabilityRate
            }

            //console.log($scope.recognitionData);
            app.recognitionErrorMsg = false;
            app.recognitionSuccessMsg = false;
            EndorsementRecognition.createEndorsementRecognition($scope.recognitionData).then(function (data) {
                if (data.data.success) {
                    app.recognitionSuccessMsg = data.data.message;
                    $timeout(function () {
                        app.recognitionSuccessMsg = false;
                    }, 2000);
                } else {
                    app.recognitionErrorMsg = data.data.message;
                    $timeout(function () {
                        app.recognitionErrorMsg = false;
                    }, 2000);
                }
            });
        }

        this.submitExpertiseEndorsement = function () {
            //console.log("IS pic coming: " + $scope.file.upload.name);

            $scope.edorsementData = {
                //email: $scope.main.email,
                //email: atob($scope.main.encodedEmail)
                email: atob($routeParams.email),
                endorseremail: $scope.main.email,
                expertiseid: $scope.expertprofile.expId,
                rateskill: $scope.expertprofile.rateskill,
                comment: $scope.expertprofile.expertcomment
            }
            //console.log($scope.edorsementData);
            app.endorsementErrorMsg = false;
            app.endorsementSuccessMsg = false;
            EndorsementExpertise.createEndorsementExpertise($scope.edorsementData).then(function (data) {
                if (data.data.success) {
                    app.endorsementSuccessMsg = data.data.message;
                    $timeout(function () {
                        app.endorsementSuccessMsg = false;
                    }, 2000);
                } else {
                    app.endorsementErrorMsg = data.data.message;
                    $timeout(function () {
                        app.endorsementErrorMsg = false;
                    }, 2000);
                }
            });
        }

        this.saveEndorsementViewExpert = function() {
            $scope.endorsementData = {
                //email: $scope.main.email,
                //email: atob($scope.main.encodedEmail)
                email: atob($routeParams.email),
                expertiseid: $scope.expertprofile.expId,
                rateskill: $scope.expertprofile.rateskill,
                comment: $scope.expertprofile.expertcomment
            }
            //console.log($scope.endorsementData);
            app.endorsementErrorMsg = false;
            app.endorsementSuccessMsg = false;
            EndorsementExpertise.createEndorsementExpertise($scope.endorsementData).then(function (data) {
                if (data.data.success) {
                    app.endorsementSuccessMsg = data.data.message;
                    $scope.showEndorsementProfile = false;
                    $timeout(function () {
                        app.endorsementSuccessMsg = false;
                    }, 2000);
                } else {
                    app.endorsementErrorMsg = data.data.message;
                    $timeout(function () {
                        app.endorsementErrorMsg = false;
                    }, 2000);
                }
            });
        }
        
        this.selectRecognition = function(name) {
            if(name=='creativeRadio') {
                document.getElementById('creativityRate').disabled = false;
                document.getElementById('proactivityRate').disabled = true;
                document.getElementById('reliabilityRate').disabled = true;
                document.getElementById('managabilityRate').disabled = true;
                // $scope.expertprofile.proactivityRate = "";
                // $scope.expertprofile.reliabilityRate = "";
                // $scope.expertprofile.managabilityRate = "";
            } else if (name=='productiveRadio') {
                document.getElementById('creativityRate').disabled = true;
                document.getElementById('proactivityRate').disabled = false;
                document.getElementById('reliabilityRate').disabled = true;
                document.getElementById('managabilityRate').disabled = true;
                // $scope.expertprofile.creativityRate = "";
                // $scope.expertprofile.reliabilityRate = "";
                // $scope.expertprofile.managabilityRate = "";
            } else if (name=='reliabilityRadio') {
                document.getElementById('creativityRate').disabled = true;
                document.getElementById('proactivityRate').disabled = true;
                document.getElementById('reliabilityRate').disabled = false;
                document.getElementById('managabilityRate').disabled = true;
                // $scope.expertprofile.creativityRate = "";
                // $scope.expertprofile.proactivityRate = "";
                // $scope.expertprofile.managabilityRate = "";
            } else if (name=='managabilityRadio') {
                document.getElementById('creativityRate').disabled = true;
                document.getElementById('proactivityRate').disabled = true;
                document.getElementById('reliabilityRate').disabled = true;
                document.getElementById('managabilityRate').disabled = false;
                // $scope.expertprofile.creativityRate = "";
                // $scope.expertprofile.proactivityRate = "";
                // $scope.expertprofile.reliabilityRate = "";
            }
        }

        this.selectMainIdea = function (obj, index) {
            var i = 0;
            for (o in obj) {
                if (i == index) {
                    obj[o].expRadio = true;
                    $scope.expertprofile.expId = obj[o].expertiseid;
                } else {
                    obj[o].expRadio = false;
                }
                i++;
                obj[o].rateskill = false;
                obj[o].comment = false;
            }
            $scope.expertprofile.expertcomment = "";
            $scope.expertprofile.rateskill = "";
        }

        this.selectRateSkill = function (obj, index) {
            var i = 0;
            for (o in obj) {
                if (i == index) {
                    obj[o].comment = true;
                } else {
                    obj[o].comment = false;
                }
                i++;
            }
        }

        this.getHobbies = function () {
            $scope.hobbyData = {
                //email: $scope.main.email
                //email: atob($scope.main.encodedEmail)
                email: atob($routeParams.email)
            }
            Hobby.getHobbies($scope.hobbyData).then(function (data) {
                if (data.data.success) {
                    var hobbyLength = 0; var max = 0;
                    $scope.hobgeneralindoor = [];
                    if (data.data.hobbyData.generalindoor) {
                        var indoorList = data.data.hobbyData.generalindoor.split(',');
                        for (i in indoorList) {
                            if (indoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobgeneralindoor.push(indoorList[i].toString());
                            }
                        }
                    }
                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobgeneraloutdoor = [];
                    if (data.data.hobbyData.generaloutdoor) {
                        var outdoorList = data.data.hobbyData.generaloutdoor.split(',');
                        for (i in outdoorList) {
                            if (outdoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobgeneraloutdoor.push(outdoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobcollectionindoor = [];
                    if (data.data.hobbyData.collectionindoor) {
                        var collectionindoorList = data.data.hobbyData.collectionindoor.split(',');
                        for (i in collectionindoorList) {
                            if (collectionindoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobcollectionindoor.push(collectionindoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobcollectionoutdoor = [];
                    if (data.data.hobbyData.collectionoutdoor) {
                        var collectionoutdoorList = data.data.hobbyData.collectionoutdoor.split(',');
                        for (i in collectionoutdoorList) {
                            if (collectionoutdoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobcollectionoutdoor.push(collectionoutdoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobcompetitionindoor = [];
                    if (data.data.hobbyData.competitionindoor) {
                        var competitionindoorList = data.data.hobbyData.competitionindoor.split(',');
                        for (i in competitionindoorList) {
                            if (competitionindoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobcompetitionindoor.push(competitionindoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobcompetitionoutdoor = [];
                    if (data.data.hobbyData.competitionoutdoor) {
                        var competitionoutdoorList = data.data.hobbyData.competitionoutdoor.split(',');
                        for (i in competitionoutdoorList) {
                            if (competitionoutdoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobcompetitionoutdoor.push(competitionoutdoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobobservationindoor = [];
                    if (data.data.hobbyData.observationindoor) {
                        var observationindoorList = data.data.hobbyData.observationindoor.split(',');
                        for (i in observationindoorList) {
                            if (observationindoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobobservationindoor.push(observationindoorList[i].toString());
                            }
                        }
                    }

                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    hobbyLength = 0;
                    $scope.hobobservationoutdoor = [];
                    if (data.data.hobbyData.observationoutdoor) {
                        var observationoutdoorList = data.data.hobbyData.observationoutdoor.split(',');
                        for (i in observationoutdoorList) {
                            if (observationoutdoorList[i].toString() != "") {
                                hobbyLength++;
                                $scope.hobobservationoutdoor.push(observationoutdoorList[i].toString());
                            }
                        }
                    }
                    if (hobbyLength > max) {
                        max = hobbyLength;
                    }
                    app.maxHobbyLength = max;
                }
                else {
                    app.hobbyMsg = data.data.message;
                }
            });
        }        

        this.getMaxTimes = function (n) {
            return new Array(n);
        };
        
        this.getRemainingTimes = function (n) {
            var remainingSize = 10 - n;
            // console.log(remainingSize);
            // var x = new Array(remainingSize);
            // for(var i=1;i<remainingSize;i++) {
            //     x.push(i);
            // }
            // return x;
            return new Array(remainingSize);
        };

        this.getTimes = function (n) {
            var x = new Array(n);
            for(var i=1;i<n;i++) {
                x.push(i);
            }
            return x;
            // return new Array(n);
        };

    })
    .directive('starRating', function () {
        return {
            restrict: 'A',
            template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
            scope: {
                ratingValue: '=',
                max: '=',
                onRatingSelected: '&'
            },
            link: function (scope, elem, attrs) {

                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled: i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function (index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating: index + 1
                    });
                };

                scope.$watch('ratingValue', function (oldVal, newVal) {
                    if (newVal) {
                        updateStars();
                    }
                });
            }
        }
    });
    // .controller('editCtrl', function(){
    //     // var app = this;
    //     // app.everyProfile = function()

    // });

