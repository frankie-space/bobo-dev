 angular.module('userServices',[])
 
 .factory('User',function($http){
    var userFactory={};

    //User.create(regData);
    userFactory.create=function(regData){
    return $http.post('/api/users', regData);
}
//User.checkEmail(regData);
userFactory.checkEmail=function(regData){
    return $http.post('/api/checkemail', regData);
}
//User.activateAccount(token);
userFactory.activateAccount = function(token){
    return $http.put('/api/activate/' + token);
} 
//User.checkCredentials(loginData);
userFactory.checkCredentials = function(loginData){
    return $http.post('/api/resend', loginData);
};
//User.resendLink(fullname);
/*
userFactory.resendLink = function(fullname){
    return $http.post('/api/resend', fullname)
};*/
//User.resendLink(firstname);
userFactory.resendLink = function(firstname){
    return $http.post('/api/resend', firstname)
};
//User.resendLink(lastname);
userFactory.resendLink = function(lastname){
    return $http.post('/api/resend', lastname)
}
     return userFactory;
 });

