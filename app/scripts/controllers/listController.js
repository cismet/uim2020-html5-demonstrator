/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'listController',
        [
            '$scope', 'configurationService',
            'sharedDatamodel', 'TagPostfilterCollection', 'NgTableParams',
            function ($scope, configurationService,
                    sharedDatamodel, TagPostfilterCollection, NgTableParams) {
                'use strict';

                var listController, ngTableParams;

                listController = this;
                listController.mode = $scope.mainController.mode;

                listController.resultNodes = sharedDatamodel.resultNodes;
                listController.analysisNodes = sharedDatamodel.analysisNodes;

                if (listController.mode === 'search') {
                    listController.nodes = listController.resultNodes;
                } else if (listController.mode === 'analysis') {
                    listController.nodes = listController.analysisNodes;
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
                        show: true
                    }, {
                        field: "description",
                        title: "Beschreibung",
                        show: true
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


                listController.pollutantPostfilters = new TagPostfilterCollection('ALL', 'POLLUTANT', 'Schadstoffe');

                listController.clearPostfilters = function () {
                    listController.pollutantPostfilters.clear();
                };

                listController.setNodes = function (nodes) {
                    var i, node, tags, feature, featureGroup, featureGroups;
                    
                    listController.tableData.reload();
                    
                    // clear all
                    listController.clearPostfilters();
                    if (nodes !== null && nodes.length > 0) {
                        for (i = 0; i < nodes.length; ++i) {
                            node = nodes[i];
                            if(node.$data && node.$data.tags) {
                                tags = node.$data.tags;
                                // don't clear sort
                                listController.pollutantPostfilters.addAll(tags, false, true);
                            } 
                        }
                    }
                };

                /*listController.setNodes = function (nodes) {
                 
                 //listController.tableData.reload();
                 listController.tableData.settings({
                 dataset: nodes
                 });
                 };*/

                // leak this to parent scope
                $scope.$parent.listController = listController;

                /**
                 * Init Postfilters on search success
                 */
                $scope.$on('searchSuccess()', function (event) {
                    if (sharedDatamodel.resultNodes.length > 0) {
                        listController.setNodes(sharedDatamodel.resultNodes);
                    } else {
                        listController.clearPostfilters();
                    }
                });

                console.log('new listController instance created from ' + $scope.name);
            }
        ]
        );
