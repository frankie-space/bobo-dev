angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){

    $routeProvider
    .when('/', {
       templateUrl:'app/views/pages/home.html'
    })
    .when('/register', {
        templateUrl:'app/views/pages/users/register.html',
        controller:'regCtrl',
        controllerAs:'register',
        authenticated: false

    })
    .when('/login',{
        templateUrl:'app/views/pages/users/login.html',
        authenticated: false
      })
      .when('/logout', {
        templateUrl:'app/views/pages/users/logout.html',
        authenticated: true
    })
    .when('/expertprofile', {
        templateUrl:'app/views/pages/users/expertprofile.html'
    })
    .when('/signupsuccess',{
        templateUrl:'app/views/pages/users/signupsuccess.html'
     })
     .when('/resetpassword', {
        templateUrl:'app/views/pages/users/resetpassword.html'
    })
    .when('/activate/:token', {        
        templateUrl:'app/views/pages/users/activation/activate.html',
        controller:'emailCtrl',
        controllerAs: 'email'
    })
    
    .when('/eep', {
    templateUrl:'app/views/pages/users/eep.html',
    authenticated: true
})
    .when('/resend', {
    templateUrl:'app/views/pages/users/activation/resend.html',
    controller: 'resendCtrl',
    controllerAs:'resend'
})
    
    .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
        enabled:true,
        reequireBase:false
    });
});
     
