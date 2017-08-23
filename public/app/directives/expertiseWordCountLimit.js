angular.module('maximumWordsValidation',[])
.directive('maximumWordsValidation', function () {
    'use strict';
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        // Figure out name of count variable we will set on parent scope
        var wordCountName = attrs.ngModel.replace('.', '_') + '_words_count';

        scope.$watch(function () {
          return ngModelCtrl.$modelValue;
        }, function (newValue) {
          var str = newValue && newValue.replace('\n', '');
          // Dont split when string is empty, else count becomes 1
          var wordCount = str ? str.split(' ').length : 0;
          // Set count variable
          scope.$parent[wordCountName] = wordCount;
          // Update validity
          var max = attrs.maximumWordsValidation;
          console.log("max: "+ max);
          ngModelCtrl.$setValidity('maximumWords', wordCount <= max);
        });
      }
    };
});
