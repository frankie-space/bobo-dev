angular.module('companyServices', [])

    .factory('Company', function ($http) {
        var companyFactory = {};
        
        // companyFactory.create = function(newCompanyData){
        //     return $http.post('/api/')
        // }
        companyFactory.getCompany = function (searchText) {
            return $http.get('/api/getCompany'+ searchText);
        }

        companyFactory.getCompanyByIds = function (companyids) {
            return $http.post('/api/getCompanyByIds', companyids);
        }

        companyFactory.getCompanyByName = function (companyname) {
            return $http.post('/api/getCompanyByName', companyname);
        }

        return companyFactory;
    });

