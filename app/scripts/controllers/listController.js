angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'listController',
        [
            '$scope', 'NgTableParams',
            function ($scope, NgTableParams) {
                'use strict';
                var _this = this;
                var data = [{name: "Moroni", age: 50} /*,*/];
                _this.tableParams = new NgTableParams({}, {dataset: data});
                
                console.log('new listController instance created from ' + $scope.name);
            }
        ]
        );
