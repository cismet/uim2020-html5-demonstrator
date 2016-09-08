/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'listController',
        [
            '$scope', 'configurationService',
            'sharedDatamodel', 'NgTableParams',
            function ($scope, configurationService,
                    sharedDatamodel, NgTableParams) {
                'use strict';

                var listController, ngTableParams;

                listController = this;
                listController.mode = $scope.mainController.mode;

                if (listController.mode === 'search') {
                    listController.nodes = sharedDatamodel.resultNodes;
                } else if (listController.mode === 'analysis') {
                    listController.nodes = sharedDatamodel.analysisNodes;
                }

                /*
                 var groupByClass = function (item) {
                 return "First letter \"" + item.name[0] + "\"";
                 };
                 groupByClass.title = "First Initial";
                 // here's an example where we let the order of data rows determine the sorting of groups
                 groupByClass.sortDirection = undefined;
                 */

                listController.tableColumns = [{
                        field: "classKey",
                        title: "Thema",
                        show: false,
                        groupable: "classKey"
                    }, {
                        field: "name",
                        title: "Name",
                        sortable: "name",
                        show: true,
                    }, {
                        field: "description",
                        title: "Beschreibung",
                        show: true,
                    }];


                ngTableParams = {
                    sorting: {name: 'asc'},
                    count: 500,
                    /*group: {
                     classKey: 'desc'
                     }*/

                };

                listController.tableData = new NgTableParams(
                        ngTableParams, {
                            dataset: listController.nodes,
                            /*groupOptions: {
                             isExpanded: true
                             },*/
                            counts: []
                        });

                $scope.$on('searchSuccess()', function (e) {
                    listController.tableData.reload();
                });

                /*listController.setNodes = function (nodes) {
                 
                 //listController.tableData.reload();
                 listController.tableData.settings({
                 dataset: nodes
                 });
                 };*/

                // leak this to parent scope
                $scope.$parent.listController = listController;
                console.log('new listController instance created from ' + $scope.name);
            }
        ]
        );
