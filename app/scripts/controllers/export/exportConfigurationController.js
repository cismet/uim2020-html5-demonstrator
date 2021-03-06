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
            '$scope', 'configurationService', 'sharedDatamodel',
            function ($scope, configurationService, sharedDatamodel) {
                'use strict';

                var configurationController = this;
                configurationController.exportFormats = configurationService.export.exportFormats;

                $scope.options.isMergeExternalDatasource = false;
                $scope.options.isMergeExternalDatasourceEnabled = sharedDatamodel.localDatasources.length > 0 ? true : false;
                // || sharedDatamodel.globalDatasources.length > 0;
                $scope.options.exportFormat = 'xlsx'; //configurationController.exportFormats[0];

                // ENTER VALIDATION --------------------------------------------
                $scope.wizard.enterValidators['Konfiguration'] = function (context) {

                    if (context.valid === true) {
                        $scope.status.message = 'Datenexport der Messstellen aus der Merkliste.';
                        $scope.status.type = 'info';
                    }

                    return true;
                };

                // EXIT VALIDATION ---------------------------------------------
                $scope.wizard.exitValidators['Konfiguration'] = function (context) {
                    context.valid = true;

                    if (!$scope.options.exportFormat) {
                        $scope.status.message = 'Bitte wählen Sie ein Exportformat aus!';
                        $scope.status.type = 'warning';
                        context.valid = false;
                    }

                    if (context.valid === true) {
                        $scope.wizard.hasError = false;
                    }
                    // no error? -> reset

                    return context.valid;
                };

                console.log('exportConfigurationController instance created');
            }
        ]
        );

