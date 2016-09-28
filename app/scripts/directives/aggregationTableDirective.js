/*globals angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.directives'
        ).directive('aggregationTable', [
    function () {
        'use strict';
        return {
            restrict: 'E',
            templateUrl: 'templates/aggregation-table-directive.html',
            scope: {
                aggregationValues: '=',
                parseDate: '='
            },
            controller: 'aggregationTableController',
            controllerAs: 'aggregationTableController'
        };
    }]);