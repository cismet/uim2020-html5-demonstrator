/*global angular, Date*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'aggregationTableController',
        [
            '$scope', 'NgTableParams',
            function ($scope, NgTableParams) {
                'use strict';

                var aggregationTableController, ngTableParams;

                aggregationTableController = this;
                
                aggregationTableController.parseDate = function(dateString) {
                    return Date.parse(dateString);
                };

                /*aggregationTableController.tableColumns = [{
                        field: "name",
                        title: "Parameter",
                        sortable: "name",
                        show: true
                    }, {
                        field: "maxvalue",
                        title: "Maximalwert",
                        show: true
                    }, {
                        field: "maxdate",
                        title: "gemessen am",
                        show: true
                    }, {
                        field: "minvalue",
                        title: "Minimalwert",
                        show: true
                    }, {
                        field: "mindate",
                        title: "gemessen am",
                        show: true
                    }];*/

                ngTableParams = {
                    sorting: {name: 'asc'},
                    count: 500
                    /*group: {
                     classKey: 'desc'
                     }*/

                };

                aggregationTableController.tableData = new NgTableParams(
                        ngTableParams, {
                            dataset: $scope.aggregationValues,
                            /*groupOptions: {
                             isExpanded: true
                             },*/
                            counts: []
                        });
                        
                        

            }
        ]
        );
