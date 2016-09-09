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
        'analysisController',
        [
            '$timeout', '$scope', '$state', 'dataService', 'sharedDatamodel','leafletData',
            function ($timeout, $scope, $state, dataService, sharedDatamodel,leafletData) {
                'use strict';

                var analysisController;
                analysisController = this;

                console.log('analysisController instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'analysis';
                analysisController.mode = 'map';

                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.analysis") && !$state.is("main.analysis")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        analysisController.mode = $state.current.name.split(".").slice(1, 3).pop();
                        console.log('analysisController::mode: ' + analysisController.mode);

                        // resize the map on stzate change
                        if (analysisController.mode === 'map') {
                            leafletData.getMap('analysis-map').then(function (map) {
                                $timeout(function () {
                                    if (map && map._container.parentElement) {
                                        if (map._container.parentElement.offsetHeight > 0 &&
                                                map._container.parentElement.offsetWidth > 0) {
                                            $scope.mapHeight = map._container.parentElement.offsetHeight;
                                            $scope.mapWidth = map._container.parentElement.offsetWidth;
                                            console.log('analysisController::stateChangeSuccess new size: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
                                            map.invalidateSize(false);

                                        } else {
                                            console.warn('analysisController::stateChangeSuccess saved size: ' + $scope.mapWidth + "x" + $scope.mapHeight);
                                            map.invalidateSize(false);
                                        }
                                    }
                                }, 100);
                            });
                        }
                    }
                });
            }
        ]
        );
