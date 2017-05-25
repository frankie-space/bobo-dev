angular.module('userControllers',['userServices'])

.controller('regCtrl', function($http,$location,$timeout,User){
    var app = this;
    this.disablebutton = function() {
        document.getElementById('close-btn').disabled=false;
        document.getElementById('radio-btn').checked = true;
    };

    this.homeRedirect = function() {
        window.location.href ='http://localhost:8080/';
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

