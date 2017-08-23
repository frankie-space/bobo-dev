angular.module('expertiseServices', [])

    .factory('Expertise', function ($http) {
        var expertiseFactory = {};

        expertiseFactory.createExpertise = function (expertData) {
            return $http.post('/api/createExpertise', expertData);
        }
        expertiseFactory.getExpertise = function (expertData) {
            return $http.post('/api/getExpertise', expertData);
        }
        expertiseFactory.getCurrentExpertise = function (expertData) {
            return $http.post('/api/getCurrentExpertise', expertData);
        }

        expertiseFactory.getExpertiseSource = function (expertData) {
            return $http.post('/api/getExpertiseSource', expertData);
        }

        expertiseFactory.getExpertExpertise = function (expertData) {
            return $http.post('/api/getExpertExpertise', expertData);
        }
        
        
        return expertiseFactory;
    });
