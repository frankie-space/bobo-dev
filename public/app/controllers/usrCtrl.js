angular.module('userControllers',['userServices'])
// Controller: regCtrl is used for users to register an account
.controller('regCtrl', function($http,$location,$timeout,$routeParams, User){
    var app = this;
    this.disablebutton = function() {
        document.getElementById('close-btn').disabled=false;
        document.getElementById('radio-btn').checked = true;
    };

    this.homeRedirect = function () {
        // if ($routeParams.email) {
        //     var temp = $routeParams.email;
        //     var data = temp.split('&');
        //     if (data.length > 1) {
        //         $routeParams.email = data[0];
        //         $scope.regData = {
        //             email: atob(data[1])
        //         }
        //         User.createReminderUser(app.regData).then(function (data) {
        //             if (data.data.success) {
        //                 app.successMsg = data.data.message;
        //                 $timeout(function () {
        //                     $location.path('/signupsuccess');
        //                 }, 2000);

        //             } else {
        //                 app.errorMsg = data.data.message;
        //             }
        //         });
        //     }
        // }
        window.close();
        //window.location.href ='http://localhost:8080/';
    };

    this.regUser = function(regData, valid){
        app.errorMsg = false;
        //console.log('form submitted');
        //console.log(this.regData);
        //organized code with services
        if(valid){

            User.create(app.regData).then(function(data){
        //$http.post('/api/users', this.regData).then(function(data){
            if(data.data.success){
                //Create Success Message
                app.successMsg = data.data.message;
                //Redirect to Login page
                $timeout(function(){
                $location.path('/signupsuccess');
                },2000);
                
        }else{
            //create an error message
            app.errorMsg = data.data.message;
        }

        });

        }else{
             app.errorMsg = 'Please ensure form is filled out correctly';
        }
    };
    this.checkEmail = function(regData){
        app.checkingEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false; 
        // Runs custom function that checks if e-mail is available for user to use  
        User.checkEmail(app.regData).then(function(data){
           if(data.data.success){
               app.checkingEmail = false;
               app.emailInvalid = false;
               app.emailMsg=data.data.message;
           }else{
               app.checkingEmail = false;
               app.emailInvalid = true;
               app.emailMsg = data.data.message;
           }
        });
    }
    
})
.directive('match', function(){
        return{
            restrict:'A',
            controller: function($scope){
            $scope.confirmed = false;
            // Custom function that checks both inputs against each other    
            $scope.doConfirm = function(values){
            values.forEach(function(ele){
                if($scope.confirm == ele){
                    $scope.confirmed = true;
                }else{
                    $scope.confirmed = false;
                }
            }); 
            }
            },
            link: function(scope,element,attrs){
                attrs.$observe('match', function(){
                   scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                scope.$watch('confirm', function(){
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }
        };
    });

