angular.module('hobbyServices', [])

.factory('Hobby', function ($http) {
    var hobbyFactory = {};

hobbyFactory.createHobbies = function (hobbyData) {
        return $http.post('/api/createHobbies', hobbyData);
    }
hobbyFactory.getHobbies = function (hobbyData) {
        return $http.post('/api/getHobbies', hobbyData);
    }
    return hobbyFactory;
});
