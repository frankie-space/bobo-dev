angular.module('appRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })
            .when('/register', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })
            .when('/register/:email', {
                templateUrl: 'app/views/pages/users/register.html',
                controller: 'regCtrl',
                controllerAs: 'register',
                authenticated: false
            })
            .when('/login', {
                templateUrl: 'app/views/pages/users/login.html',
                authenticated: false
            })
            .when('/logout', {
                templateUrl: 'app/views/pages/users/logout.html',
                authenticated: true
            })
            .when('/temp', {
                templateUrl: 'app/views/pages/users/temp.html',
                authenticated: true
            })
            
            .when('/loginPopup', {
                templateUrl: 'app/views/pages/users/loginPopup.html'
                // controller: 'expertProfileCtrl',
                // controllerAs: 'expertprofile',
                // authenticated: false
            })
            .when('/expertprofile', {
                templateUrl: 'app/views/pages/users/expertprofile.html',
                controller: 'expertProfileCtrl',
                controllerAs: 'expertprofile',
                authenticated: true
            })
            .when('/testingamazonrating', {
                templateUrl: 'app/views/pages/users/testingamazonrating.html',
                authenticated:true
            })
            .when('/expertprofile/:email', {
                templateUrl: 'app/views/pages/users/expertprofile.html',
                controller: 'expertProfileCtrl',
                controllerAs: 'expertprofile',
                authenticated: true
            })
            .when('/communicationconsolewithemail', {
                templateUrl: 'app/views/pages/users/communicationconsolewithemail.html',
                controller: 'composeEmailCtrl',
                controllerAs: 'composeemail'
                //authenticated: true
            })
            .when('/signupsuccess', {
                templateUrl: 'app/views/pages/users/signupsuccess.html'
            })
            .when('/resetpassword', {
                templateUrl: 'app/views/pages/users/resetpassword.html'
            })
            .when('/activate/:token', {
                templateUrl: 'app/views/pages/users/activation/activate.html',
                controller: 'emailCtrl',
                controllerAs: 'email'
            })

            .when('/createnewemployer', {
                templateUrl: 'app/views/pages/users/createnewemployer.html',
                authenticated: true
            })

            .when('/eep', {
                templateUrl: 'app/views/pages/users/eep.html',
                controller: 'countryCtrl',
                controllerAs: 'country',
                authenticated: true
            })
            .when('/resend', {
                templateUrl: 'app/views/pages/users/activation/resend.html',
                controller: 'resendCtrl',
                controllerAs: 'resend',
                authenticated: false

            })

            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            reequireBase: false
        });
    });
