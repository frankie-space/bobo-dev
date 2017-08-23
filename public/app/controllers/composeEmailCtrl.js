angular.module('composeEmailControllers', ['authServices', 'endorsementServices'])
    .controller('composeEmailCtrl', function ($scope,$timeout, EndorsementExpertise) {//, $scope){
        var app = this;
        //Compose Email using communication console

        $scope.isPopupVisible = false;
        $scope.isComposePopupVisible = false;
        $scope.fromEmail = $scope.main.email;

        $scope.composeEmail = {};


        this.sendEmail = function () {
            $scope.isComposePopupVisible = false;

            var emailBody = $scope.composeEmail.emailbody+'&'+btoa($scope.composeEmail.toemail);
            $scope.endorsementData = {
                toemail: $scope.composeEmail.toemail,
                fromemail: $scope.main.email,
                subject: $scope.composeEmail.subject,
                emailbody: emailBody
            };
            app.emailSuccessMsg = false;
            app.emailErrorMsg = false;
            EndorsementExpertise.sendEmail($scope.endorsementData).then(function (data) {
                if(data.data.success) {
                    app.emailSuccessMsg = data.data.message;
                    console.log(app.emailSuccessMsg);
                    $timeout(function () {
                        app.emailSuccessMsg = false;
                    }, 2000);
                } else {
                    app.emailErrorMsg = data.data.message;
                    console.log(app.emailErrorMsg);
                    $timeout(function () {
                        app.emailErrorMsg = false;
                    }, 2000);
                }

                // $scope.composeEmail.toemail = data.data.toemail;
                // $scope.composeEmail.subject = data.data.subject;
                // $scope.composeEmail.emailbody = data.data.emailbody;
            });
        };
        $scope.showComposePopup = function () {
            console.log("coming console: ");
            $scope.composeEmail = {};
            $scope.composeEmail.subject = "Please endorse my Expertise";
            $scope.composeEmail.emailbody = "Hello, Please click on the security link below to endorse: http://localhost:8080/expertprofile/" + btoa($scope.fromEmail);
            $scope.isComposePopupVisible = true;
        };

        $scope.closeComposePopup = function () {
            $scope.isComposePopupVisible = false;
        };

        $scope.showPopup = function (email) {

            $scope.isPopupVisible = true;
            $scope.selectedEmail = email;
        };

        $scope.closePopup = function () {
            $scope.isPopupVisible = false;
        };

        $scope.emails = [
            {
                from: 'John',
                subject: 'I love angular',
                date: 'Jan 1',
                body: 'hello world!'
            },
            {
                from: 'Jack',
                subject: 'Angular and I are just friends',
                date: 'Feb 15',
                body: 'just kidding'
            },
            {
                from: 'Ember',
                subject: 'I hate you Angular!',
                date: 'Dec 8',
                body: 'wassup dude'
            }
        ];
    })