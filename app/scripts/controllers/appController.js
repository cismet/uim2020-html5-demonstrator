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
            'configurationService',
            'sharedDatamodel',
            'authenticationService',
            function (
                    $scope,
                    $state,
                    $previousState,
                    configurationService,
                    sharedDatamodel,
                    authenticationService
                    ) {
                'use strict';
                var appController;

                $scope.popover = {
                    "title": "Title",
                    "content": "Hello Popover<br />This is a multiline message!"
                };

                $scope.tooltip = {
                    "title": "Hello Tooltip<br />This is a multiline message!",
                    "checked": false
                };

                appController = this;

                appController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                appController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
                appController.resultNodes = sharedDatamodel.resultNodes;

                // FIXME: use authenticationController!
                appController.signOut = function () {
                    authenticationService.clearIdentity();
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };
            }
        ]
        );
