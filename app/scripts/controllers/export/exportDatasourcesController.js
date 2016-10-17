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
            '$scope', 'ExportThemeCollection', 'sharedDatamodel',
            function ($scope, ExportThemeCollection, sharedDatamodel) {
                'use strict';

                var datasourcesController;

                datasourcesController = this;

                // bind wizard panel local variables to controller only
                datasourcesController.exportThemes = new ExportThemeCollection(sharedDatamodel.analysisNodes);

                datasourcesController.exportDatasources = [];

                sharedDatamodel.globalDatasources.forEach(function (globalDatasource) {
                    //if (globalDatasource.isSelected()) {
                        datasourcesController.exportDatasources.push(new ExportDatasource(globalDatasource));
                    //}
                });
                sharedDatamodel.localDatasources.forEach(function (localDatasource) {
                    //if (localDatasource.isSelected()) {
                        datasourcesController.exportDatasources.push(new ExportDatasource(localDatasource));
                    //}
                });

                $scope.selectedExportDatasource = null;

                $scope.options.selectedExportThemes = [];

                $scope.wizard.enterValidators['Datenquellen'] = function (context) {
                    if (context.valid === true) {

                        if (datasourcesController.exportThemes === null ||
                                datasourcesController.exportThemes.size() === 0) {
                            $scope.status.message = 'Es sind keine Messstellen zum Exportieren in der Merkliste vorhanden';
                            $scope.status.type = 'warning';
                            context.valid = false;
                            return context.valid;
                        }

                        // select 1st ext. datasurce by default
                        if ($scope.options.isMergeExternalDatasource) {
                            if (datasourcesController.exportDatasources.length > 0) {
                                $scope.selectedExportDatasource = datasourcesController.exportDatasources[0];
                            } else {
                                $scope.status.message = 'Es sind keine externen Datenquellen zum Verschneiden verfügbar';
                                $scope.status.type = 'warning';
                                context.valid = false;
                                return context.valid;
                            }
                        } else {
                            $scope.options.selectedExportDatasource = null;
                        }
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Datenquellen'] = function (context) {
                    context.valid = true;

                    if($scope.options.isMergeExternalDatasource === true && 
                            $scope.options.selectedExportDatasource === null) {
                        $scope.status.message = 'Bitte wählen Sie mindestens ein Thema für den Export aus';
                        $scope.status.type = 'warning';
                        context.valid = false;
                        return context.valid;
                    }
                    
                    $scope.options.selectedExportThemes = datasourcesController.exportThemes.getSelectedExportEntitiesCollections();
                    if($scope.options.selectedExportThemes.length === 0) {
                        $scope.status.message = 'Bitte wählen Sie eine Datenquelle zum Verschneiden aus';
                        $scope.status.type = 'warning';
                        context.valid = false;
                        return context.valid;
                    } 
                    
                    return context.valid;
                };
            }
        ]
        );

