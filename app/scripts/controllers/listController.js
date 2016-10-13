/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'listController',
        [
            '$scope', 'configurationService', 'sharedDatamodel', 'sharedControllers',
            'TagPostfilterCollection', 'postfilterService', 'NgTableParams',
            function ($scope, configurationService, sharedDatamodel, sharedControllers,
                    TagPostfilterCollection, postfilterService, NgTableParams) {
                'use strict';

                var listController, ngTableParams, postfilters;

                listController = this;
                postfilters = [];

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



                // Allgemeine Schadstoffe
                listController.pollutantPostfilters = new TagPostfilterCollection(
                        'ALL',
                        'POLLUTANT',
                        'Schadstoffe');
                postfilters.push(listController.pollutantPostfilters);

                // EPRTR Meldeperiode
                listController.notificationPeriodPostfilters = new TagPostfilterCollection(
                        'EPRTR_INSTALLATION',
                        'EPRTR.NOTIFICATION_PERIOD',
                        'Meldeperiode');
                postfilters.push(listController.notificationPeriodPostfilters);

                // EPRTR Freisetzungsart
                listController.releaseTypePostfilters = new TagPostfilterCollection(
                        'EPRTR_INSTALLATION',
                        'EPRTR.RELEASE_TYPE',
                        'Freisetzungsart');
                postfilters.push(listController.releaseTypePostfilters);

                listController.clearPostfilters = function () {
                    postfilters.forEach(function (postfilterCollection) {
                        postfilterCollection.clear();
                    });
                };

                /**
                 * Applies the selected tag-based postfilters and alls setNodes()
                 * to update the table.
                 * 
                 * @return {undefined}
                 */
                listController.applyPostfilters = function () {
                    var nodes, promise;

                    // filter nodes in place
                    nodes = sharedDatamodel.resultNodes;
                    promise = postfilterService.filterNodesByTags(sharedDatamodel.resultNodes, postfilters);

                    promise.then(
                            function resolve(filteredNodesIndices) {
                                // don't reset the postfilters!
                                listController.setNodes(nodes, false);

                                if (filteredNodesIndices.length < nodes.length) {
                                    sharedDatamodel.status.type = 'success';
                                    sharedDatamodel.status.message = listController.getAppliedPostfiltersSize() +
                                            ' Postfilter angewendet und ' +
                                            filteredNodesIndices.length + ' von ' +
                                            nodes.length + ' Messstellen herausgefiltert.';
                                } else {
                                    sharedDatamodel.status.type = 'warning';
                                    sharedDatamodel.status.message = 'Alle ' +
                                            nodes.length + ' Messstellen wurden herausgefiltert. Bitte setzen Sie die Postfilter zurück.';
                                }

                            }, function reject(filteredNodesIndices) {
                        sharedDatamodel.status.type = 'danger';
                        sharedDatamodel.status.message = 'Beim Anwenden der Postfilter ist ein Fehler aufgetreten.';
                    });
                };

                listController.resetPostfilters = function () {
                    postfilterService.resetFilteredNodes(sharedDatamodel.resultNodes);
                    listController.setNodes(sharedDatamodel.resultNodes);
                    
                    sharedDatamodel.status.type = 'success';
                    sharedDatamodel.status.message = 'Alle Postfilter zurückgesetzt.';
                };

                listController.getAppliedPostfiltersSize = function () {
                    var appliedPostfiltersSize = 0;
                    postfilters.forEach(function (postfilterCollection) {
                        appliedPostfiltersSize += postfilterCollection.getDeselectedKeys().length;
                    });

                    return appliedPostfiltersSize;
                };

                listController.setNodes = function (nodes, clearPostfilters) {
                    listController.tableData.reload();

                    // default set to true
                    clearPostfilters = typeof clearPostfilters !== 'undefined' ? clearPostfilters : true;

                    // clear all
                    if (clearPostfilters === true) {
                        listController.clearPostfilters();
                    }

                    postfilters.forEach(function (postfilterCollection) {
                        // don't clear, sort = true
                        postfilterCollection.addAllFromNodes(nodes, false, true);
                    });
                };

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

                if (sharedDatamodel.resultNodes &&
                        sharedDatamodel.resultNodes.length > 0) {
                    console.log(sharedDatamodel.resultNodes.length + ' result nodes available before listController instance created!');
                    listController.setNodes(sharedDatamodel.resultNodes);
                }

                console.log('new listController instance created');
            }
        ]
        );
