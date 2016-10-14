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
        'exportConfigurationController', [
            '$scope', 'sharedDatamodel',
            function ($scope, sharedDatamodel) {
                'use strict';

                $scope.options.isMergeExternalDatasource = false;
                $scope.options.isMergeExternalDatasourceEnabled = sharedDatamodel.localDatasources.length > 0;
                $scope.options.exportFormat = null;

                $scope.wizard.enterValidators['Konfiguration'] = function (context) {
                    if (context.valid === true) {

                        $scope.status.message = 'Bitte wählen Sie ein Exportformat aus';
                        $scope.status.type = 'info';
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Konfiguration'] = function (context) {
                    context.valid = true;

                    if (!$scope.options.exportFormat) {
                        $scope.status.message = 'Bitte wählen Sie ein Exportformat aus';
                        $scope.status.type = 'warning';
                        context.valid = false;
                    }

                    if (context.valid === true) {
                        $scope.wizard.hasError = null;
                    }
                    // no error? -> reset

                    return context.valid;
                };
            }
        ]
        );

