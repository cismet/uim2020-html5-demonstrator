/*global angular*/

angular.module(
    'de.cismet.uim2020-html5-demonstrator.directives'
).directive('myDirective',
    [
        function () {
            'use strict';

            return {
                restrict: 'E',
                templateUrl: 'templates/my-directive.html',
                scope: {},
                controller: 'myDirectiveController'
            };
        }
    ]);
