angular.module('userpendingconnectionServices', [])

    .factory('UserPendingConnection', function ($http) {
        var userpendingconnectionFactory = {};

        userpendingconnectionFactory.createUserPendingConnection = function (pendingConnectionData) {
            return $http.post('/api/createUserPendingConnection/', pendingConnectionData);
        }

        userpendingconnectionFactory.sendConnectionRequestEmail = function (composeEmail) {
            return $http.post('/api/sendConnectionRequestEmail', composeEmail);
        }
        
        userpendingconnectionFactory.getUserPendingConnection = function (email) {
            return $http.post('/api/getUserPendingConnection/', email);
        }

        userpendingconnectionFactory.approveUser = function (pendingUser) {
            return $http.post('/api/approveUser/', pendingUser);
        }

        userpendingconnectionFactory.deleteUser = function (pendingUser) {
            return $http.post('/api/deleteUser/', pendingUser);
        }
        
        

        return userpendingconnectionFactory;
    });

