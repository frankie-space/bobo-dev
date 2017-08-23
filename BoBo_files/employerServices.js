angular.module('employerServices', [])

    .factory('Employer', function ($http) {
        var employerFactory = {};


        employerFactory.create = function (employerData) {
            return $http.post('/api/employmentInfo', employerData);
        }
        employerFactory.getEmployer = function (employerData) {
            return $http.post('/api/getEmployer', employerData);
        }


        return employerFactory;
    });

