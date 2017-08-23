angular.module('stateServices', [])

    .factory('State', function ($http) {
        var stateFactory = {};

        stateFactory.getState = function(countryCode) {
            return $http.post('/api/getState/' + countryCode);            
        }
         stateFactory.getMetropolitan = function(countryStateCode) {
            return $http.post('/api/getMetropolitan/' + countryStateCode);            
        }

        stateFactory.getMetropolitanByCode = function(metroCode) {            
            return $http.post('/api/getMetropolitanByCode/' + metroCode);
        }

        
        return stateFactory;
    });
    