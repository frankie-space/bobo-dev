angular.module('userApp',['appRoutes','userControllers','userServices','mainController','authServices','emailController','countryControllers','countryServices','stateServices','profileServices','ngMaterial','ngAnimate','ngAria'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});

