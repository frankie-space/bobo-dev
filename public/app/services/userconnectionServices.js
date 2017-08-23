angular.module('userconnectionServices', [])

    .factory('UserConnection', function ($http) {
        var userconnectionFactory = {};

        userconnectionFactory.getUserConnections = function (email) {
            return $http.post('/api/getUserConnections/', email);
        }

        return userconnectionFactory;
    });

