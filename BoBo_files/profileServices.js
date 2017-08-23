angular.module('profileServices', [])

    .factory('Profile', function ($http) {
        var profileFactory = {};


        profileFactory.create = function (profileData) {
            return $http.post('/api/profileUser', profileData);
        }
        profileFactory.getProfile = function (profileData) {
            return $http.post('/api/getProfile', profileData);
        }


        return profileFactory;
    });

