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
            '$state',
            '$previousState',
            'configurationService',
            'sharedDatamodel',
            'authenticationService',
            function (
                    $state,
                    $previousState,
                    configurationService,
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
            }
        ]
        );
