angular.module('educationServices', [])

.factory('Education', function ($http) {
    var educationFactory = {};

    educationFactory.createEducation = function (universityData) {
        return $http.post('/api/createEducation', universityData);
    }
    educationFactory.getEducation = function (universityData) {
        return $http.post('/api/getEducation', universityData);
    }
    educationFactory.getCurrentEducation = function (universityData) {
        return $http.post('/api/getCurrentEducation', universityData);
    }
    educationFactory.deleteCurrentEducation = function (universityData) {
        return $http.post('/api/deleteCurrentEducation', universityData);
    }
    educationFactory.deleteEducationByEmail = function (universityData) {
        return $http.post('/api/deleteEducationByEmail', universityData);
    }
    
    
        return educationFactory;
});