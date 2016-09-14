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
        'authenticationController',
        [
            '$scope',
            '$state',
            '$previousState',
            'configurationService',
            'authenticationService',
            function ($scope, $state, $previousState, configurationService, authenticationService) {
                'use strict';

                var authenticationController;
                authenticationController = this;

                $scope.errorStatusCode = -1;
                $scope.errorStatusMessage = null;

                authenticationController.signIn = function (username, password) {

                    $scope.errorStatusCode = -1;
                    $scope.errorStatusMessage = null;

                    var authenticatePromise = authenticationService.authenticate(
                            username,
                            configurationService.authentication.domain,
                            password);
                            
                    authenticatePromise.then(
                            function authenticationSuccess(identity) {
                                console.log('authenticationController::authenticationSuccess: user "' +
                                        identity.user + '" successfully authenticated');

                                if ($previousState.get("authentication") &&
                                        $previousState.get("authentication").state &&
                                        $previousState.get("authentication").state.name !== 'main.authentication') {
                                    $previousState.go('authentication');
                                } else {
                                    $state.go('main.search.map');
                                }
                            }, function authenticationError(httpResponse) {

                        $scope.errorStatusCode = httpResponse.status;
                        $scope.errorStatusMessage = httpResponse.statusText;
                        $scope.password = null;

                        console.error('authenticationController::authenticationError: user "' +
                                username + '" could not be authenticated: ' + $scope.errorStatusMessage);
                    });
                };

                authenticationController.signOut = function () {
                    $scope.errorStatusCode = -1;
                    $scope.errorStatusMessage = null;
                    $scope.username = null;
                    $scope.password = null;

                    authenticationService.clearIdentity();
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };
            }
        ]
        );
