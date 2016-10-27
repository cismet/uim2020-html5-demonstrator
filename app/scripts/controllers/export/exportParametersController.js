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
        'exportParametersController', [
            '$scope',
            function ($scope) {
                'use strict';

                // ENTER VALIDATION --------------------------------------------
                $scope.wizard.enterValidators['Parameter'] = function (context) {
                    if ($scope.options.isMergeExternalDatasource === true) {
                        $scope.options.selectedExportThemes.forEach(function (exportEntitiesCollection) {
                            if (typeof exportEntitiesCollection.exportDatasource === 'undefined' ||
                                    exportEntitiesCollection.exportDatasource === null) {
                                $scope.status.type = 'warning';
                                $scope.status.message = 'Bitte wählen Sie eine Datenquelle zum Verschneiden mit dem Thema "' +
                                        exportEntitiesCollection.title + '" aus';
                            }
                        });
                    }

                    if (context.valid === true) {
                        $scope.status.type = 'info';
                        if ($scope.options.isMergeExternalDatasource === true) {
                            $scope.status.message = 'Bitte wählen Sie die Parameter für den Export aus.';
                        } else {
                            $scope.status.message = 'Bitte wählen Sie die Parameter für den Export und zum Verschneiden aus.';
                        }
                    }

                    return context.valid;
                };

                // EXIT VALIDATION ---------------------------------------------
                $scope.wizard.exitValidators['Parameter'] = function (context) {
                    context.valid = true;

                    if ($scope.options.selectedExportThemes.length === 0) {
                        $scope.status.message = 'Bitte wählen Sie mindestens ein Thema für den Export aus.';
                        $scope.status.type = 'warning';
                        context.valid = false;
                        return context.valid;
                    }

                    $scope.options.selectedExportThemes.forEach(function (exportEntitiesCollection) {
                        if (exportEntitiesCollection.getSelectedParameters().length === 0) {
                            $scope.status.type = 'warning';
                            $scope.status.message = 'Bitte wählen Sie mindestens einen Parameter des Themas "' +
                                    exportEntitiesCollection.title + '" für den Export aus.';
                            context.valid = false;
                            return context.valid;

                        } else if ($scope.options.isMergeExternalDatasource === true &&
                                typeof exportEntitiesCollection.exportDatasource !== 'undefined' &&
                                exportEntitiesCollection.exportDatasource !== null &&
                                exportEntitiesCollection.exportDatasource.getSelectedParameters().length === 0) {

                            $scope.status.type = 'warning';
                            $scope.status.message = 'Bitte wählen Sie mindestens einen Parameter der Datenquelle "' +
                                    exportEntitiesCollection.exportDatasource.name + '" zum Verschneiden mit dem Thema "' +
                                    exportEntitiesCollection.title + '" aus.';
                            context.valid = false;
                            return context.valid;
                        }
                    });

                    return context.valid;
                };

                console.log('exportParametersController instance created');
            }
        ]
        );

