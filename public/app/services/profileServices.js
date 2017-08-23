angular.module('profileServices', [])

    .factory('Profile', function ($http) {
        var profileFactory = {};


        profileFactory.create = function (profileData) {
            return $http.post('/api/profileUser', profileData);
        }
        profileFactory.getProfile = function (profileData) {
            return $http.post('/api/getProfile', profileData);
        }
        profileFactory.deleteProfileImage = function (profileData) {
            return $http.post('/api/deleteProfileImage', profileData);
        }


        return profileFactory;
    });

