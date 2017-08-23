angular.module('endorsementServices', [])

    .factory('EndorsementExpertise', function ($http) {
        var endorsementExpertiseFactory = {};

        endorsementExpertiseFactory.createEndorsementExpertise = function (endorsementExpertiseData) {
            return $http.post('/api/createEndorsementExpertise', endorsementExpertiseData);
        }
        endorsementExpertiseFactory.sendEmail = function (composeEmail) {
            return $http.post('/api/sendEmail', composeEmail);
        }

        return endorsementExpertiseFactory;
    })

    .factory('EndorsementRecognition', function ($http) {
        var endorsementRecognitionFactory = {};

        endorsementRecognitionFactory.createEndorsementRecognition = function (endorsementRecognitionData) {
            return $http.post('/api/createEndorsementRecognition', endorsementRecognitionData);
        }
        return endorsementRecognitionFactory;
    });


