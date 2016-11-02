/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L */
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'appController',
        [
            '$scope',
            '$state',
            '$previousState',
            'sharedControllers',
            'sharedDatamodel',
            'authenticationService',
            function (
                    $scope,
                    $state,
                    $previousState,
                    sharedControllers,
                    sharedDatamodel,
                    authenticationService
                    ) {
                'use strict';
                var appController;
                appController = this;

                appController.status = sharedDatamodel.status;
                appController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                appController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
                appController.resultNodes = sharedDatamodel.resultNodes;

                // FIXME: use authenticationController!
                appController.signOut = function () {
                    authenticationService.clearIdentity();
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };

                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.analysis") && !$state.is("main.analysis")) {
                        var analysisController = sharedControllers.analysisController;
                        if (sharedControllers.analysisController) {
                            var analysisMapController = sharedControllers.analysisMapController;
                            analysisController.mode = $state.current.name.split(".").slice(1, 3).pop();

                            // resize the map on state change
                            if (analysisController.mode === 'map' && analysisMapController) {
                                analysisMapController.activate();
                            }
                        }
                    } else if ($state.includes("main.search") && !$state.is("main.search")) {
                        var searchController = sharedControllers.searchController;
                        if (sharedControllers.searchController) {
                            var searchMapController = sharedControllers.searchMapController;
                            searchController.mode = $state.current.name.split(".").slice(1, 3).pop();

                            // resize the map on state change
                            if (searchController.mode === 'map' && searchMapController) {
                                searchMapController.activate();
                            }
                        }
                    }
                });
                
                sharedControllers.appController = appController;
                console.log('appController instance created');
            }
        ]
        );
