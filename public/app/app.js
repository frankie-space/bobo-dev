angular.module('userApp',['appRoutes','userControllers','userServices','mainController','authServices','emailController','countryControllers','expertProfileControllers','composeEmailControllers','countryServices','stateServices','profileServices','companyServices','ngMaterial','ngAnimate','ngAria', 'ngRightClick'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});

