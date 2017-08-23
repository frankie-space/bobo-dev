angular.module('mainController',['authServices'])

// Controller: mainCtrl is used to handle login and main index functions (stuff that should run on every page)	
.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope){
    var app = this;
    app.loadme = false;// Hide main HTML until data is obtained in AngularJS

// Will run code every time a route changes
    $rootScope.$on('$routeChangeStart', function () {
        // Check if user is logged in
        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;// Variable to activate ng-show on index
            // Custom function to retrieve user data
            Auth.getUser().then(function (data) {
                //console.log(data.data.fullname);
                app.firstname = data.data.firstname;
                app.lastname = data.data.lastname;
                //app.fullname = data.data.fullname;
                app.email = data.data.email;
                app.loadme = true;// Show main HTML now that data is obtained in AngularJS
            });

        } else {
            app.isLoggedIn = false;// User is not logged in, set variable to false
            app.firstname = '';
            app.lastname = '';
            // app.fullname = ''; // Clear name
            app.loadme = true;  // Show main HTML now that data is obtained in AngularJS
        }


    });

    this.doLogin = function(loginData){
        app.errorMsg = false;
        app.expired = false; // Clear expired whenever user attempts a login 
        app.disabled = true; // Disable form on submission
        // Function that performs login
        Auth.login(app.loginData).then(function(data){
            // Check if login was successful 
          if(data.data.success){
                //Create Success Message
                app.successMsg = data.data.message;                
                $timeout(function(){
                 $location.path('/expertprofile');
                 app.loginData ='';
                 app.successMsg = false; 
                 app.disabled= false;// Enable form on submission
             },1000);
                
        }else{
             
            if(data.data.expired){
                 //create an error message
            app.expired = true;  
            app.errorMsg = data.data.message; 
        }else{
            app.disabled = false;
            app.errorMsg = data.data.message; 
        }        
        }

        });

    };
    this.logout = function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        }, 1000); 
    };

    //  this.profileUser = function() {
    //         console.log('form submitted');
    //         console.log(this.headerData);            
    //     };
});

// .controller('countryCtrl', ['$scope','$http', function($scope,$http) {
//         $scope.countryList= [];
//         $http.get("country.json").then(function(data){                        
//             $scope.countryList  = data;
//         })        

//     }]

// );



