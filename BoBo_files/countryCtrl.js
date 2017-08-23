angular.module('countryControllers', ['authServices', 'countryServices', 'stateServices', 'profileServices', 'fileModelDirective', 'uploadFileServices', 'employerServices','ngMaterial'])

    .controller('countryCtrl', function (Auth, $http, $location, $timeout, Country, State, Profile, $scope, uploadFile, Employer) {
        var app = this;
        $scope.file = {};
        this.Submit = function () {
            $scope.uploading = true;
            // app.filedisabled = false;
            //app.re
            uploadFile.upload($scope.file).then(function (data) {
                if (data.data.success) {
                    $scope.uploading = false;
                    $scope.alert = 'alert alert-success';
                    $scope.message = data.data.message;
                    // app.filedisabled = true;
                    $scope.file = {};


                } else {

                    $scope.uploading = false;
                    $scope.alert = 'alert alert-danger';
                    $scope.message = data.data.message;
                    $scope.file = {};
                }
            })
        }

        //     $scope.stepsModel = []; 
        //     $scope.imageUpload = function(files){
        //         var files = event.target.files;//fileList object

        //         var file = files[0];
        //             var reader = new FileReader();
        //             reader.onload = $scope.imageIsLoaded; 
        //             reader.readAsDataURL(file);
        //     }
        //     $scope.imageIsLoaded = function(e){
        //     $scope.$apply(function() {
        //         $scope.stepsModel.push(e.target.result);
        //     });
        // }

        $scope.stepsModel = [];
        $scope.imageUpload = function (event) {
            var files = event.target.files;//fileList object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }
        }
        $scope.imageIsLoaded = function (e) {
            $scope.$apply(function () {
                $scope.stepsModel.push(e.target.result);
            });
        }
        /////////////////////////////
        this.employmentInfo = function () {
            //console.log("File name? " + $scope.country.companyCode);
            //Header data object
            $scope.empData = {
                email: $scope.main.email,
                companyname: $scope.country.companyCode,
                country: $scope.country.countryCode,
                state: $scope.country.stateCode,
                metropolitan: $scope.country.metroCode,
                titlecategory: $scope.country.titlecategory,
                exacttitle: $scope.country.exacttitle,
                startyear: $scope.country.startyear,
                endyear: $scope.country.endyear
                // hideinfo:$scope.county.hideinfo         
            }
            //if valid data, save data else, show error
            //if (valid) {
            app.errorMsg = false;
            Employer.create($scope.empData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message
                    //console.log("lllllll" + data.data.success);
                    app.successMsg = data.data.message;
                } else {
                    //create an error message
                    app.errorMsg = data.data.message;
                }
            });
        }

        this.getEmployer = function () {
            //Profile data object
            $scope.employerData = {
                email: $scope.main.email
            }
            var countryCode;
            Employer.getEmployer($scope.employerData).then(function (data) {
                if (data.data.employerData) {
                    app.companyCode = data.data.employerData.companyname;
                    app.countryCode = data.data.employerData.country;
                    app.stateCode = data.data.employerData.state;
                    app.metroCode = data.data.employerData.metropolitanarea;
                    app.titlecategory = data.data.employerData.titlecategory;
                    app.exacttitle = data.data.employerData.exacttitle;
                    app.startyear = data.data.employerData.startyear;
                    app.endyear = data.data.employerData.endyear;
                    //app.hideinfo= data.data.employerData.hideinfo;   
                    //Get State
                    if (app.countryCode == "us" || app.countryCode == "ca") {
                        app.stateDisabled = false;
                        app.metroMsg = "";
                        State.getState(app.countryCode).then(function (data) {
                            if (data.data.stateData) {
                                app.stateOption = data.data.stateData;
                            } else {
                                app.stateOption = data.data.message;
                            }
                        });
                    }
                    //Get Metropolitan
                    if (app.countryCode == "") {
                        app.metroDisabled = true;
                    } else {
                        app.metroDisabled = false;
                    }

                    app.countryStateCode = app.countryCode;
                    if (app.stateCode) {
                        //if (app.stateCode == "California") {
                        app.countryStateCode = app.countryCode + "." + app.stateCode;
                        //}
                    }
                    State.getMetropolitan(app.countryStateCode).then(function (data) {
                        if (data.data.metropolitanData) {
                            app.metroOption = data.data.metropolitanData;
                        } else {
                            app.metroOption = data.data.message;
                        }
                    });

                } else {
                    app.employerMsg = data.data.message;
                }
            });
        }


        this.profileUser = function () {
            //console.log("File name? " + $scope.country.profileImage);
            //Header data object
            $scope.headerData = {
                title: $scope.country.title,
                email: $scope.main.email,
                firstname: $scope.main.firstname,
                nickname: $scope.country.nickname,
                middlename: $scope.country.middlename,
                lastname: $scope.main.lastname,
                degree: $scope.country.degree,
                country: $scope.country.countryCode,
                state: $scope.country.stateCode,
                city: $scope.country.city,
                metropolitan: $scope.country.metroCode,
                backgroundImage: $scope.country.backgroundImage,
                profileImage: $scope.country.profileImage
            }
            //if valid data, save data else, show error
            //if (valid) {
            app.errorMsg = false;
            Profile.create($scope.headerData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message
                    app.successMsg = data.data.message;
                } else {
                    //create an error message
                    app.errorMsg = data.data.message;
                }
            });
            // } else {
            //     app.errorMsg = 'Please ensure form is filled out correctly';
            // }
        }

        this.getProfile = function () {
            //Profile data object
            $scope.profileData = {
                email: $scope.main.email
            }
            var countryCode;
            Profile.getProfile($scope.profileData).then(function (data) {
                if (data.data.profileData) {
                    app.title = data.data.profileData.title;
                    app.nickname = data.data.profileData.nickname;
                    app.middlename = data.data.profileData.middlename;
                    app.degree = data.data.profileData.degree;
                    app.countryCode = data.data.profileData.country;
                    app.stateCode = data.data.profileData.state;
                    app.city = data.data.profileData.city;
                    app.metroCode = data.data.profileData.metropolitanarea;
                    app.backgroundImage = data.data.profileData.backgroundImage;
                    app.profileImage = data.data.profileData.profileImage;

                    //Get State
                    if (app.countryCode == "us" || app.countryCode == "ca") {
                        app.stateDisabled = false;
                        app.metroMsg = "";
                        State.getState(app.countryCode).then(function (data) {
                            if (data.data.stateData) {
                                app.stateOption = data.data.stateData;
                            } else {
                                app.stateOption = data.data.message;
                            }
                        });
                    }
                    //Get Metropolitan
                    if (app.countryCode == "") {
                        app.metroDisabled = true;
                    } else {
                        app.metroDisabled = false;
                    }

                    app.countryStateCode = app.countryCode;
                    if (app.stateCode) {
                        //if (app.stateCode == "California") {
                        app.countryStateCode = app.countryCode + "." + app.stateCode;
                        //}
                    }
                    State.getMetropolitan(app.countryStateCode).then(function (data) {
                        if (data.data.metropolitanData) {
                            app.metroOption = data.data.metropolitanData;
                        } else {
                            app.metroOption = data.data.message;
                        }
                    });

                } else {
                    app.profileMsg = data.data.message;
                }
            });
        }

        this.getCountry = function () {
            app.stateDisabled = true;
            app.metroDisabled = true;
            app.countryOption = "empty Country";
            Country.getCountry().then(function (data) {
                if (data.data.countryData) {
                    app.countryOption = data.data.countryData;
                } else {
                    app.countryOption = data.data.message;
                }
            });
        }

        this.getState = function (code) {
            app.stateDisabled = true;
            app.stateOption = "empty State";
            if ($scope.country.countryCode == "us" || $scope.country.countryCode == "ca") {
                app.stateOption = "Select State";
                app.stateDisabled = false;
                app.metroDisabled = true;
                app.metroOption = "";
                State.getState($scope.country.countryCode).then(function (data) {
                    if (data.data.stateData) {
                        app.stateOption = data.data.stateData;
                        //console.log("sfdsfs " + app.stateOption['ca'].name);
                    } else {
                        app.stateOption = data.data.message;
                    }
                });
            } else {
                this.getMetropolitan();
            }
        }

        this.getMetropolitan = function () {
            if ($scope.country.countryCode == "") {
                app.metroDisabled = true;
            } else {
                app.metroDisabled = false;
            }
            app.metroMsg = "empty Metropolitans";
            $scope.countryStateCode = $scope.country.countryCode;
            if ($scope.country.stateCode) {
                //if ($scope.country.stateCode == "California") {
                $scope.countryStateCode = $scope.country.countryCode + '.' + $scope.country.stateCode; // + "." + "ca";
                // }
            }
            State.getMetropolitan($scope.countryStateCode).then(function (data) {
                if (data.data.metropolitanData) {
                    app.metroOption = data.data.metropolitanData;
                } else {
                    app.metroOption = data.data.message;
                }
            });
        }

   });
        ///autocomplete feature
        function autoCompleteController($timeout, $q, $log) {
            var self = this;
            self.simulateQuery = false;
            self.isDisabled = false;
            // list of states to be displayed
            //console.log("states" + states);
            self.states = loadStates();
            self.querySearch = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange = searchTextChange;
            self.newState = newState;
         function newState(state) {
                alert("This functionality is yet to be implemented!");
            }
            function querySearch(query) {
                var results = query ? self.states.filter(createFilterFor(query)) : self.states, deferred;
                if (self.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(results);
                    },
                        Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            }
            function searchTextChange(text) {
                $log.info('Text changed to ' + text);
            }
           function selectedItemChange(item) {
                $log.info('Item changed to ' + JSON.stringify(item));
            }
            //build list of states as map of key-value pairs
           function  loadStates() {
                var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                 Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                 Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                 Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                 North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                 South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                 Wisconsin, Wyoming';
                return allStates.split(/, +/g).map(function (state) {
                    return {
                        value: state.toLowerCase(),
                        display: state
                    };
                });
            }
            //filter function for search query
          function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn (state) {
                    return (state.value.indexOf(lowercaseQuery) === 0);
                };
            }
        }


   // });

