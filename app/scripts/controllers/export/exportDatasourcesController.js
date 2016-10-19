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
        'exportDatasourcesController', [
            '$scope', 'filterFilter', 'ExportDatasource', 'ExportThemeCollection', 'sharedDatamodel', 'dataService',
            function ($scope, filterFilter, ExportDatasource, ExportThemeCollection, sharedDatamodel, dataService) {
                'use strict';

                var datasourcesController;

                datasourcesController = this;

                // init global datasources list
                datasourcesController.exportDatasources = [];
                if (!sharedDatamodel.globalDatasources ||
                        sharedDatamodel.globalDatasources.length === 0) {

                    var globalDatasources = dataService.getGlobalDatasources();

                    if (typeof globalDatasources.$resolved !== 'undefined' &&
                            globalDatasources.$resolved === true) {
                        sharedDatamodel.globalDatasources = globalDatasources;
                        sharedDatamodel.globalDatasources.forEach(function (globalDatasource) {
                            datasourcesController.exportDatasources.push(new ExportDatasource(globalDatasource));
                        });
                    } else {
                        var resolve = function (externalDatasources) {
                            sharedDatamodel.globalDatasources = externalDatasources;
                            sharedDatamodel.globalDatasources.$resolved = true;
                            sharedDatamodel.globalDatasources.forEach(function (globalDatasource) {
                                datasourcesController.exportDatasources.push(new ExportDatasource(globalDatasource));
                            });
                        };

                        if (globalDatasources.$promise) {
                            globalDatasources.$promise.then(resolve);
                        } else {
                            globalDatasources.then(resolve);
                        }
                    }
                } else {
                    sharedDatamodel.globalDatasources.forEach(function (globalDatasource) {
                        datasourcesController.exportDatasources.push(new ExportDatasource(globalDatasource));
                    });
                }

                // bind wizard panel local variables to controller only
                datasourcesController.exportThemes = new ExportThemeCollection(sharedDatamodel.analysisNodes);

                sharedDatamodel.localDatasources.forEach(function (localDatasource) {
                    //if (localDatasource.isSelected()) {
                    datasourcesController.exportDatasources.push(new ExportDatasource(localDatasource));
                    //}
                });

                $scope.options.selectedExportDatasource = null;
                $scope.options.selectedExportThemes = [];

                $scope.wizard.enterValidators['Datenquellen'] = function (context) {
                    if (context.valid === true) {

                        if (datasourcesController.exportThemes === null ||
                                datasourcesController.exportThemes.size() === 0) {
                            $scope.status.message = 'Es sind keine Messstellen zum Exportieren in der Merkliste vorhanden.';
                            $scope.status.type = 'warning';
                            context.valid = false;
                            return context.valid;
                        }

                        // select 1st ext. datasurce by default
                        if ($scope.options.isMergeExternalDatasource) {
                            if (datasourcesController.exportDatasources.length > 0) {
                                datasourcesController.exportDatasources[0].setSelected(true);
                                $scope.options.selectedExportDatasource = datasourcesController.exportDatasources[0];
                            } else {
                                $scope.status.message = 'Es sind keine externen Datenquellen zum Verschneiden verfügbar.';
                                $scope.status.type = 'warning';
                                context.valid = false;
                                return context.valid;
                            }
                        } else {
                            $scope.options.selectedExportDatasource = null;
                        }

                        $scope.status.type = 'info';
                        if ($scope.options.isMergeExternalDatasource === true) {
                            $scope.status.message = 'Bitte wählen Sie mindestens ein Thema und eine externen Datenquellen zum Verschneiden aus.';
                        } else {
                            $scope.status.message = 'Bitte wählen Sie mindestens ein Thema für den Export aus.';
                        }
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Datenquellen'] = function (context) {
                    context.valid = true;

                    if ($scope.options.isMergeExternalDatasource === true &&
                            $scope.options.selectedExportDatasource === null) {
                        $scope.status.message = 'Bitte wählen Sie eine Datenquelle zum Verschneiden aus.';
                        $scope.status.type = 'warning';
                        context.valid = false;
                        return context.valid;
                    }

                    $scope.options.selectedExportThemes = datasourcesController.exportThemes.getSelectedExportEntitiesCollections();
                    if ($scope.options.selectedExportThemes.length === 0) {
                        $scope.status.message = 'Bitte wählen Sie mindestens ein Thema für den Export aus.';
                        $scope.status.type = 'warning';
                        context.valid = false;
                        return context.valid;
                    }

                    return context.valid;
                };

                // watch selectedExportDatasources for changes
                /*$scope.$watch('datasourcesController.exportDatasources|filter:{selected:true}',
                 function (selectedExportDatasource) {
                 $scope.options.selectedExportDatasource = selectedExportDatasource;
                 }, true);
                 
                 // watch selectedExportThemes for changes
                 $scope.$watch('datasourcesController.exportThemes.exportEntitiesCollections|filter:{selected:true}',
                 function (selectedExportThemes) {
                 $scope.options.selectedExportThemes = selectedExportThemes;
                 }, true);
                 */

                console.log('exportDatasourcesController instance created');
            }
        ]
        );

