angular.module('emailController',['userServices'])
// Controller: emailCtrl is used to activate the user's account 
    .controller('emailCtrl', function($routeParams, User, $timeout, $location){
        app = this;
    //Check function that grabs token from URL and checks database runs on page load
    User.activateAccount($routeParams.token).then(function(data){
        app.errorMsg = false; // Clear errorMsg each time user submits

        //Check if activation was successful or not
        if(data.data.success){
            app.successMsg = data.data.message; //If successful, grab message from JSON object and redirect to login page
            // Redirect after 2000 milliseconds (2 seconds)
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '...Redirecting'; // If not successful, grab message from JSON object and redirect to login page
                // Redirect after 2000 milliseconds (2 seconds)
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
        }
    });

})
// .controller('composeEmailCtrl', function($scope){//, $scope){
//     app = this;
//    //Compose Email using communication console

//     $scope.isPopupVisible = false;
//     $scope.isComposePopupVisible = false;
//      $scope.composeEmail = {};
    
//     $scope.sendEmail = function() {
//         $scope.isComposePopupVisible = false;
//         alert($scope.composeEmail.to 
//               + " " + $scope.composeEmail.subject
//               + " " + $scope.composeEmail.body);
//     };
    
//     $scope.showComposePopup = function() {
//         console.log("coming console: ");
//         $scope.composeEmail = {};
//         $scope.isComposePopupVisible = true;
//     };
    
//     $scope.closeComposePopup = function() {
//         $scope.isComposePopupVisible = false;
//     };
    
//     $scope.showPopup = function(email) {

//         $scope.isPopupVisible = true;
//         $scope.selectedEmail = email;
//     };
    
//     $scope.closePopup = function() {
//         $scope.isPopupVisible = false;
//     };
    
//     $scope.emails = [
//         { 
//             from: 'John', 
//             subject: 'I love angular', 
//             date: 'Jan 1', 
//             body: 'hello world!' 
//         },
//         { 
//             from: 'Jack', 
//             subject: 'Angular and I are just friends', 
//             date: 'Feb 15', 
//             body: 'just kidding' 
//         },
//         { 
//             from: 'Ember', 
//             subject: 'I hate you Angular!', 
//             date: 'Dec 8', 
//             body: 'wassup dude' 
//         }
//     ];
//     })

    //     $scope.showComposePopup = function() {
       
//         $scope.isComposePopupVisible = true;
//         //$scope.isPopupVisible = true;
        
//     };
//      console.log("coming here console? "+ $scope.isComposePopupVisible);
//     $scope.closeComposePopup = function() {
//         $scope.isComposePopupVisible = false;
//     };
    
//     $scope.showPopup = function(email) {
//         $scope.isPopupVisible = true;
//         $scope.selectedEmail = email;
//     };
    
//     $scope.closePopup = function() {
//         $scope.isPopupVisible = false;
//     };
// $scope.emails = [
//         { 
//             from: 'John', 
//             subject: 'I love angular', 
//             date: 'Jan 1', 
//             body: 'hello world!' 
//         },
//         { 
//             from: 'Jack', 
//             subject: 'Angular and I are just friends', 
//             date: 'Feb 15', 
//             body: 'just kidding' 
//         },
//         { 
//             from: 'Ember', 
//             subject: 'I hate you Angular!', 
//             date: 'Dec 8', 
//             body: 'wassup dude' 
//         }
//     ];


.controller('resendCtrl', function(User){//, $scope){

    app = this;

// Custom function that check's the user's credentials against the database
        app.checkCredentials = function(loginData){//, valid) {
           // if(valid){
            app.disabled = true; // Disable the form when user submits to prevent multiple requests to server
            app.errorMsg = false; // Clear errorMsg each time user submits
            app.successMsg = false;

            // Runs custom function that check's the user's credentials against the database
            User.checkCredentials(app.loginData).then(function(data) {
                // Check if credentials match
                if (data.data.success) {
                    // Custom function that sends activation link
                    User.resendLink(app.loginData).then(function(data) {
                        // Check if sending of link is successful
                        if (data.data.success) {
                            //$scope.alert = 'alert alert-success';
                            app.successMsg = data.data.message; // If successful, grab message from JSON object
                        } else {
                            //$scope.alert = 'alert alert-danger';
                            app.errorMsg = data.data.message; // If not successful, grab message from JSON object
                        }
                    });
                } else {
                    app.disabled = false; // If error occurs, remove disable lock from form
                   // $scope.alert = 'alert alert-danger';
                    app.errorMsg = data.data.message; // If credentials do not match, display error from JSON object
                }
            });
        //    } else{
        //     $scope.alert = 'alert alert-danger';
        //     app.errorMsg = 'Please ensure form is filled out properly';
        //     }
        };
    });