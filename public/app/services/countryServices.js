angular.module('countryServices', [])

    .factory('Country', function ($http) {
        var countryFactory = {};

        countryFactory.getCountry = function () {
            return $http.post('/api/getCountry');
        }
        return countryFactory;
    });

