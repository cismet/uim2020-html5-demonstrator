angular.module(
    'de.cismet.uim2020-html5-demonstrator.controllers'
).controller(
    'myDirectiveController',
    [
        '$scope',
        'myService',
        function ($scope, MyService) {
            'use strict';
            
            $scope.description = 'The \'scripts/controllers\' folder contains the actual controllers that will automagically be processed during build.';
            $scope.info = MyService.tellMe();
        }
    ]
);
