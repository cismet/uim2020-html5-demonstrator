/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mainController',
        ['$scope', '$state', '$previousState', 'sharedDatamodel', 'sharedControllers',
            function ($scope, $state, $previousState, sharedDatamodel, sharedControllers) {
                'use strict';

                var mainController;
                mainController = this;

                console.log('mainController::main instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                mainController.mode = $state.current.name.split(".").slice(1, 2).pop();

                /**
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mainController.removeAnalysisNode = function (analysisNode) {
                    sharedDatamodel.resultNodes.forEach(function (resultNode) {
                        if (resultNode.objectKey === analysisNode.objectKey) {
                            resultNode.$analysis = false;
                        }
                    });
                    
                    var index = sharedDatamodel.analysisNodes.indexOf(analysisNode);
                    
                    if (index !== -1) {
                        sharedDatamodel.analysisNodes.splice(sharedDatamodel.analysisNodes.indexOf(analysisNode), 1);
                        // manually update map
                        if (sharedControllers.analysisMapController) {
                            sharedControllers.analysisMapController.removeNode(analysisNode);
                        }
                    } else {
                        console.warn("mainController::removeAnalysisNode: analysisNode '" + analysisNode.name + "' not in list of analysis nodes!");
                    }
                };
                
                mainController.removeAnalysisNodes = function () {
                    sharedDatamodel.analysisNodes.length = 0;
                    sharedControllers.analysisMapController.clearNodes();
                    sharedDatamodel.resultNodes.forEach(function (resultNode) {
                        resultNode.$analysis = false;
                    });
                };

                /**
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mainController.addAnalysisNode = function (resultNode) {
                    var i, index;
                    
                    resultNode.$analysis = true;

                    if (resultNode.$filtered) {
                        console.warn('mainController::addAnalysisNode: resultNode "' + resultNode.name +
                                '" (' + resultNode.objectKey + ') is NOT visible (filtered)!?!');
                        resultNode.$filtered = false;
                    }

                    // indexOf does not work since node$feature is different!
                    index = -1; //sharedDatamodel.analysisNodes.indexOf(node);
                    for (i = 0; i < sharedDatamodel.analysisNodes.length; i++) {
                        if (sharedDatamodel.analysisNodes[i].objectKey === resultNode.objectKey) {
                            index = i;
                            break;
                        }
                    }

                    if (index !== -1) {
                        console.warn("mainController::addAnalysisNode: resultNode '" + resultNode.name + "' already in list of analysis nodes!");
                    } else {
                        // we cannot add the same feature to two different maps ... :-(
                        // var analysisNode = angular.copy(node);

                        // make *shallow* copy
                        var analysisNode = angular.extend({}, resultNode);
                        analysisNode.$feature = null;
                        analysisNode.$analysis = false;

                        // manually update map
                        sharedDatamodel.analysisNodes.push(analysisNode);
                        if (sharedControllers.analysisMapController) {
                            sharedControllers.analysisMapController.addNode(analysisNode);
                        }
                    }
                };
                
                mainController.addAnalysisNodes = function () {
                    sharedDatamodel.resultNodes.forEach(function (resultNode) {
                        if (!resultNode.$filtered) {
                            mainController.addAnalysisNode(resultNode);
                        }
                    });
                };

                /**
                 * set mode (search analysis, ...) and previous state name
                 */
                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main") && !$state.is("main")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        mainController.mode = $state.current.name.split(".").slice(1, 2).pop();
                        //console.log('mainController::mainController.mode: ' + mainController.mode + 
                        //        '(toState: ' + toState.name + ')');

                        var previousState = $previousState.get();
                        if (previousState && previousState.state && previousState.state.name) {
                            mainController.previousStateName = previousState.state.name;
                        } else {
                            mainController.previousStateName = undefined;
                        }
                    } else {
                        // console.log("mainController::ingoring stateChange '" + $state.name + "'");
                    }
                });
            }]
        );


