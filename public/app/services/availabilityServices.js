angular.module('availabilityServices', [])

    .factory('Availability', function ($http) {
        var availabilityFactory = {};
        
       
       availabilityFactory.createAvailabilities = function (availableData) {
        return $http.post('/api/createAvailabilities', availableData);
    }

        availabilityFactory.getAvailabilities = function (availableData) {
            return $http.post('/api/getAvailabilities', availableData);
        }


        return availabilityFactory;
    });

