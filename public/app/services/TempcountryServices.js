//  angular.module('countryController', ['countryService'])
 
//  .controller('countryCtrol', function($scope,countryService){
//     var promise = countryService.getCountry();
//     promise.then(function(data){
//         $scope.countryList = data.data;
//         alert(data.data[0].name);
//         console.log($scope.countryList);
//         //alert($scope.country);
//     });
// })

// .service('countryService', function($http, $q){
//     var deferred = $q.defer(); // to do some thing later
//     $http.get('country.json').then(function(data){
//         deferred.resolve(data);
//     });
//     this.getCountry = function(){
//         return deferred.promise; 
//     }
// });


// //app.controller('countryCtrol',countryCtrol);
