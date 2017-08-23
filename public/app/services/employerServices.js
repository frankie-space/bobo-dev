angular.module('employerServices', [])

    .factory('Employer', function ($http) {
        var employerFactory = {};


        employerFactory.create = function (employerData) {
            return $http.post('/api/employmentInfo', employerData);
        }
        employerFactory.createEmployment = function (employerData) {
            return $http.post('/api/createEmployment', employerData);
        }
        
        employerFactory.getEmployer = function (employerData) {
            return $http.post('/api/getEmployer', employerData);
        }
        
        employerFactory.getEmployment = function (employerData) {
            return $http.post('/api/getEmployment', employerData);
        }

        employerFactory.getCurrentEmployment = function (employerData) {
            return $http.post('/api/getCurrentEmployment', employerData);
        }

        employerFactory.deleteCurrentEmployment = function (employerData) {
            return $http.post('/api/deleteCurrentEmployment', employerData);
        }

        employerFactory.deleteEmploymentByEmail = function (employerData) {
            return $http.post('/api/deleteEmploymentByEmail', employerData);
        }

        return employerFactory;
    });

