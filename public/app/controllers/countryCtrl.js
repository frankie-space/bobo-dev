angular.module('countryControllers', ['authServices', 'countryServices', 'stateServices', 'profileServices', 'companyServices', 'fileModelDirective','maximumWordsValidation', 'uploadFileServices', 'employerServices','educationServices','expertiseServices', 'hobbyServices','availabilityServices', 'ngMaterial'])

    .controller('countryCtrl', function (Auth, $http, $location, $timeout, $q, $log, Country, State, Profile, Company, $scope, uploadFile, Employer, Education,Expertise, Hobby,Availability) {
        var app = this;
        $scope.file = {};
        $scope.empClearEmployment = false;
        $scope.eduClearEducation = false;
        $scope.expClearExpertise = false;

        $scope.starrating ={
          name:  '&#9734'
        }
        // print STAR for starrating dynamically
        this.getTimes = function (n) {
            return new Array(n);
        };
    
//         $scope.menus = [
//   {label: 'Approve',   action: 'callApprove',   active: true},
//   {label: 'Delete', action: 'deleteItem', active: true},
//   {label: 'Block',   action: 'blockRequest',   active: false}
// ];
// $scope.deleteItem = function(arg){
//   console.warn('deleted ...')
// };
 
// $scope.callApprove = function(arg){
//   console.info('View Call, another method')
// };


       // $scope.country.expincludeinsearch = true;

        // this.includeInSearch= function(){
        //     $scope.country.expincludeinsearch= false;
        // }
        // this.uncheckSearch = function (companyNumber) {  
        //     if(companyNumber==0){      
        //     $scope.expertise.option_new.expincludeinsearch= true;            
        // }
        // }
//         this.yearValidation = function(year,ev){
//             var text = /^[0-9]+$/;
//   if(ev.type=="blur" || year.length==4 && ev.keyCode!=8 && ev.keyCode!=46) {
//     if (year != 0) {
//         if (year.length != 4) {
//             alert("Year is not proper. Please check");
//             return false;
//         }
//         var current_year=new Date().getFullYear();
//         if((year < 1920) || (year > current_year))
//             {
//             alert("Year should be in range 1920 to current year");
//             return false;
//             }
//         return true;
//     } }
//         }

/***************************************START OF AVAILABILITY SECTION CODE********************************************************************************** */
        this.uncheckAll = function () {
            $scope.country.contractwork = false;
            $scope.country.parttimework = false;
            $scope.country.fulltimework = false;
            $scope.country.servicework = false;
            $scope.country.consultingwork = false;
            $scope.country.probonowork = false;
        }
        this.uncheckRadio = function () {        
            $scope.country.nooptionselected = false;            
        }
        this.submitAvailabilities = function () {
            $scope.availableData = {
                email: $scope.main.email
            }
            
            //Header data object
            $scope.availabilitiesData = {
                email: $scope.main.email,
                nooptionselected: $scope.country.nooptionselected,
                contractwork: $scope.country.contractwork,
                parttimework: $scope.country.parttimework,
                fulltimework: $scope.country.fulltimework,
                servicework: $scope.country.servicework,
                consultingwork: $scope.country.consultingwork,
                probonowork: $scope.country.probonowork
            }
            // console.log($scope.availabilitiesData);
            app.availErrorMsg = false;
            app.availSuccessMsg = false;
            Availability.createAvailabilities($scope.availabilitiesData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message
                    app.availSuccessMsg = data.data.message;
                    $timeout(function () {
                        app.availSuccessMsg = false;
                    }, 2000);
                } else {
                    //create an error message
                    app.availErrorMsg = data.data.message;
                    $timeout(function () {
                        app.availErrorMsg = false;
                    }, 2000);
                }
            });
        }
        this.getAvailabilities = function () {
            $scope.availableData = {
                email: $scope.main.email
            }
            //$scope.country.nooptionselected = false;
            Availability.getAvailabilities($scope.availableData).then(function (data) {
                if (data.data.success) {
                    // console.log(data.data.availableData);
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



/***************************************END OF AVAILABILITY SECTION CODE********************************************************************************** */
        
/***************************************START OF EXPERTISE SECTION CODE********************************************************************************** */
           /*****Expertise object creation */
            $scope.expertise = {
            options: [],
            //option_new: { testTitle: '' }
            //read all write all, create json object 
            //person profile, 
             option_new: {
                expertiseid:'',
                expmainidea: '', 
                Text: '', 
                expertiseSource:[],
                selectedExpertiseSource:[],                
                exprateskill: '',
                exphidefrompublic:'',
                expincludeinsearch:true
             }
        };/*****End of Expertise object creation **************/
        
        /*********MAIN IDEA TEXT FIELD 10 WORDS COUNT LIMIT STARTS************* */
         app.CharacterTotalLength = 0;
        app.WORDS_MAX = 10; // changeable
        app.WordsTotalLength=0;
        app.expmainidea = "";
        app.FontTotalStyle={'color':'red'};

        this.Alphabet = function(character){
            var numericChar = character.charCodeAt(character);
            //32 is numeric character for space. http://www.december.com/html/spec/codes.html
            
            if(numericChar== 32) {
                return false;
            } else {
                return true;
            }
    }
           this.UpdateTotalLengths = function (companyNumber) {
            if (companyNumber == 0) {
                app.expmainidea = $scope.expertise.option_new.expmainidea;
                app.CharacterTotalLength = $scope.expertise.option_new.expmainidea.length;
                $scope.expertise.option_new.WordsTotalLength = 0;
                if ($scope.expertise.option_new.expmainidea.length == 1 && $scope.expertise.option_new.expmainidea[0] != ' ') {
                    $scope.expertise.option_new.WordsTotalLength = 1;
                }                
                for (var i = 1; i < $scope.expertise.option_new.expmainidea.length; i++) {                    
                    if (this.Alphabet($scope.expertise.option_new.expmainidea[i]) && !this.Alphabet($scope.expertise.option_new.expmainidea[i - 1])) {
                        $scope.expertise.option_new.WordsTotalLength++;
                        if ($scope.expertise.option_new.WordsTotalLength == app.WORDS_MAX + 1) {                            
                            $scope.expertise.option_new.WordsTotalLength--;
                            $scope.expertise.option_new.expmainidea = $scope.expertise.option_new.expmainidea.substring(0, i);
                            //continue;
                            return;
                        }
                    } else if (this.Alphabet($scope.expertise.option_new.expmainidea[i]) && this.Alphabet($scope.expertise.option_new.expmainidea[i - 1])) {                        
                        if ($scope.expertise.option_new.WordsTotalLength == 0) {
                            $scope.expertise.option_new.WordsTotalLength = 1;
                        }
                    } else if (!this.Alphabet($scope.expertise.option_new.expmainidea[i]) && !this.Alphabet($scope.expertise.option_new.expmainidea[i - 1])) {
                        continue;
                    } else if (!this.Alphabet($scope.expertise.option_new.expmainidea[i]) && this.Alphabet($scope.expertise.option_new.expmainidea[i - 1])) {
                        continue;
                    }
                }
            } else {
                app.expmainidea = $scope.expertise.options[companyNumber - 1].expmainidea;
                app.CharacterTotalLength = app.expmainidea.length;
                $scope.expertise.options[companyNumber - 1].WordsTotalLength = 0;
                if ($scope.expertise.options[companyNumber - 1].expmainidea.length == 1 && $scope.expertise.options[companyNumber - 1].expmainidea[0] != ' ') {
                    $scope.expertise.options[companyNumber - 1].WordsTotalLength = 1;
                }
                for (var i = 1; i < $scope.expertise.options[companyNumber - 1].expmainidea.length; i++) {
                    if (this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i]) && !this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i - 1])) {
                        $scope.expertise.options[companyNumber - 1].WordsTotalLength++;
                        if ($scope.expertise.options[companyNumber - 1].WordsTotalLength == app.WORDS_MAX + 1) {
                            $scope.expertise.options[companyNumber - 1].WordsTotalLength--;
                            $scope.expertise.options[companyNumber - 1].expmainidea = $scope.expertise.options[companyNumber - 1].expmainidea.substring(0, i);
                            return;
                        }
                    } else if (this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i]) && this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i - 1])) {
                        if ($scope.expertise.options[companyNumber - 1].WordsTotalLength == 0) {
                            $scope.expertise.options[companyNumber - 1].WordsTotalLength = 1;
                        }
                    } else if (!this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i]) && !this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i - 1])) {
                        continue;
                    } else if (!this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i]) && this.Alphabet($scope.expertise.options[companyNumber - 1].expmainidea[i - 1])) {
                        continue;
                    }
                }
            }
        }
        /*********MAIN IDEA TEXT FIELD 10 WORDS COUNT LIMIT ENDS************* */
        /*  ******WORD COUNT LIMIT FUNCTION ENDS FOR EXPERTISE SECTION******* */
        app.CharacterLength = 0;
        app.WORDS_MAXIMUM = 250; // changeable
        app.WordsLength=0;
        app.Text = "";
        app.FontStyle={'color':'red'};
          
        this.IsAlphabet = function(character){
            
            var numeric_char = character.charCodeAt(character);
            //32 is numeric character for space. http://www.december.com/html/spec/codes.html
            
            if(numeric_char== 32) {
                return false;
            } else {
                return true;
            }
            // if(numeric_char>64 && numeric_char<91){// A-Z    
            //     return true;
            // }
            // if(numeric_char>96 && numeric_char<123){// a-z
            //     return true;
            // }
            //     return false;
        }
        //this.UpdateLengths = function ($event) {
        this.UpdateLengths = function (companyNumber) {
            if (companyNumber == 0) {
                app.Text = $scope.expertise.option_new.Text;
                app.CharacterLength = $scope.expertise.option_new.Text.length;
                $scope.expertise.option_new.WordsLength = 0;
                if ($scope.expertise.option_new.Text.length == 1 && $scope.expertise.option_new.Text[0] != ' ') {
                    $scope.expertise.option_new.WordsLength = 1;
                }                
                for (var i = 1; i < $scope.expertise.option_new.Text.length; i++) {                    
                    if (this.IsAlphabet($scope.expertise.option_new.Text[i]) && !this.IsAlphabet($scope.expertise.option_new.Text[i - 1])) {
                        $scope.expertise.option_new.WordsLength++;
                        if ($scope.expertise.option_new.WordsLength == app.WORDS_MAXIMUM + 1) {                            
                            $scope.expertise.option_new.WordsLength--;
                            $scope.expertise.option_new.Text = $scope.expertise.option_new.Text.substring(0, i);
                            //continue;
                            return;
                        }
                    } else if (this.IsAlphabet($scope.expertise.option_new.Text[i]) && this.IsAlphabet($scope.expertise.option_new.Text[i - 1])) {                        
                        if ($scope.expertise.option_new.WordsLength == 0) {
                            $scope.expertise.option_new.WordsLength = 1;
                        }
                    } else if (!this.IsAlphabet($scope.expertise.option_new.Text[i]) && !this.IsAlphabet($scope.expertise.option_new.Text[i - 1])) {
                        continue;
                    } else if (!this.IsAlphabet($scope.expertise.option_new.Text[i]) && this.IsAlphabet($scope.expertise.option_new.Text[i - 1])) {
                        continue;
                    }
                }
            } else {
                app.Text = $scope.expertise.options[companyNumber - 1].Text;
                app.CharacterLength = app.Text.length;
                $scope.expertise.options[companyNumber - 1].WordsLength = 0;
                if ($scope.expertise.options[companyNumber - 1].Text.length == 1 && $scope.expertise.options[companyNumber - 1].Text[0] != ' ') {
                    $scope.expertise.options[companyNumber - 1].WordsLength = 1;
                }
                for (var i = 1; i < $scope.expertise.options[companyNumber - 1].Text.length; i++) {
                    if (this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i]) && !this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i - 1])) {
                        $scope.expertise.options[companyNumber - 1].WordsLength++;
                        if ($scope.expertise.options[companyNumber - 1].WordsLength == app.WORDS_MAXIMUM + 1) {
                            $scope.expertise.options[companyNumber - 1].WordsLength--;
                            $scope.expertise.options[companyNumber - 1].Text = $scope.expertise.options[companyNumber - 1].Text.substring(0, i);
                            return;
                        }
                    } else if (this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i]) && this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i - 1])) {
                        if ($scope.expertise.options[companyNumber - 1].WordsLength == 0) {
                            $scope.expertise.options[companyNumber - 1].WordsLength = 1;
                        }
                    } else if (!this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i]) && !this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i - 1])) {
                        continue;
                    } else if (!this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i]) && this.IsAlphabet($scope.expertise.options[companyNumber - 1].Text[i - 1])) {
                        continue;
                    }
                }
            }
        }
/*******************************WORD COUNT LIMIT FUNCTION ENDS FOR EXPERTISE SECTION*********************************** */

        /****ADD MORE FIELDS TO Expertise STARTS*****/
        this.addMoreFieldToExpertise = function (companyLength) {
            
            if (companyLength > 0) {
                $scope.newExpertise = true;                
                // add the new option to the model
                //$scope.question.options.push($scope.question.option_new);
            }
            // add the new option to the model
            if ($scope.expertise.option_new.expertiseid) {
                $scope.expertise.options.push($scope.expertise.option_new);
                // clear the option.
                $scope.expertise.option_new = {
                    expertiseid: '',
                    expmainidea: '',
                    Text: '',
                    expertiseSource: '',
                    selectedExpertiseSource:'',                    
                    exprateskill: '',
                    exphidefrompublic: '',
                    expincludeinsearch:true
                };
            }
            
            document.getElementById("expAddMoreFields").style = "background-color:lightgrey";
            document.getElementById("expAddMoreFields").disabled = true;
            $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgreen'};
            $scope.expertise.option_new.expRemoveDisabled=false;
        }/****ADD MORE FIELDS TO EXPERTISE ENDS*****/

        /****REMOVE NEW FIELDS FROM EXPERTISE STARTS*****/
        this.removeMoreFieldFromExpertise = function(companyNumber) {    
            console.log("Remove exp: ");

            if (companyNumber != 0) {
                if(Object.keys($scope.expertise.options).length==0 || Object.keys($scope.expertise.options).length==1) {
                    $scope.newExpertise = true;
                }
                $scope.expertise.options.splice(companyNumber - 1, 1);                
            }

            if(companyNumber==0)  {
                if(Object.keys($scope.expertise.options).length==0) {
                    this.clearExpertiseFields(0);
                    $scope.newExpertise = true;
                } else {
                    this.clearExpertiseFields(0);
                    $scope.newExpertise = false;
                }                
            }
            if(Object.keys($scope.expertise.options).length==0) {
                document.getElementById("expAddMoreFields").style = "background-color:lightgrey";
                document.getElementById("expAddMoreFields").disabled = true;

                $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgrey'};
                $scope.expertise.option_new.expRemoveDisabled=true;
            } else {
                document.getElementById("expAddMoreFields").style = "background-color:lightgreen";
                document.getElementById("expAddMoreFields").disabled = false;

                $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgreen'};
                $scope.expertise.option_new.expRemoveDisabled=false;
            }

        }        
        /******GetCurrentExpertise STARTS************ */
        this.getCurrentExpertise = function (companyNumber) {
            $scope.expClearExpertise = false;            
            if (companyNumber == 0) {
                $scope.expertData = {
                    email: $scope.main.email,
                    expertiseid: $scope.expertise.option_new.expertiseid
                }
            } else {
                $scope.expertData = {
                    email: $scope.main.email,
                    expertiseid: $scope.expertise.options[companyNumber - 1].expertiseid
                }
            }
            if ($scope.expertData.expertiseid) {
                Expertise.getCurrentExpertise($scope.expertData).then(function (data) {
                    if (companyNumber == 0) {
                        for (company in data.data.expertiseData) {
                            $scope.expertise.option_new.expertiseid = data.data.expertiseData[company].expertiseid;
                            $scope.expertise.option_new.expmainidea = data.data.expertiseData[company].expmainidea;
                            $scope.expertise.option_new.Text = data.data.expertiseData[company].Text;
                            $scope.expertise.option_new.selectedExpertiseSource = data.data.expertiseData[company].selectedExpertiseSource;
                            $scope.expertise.option_new.exprateskill = data.data.expertiseData[company].exprateskill;
                            $scope.expertise.option_new.exphidefrompublic = data.data.expertiseData[company].exphidefrompublic;
                            $scope.expertise.option_new.expincludeinsearch = data.data.expertiseData[company].expincludeinsearch;
                            
                        }
                        console.log("expert source: " + $scope.expertise.option_new.expertiseid);
                    } else {
                        for (company in data.data.expertiseData) {
                            $scope.expertise.options[companyNumber - 1] = data.data.expertiseData[company];
                        }
                    }
                });
            }else{
                this.clearExpertiseFields(companyNumber);
            }
        }/******GetCurrentExpertise ENDS************ */
        
        
        this.getExpertiseSource = function (companyNumber) {
            $scope.expertiseData = {
                email: $scope.main.email
            }
            Expertise.getExpertiseSource($scope.expertiseData).then(function (data) {
                if (data.data.expertiseSourceData) {
                    if (companyNumber == 0) {
                        $scope.expertise.option_new.expertiseSource = data.data.expertiseSourceData;
                        //if expertise source data not found remove it from selected.
                        // expertise has A, B, C and selected has A,B, D the remove D from selected.
                        //$scope.expertise.option_new.selectedExpertiseSource
                    } else {
                        $scope.expertise.options[companyNumber - 1].expertiseSource = data.data.expertiseSourceData;
                    }
                } else {
                    $scope.expertise.option_new.expertiseSource = data.data.message;
                }
            });
        }

        $scope.hideExpertise = function (optionExpertise) {
            var index = $scope.hideEmployment.indexOf(optionExpertise);
            if (index > -1) {
                return false;
            }
            else {
                return true;
            }
        }
        
        this.printSelectedToppings = function (companyNumber) {
            if(companyNumber==0) {
                var numberOfToppings = $scope.expertise.option_new.selectedExpertiseSource.length;
                
                //Remove hide employment.
                // for(data in $scope.hideEmployment) {
                //     var index = $scope.expertise.option_new.displayExpertiseSource.indexOf($scope.hideEmployment[data]);
                //     if (index > -1) {
                //         console.log($scope.expertise.option_new.selectedExpertiseSource);
                //         $scope.expertise.option_new.displayExpertiseSource.splice(index, 1);
                //     }
                //     for (var i = 0; i < $scope.expertise.options.length; i++) {
                //         var index = $scope.expertise.options[i].selectedExpertiseSource.indexOf($scope.hideEmployment[data]);
                //         if (index > -1) {
                //             $scope.expertise.options[i].selectedExpertiseSource.splice(index, 1);
                //         }
                //     }
                // }
                
                // If there is more than one topping, we add an 'and'
                // to be gramatically correct. If there are 3+ toppings
                // we also add an oxford comma.
                // if (numberOfToppings > 1) {
                //     var needsOxfordComma = numberOfToppings > 2;
                //     var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
                //     var lastTopping = lastToppingConjunction +
                //         $scope.expertise.option_new.selectedExpertiseSource[$scope.expertise.option_new.selectedExpertiseSource.length - 1];
                //     return $scope.expertise.option_new.selectedExpertiseSource.slice(0, -1).join(', ') + lastTopping;
                // }

                return $scope.expertise.option_new.selectedExpertiseSource.name.join(', ');
            } else {
                // var numberOfToppings = $scope.expertise.options[companyNumber - 1].selectedExpertiseSource.length;

                // // If there is more than one topping, we add an 'and'
                // // to be gramatically correct. If there are 3+ toppings
                // // we also add an oxford comma.
                // if (numberOfToppings > 1) {
                //     var needsOxfordComma = numberOfToppings > 2;
                //     var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
                //     var lastTopping = lastToppingConjunction +
                //         $scope.expertise.options[companyNumber - 1].selectedExpertiseSource[$scope.expertise.options[companyNumber - 1].selectedExpertiseSource.length - 1];
                //     return $scope.expertise.options[companyNumber - 1].selectedExpertiseSource.slice(0, -1).join(', ') + lastTopping;
                // }

                return $scope.expertise.options[companyNumber - 1].selectedExpertiseSource.join(', ');
            }
            
        };
        
        /*****GetExpertise STARTS******************************* */
        this.getExpertise = function () {            
            $scope.expertData = {
                email: $scope.main.email
            }
            Expertise.getExpertise($scope.expertData).then(function (data) {

                if (Object.keys(data.data.expertiseData).length > 1) {
                    $scope.newExpertise = false;                    
                }
                if (Object.keys(data.data.expertiseData).length == 0) {
                    $scope.newExpertise = true;
                    $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgrey'};
                    $scope.expertise.option_new.expRemoveDisabled=true;
                }

                if (Object.keys(data.data.expertiseData).length >= 1){
                    document.getElementById("expAddMoreFields").style = "background-color:lightgreen";
                    document.getElementById("expAddMoreFields").disabled = false;                    
                }                

                if (Object.keys(data.data.expertiseData).length == 1) {                
                    $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgrey'};
                    $scope.expertise.option_new.expRemoveDisabled=true;
                    for (company in data.data.expertiseData) {                        
                        $scope.expertise.option_new.expertiseid = data.data.expertiseData[company].expertiseid;
                        $scope.expertise.option_new.expmainidea = data.data.expertiseData[company].expmainidea;
                        $scope.expertise.option_new.Text = data.data.expertiseData[company].Text;
                        //$scope.expertise.option_new.expertiseSource = data.data.expertiseData[company].expertiseSource;                        
                        $scope.expertise.option_new.selectedExpertiseSource = data.data.expertiseData[company].selectedExpertiseSource;
                        console.log("Test: "+$scope.expertise.option_new.selectedExpertiseSource);
                        //Remove hide employment.                        
                        // for (i in $scope.hideEmployment) {
                        //     var index = $scope.expertise.option_new.selectedExpertiseSource.indexOf($scope.hideEmployment[i]);
                        //     console.log(index);
                        //     if (index > -1) {
                        //         $scope.expertise.option_new.selectedExpertiseSource.splice(index, 1);
                        //     }
                        //     for (var j = 0; j < $scope.expertise.options.length; j++) {
                        //         var index = $scope.expertise.options[j].selectedExpertiseSource.indexOf($scope.hideEmployment[i]);
                        //         if (index > -1) {
                        //             $scope.expertise.options[j].selectedExpertiseSource.splice(index, 1);
                        //         }
                        //     }
                        // }
                        // if (data.data.expertiseData[company].expertiseSource) {
                        //     var expertiseSourceList = data.data.expertiseData[company].expertiseSource.split(',');
                        //     for (i in expertiseSourceList) {
                        //         $scope.expertise.option_new.selectedExpertiseSource.push(expertiseSourceList[i].toString());
                        //     }
                        // }    
                        $scope.expertise.option_new.exprateskill = data.data.expertiseData[company].exprateskill;
                        $scope.expertise.option_new.exphidefrompublic = data.data.expertiseData[company].exphidefrompublic;
                        $scope.expertise.option_new.expincludeinsearch = data.data.expertiseData[company].expincludeinsearch;
                    }                    
                    $scope.newExpertise = true;
                } else {
                    var index=0;
                    for (company in data.data.expertiseData) {                 
                        //Remove hide employment.
                        // for (i in $scope.hideEmployment) {
                        //     var pos = data.data.expertiseData[company].selectedExpertiseSource.indexOf($scope.hideEmployment[i]);
                        //     if (pos > -1) {
                        //         data.data.expertiseData[company].selectedExpertiseSource.splice(pos, 1);
                        //     }
                        // }
                        //console.log("MTest: "+data.data.expertiseData[company].selectedExpertiseSource);
                        $scope.expertise.options.push(data.data.expertiseData[company]);
                        $scope.expertise.options[index].expRemoveStyle={'background-color':'lightgrey'};
                        $scope.expertise.options[index].expRemoveDisabled=true;                        
                        index++;
                    }
                }
        });
    }
    
        /***************submitExpertise STARTS**************************************** */
        this.submitExpertise = function (companyNumber) {    
            
            //Remove hide employment.
            // for (data in $scope.hideEmployment) {
            //     var index = $scope.expertise.option_new.selectedExpertiseSource.indexOf($scope.hideEmployment[data]);
            //     if (index > -1) {
            //         $scope.expertise.option_new.selectedExpertiseSource.splice(index, 1);
            //     }
            //     for (var i = 0; i < $scope.expertise.options.length; i++) {
            //         var index = $scope.expertise.options[i].selectedExpertiseSource.indexOf($scope.hideEmployment[data]);
            //         if (index > -1) {
            //             $scope.expertise.options[i].selectedExpertiseSource.splice(index, 1);
            //         }
            //     }
            // }

            if (companyNumber == 0) {
                // console.log($scope.expertise.option_new.selectedExpertiseSource);
                // var  expertiseSourceArr = [];
                // for (source in $scope.expertise.option_new.selectedExpertiseSource) {                    
                //     expertiseSourceArr.push($scope.expertise.option_new.selectedExpertiseSource[source].name);
                // }
                // var expertiseSource = expertiseSourceArr.join(",");
                                
                $scope.expertiseData = {
                    email: $scope.main.email,
                    clearExpertise: $scope.expClearExpertise,
                    expertiseid: $scope.expertise.option_new.expertiseid,
                    expmainidea: $scope.expertise.option_new.expmainidea,
                    Text: $scope.expertise.option_new.Text,
                    expertiseSource: $scope.expertise.option_new.selectedExpertiseSource,
                    // expertiseSource:expertiseSource,
                    exprateskill: $scope.expertise.option_new.exprateskill,
                    exphidefrompublic: $scope.expertise.option_new.exphidefrompublic,
                    expincludeinsearch: $scope.expertise.option_new.expincludeinsearch
                }                
                $scope.expertise.option_new.expertiseSuccessMsg = false;
                $scope.expertise.option_new.expertiseErrorMsg = false;                
            } else {

                // var  expertiseSourceArr = [];
                // for (source in $scope.expertise.options[companyNumber - 1].selectedExpertiseSource) {
                //     expertiseSourceArr.push($scope.expertise.options[companyNumber - 1].selectedExpertiseSource[source].name);
                // }
                // var expertiseSource = expertiseSourceArr.join(",");
                
                $scope.expertiseData = {
                    email: $scope.main.email,
                    clearExpertise: $scope.expClearExpertise,
                    expertiseid: $scope.expertise.options[companyNumber - 1].expertiseid,
                    expmainidea: $scope.expertise.options[companyNumber - 1].expmainidea,
                    Text: $scope.expertise.options[companyNumber - 1].Text,
                    expertiseSource: $scope.expertise.options[companyNumber - 1].selectedExpertiseSource,
                    // expertiseSource:expertiseSource,
                    exprateskill: $scope.expertise.options[companyNumber - 1].exprateskill,
                    exphidefrompublic: $scope.expertise.options[companyNumber - 1].exphidefrompublic,
                    expincludeinsearch: $scope.expertise.options[companyNumber - 1].expincludeinsearch
                }
                $scope.expertise.options[companyNumber - 1].expertiseSuccessMsg = false;
                $scope.expertise.options[companyNumber - 1].expertiseErrorMsg = false;
            }
            
            Expertise.createExpertise($scope.expertiseData).then(function (data) {
                if (data.data.success) {                    
                    if (companyNumber == 0) {
                        document.getElementById("expAddMoreFields").style = "background-color:lightgreen";
                        document.getElementById("expAddMoreFields").disabled = false;                        
                        if($scope.expClearExpertise) {
                            $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgreen'};
                            $scope.expertise.option_new.expRemoveDisabled=false;
                            $scope.expClearExpertise = false;
                        } else {
                            $scope.expertise.option_new.expRemoveStyle={'background-color':'lightgrey'};
                            $scope.expertise.option_new.expRemoveDisabled=true;
                        }
                        for (company in data.data.expertiseData) {
                            $scope.expertise.option_new.expertiseid = data.data.expertiseData[company].expertiseid;
                            $scope.expertise.option_new.expmainidea = data.data.expertiseData[company].expmainidea;
                            $scope.expertise.option_new.Text = data.data.expertiseData[company].Text;
                            // $scope.expertise.option_new.expertiseSource = data.data.expertiseData[company].expertiseSource;
                            $scope.expertise.option_new.selectedExpertiseSource = data.data.expertiseData[company].selectedExpertiseSource;
                            // if (data.data.expertiseData[company].expertiseSource) {
                            //     var expertiseSourceList = data.data.expertiseData[company].expertiseSource.split(',');
                            //     $scope.expertise.option_new.selectedExpertiseSource = expertiseSourceList;                            
                            // }
                            $scope.expertise.option_new.exprateskill = data.data.expertiseData[company].exprateskill;
                            $scope.expertise.option_new.exphidefrompublic = data.data.expertiseData[company].exphidefrompublic;
                            $scope.expertise.option_new.expincludeinsearch = data.data.expertiseData[company].expincludeinsearch;
                            //Remove hide employment.
                            // for (data in $scope.hideEmployment) {
                            //     var index = $scope.expertise.option_new.selectedExpertiseSource.indexOf($scope.hideEmployment[data]);
                            //     if (index > -1) {
                            //         $scope.expertise.option_new.selectedExpertiseSource.splice(index, 1);
                            //     }
                            //     for (var i = 0; i < $scope.expertise.options.length; i++) {
                            //         var index = $scope.expertise.options[i].selectedExpertiseSource.indexOf($scope.hideEmployment[data]);
                            //         if (index > -1) {
                            //             $scope.expertise.options[i].selectedExpertiseSource.splice(index, 1);
                            //         }
                            //     }
                            // }
                        }
                        $scope.expertise.option_new.expertiseSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.expertise.option_new.expertiseSuccessMsg = false;
                        }, 2000);
                       // console.log("grad year: "+ data.data.educationData[company].edumajor);
                    } else {
                        if($scope.expClearExpertise) {
                            $scope.expertise.options[companyNumber - 1].expRemoveStyle={'background-color':'lightgreen'};
                            $scope.expertise.options[companyNumber - 1].expRemoveDisabled=false;
                            $scope.expClearExpertise = false;
                        } else {
                            $scope.expertise.options[companyNumber - 1].expRemoveStyle={'background-color':'lightgrey'};
                            $scope.expertise.options[companyNumber - 1].expRemoveDisabled=true;
                        }
                        for (company in data.data.expertiseData) {                            
                            $scope.expertise.options.push(data.data.expertiseData[company]);
                        }                        
                        $scope.expertise.options[companyNumber - 1].expertiseSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.expertise.options[companyNumber - 1].expertiseSuccessMsg = false;
                        }, 2000);
                    }
                } else {
                    if (companyNumber == 0) {
                        $scope.expertise.option_new.expertiseErrorMsg = data.data.message;
                        $timeout(function () {
                            $scope.expertise.option_new.expertiseErrorMsg = false;
                        }, 2000);
                    } else {
                        $scope.expertise.options[companyNumber - 1].expertiseErrorMsg = data.data.message;
                        $timeout(function () {
                            $scope.expertise.options[companyNumber - 1].expertiseErrorMsg = false;
                        }, 2000);
                    }
                }
            });
        }/********submitExpertise Ends****** */

     /********CLEAR EXPERTISE FIELDS STARTS***************** */
        this.clearExpertiseFields = function (companyNumber) {            
            
            if (companyNumber == 0) {
                if($scope.expertise.option_new.expertiseid) {
                    $scope.expClearExpertise = true;
                }                
                $scope.expertise.option_new.expmainidea = "";
                $scope.expertise.option_new.Text = "";
                $scope.expertise.option_new.selectedExpertiseSource = "";
                $scope.expertise.option_new.exprateskill = "";
                $scope.expertise.option_new.exphidefrompublic = "";
                $scope.expertise.option_new.expincludeinsearch = true;
                
            } else {
                if($scope.expertise.options[companyNumber - 1].expertiseid) {
                    $scope.expClearExpertise = true;
                }
                $scope.expertise.options[companyNumber - 1].expmainidea = "";
                $scope.expertise.options[companyNumber - 1].Text = "";
                $scope.expertise.options[companyNumber - 1].selectedExpertiseSource = "";
                $scope.expertise.options[companyNumber - 1].exprateskill = "";
                $scope.expertise.options[companyNumber - 1].exphidefrompublic = "";
                $scope.expertise.options[companyNumber - 1].expincludeinsearch = true;
            }
        } /********CLEAR EXPERTISE FIELDS ENDS***************** */

        //********** */
        $scope.remove = function () {
              var newDataList = [];
              $scope.selectedAll = false;
              angular.forEach($scope.question, function (selected) {
                  if (!selected.selected) {
                      newDataList.push(selected);
                  }
              });
              $scope.question = newDataList;
        };

        $scope.alert = '';
        $scope.choiceSet = { choices: [] };
    
        $scope.choiceSet.choices = [];
        $scope.choiceSet.choices.push('');
        $scope.addNewChoice = function () {
            console.log($scope.choiceSet);
            $scope.choiceSet.choices.push('');
        };
           

        $scope.removeChoice = function (z) {
            //var lastItem = $scope.choiceSet.choices.length - 1;
            $scope.choiceSet.choices.splice(z,1);
        };
        this.Submit = function () {
            $scope.uploading = true;
            // app.filedisabled = false;
            //app.re         
            //console.log("$scope.file.upload: "+ $scope.file.upload);
            if ($scope.file.upload) {
                //console.log("file upload : " + $scope.file.upload.name);
                // console.log("Image uploading started..: ");
                uploadFile.upload($scope.file).then(function (data) {
                    // console.log("Image uploading return..: ");
                    if (data.data.success) {
                        // console.log("Image uploading return with sucess..: ");
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        // app.filedisabled = true;
                        $scope.file = {};          
                        console.log("Image uploading finished... ");
                        //console.log("Apoorva: "+ data.data.profileImageName);
                        //app.profileImageUploaded = "https://storage.googleapis.com/bobo-0518/"+data.data.profileImageName;
                        //app.profileImageUploaded = data.data.profileImageName;
                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        app.profileImageUploaded = "Image upload error";
                    }
                })
            }
    }
        $scope.stepsModel = [];
        $scope.profileImageModel = [];        
         
        $scope.imageUpload = function (event) {
            var files = event.target.files;//fileList object
            console.log("file length: "+ files.length);
            for (var i = 0; i < files.length; i++) {
            //for (var i = 0; i < 1; i++) {
                var file = files[i];
                console.log("file name: "+ file.name);
                var reader = new FileReader();
                reader.onload = $scope.imageIsLoaded;
                reader.readAsDataURL(file);
            }            
        }
        //As we are allowing only ONE profilepic stepsModel[0] used (index = 0).
        $scope.imageIsLoaded = function (e) {
            $scope.country.stepModelImage = true;
            if(app.stepModelImage) {
                app.stepModelImage = true;
            } else {
                app.stepModelImage = false;
            }
            $scope.$apply(function () {                
                $scope.stepsModel[0]= e.target.result;
            });
        }

        //As we are allowing only ONE profilepic splice(0,1) used (index = 0)
        this.removeProfileImage = function(imageData){            
            // alert("Deleting index: " + imageData);
            app.stepModelImage = false;
            //  app.profileImage = '';         
            // $scope.file = {};
            // document.getElementById("fileinput").value = "";            
            // $scope.stepsModel.splice(imageData,1);
            //If you want to delete all the images
            //$scope.stepsModel = [];
        };

        this.replaceProfileImage = function(imageData){
            // alert("Deleting index: " + imageData);            
            $scope.file = {};
            document.getElementById("fileinput").value = "";            
            $scope.stepsModel.splice(0,1);
            //If you want to delete all the images
            //$scope.stepsModel = [];
        };

        this.deleteProfileImage = function () {
            $scope.profileData = {
                email: $scope.main.email
            }
            app.profileImage = '';            
            // console.log("image: " + $scope.profileData.email);
            // if ($scope.profileData.email != null) {
            //     Profile.deleteProfileImage($scope.profileData).then(function (data) {
            //         app.profileImage = '';
            //     });
            // }
        }
        /***************************************START OF EDUCATION SECTION CODE********************************************************************************** */
           /*****Education object creation */
            $scope.eduObject = {
            options: [],
            //option_new: { testTitle: '' }
            //read all write all, create json object 
            //person profile, 
             option_new: {
                educompanyid:'',
                eduaddnewcompany: '', 
                empcompanyCode: '', 
                searchText:'',
                edunewcompany: '',
                edunewcountry:'',
                eduurlinput: '',
                edupresent: '',
                edudegree:'',
                edumajor:'',
                edugradyear:'',
                edugradyearexpected:''
             }
        };/*****End of Education object creation **************/

        /****ADD MORE FIELDS TO EDUCATION STARTS*****/
        this.addMoreFieldToEducation = function (companyLength) {

            console.log("new company length: "+ companyLength);
            if (companyLength > 0) {
                $scope.newEducation = true;
                // add the new option to the model
                //$scope.question.options.push($scope.question.option_new);
            }
            // add the new option to the model
            if ($scope.eduObject.option_new.educompanyid) {
                $scope.eduObject.options.push($scope.eduObject.option_new);
                // clear the option.
                // $scope.question.option_new = { testTitle: '' };
                $scope.eduObject.option_new= {
                    educompanyid:'',
                    eduaddnewcompany: '', 
                    empcompanyCode: '', 
                    searchText:'',
                    edunewcompany: '',
                    edunewcountry:'',
                    eduurlinput: '',
                    edupresent: '',
                    edudegree:'',
                    edumajor:'',
                    edugradyear:'',
                    edugradyearexpected:''
                };
            }
            document.getElementById("eduAddMoreFields").style = "background-color:lightgrey";
            document.getElementById("eduAddMoreFields").disabled = true;
            $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgreen'};
            $scope.eduObject.option_new.eduRemoveDisabled=false;
        }/****ADD MORE FIELDS TO EDUCATION ENDS*****/

        /****REMOVE NEW FIELDS FROM EDUCATION ENDS*****/
        this.removeMoreFieldFromEducation = function(companyNumber) {    
            if (companyNumber != 0) {
                if(Object.keys($scope.eduObject.options).length==0 || Object.keys($scope.eduObject.options).length==1) {
                    $scope.newEducation = true;
                }
                $scope.eduObject.options.splice(companyNumber - 1, 1);                
            }if(companyNumber==0)  {
                if(Object.keys($scope.eduObject.options).length==0) {
                    this.clearEducationFields(0);
                    $scope.newEducation = true;
                } else {
                    this.clearEducationFields(0);
                    $scope.newEducation = false;
                }                
            } if(Object.keys($scope.eduObject.options).length==0) {
                document.getElementById("eduAddMoreFields").style = "background-color:lightgrey";
                document.getElementById("eduAddMoreFields").disabled = true;
                $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgrey'};
                $scope.eduObject.option_new.eduRemoveDisabled=true;
            }
            else {
                document.getElementById("eduAddMoreFields").style = "background-color:lightgreen";
                document.getElementById("eduAddMoreFields").disabled = false;
                $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgreen'};
                $scope.eduObject.option_new.eduRemoveDisabled=false;
            }
        }
            
        /******GetCurrentEducation STARTS************ */
        this.getCurrentEducation = function (companyNumber) {
            $scope.eduClearEducation = false;            
            if (companyNumber == 0) {
                $scope.universityData = {
                    email: $scope.main.email,
                    companyid: $scope.eduObject.option_new.educompanyid
                }
            } else {
                $scope.universityData = {
                    email: $scope.main.email,
                    companyid: $scope.eduObject.options[companyNumber - 1].educompanyid
                }
            }
            if ($scope.universityData.companyid) {
                Education.getCurrentEducation($scope.universityData).then(function (data) {
                    if (companyNumber == 0) {
                        for (company in data.data.educationData) {
                            $scope.eduObject.option_new.educompanyid = data.data.educationData[company].educompanyid;
                            $scope.eduObject.option_new.searchText = data.data.educationData[company].searchText;
                            $scope.eduObject.option_new.empcompanyCode = data.data.educationData[company].empcompanyCode;
                            $scope.eduObject.option_new.edupresent = data.data.educationData[company].edupresent;
                            $scope.eduObject.option_new.edudegree = data.data.educationData[company].edudegree;
                            $scope.eduObject.option_new.edumajor = data.data.educationData[company].edumajor;
                            $scope.eduObject.option_new.edugradyearexpected = data.data.educationData[company].edugradyearexpected;
                            $scope.eduObject.option_new.edugradyear = data.data.educationData[company].edugradyear;
                        }
                    } else {
                        for (company in data.data.educationData) {
                            $scope.eduObject.options[companyNumber - 1] = data.data.educationData[company];
                        }
                    }
                });
            }else{
                this.clearEducationFields(companyNumber);
            }
        }/******GetCurrentEducation ENDS************ */


        /*****GetEducation STARTS******************************* */
        this.getEducation = function () {
            $scope.universityData = {
                email: $scope.main.email
            }
            Education.getEducation($scope.universityData).then(function (data) {

                //console.log("Education length: "+ Object.keys(data.data.educationData).length );
                if (Object.keys(data.data.educationData).length > 1) {
                    $scope.newEducation = false;                    
                }
                if (Object.keys(data.data.educationData).length == 0) {
                    $scope.newEducation = true;
                    $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgrey'};
                    $scope.eduObject.option_new.eduRemoveDisabled=true;
                }
                if (Object.keys(data.data.educationData).length >= 1){
                    document.getElementById("eduAddMoreFields").style = "background-color:lightgreen";
                    document.getElementById("eduAddMoreFields").disabled = false;   
                }
                if (Object.keys(data.data.educationData).length == 1) {                    
                    $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgrey'};
                    $scope.eduObject.option_new.eduRemoveDisabled=true;
                    for (company in data.data.educationData) {
                        $scope.eduObject.option_new.educompanyid = data.data.educationData[company].educompanyid;
                        $scope.eduObject.option_new.searchText = data.data.educationData[company].searchText;
                        $scope.eduObject.option_new.empcompanyCode = data.data.educationData[company].empcompanyCode;
                        $scope.eduObject.option_new.edupresent = data.data.educationData[company].edupresent;
                        $scope.eduObject.option_new.edudegree = data.data.educationData[company].edudegree;
                        $scope.eduObject.option_new.edumajor = data.data.educationData[company].edumajor;
                        $scope.eduObject.option_new.edugradyearexpected = data.data.educationData[company].edugradyearexpected;
                        $scope.eduObject.option_new.edugradyear = data.data.educationData[company].edugradyear;
                    }
                    //console.log("Education length1: "+ Object.keys(data.data.educationData).length );
                    $scope.newEducation = true;
                } else {
                    var index=0;
                    for (company in data.data.educationData) {                        
                        $scope.eduObject.options.push(data.data.educationData[company]);
                        $scope.eduObject.options[index].eduRemoveStyle={'background-color':'lightgrey'};
                        $scope.eduObject.options[index].eduRemoveDisabled=true;
                        index++;
                }
                }
        });
    }/****getEducation ends********** */
        this.querySearchforEducation = function (searchText) {
            // app.companySearchLimitMsg = false;              
            $scope.eduObject.option_new.companySearchLimitMsg = false;
            return Company.getCompany(searchText).then(function (data) {

                if (Object.keys(data.data.companyData).length == 101) {
                    $scope.eduObject.option_new.companySearchLimitMsg = true;
                } else {
                    $scope.eduObject.option_new.companySearchLimitMsg = false;
                }
                return data.data.companyData;
            });
        }

    
        /***************submitEducation STARTS**************************************** */
        this.submitEducation = function (companyNumber) {
            // console.log("Company education:" + companyNumber);
            if (companyNumber == 0) {
                companyname = $scope.eduObject.option_new.searchText;
                if ($scope.eduObject.option_new.eduaddnewcompany) {
                    companyname = $scope.eduObject.option_new.edunewcompany;
                }
                if($scope.eduObject.option_new.edupresent) {
                    edugradyearexpected = $scope.eduObject.option_new.edugradyearexpected;
                    edugradyear = '';
                } else {                    
                    edugradyearexpected = '';
                    edugradyear = $scope.eduObject.option_new.edugradyear;
                }
                $scope.educationData = {
                    email: $scope.main.email,
                    clearEducation:$scope.eduClearEducation,
                    companyid: $scope.eduObject.option_new.educompanyid,
                    companyname: companyname,
                    eduCompanyCountry: $scope.eduObject.option_new.eduCompanyCountry,
                    edupresent: $scope.eduObject.option_new.edupresent,
                    edudegree: $scope.eduObject.option_new.edudegree,
                    edumajor: $scope.eduObject.option_new.edumajor,
                    graduationyear: edugradyear,
                    gradyearexpected: edugradyearexpected,
                    //New company data
                    newcompany: companyname,
                    newcountry: $scope.eduObject.option_new.edunewcountry,
                    newurl: $scope.eduObject.option_new.eduurlinput,
                    addnewcompany: $scope.eduObject.option_new.eduaddnewcompany
                }
                $scope.eduObject.option_new.educationSuccessMsg = false;
                $scope.eduObject.option_new.educationErrorMsg = false;
                } else {

                companyname = $scope.eduObject.options[companyNumber - 1].searchText;
                if ($scope.eduObject.options[companyNumber - 1].eduaddnewcompany) {
                    companyname = $scope.eduObject.options[companyNumber - 1].edunewcompany;
                }
                if($scope.eduObject.options[companyNumber - 1].edupresent) {
                    edugradyearexpected = $scope.eduObject.options[companyNumber - 1].edugradyearexpected;
                    edugradyear = '';
                } else {
                    edugradyearexpected = '';
                    edugradyear = $scope.eduObject.options[companyNumber - 1].edugradyear;
                }
                $scope.educationData = {
                    email: $scope.main.email,
                    clearEducation:$scope.eduClearEducation,
                    companyid: $scope.eduObject.options[companyNumber - 1].educompanyid,
                    companyname: companyname,
                    eduCompanyCountry: $scope.eduObject.options[companyNumber - 1].eduCompanyCountry,
                    edupresent: $scope.eduObject.options[companyNumber - 1].edupresent,
                    edudegree: $scope.eduObject.options[companyNumber - 1].edudegree,
                    edumajor: $scope.eduObject.options[companyNumber - 1].edumajor,
                    graduationyear: edugradyear,
                    gradyearexpected: edugradyearexpected,
                    //New company data
                    newcompany: companyname,
                    newcountry: $scope.eduObject.options[companyNumber - 1].edunewcountry,
                    newurl: $scope.eduObject.options[companyNumber - 1].eduurlinput,
                    addnewcompany: $scope.eduObject.options[companyNumber - 1].eduaddnewcompany
                }
                $scope.eduObject.options[companyNumber - 1].educationSuccessMsg = false;
                $scope.eduObject.options[companyNumber - 1].educationErrorMsg = false;
              }
            Education.createEducation($scope.educationData).then(function (data) {
                if (data.data.success) {
                    if (companyNumber == 0) {
                        document.getElementById("eduAddMoreFields").style = "background-color:lightgreen";
                        document.getElementById("eduAddMoreFields").disabled = false;
                         if($scope.eduClearEducation) {
                            $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgreen'};
                            $scope.eduObject.option_new.eduRemoveDisabled=false;
                            $scope.eduClearEducation = false;
                        } else {
                            $scope.eduObject.option_new.eduRemoveStyle={'background-color':'lightgrey'};
                            $scope.eduObject.option_new.eduRemoveDisabled=true;
                        }
                        for (company in data.data.educationData) {
                            $scope.eduObject.option_new.educompanyid = data.data.educationData[company].educompanyid;
                            $scope.eduObject.option_new.searchText = data.data.educationData[company].searchText;
                            $scope.eduObject.option_new.empcompanyCode = data.data.educationData[company].empcompanyCode;
                            $scope.eduObject.option_new.edupresent = data.data.educationData[company].edupresent;
                            $scope.eduObject.option_new.edudegree = data.data.educationData[company].edudegree;
                            $scope.eduObject.option_new.edumajor = data.data.educationData[company].edumajor;
                            $scope.eduObject.option_new.edugradyearexpected = data.data.educationData[company].edugradyearexpected;
                            $scope.eduObject.option_new.edugradyear = data.data.educationData[company].edugradyear;
                        }
                        
                        $scope.eduObject.option_new.educationSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.eduObject.option_new.educationSuccessMsg = false;
                        }, 2000);

                    } else {
                        if($scope.eduClearEducation) {
                            $scope.eduObject.options[companyNumber - 1].eduRemoveStyle={'background-color':'lightgreen'};
                            $scope.eduObject.options[companyNumber - 1].eduRemoveDisabled=false;
                            $scope.eduClearEducation = false;
                        } else {
                            $scope.eduObject.options[companyNumber - 1].eduRemoveStyle={'background-color':'lightgrey'};
                            $scope.eduObject.options[companyNumber - 1].eduRemoveDisabled=true;
                        }
                        for (company in data.data.educationData) {                            
                            $scope.eduObject.options.push(data.data.educationData[company]);
                        }                        
                        $scope.eduObject.options[companyNumber - 1].educationSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.eduObject.options[companyNumber - 1].educationSuccessMsg = false;
                        }, 2000);
                    }
                } else {                    
                    if (companyNumber == 0) {
                        $scope.eduObject.option_new.educationErrorMsg = data.data.message;
                        $timeout(function () {
                            $scope.eduObject.option_new.educationErrorMsg = false;
                        }, 2000);
                    } else {
                        $scope.eduObject.options[companyNumber - 1].educationErrorMsg = data.data.message;
                        $timeout(function () {
                            $scope.eduObject.options[companyNumber - 1].educationErrorMsg = false;
                        }, 2000);
                    }
                }
            });
        }/********submitEducation Ends****** */

        /********REMOVE UNIVERSITY INFO STARTS***************** */
        this.removeUniversityInfo = function (companyNumber) {
         if (companyNumber == 0) {             
                $scope.eduObject.option_new.edunewcompany = "";
                $scope.eduObject.option_new.edunewcountry = "";
                $scope.eduObject.option_new.eduurlinput = "";
            } else {
                $scope.eduObject.options[companyNumber - 1].edunewcompany = "";
                $scope.eduObject.options[companyNumber - 1].edunewcountry = "";
                $scope.eduObject.options[companyNumber - 1].eduurlinput = "";
            }
        } /********REMOVE UNIVERSITY INFO ENDS***************** */

         /********CLEAR STATIC  UNIVERSITY FIELD STARTS***************** */
        this.clearStaticEducationField = function(){
            $scope.universityData = {
                email: $scope.main.email,
            }
            //Check if company id 
            if ($scope.universityData.email != null) {
                Education.deleteEducationByEmail($scope.universityData).then(function (data) {
                });
            }
                $scope.eduObject.option_new.edunewcompany = "";
                $scope.eduObject.option_new.edunewcountry = "";
                $scope.eduObject.option_new.eduurlinput = "";
                $scope.eduObject.option_new.searchText = "";
                $scope.eduObject.option_new.empcompanyCode = "";
                $scope.eduObject.option_new.edupresent = "";
                $scope.eduObject.option_new.edudegree = "";
                $scope.eduObject.option_new.edumajor = "";
                $scope.eduObject.option_new.edugradyear = "";
                $scope.eduObject.option_new.edugradyearexpected = "";
    } /********CLEAR STATIC EDUCATION FIELD ENDS***************** */

     /********CLEAR EDUCATION FIELDS STARTS***************** */
        this.clearEducationFields = function (companyNumber) {            
            
            if (companyNumber == 0) {
                if($scope.eduObject.option_new.educompanyid) {
                    $scope.eduClearEducation = true;
                }
                $scope.eduObject.option_new.edunewcompany = "";
                $scope.eduObject.option_new.edunewcountry = "";
                $scope.eduObject.option_new.eduurlinput = "";
                $scope.eduObject.option_new.searchText = "";
                $scope.eduObject.option_new.empcompanyCode = "";
                $scope.eduObject.option_new.edupresent = "";
                $scope.eduObject.option_new.edudegree = "";
                $scope.eduObject.option_new.edumajor = "";
                $scope.eduObject.option_new.edugradyear = "";
                $scope.eduObject.option_new.edugradyearexpected = "";
            } else {
                if($scope.eduObject.options[companyNumber - 1].educompanyid) {
                    $scope.eduClearEducation = true;
                }
                $scope.eduObject.options[companyNumber - 1].edunewcompany = "";
                $scope.eduObject.options[companyNumber - 1].edunewcountry = "";
                $scope.eduObject.options[companyNumber - 1].eduurlinput = "";
                $scope.eduObject.options[companyNumber - 1].searchText = "";
                $scope.eduObject.options[companyNumber - 1].empcompanyCode = "";
                $scope.eduObject.options[companyNumber - 1].edupresent = "";
                $scope.eduObject.options[companyNumber - 1].edudegree = "";
                $scope.eduObject.options[companyNumber - 1].edumajor = "";
                $scope.eduObject.options[companyNumber - 1].edugradyear = "";
                $scope.eduObject.options[companyNumber - 1].edugradyearexpected = "";
            }
        } /********CLEAR EDUCATION FIELDS ENDS***************** */




        
        
        
        
        
        
        
        /****************************************END OF EDUCATION SECTION CODE********************************************************************************** */

        /*****************************************ADD MORE FIELDS TO NEXT EMPLOYMENT************************************************* */
        $scope.question = {
            options: [],
            //option_new: { testTitle: '' }
            option_new: {
                empcompanyid:'', empaddnewcompany: '', empcompanyCode: '', searchText:'', companyCountry:'',
                empnewcompany: '', empnewcountry: '',empnewstate:'',empnewmetropolitanarea:'', urlinput: '',
                //empCountryCode: '', empStateCode: '', empMetroCode: '',
                 emppresent: '',
                emptitlecategory: '', empexacttitle: '', empstartyear: '', empendyear: '', emphideinfo: ''                
            }
        };     
        // $scope.question.option_new = { testTitle: 'ABC' };        Right One Syntax
        // app.question.option_new = {'testTitle':"ABC"};
        
        // app.question.option1 = { testTitle: 'vaja' };
        // app.question.option2 = { testTitle: 'appy' };
        // app.question.options.push(app.question.option1);
        // app.question.options.push(app.question.option2);

        /******ADD MORE FIELDS TO EMPLOYMENT STARTS*************** */
        this.addMoreField = function (companyLength) {
            //console.log("new company length: "+ companyLength);
            if (companyLength > 0) {
                $scope.newEmployment = true;
                // add the new option to the model
                //$scope.question.options.push($scope.question.option_new);
            }
            // add the new option to the model
            if ($scope.question.option_new.empcompanyid) {
                $scope.question.options.push($scope.question.option_new);
                // clear the option.
                $scope.question.option_new = {
                    empcompanyid: '', empaddnewcompany: '', empcompanyCode: '', searchText: '', companyCountry:'',
                    empnewcompany: '', empnewcountry: '', urlinput: '',
                    empnewstate: '', empnewmetropolitanarea: '', emppresent: '',
                    emptitlecategory: '', empexacttitle: '', empstartyear: '', empendyear: '', emphideinfo: ''
                };                
            }  
            document.getElementById("empAddMoreFields").style = "background-color:lightgrey";
            document.getElementById("empAddMoreFields").disabled = true;
            $scope.question.option_new.empRemoveStyle={'background-color':'lightgreen'};
            $scope.question.option_new.empRemoveDisabled=false;
        }        /******ADD MORE FIELDS TO EMPLOYMENT ENDS*************** */
        var date = new Date().getFullYear();

        /********REMOVE MORE FIELDS FROM EMPLOYMENT STARTS**************** */
        this.removeMoreField = function (companyNumber) {
            if (companyNumber != 0) {
                if(Object.keys($scope.question.options).length==0 || Object.keys($scope.question.options).length==1) {
                    $scope.newEmployment = true;
                }
                $scope.question.options.splice(companyNumber - 1, 1);                
            }
            if(companyNumber==0)  {
                if(Object.keys($scope.question.options).length==0) {
                    this.clearEmploymentFields(0);
                    $scope.newEmployment = true;
                } else {
                    this.clearEmploymentFields(0);
                    $scope.newEmployment = false;
                }                
            }
            if(Object.keys($scope.question.options).length==0) {
                document.getElementById("empAddMoreFields").style = "background-color:lightgrey";
                document.getElementById("empAddMoreFields").disabled = true;

                $scope.question.option_new.empRemoveStyle={'background-color':'lightgrey'};
                $scope.question.option_new.empRemoveDisabled=true;
            }
            else {
                document.getElementById("empAddMoreFields").style = "background-color:lightgreen";
                document.getElementById("empAddMoreFields").disabled = false;
                $scope.question.option_new.empRemoveStyle={'background-color':'lightgreen'};
                $scope.question.option_new.empRemoveDisabled=false;
            }
        }/********REMOVE MORE FIELDS FROM EMPLOYMENT ENDS**************** */

        this.submitEmployment = function (companyNumber) {


            if (companyNumber == 0) {

                companyname = $scope.question.option_new.searchText;
                if ($scope.question.option_new.empaddnewcompany) {
                    companyname = $scope.question.option_new.empnewcompany;
                }
                
                $scope.employmentData = {
                    email: $scope.main.email,
                    clearEmployment:$scope.empClearEmployment,
                    companyid: $scope.question.option_new.empcompanyid,
                    companyname: companyname,
                    companyCountry : $scope.question.option_new.companyCountry,
                    // country: $scope.question.option_new.empCountryCode,
                    // state: $scope.question.option_new.empStateCode,
                    // metropolitan: $scope.question.option_new.empMetroCode,
                    titlecategory: $scope.question.option_new.emptitlecategory,
                    emppresent: $scope.question.option_new.emppresent,
                    exacttitle: $scope.question.option_new.empexacttitle,
                    startyear: $scope.question.option_new.empstartyear,
                    endyear: $scope.question.option_new.empendyear,
                    hideinfo: $scope.question.option_new.emphideinfo,
                    //New company data
                    newcompany: companyname,
                    newcountry: $scope.question.option_new.empnewcountry,
                    newstate: $scope.question.option_new.empnewstate,
                    newmetropolitanarea: $scope.question.option_new.empnewmetropolitanarea,
                    newurl: $scope.question.option_new.urlinput,
                    addnewcompany: $scope.question.option_new.empaddnewcompany
                }
                $scope.question.option_new.employmentSuccessMsg = false;
                $scope.question.option_new.employmentErrorMsg = false;
            } else {

                companyname = $scope.question.options[companyNumber - 1].searchText;
                if ($scope.question.options[companyNumber - 1].empaddnewcompany) {
                    companyname = $scope.question.options[companyNumber - 1].empnewcompany;
                }
                $scope.employmentData = {
                    email: $scope.main.email,
                    clearEmployment:$scope.empClearEmployment,
                    companyid: $scope.question.options[companyNumber - 1].empcompanyid,
                    companyname: companyname,
                    companyCountry : $scope.question.options[companyNumber - 1].companyCountry,
                    //country: $scope.question.options[companyNumber - 1].empCountryCode,
                    //state: $scope.question.options[companyNumber - 1].empStateCode,
                    //metropolitan: $scope.question.options[companyNumber - 1].empMetroCode,
                    titlecategory: $scope.question.options[companyNumber - 1].emptitlecategory,
                    emppresent: $scope.question.options[companyNumber - 1].emppresent,
                    exacttitle: $scope.question.options[companyNumber - 1].empexacttitle,
                    startyear: $scope.question.options[companyNumber - 1].empstartyear,
                    endyear: $scope.question.options[companyNumber - 1].empendyear,
                    hideinfo: $scope.question.options[companyNumber - 1].emphideinfo,
                    //New company data
                    newcompany: companyname,
                    newcountry: $scope.question.options[companyNumber - 1].empnewcountry,
                    newstate: $scope.question.options[companyNumber - 1].empnewstate,
                    newmetropolitanarea: $scope.question.options[companyNumber - 1].empnewmetropolitanarea,
                    newurl: $scope.question.options[companyNumber - 1].urlinput,
                    addnewcompany: $scope.question.options[companyNumber - 1].empaddnewcompany
                }
                $scope.question.options[companyNumber - 1].employmentSuccessMsg = false;
                $scope.question.options[companyNumber - 1].employmentErrorMsg = false;
              //  $scope.question.options[companyNumber - 1].companySearchLimitMsg = false;
            }               
            Employer.createEmployment($scope.employmentData).then(function (data) {
                if (data.data.success) {
                    //Remove 
                    // var index = $scope.expertise.option_new.selectedExpertiseSource.indexOf(data.data.oldCompany);
                    // if (index > -1) {                    
                    //     $scope.expertise.option_new.selectedExpertiseSource.splice(index, 1);
                    // }
                    // for(var i=0;i<$scope.expertise.options.length;i++) {
                    //     var index = $scope.expertise.options[i].selectedExpertiseSource.indexOf(data.data.oldCompany);
                    //     if (index > -1) {                            
                    //         $scope.expertise.options[i].selectedExpertiseSource.splice(index, 1);
                    //     }    
                    // }                    
                    if (companyNumber == 0) {                        
                        document.getElementById("empAddMoreFields").style = "background-color:lightgreen";
                        document.getElementById("empAddMoreFields").disabled = false;                        
                        if($scope.empClearEmployment) {                            
                            $scope.question.option_new.empRemoveStyle={'background-color':'lightgreen'};
                            $scope.question.option_new.empRemoveDisabled=false;
                            $scope.empClearEmployment = false;
                        } else {
                            $scope.question.option_new.empRemoveStyle={'background-color':'lightgrey'};
                            $scope.question.option_new.empRemoveDisabled=true;
                        }
                                                
                        for (company in data.data.employmentData) {                            
                            $scope.question.option_new.empcompanyid = data.data.employmentData[company].empcompanyid;
                            $scope.question.option_new.searchText = data.data.employmentData[company].searchText;
                            $scope.question.option_new.empcompanyCode = data.data.employmentData[company].empcompanyCode;
                            $scope.question.option_new.emppresent = data.data.employmentData[company].emppresent;
                            $scope.question.option_new.empstartyear = data.data.employmentData[company].empstartyear;
                            $scope.question.option_new.emptitlecategory = data.data.employmentData[company].emptitlecategory;
                            $scope.question.option_new.emphideinfo = data.data.employmentData[company].emphideinfo;
                            $scope.question.option_new.empendyear = data.data.employmentData[company].empendyear;
                        }
                        
                        if ($scope.question.option_new.emphideinfo) {
                            $scope.hideEmployment[$scope.hideEmployment.length+1] = $scope.question.option_new.searchText;                        
                        } else {
                            var index = $scope.hideEmployment.indexOf($scope.question.option_new.searchText);
                            if (index > -1) {
                                $scope.hideEmployment.splice(index, 1);
                            }                            
                        }
                        $scope.question.option_new.employmentSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.question.option_new.employmentSuccessMsg = false;
                        }, 2000);
                      }  else {        

                        if($scope.empClearEmployment) {
                            $scope.question.options[companyNumber - 1].empRemoveStyle={'background-color':'lightgreen'};
                            $scope.question.options[companyNumber - 1].empRemoveDisabled=false;
                            $scope.empClearEmployment = false;
                        } else {
                            $scope.question.options[companyNumber - 1].empRemoveStyle={'background-color':'lightgrey'};
                            $scope.question.options[companyNumber - 1].empRemoveDisabled=true;
                        }
                        
                        for (company in data.data.employmentData) {                            
                            $scope.question.options.push(data.data.employmentData[company]);                            
                        }
                        if ($scope.question.options[companyNumber - 1].emphideinfo) {                            
                            $scope.hideEmployment[$scope.hideEmployment.length+1] = $scope.question.options[companyNumber - 1].searchText;
                        } else {
                            var index = $scope.hideEmployment.indexOf($scope.question.options[companyNumber - 1].searchText);
                            if (index > -1) {
                                $scope.hideEmployment.splice(index, 1);
                            }                            
                        }

                        $scope.question.options[companyNumber - 1].employmentSuccessMsg = data.data.message;
                        $timeout(function () {
                            $scope.question.options[companyNumber - 1].employmentSuccessMsg = false;
                        }, 2000);
                    }                    
                } else {                  
                    if (companyNumber == 0) {
                        $scope.question.option_new.employmentErrorMsg = data.data.message;
                        $timeout(function () {
                            $scope.question.option_new.employmentErrorMsg = false;
                        }, 2000);
                    } else {                        
                        $scope.question.options[companyNumber - 1].employmentErrorMsg = data.data.message;
                        $timeout(function () {                        
                            $scope.question.options[companyNumber - 1].employmentErrorMsg = false;
                        }, 2000);
                    }
                }                
            });
        }
        this.removecompanyInfo = function (companyNumber) {
            if (companyNumber == 0) {
                $scope.question.option_new.empnewcompany = "";
                $scope.question.option_new.empnewcountry = "";
                $scope.question.option_new.empnewstate = "";
                $scope.question.option_new.empnewmetropolitanarea = "";
                $scope.question.option_new.urlinput = "";
            } else {
                $scope.question.options[companyNumber - 1].empnewcompany = "";
                $scope.question.options[companyNumber - 1].empnewcountry = "";
                $scope.question.options[companyNumber - 1].empnewstate = "";
                $scope.question.options[companyNumber - 1].empnewmetropolitanarea = "";
                $scope.question.options[companyNumber - 1].urlinput = "";
            }
        }
        this.clearStaticEmploymentField = function(){
            $scope.employerData = {
                email: $scope.main.email,
                //companyid:  $scope.question.options[companyNumber - 1].empcompanyid
            }
            //Check if company id 
            if ($scope.employerData.email != null) {
                Employer.deleteEmploymentByEmail($scope.employerData).then(function (data) {
                });
            }
                $scope.question.option_new.empcompanyid = "";
                $scope.question.option_new.empnewcompany = "";
                $scope.question.option_new.empnewcountry = "";
                $scope.question.option_new.empnewstate = "";
                $scope.question.option_new.empnewmetropolitanarea = "";
                $scope.question.option_new.urlinput = "";
                $scope.question.option_new.searchText = "";
                $scope.question.option_new.empcompanyCode = "";
                $scope.question.option_new.emppresent = "";
                $scope.question.option_new.empstartyear = "";
                $scope.question.option_new.emptitlecategory = "";
                $scope.question.option_new.emphideinfo = "";
                $scope.question.option_new.empendyear = "";
    }
     
     this.clearEmploymentFields = function (companyNumber) {
            
            if (companyNumber == 0) {
                //$scope.question.option_new.empcompanyid = "";
                if($scope.question.option_new.empcompanyid) {
                    $scope.empClearEmployment = true;
                }
                $scope.question.option_new.empnewcompany = "";
                $scope.question.option_new.empnewcountry = "";
                $scope.question.option_new.empnewstate = "";
                $scope.question.option_new.empnewmetropolitanarea = "";
                $scope.question.option_new.urlinput = "";
                $scope.question.option_new.searchText = "";
                $scope.question.option_new.empcompanyCode = "";
                $scope.question.option_new.emppresent = "";
                $scope.question.option_new.empstartyear = "";
                $scope.question.option_new.emptitlecategory = "";
                $scope.question.option_new.emphideinfo = "";
                $scope.question.option_new.empendyear = "";
            } else {
                if($scope.question.options[companyNumber - 1].empcompanyid) {
                    $scope.empClearEmployment = true;
                }
                $scope.question.options[companyNumber - 1].empnewcompany = "";
                $scope.question.options[companyNumber - 1].empnewcountry = "";
                $scope.question.options[companyNumber - 1].empnewstate = "";
                $scope.question.options[companyNumber - 1].empnewmetropolitanarea = "";
                $scope.question.options[companyNumber - 1].urlinput = "";
                $scope.question.options[companyNumber - 1].searchText = "";
                $scope.question.options[companyNumber - 1].empcompanyCode = "";
                $scope.question.options[companyNumber - 1].emppresent = "";
                $scope.question.options[companyNumber - 1].empstartyear = "";
                $scope.question.options[companyNumber - 1].emptitlecategory = "";
                $scope.question.options[companyNumber - 1].emphideinfo = "";
                $scope.question.options[companyNumber - 1].empendyear = "";
            }
        }
        
        this.submitEmploymentInfo = function (companyNumber) {
            //Employement Section data object             
            
            companyname = $scope.country.searchText;
            if($scope.country.empaddnewcompany) {
                companyname = $scope.country.empnewcompany;
            }
            $scope.empData = {
                email: $scope.main.email,
                companyname: companyname,
               // country: $scope.country.empCountryCode,
               // state: $scope.country.empStateCode,
              //  metropolitan: $scope.country.empMetroCode,
                titlecategory: $scope.country.emptitlecategory,
                emppresent: $scope.country.emppresent,
                exacttitle: $scope.country.empexacttitle,
                startyear: $scope.country.empstartyear,
                endyear: $scope.country.empendyear,
                hideinfo: $scope.country.emphideinfo,
                //New company data
                newcompany:companyname,
                newcountry:$scope.country.empnewcountry,
                newstate: $scope.country.empnewstate,
                newmetropolitanarea: $scope.country.empnewmetropolitanarea,
                newurl:$scope.country.urlinput,
                addnewcompany:$scope.country.empaddnewcompany
            }
            //if valid data, save data else, show error
            //if (valid) {
            app.emperrorMsg = false;
            //app.empsuccessMsg = false;
            app.empsuccessMsg = false;
            Employer.create($scope.empData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message                    
                    //app.empsuccessMsg = data.data.message;
                    app.empsuccessMsg = data.data.message;
                    //app.employmentSuccessMsg = data.data.message;
                    $timeout(function () {
                      app.empsuccessMsg = false;
                    }, 3000);  
                } else {
                    //create an error message
                    app.emperrorMsg = data.data.message;
                    //app.emperrorMsg = data.data.message;
                    $timeout(function () {
                        app.emperrorMsg = false;
                    }, 3000);  
                }
            });
        }

        this.getCurrentEmployment = function (companyNumber) {
            $scope.empClearEmployment = false;
            if (companyNumber == 0) {
                $scope.employerData = {
                    email: $scope.main.email,
                    companyid: $scope.question.option_new.empcompanyid
                }                
            } else {
                $scope.employerData = {
                    email: $scope.main.email,
                    companyid: $scope.question.options[companyNumber - 1].empcompanyid
                }
            }
            if ($scope.employerData.companyid) {
                Employer.getCurrentEmployment($scope.employerData).then(function (data) {
                    if (companyNumber == 0) {
                        for (company in data.data.employmentData) {
                            $scope.question.option_new.empcompanyid = data.data.employmentData[company].empcompanyid;
                            $scope.question.option_new.searchText = data.data.employmentData[company].searchText;
                            $scope.question.option_new.empcompanyCode = data.data.employmentData[company].empcompanyCode;
                            $scope.question.option_new.emppresent = data.data.employmentData[company].emppresent;
                            $scope.question.option_new.empstartyear = data.data.employmentData[company].empstartyear;
                            $scope.question.option_new.emptitlecategory = data.data.employmentData[company].emptitlecategory;
                            $scope.question.option_new.emphideinfo = data.data.employmentData[company].emphideinfo;
                            $scope.question.option_new.empendyear = data.data.employmentData[company].empendyear;
                        }
                    } else {
                        for (company in data.data.employmentData) {
                            $scope.question.options[companyNumber - 1] = data.data.employmentData[company];
                        }
                    }
                });
            }else{
                this.clearEmploymentFields(companyNumber);
            }
        }    /*******************************GET CURRENT EMPLOYMENT ENDS***************************/   

        $scope.hideEmployment = [];
        /********GET EMPLOYMENT STARTS********** */
        this.getEmployment = function () {
            // console.log("getemployment coming? ");
            $scope.employerData = {
                email: $scope.main.email
            }
            Employer.getEmployment($scope.employerData).then(function (data) {
                if (Object.keys(data.data.employmentData).length > 1) {
                    $scope.newEmployment = false;                    
                }
                if (Object.keys(data.data.employmentData).length == 0) {
                    $scope.newEmployment = true;
                    $scope.question.option_new.empRemoveStyle={'background-color':'lightgrey'};
                    $scope.question.option_new.empRemoveDisabled=true;
                }
                if (Object.keys(data.data.employmentData).length >= 1){
                    document.getElementById("empAddMoreFields").style = "background-color:lightgreen";
                    document.getElementById("empAddMoreFields").disabled = false;   
                }
                
                if (Object.keys(data.data.employmentData).length == 1) {
                    
                    $scope.question.option_new.empRemoveStyle={'background-color':'lightgrey'};
                    $scope.question.option_new.empRemoveDisabled=true;
                //if (Object.keys(data.data.employmentData).length == 1) {
                    for (company in data.data.employmentData) {
                        $scope.question.option_new.empcompanyid = data.data.employmentData[company].empcompanyid;
                        $scope.question.option_new.searchText = data.data.employmentData[company].searchText;
                        $scope.question.option_new.empcompanyCode = data.data.employmentData[company].empcompanyCode;
                        $scope.question.option_new.emppresent = data.data.employmentData[company].emppresent;
                        $scope.question.option_new.empstartyear = data.data.employmentData[company].empstartyear;
                        $scope.question.option_new.emptitlecategory = data.data.employmentData[company].emptitlecategory;
                        $scope.question.option_new.emphideinfo = data.data.employmentData[company].emphideinfo;
                        $scope.question.option_new.empexacttitle = data.data.employmentData[company].empexacttitle;
                        
                        $scope.question.option_new.empendyear = data.data.employmentData[company].empendyear;
                    }
                    $scope.newEmployment = true;
                    if(data.data.employmentData[company].emphideinfo){
                        $scope.hideEmployment[0] = data.data.employmentData[company].searchText;
                    } else {
                        var index = $scope.hideEmployment.indexOf($scope.question.option_new.searchText);
                        if (index > -1) {
                            $scope.hideEmployment.splice(index, 1);
                        }
                    }
                } else {
                    var index=0;
                    //var hideIndex = 0;
                    for (company in data.data.employmentData) {                        
                        $scope.question.options.push(data.data.employmentData[company]);
                        $scope.question.options[index].empRemoveStyle={'background-color':'lightgrey'};
                        $scope.question.options[index].empRemoveDisabled=true;
                        //console.log("Length: "+ $scope.hideEmployment.length);
                        if (data.data.employmentData[company].emphideinfo) {
                            $scope.hideEmployment[$scope.hideEmployment.length+1] = data.data.employmentData[company].searchText;
                            //hideIndex++;
                        } else {
                            var index = $scope.hideEmployment.indexOf(data.data.employmentData[company].searchText);
                            if (index > -1) {
                                $scope.hideEmployment.splice(index, 1);
                            }
                        }
                        index++;
                    }             
                }
                // console.log("Hide Employment: "+$scope.hideEmployment);
            });
        }/**********GET EMPLOYMENT ENDS********* */
        /******************************END OF ADD MORE FIELDS TO EMPLOYMENT SECTION******************************************* */
        this.getEmployer = function () {
            //Employer data object
            $scope.employerData = {
                email: $scope.main.email
            }
            var countryCode;
            Employer.getEmployer($scope.employerData).then(function (data) {
                console.log("Employer data: "+ $scope.employerData);
                if (data.data.employerData) {
                    app.searchText = data.data.employerData.companyname;
                   // app.empCountryCode = data.data.employerData.country;
                    //app.empStateCode = data.data.employerData.state;
                    //app.empMetroCode = data.data.employerData.metropolitanarea;
                    app.emptitlecategory = data.data.employerData.titlecategory;
                    app.emppresent = data.data.employerData.currentcompany;
                    app.empexacttitle = data.data.employerData.exacttitle;
                    app.empstartyear = data.data.employerData.startyear;
                    app.empendyear = data.data.employerData.endyear;
                    app.emphideinfo = data.data.employerData.hideinfo;
                    app.empnewcompany = data.data.employerData.newcompany;
                     //app.empnewcountry = data.data.employerData.newcountry;
                    // app.empnewcompanyurl = data.data.employerData.newcompanyurl;
    console.log("Employer data2: "+ data.data.employerData);
                   // Get State
                    if (app.empnewcountry == "us" || app.empnewcountry == "ca") {
                        app.empstateDisabled = false;

                        app.empmetroMsg = "";
                        State.getState(app.empnewcountry).then(function (data) {
                            if (data.data.stateData) {
                                app.empstateOption = data.data.stateData;
                            } else {
                                app.empstateOption = data.data.message;
                            }
                        });
                    }
                    //Get Metropolitan
                    if (app.empnewcountry == "") {
                        app.empmetroDisabled = true;
                    } else {
                        app.empmetroDisabled = false;
                    }

                    app.countryStateCode = app.empnewcountry;
                    if (app.empnewstate) {
                        //if (app.stateCode == "California") {
                        app.countryStateCode = app.empnewcountry + "." + app.empnewstate;
                        //}
                    }
                //     State.getMetropolitan(app.countryStateCode).then(function (data) {
                //         if (data.data.metropolitanData) {
                //             app.empmetroOption = data.data.metropolitanData;
                //         } else {
                //             app.empmetroOption = data.data.message;
                //         }
                //     });

            } else {
                
                    app.employerMsg = data.data.message;
                    // console.log("Emp: "+ app.employerMsg);
                 }
            });
        }
/**********************************************START OF HOBBIES SECTION CODE***************************************************************** */

        /***** submitHobbies STARTS******************************* */
        this.submitHobbies = function () {
            $scope.hobbyData = {
                email: $scope.main.email
            }
            //Header data object
            $scope.hobbiesData = {
                email: $scope.main.email,

                hobgeneralindoor: $scope.country.hobgeneralindoor,
                hobgeneralindoorImage: $scope.country.hobgeneralindoorImage,

                hobgeneraloutdoor: $scope.country.hobgeneraloutdoor,
                hobgeneraloutdoorImage: $scope.country.hobgeneraloutdoorImage,

                hobcollectionindoor: $scope.country.hobcollectionindoor,
                hobcollectionindoorImage: $scope.country.hobcollectionindoorImage,

                hobcollectionoutdoor: $scope.country.hobcollectionoutdoor,
                hobcollectionoutdoorImage: $scope.country.hobcollectionoutdoorImage,

                hobcompetitionindoor: $scope.country.hobcompetitionindoor,
                hobcompetitionindoorImage: $scope.country.hobcompetitionindoorImage,

                hobcompetitionoutdoor: $scope.country.hobcompetitionoutdoor,
                hobcompetitionoutdoorImage: $scope.country.hobcompetitionoutdoorImage,

                hobobservationindoor: $scope.country.hobobservationindoor,
                hobobservationindoorImage: $scope.country.hobobservationindoorImage,

                hobobservationoutdoor:$scope.country.hobobservationoutdoor,
                hobobservationoutdoorImage: $scope.country.hobobservationoutdoorImage,

                hobnewhobby: $scope.country.hobnewhobby
            }
            //if valid data, save data else, show error
            //if (valid) {   
            app.hobbyErrorMsg = false;
            app.hobbySuccessMsg = false;
            Hobby.createHobbies($scope.hobbiesData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message
                    app.hobbySuccessMsg = data.data.message;
                    $timeout(function () {
                        app.hobbySuccessMsg = false;
                    }, 2000);
                } else {
                    //create an error message
                    app.hobbyErrorMsg = data.data.message;
                    $timeout(function () {
                        app.hobbyErrorMsg = false;
                    }, 2000);
                }
            });
        }

        this.getHobbies = function () {
            $scope.hobbyData = {
                email: $scope.main.email
            }
            this.printSelectedGeneralIndoorHobbies = function () {
                return $scope.country.hobgeneralindoor.join(', ');
            }
            this.printSelectedGeneralOutdoorHobbies = function () {
                return $scope.country.hobgeneraloutdoor.join(', ');
            }
            this.printSelectedCollectionIndoorHobbies = function () {
                return $scope.country.hobcollectionindoor.join(', ');
            }
            this.printSelectedCollectionOutdoorHobbies = function () {
                return $scope.country.hobcollectionoutdoor.join(', ');
            }
            this.printSelectedCompetitionIndoorHobbies = function () {
                return $scope.country.hobcompetitionindoor.join(', ');
            }
            this.printSelectedCompetitionOutdoorHobbies = function () {
                return $scope.country.hobcompetitionoutdoor.join(', ');
            }
            this.printSelectedObservationIndoorHobbies = function () {
                return $scope.country.hobobservationindoor.join(', ');
            }
            this.printSelectedObservationOutdoorHobbies = function () {
                return $scope.country.hobobservationoutdoor.join(', ');
            }

            Hobby.getHobbies($scope.hobbyData).then(function (data) {
                if (data.data.success) {

                    app.hobgeneralindoor = [];
                    if (data.data.hobbyData.generalindoor) {
                        var indoorList = data.data.hobbyData.generalindoor.split(',');
                        for (i in indoorList) {
                            if (indoorList[i].toString() != "") {
                                app.hobgeneralindoor.push(indoorList[i].toString());
                            }
                        }
                    }

                    app.hobgeneraloutdoor = [];
                    if (data.data.hobbyData.generaloutdoor) {
                        var outdoorList = data.data.hobbyData.generaloutdoor.split(',');
                        for (i in outdoorList) {
                            if (outdoorList[i].toString() != "") {
                                app.hobgeneraloutdoor.push(outdoorList[i].toString());
                            }
                        }
                    }
                    app.hobcollectionindoor = [];
                    if (data.data.hobbyData.collectionindoor) {
                        var collectionindoorList = data.data.hobbyData.collectionindoor.split(',');
                        for (i in collectionindoorList) {
                            if (collectionindoorList[i].toString() != "") {
                                app.hobcollectionindoor.push(collectionindoorList[i].toString());
                            }
                        }
                    }
                    app.hobcollectionoutdoor = [];
                    if (data.data.hobbyData.collectionoutdoor) {
                        var collectionoutdoorList = data.data.hobbyData.collectionoutdoor.split(',');
                        for (i in collectionoutdoorList) {
                            if (collectionoutdoorList[i].toString() != "") {
                                app.hobcollectionoutdoor.push(collectionoutdoorList[i].toString());
                            }
                        }
                    }
                    app.hobcompetitionindoor = [];
                    if (data.data.hobbyData.competitionindoor) {
                        var competitionindoorList = data.data.hobbyData.competitionindoor.split(',');
                        for (i in competitionindoorList) {
                            if (competitionindoorList[i].toString() != "") {
                                app.hobcompetitionindoor.push(competitionindoorList[i].toString());
                            }
                        }
                    }
                    app.hobcompetitionoutdoor = [];
                    if (data.data.hobbyData.competitionoutdoor) {
                        var competitionoutdoorList = data.data.hobbyData.competitionoutdoor.split(',');
                        for (i in competitionoutdoorList) {
                            if (competitionoutdoorList[i].toString() != "") {
                                app.hobcompetitionoutdoor.push(competitionoutdoorList[i].toString());
                            }
                        }
                    }
                    app.hobobservationindoor = [];
                    if (data.data.hobbyData.observationindoor) {
                        var observationindoorList = data.data.hobbyData.observationindoor.split(',');
                        for (i in observationindoorList) {
                            if (observationindoorList[i].toString() != "") {
                                app.hobobservationindoor.push(observationindoorList[i].toString());
                            }
                        }
                    }
                    app.hobobservationoutdoor = [];
                    if (data.data.hobbyData.observationoutdoor) {
                        var observationoutdoorList = data.data.hobbyData.observationoutdoor.split(',');
                        for (i in observationoutdoorList) {
                            if (observationoutdoorList[i].toString() != "") {
                                app.hobobservationoutdoor.push(observationoutdoorList[i].toString());
                            }
                        }
                    }
                    //app.hobgeneraloutdoorImage = data.data.hobbyData.hobgeneraloutdoorImage;
                    app.hobcollectionindoorImage = data.data.hobbyData.hobcollectionindoorImage;
                    app.hobcollectionoutdoorImage = data.data.hobbyData.hobcollectionoutdoorImage;
                    app.hobcompetitionindoorImage = data.data.hobbyData.hobcompetitionindoorImage;
                    app.hobcompetitionoutdoorImage = data.data.hobbyData.hobcompetitionoutdoorImage;
                    app.hobobservationindoorImage = data.data.hobbyData.hobobservationindoorImage;
                    app.hobobservationoutdoorImage = data.data.hobbyData.hobobservationoutdoorImage;
                    app.hobnewhobby = data.data.hobbyData.newhobby;//newhobby is name in db.
                }
                else {
                    app.hobbyMsg = data.data.message;
                }
            });
        }

/**********************************************END OF HOBBIES SECTION CODE***************************************************************** */
        this.profileUser = function () {                        
            if ($scope.file.upload != null) {
                $scope.country.profileImage = $scope.file.upload.name;
            }
           // console.log("IS pic coming: " + $scope.file.upload.name);
            //Header data object
            $scope.headerData = {
                title: $scope.country.title,
                email: $scope.main.email,
                firstname: $scope.country.firstname,
                nickname: $scope.country.nickname,
                middlename: $scope.country.middlename,
                lastname: $scope.country.lastname,
                degree: $scope.country.degree,
                country: $scope.country.countryCode,
                state: $scope.country.stateCode,
                // city: $scope.country.city,
                metropolitanarea: $scope.country.metroCode,
                backgroundImage: $scope.country.backgroundImage,
                profileImage: $scope.country.profileImage
                // profileImage: $scope.file.upload.name
                
            }
            console.log("Whatis Background image: " + $scope.country.backgroundImage);
            if($scope.stepsModel[0]) {
                $scope.profileImageModel[0] = $scope.stepsModel[0];
                //$scope.removeProfileImage(0);
                app.replaceProfileImage();
                app.profileImageUploaded = false;
            } else {
                //console.log("Filename? "+ $scope.country.profileImageUploaded);
                //console.log("uploaded Filename? "+ $scope.file.upload.name);
                //console.log("profileimage Filename? "+ $scope.country.profileImage);
                $scope.profileImageModel = [];                
                //$scope.profileImageModel[0] = $scope.country.profileImage;
            }
            
            
            //if valid data, save data else, show error
            //if (valid) {                
            app.errorMsg = false;
            app.successMsg = false;
            Profile.create($scope.headerData).then(function (data) {
                if (data.data.success) {
                    //Create Success Message
                    app.successMsg = data.data.message;
                    
                    
                    $timeout(function () {
                        app.successMsg = false;
                       // console.log("2sec pic: " + $scope.file.upload.name);
                      //  app.profileImage = $scope.file.upload.name;

                    }, 2000);                    
                } else {
                    //create an error message
                    app.errorMsg = data.data.message;
                    $timeout(function () {
                        app.errorMsg = false;
                    }, 2000);  
                }
            });
        }

        this.openExpertProfile = function() {
            var mainEncodedEmail = $scope.main.encodedEmail;
            window.open('/expertprofile/'+mainEncodedEmail, this.target,'left=300,top=90,height=400,width=800');
            return true;
        }
         this.getProfile = function () {
            //Profile data object
            $scope.profileData = {
                email: $scope.main.email
            }
            var countryCode;
            Profile.getProfile($scope.profileData).then(function (data) {                
                app.profileImage = false;
                if (data.data.profileData) {
                    
                    app.title = data.data.profileData.title;
                    app.firstname = data.data.profileData.firstname;
                    app.lastname = data.data.profileData.lastname;
                    app.nickname = data.data.profileData.nickname;
                    app.middlename = data.data.profileData.middlename;
                    app.degree = data.data.profileData.degree;
                    app.countryCode = data.data.profileData.country;
                    app.stateCode = data.data.profileData.state;
                    app.metroCode = data.data.profileData.metropolitanarea;
                    app.backgroundImage = data.data.profileData.backgroundImage;
                    app.profileImage = data.data.profileData.profileImage;
                    // app.profileImageUploaded =  "https://storage.googleapis.com/bobo-0518/"+data.data.profileData.profileImage;
                    app.profileImageUploaded = data.data.profileData.profileImage;
                    $scope.profileImageModel.splice(0,1);
                    //$scope.stepsModel.splice(0,1);
                    // $scope.file = {};
                                                            
                    document.getElementById("fileinput").value = "";
                    
                    
                    if(!app.stepModelImage) {
                        app.stepModelImage = true;
                    } else {
                        app.stepModelImage = false;
                        $scope.stepsModel.splice(0,1);
                    }
                    
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

        this.getState = function (countryCode) {
            app.stateDisabled = true;
            app.stateOption = "empty State";
            if (countryCode == "us" || countryCode == "ca") {
                app.stateOption = "Select State";
                app.stateDisabled = false;
                app.metroDisabled = true;
                app.metroOption = "";
                State.getState(countryCode).then(function (data) {
                    if (data.data.stateData) {
                        app.stateOption = data.data.stateData;
                    } else {
                        app.stateOption = data.data.message;
                    }
                });
            } else {
                this.getMetropolitan(countryCode);
            }
        }

        this.getMetropolitan = function (countryCode, stateCode) {             
            if (countryCode == "") {
                app.metroDisabled = true;
            } else {
                app.metroDisabled = false;
            }
            app.metroMsg = "empty Metropolitans";
            $scope.countryStateCode = countryCode;
            if (stateCode != null) {
                //if ($scope.country.stateCode == "California") {
                $scope.countryStateCode = countryCode + '.' + stateCode;
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

        this.getEmpState = function  (countryCode, companyNumber) {
            if(companyNumber == 0 ) {                                
                $scope.question.option_new.empstateDisabled = true;
                $scope.question.option_new.empstateOption = "empty State";
            } else {
                $scope.question.options[companyNumber-1].empstateDisabled = true;
                $scope.question.options[companyNumber-1].empstateOption = "empty State";
            }
            if (countryCode == "us" || countryCode == "ca") {
                if(companyNumber==0) {
                    $scope.question.option_new.empstateOption = "Select State";                
                    $scope.question.option_new.empstateDisabled = false;
                    $scope.question.option_new.empmetroDisabled = true;
                    $scope.question.option_new.empmetroOption = "";
                } else {
                    $scope.question.options[companyNumber-1].empstateOption = "Select State";                
                    $scope.question.options[companyNumber-1].empstateDisabled = false;
                    $scope.question.options[companyNumber-1].empmetroDisabled = true;
                    $scope.question.options[companyNumber-1].empmetroOption = "";
                }
                
                State.getState(countryCode).then(function (data) {
                    if (data.data.stateData) {
                        if(companyNumber==0) {
                            $scope.question.option_new.empstateOption = data.data.stateData;
                        } else {
                            $scope.question.options[companyNumber-1].empstateOption = data.data.stateData;
                        }
                    } else {
                        if(companyNumber==0) {
                            $scope.question.option_new.empstateOption = data.data.message;
                        } else {
                            $scope.question.options[companyNumber-1].empstateOption = data.data.message;
                        }                        
                    }
                });
            } else {
                this.getEmpMetropolitan(countryCode,'', companyNumber);
            }
        }

        this.getEmpMetropolitan = function (countryCode, stateCode, companyNumber) {
            if (companyNumber == 0) {
                if (countryCode == "") {
                    $scope.question.option_new.empmetroDisabled = true;
                } else {
                    $scope.question.option_new.empmetroDisabled = false;
                }
                $scope.question.option_new.empmetroMsg = "empty Metropolitans";
                $scope.countryStateCode = countryCode;
            } else {
                if (countryCode == "") {
                    $scope.question.options[companyNumber - 1].empmetroDisabled = true;
                } else {
                    $scope.question.options[companyNumber - 1].empmetroDisabled = false;
                }
                $scope.question.options[companyNumber - 1].empmetroMsg = "empty Metropolitans";
                $scope.countryStateCode = countryCode;
            }
            if (stateCode != null) {
                $scope.countryStateCode = countryCode + '.' + stateCode;
            }
            
            State.getMetropolitan($scope.countryStateCode).then(function (data) {
                if (data.data.metropolitanData) {
                    if(companyNumber==0) {
                        $scope.question.option_new.empmetroOption = data.data.metropolitanData;
                    } else {
                        $scope.question.options[companyNumber - 1].empmetroOption = data.data.metropolitanData;
                    }                    
                } else {
                    if(companyNumber==0) {
                        $scope.question.option_new.empmetroOption = data.data.message;
                    } else {
                        $scope.question.options[companyNumber - 1].empmetroOption = data.data.message;
                    }
                    
                }
            });
        }
        
        this.selectedItemChange = function(companyCountry, companyNumber) {
            console.log("company country: "+ companyCountry);
            if(companyNumber==0) {
                $scope.question.option_new.companyCountry = companyCountry;
            } else {
                $scope.question.options[companyNumber-1].companyCountry = companyCountry;
            }
        }

        this.selectedEducationChange = function(eduCompanyCountry, companyNumber) {
            console.log("education country: "+ eduCompanyCountry);
            if(companyNumber==0) {
                $scope.eduObject.option_new.eduCompanyCountry = eduCompanyCountry;
            } else {
                $scope.eduObject.options[companyNumber-1].eduCompanyCountry = eduCompanyCountry;
            }
        }

        this.querySearch = function (searchText, companyNumber) {
            if(companyNumber==0) {
                $scope.question.option_new.companySearchLimitMsg = false;    
            } else {
                $scope.question.options[companyNumber-1].companySearchLimitMsg = false;
            }
            
            return Company.getCompany(searchText).then(function (data) {
                if (Object.keys(data.data.companyData).length == 101) {
                    if(companyNumber==0) {
                        $scope.question.option_new.companySearchLimitMsg = true;
                    } else {
                        $scope.question.options[companyNumber-1].companySearchLimitMsg = true;
                    }                    
                }
                return data.data.companyData;
            });
        }

 });        
