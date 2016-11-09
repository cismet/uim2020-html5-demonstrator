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
        'exportController', [
            '$scope', '$rootScope', '$timeout', '$uibModal', '$state', '$uibModalInstance',
            'sharedDatamodel', 'exportService',
            function ($scope, $rootScope, $timeout, $uibModal, $state, $uibModalInstance,
                    sharedDatamodel, exportService) {
                'use strict';

                var exportController, progressModal, showProgressModal, exportProcessCallback;
                exportController = this;

                // <editor-fold defaultstate="collapsed" desc="=== $scope Initialisation and functions ================">
                $scope.status = sharedDatamodel.status;
                $scope.status.message = 'Bitte wählen Sie ein Exportformat aus';
                $scope.status.type = 'info';

                // scope-soup options for wizard panels
                $scope.options = {};

                /**
                 * Wizard status, etc.
                 */
                $scope.wizard = {};
                $scope.wizard.uploadchoice = false;
                $scope.wizard.enterValidators = [];
                $scope.wizard.exitValidators = [];
                $scope.wizard.currentStep = '';
                $scope.wizard.canProceed = true;
                $scope.wizard.canGoBack = false;
                $scope.wizard.hasError = false;
                $scope.wizard.proceedButtonText = 'Weiter';

                // scope soup madness -> available as wzData.status in wizard-step.tpl.html
                $scope.wizard.status = sharedDatamodel.status;

                $scope.wizard.isFinishStep = function () {
                    return $scope.wizard.currentStep === 'Parameter';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Konfiguration';
                };

                $scope.wizard.close = function () {
                    $uibModalInstance.dismiss('close');
                };

                $scope.$watch('wizard.currentStep', function (n) {
                    if (n) {
                        if ($scope.wizard.isFinishStep()) {
                            $scope.wizard.proceedButtonText = 'Fertig';
                        } else {
                            $scope.wizard.proceedButtonText = 'Weiter';
                        }

                        $scope.wizard.canGoBack = !$scope.wizard.isFirstStep();

                    } else {
                        $scope.wizard.proceedButtonText = 'Weiter';
                    }
                });

                $scope.$on("$stateChangeStart", function (evt, toState) {
                    if (!toState.$$state().includes['modal.export']) {
                        //console.log('exportController::$stateChangeStart: $uibModalInstance.close');
                        $uibModalInstance.dismiss('close');
                    } else {
                        //console.log('exportController::$stateChangeStart: ignore ' + toState);
                    }
                });
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ====================================">
                showProgressModal = function () {
                    var modalScope;
                    modalScope = $rootScope.$new(true);
                    modalScope.status = $scope.status;
                    progressModal = $uibModal.open({
                        templateUrl: 'templates/export-progress-modal.html',
                        scope: modalScope,
                        size: 'lg',
                        backdrop: 'static'
                    });
                    // check if the eror occurred before the dialog has actually been shown
                    progressModal.opened.then(function () {
                        if ($scope.status.type === 'error') {
                            progressModal.close();
                        }
                    });
                };

                exportProcessCallback = function (current, max, type) {
                    //console.log('searchProcess: type=' + type + ', current=' + current + ", max=" + max)
                    // the maximum object count
                    $scope.status.progress.max = 300;

                    // start of search (indeterminate)
                    if (max === -1 && type === 'success') {
                        // count up fake progress to 100
                        $scope.status.progress.current = current;
                        if (current < 210) {
                            //$scope.status.message = 'Der Export der ausgewählten Themen wird durchgeführt.';
                            //$scope.status.type = 'success';
                        } else {
                            $scope.status.message = 'Die UIM2020-DI Server sind z.Z. ausgelastet, bitte warten Sie einen Augenblick.';
                            $scope.status.type = 'warning';
                        }

                        // search completed
                    } else if (current === max && type === 'success') {
                        $scope.status.progress.current = 300;
                        $scope.status.message = 'Der Datenexport wurde erfolgreich durchgeführt.';
                        $scope.status.type = 'success';

                        if (progressModal) {
                            progressModal.close();
                            /*$timeout(function () {
                             progressModal.close();
                             }, 500);*/
                        }
                        // search error ...
                    } else if (type === 'error') {
                        $scope.status.progress.current = 300;
                        $scope.status.message = 'Der Datenexport konnte aufgrund eines Server-Fehlers nicht durchgeführt werden.';
                        $scope.status.type = 'danger';
                        if (progressModal) {
                            progressModal.close($scope.status.message);
                            /*$timeout(function () {
                             if (progressModal) {
                             progressModal.close($scope.status.message);
                             }
                             }, 500);*/
                        }
                    }
                };
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                exportController.finishedWizard = function () {
                    // this is madness:
                    // manually call exit validator on finish step exit
                    if ($scope.wizard.exitValidators['Parameter']({}) === true)
                    {
                        var exportOptions, externalDatasourceData, promise;

                        $scope.status.type = 'info';
                        if ($scope.options.selectedExportThemes.length === 1) {
                            $scope.status.message = 'Der Datenexport für das Thema "' +
                                    $scope.options.selectedExportThemes[0].title +
                                    '" wird durchgeführt, bitte haben Sie einen Augeblick Geduld.';
                        } else {
                            $scope.status.message = 'Der Datenexport für ' +
                                    $scope.options.selectedExportThemes.length +
                                    ' Themen wird durchgeführt, bitte haben Sie einen Augeblick Geduld.';
                        }

                        showProgressModal();

                        exportOptions = angular.copy($scope.options);

                        if (exportOptions.isMergeExternalDatasource === true) {
                            if (typeof $scope.options.selectedExportDatasource !== 'undefined' &&
                                    $scope.options.selectedExportDatasource !== null &&
                                    typeof $scope.options.selectedExportDatasource.data !== 'undefined' &&
                                    $scope.options.selectedExportDatasource.data !== null) {
                                externalDatasourceData = $scope.options.selectedExportDatasource.data;
                                //console.debug('exportController::finishedWizard -> merge with external datasource: ');
                            } else {
                                console.error('exportController::finishedWizard -> isMergeExternalDatasource is true but external datasources data (zipped geoJson) is null!');
                                externalDatasourceData = null;
                            }
                        } else {
                            externalDatasourceData = null;
                            //console.debug('exportController::finishedWizard -> do not merge with external datasource');
                        }

                        // clean ExportOptions from obsolete properties before submitting to REST API ------
                        // See de.cismet.cids.custom.udm2020di.types.rest.ExportOptions for required properties
                        //delete exportOptions.selectedExportDatasource;
                        exportOptions.selectedExportDatasource = null;

                        exportOptions.selectedExportThemes.forEach(function (exportEntitiesCollection) {
                            //delete exportEntitiesCollection.parametersKeys;
                            exportEntitiesCollection.parametersKeys = null;
                            //delete exportEntitiesCollection.forbiddenParameters;
                            exportEntitiesCollection.forbiddenParameters = null;
                            for (var i = exportEntitiesCollection.parameters.length - 1; i >= 0; i--) {
                                // keep only selected parameters
                                if (!exportEntitiesCollection.parameters[i].selected) {
                                    exportEntitiesCollection.parameters.splice(i, 1);
                                }
                            }

                            if (exportOptions.isMergeExternalDatasource === true && externalDatasourceData !== null) {
                                if (typeof exportEntitiesCollection.exportDatasource !== 'undefined' &&
                                        exportEntitiesCollection.exportDatasource !== null) {
                                    exportEntitiesCollection.exportDatasource.data = null;
                                    for (var i = exportEntitiesCollection.exportDatasource.parameters.length - 1; i >= 0; i--) {
                                        // keep only selected parameters
                                        if (!exportEntitiesCollection.exportDatasource.parameters[i].selected) {
                                            exportEntitiesCollection.exportDatasource.parameters.splice(i, 1);
                                        }
                                    }
                                } else {
                                    console.error('exportController::finishedWizard -> isMergeExternalDatasource is true but external datasources "' +
                                            exportEntitiesCollection.title + '" data (zipped geoJson) is null!');
                                }
                            } else {
                                exportEntitiesCollection.exportDatasource = null;
                            }
                        });
                        // -----------------------------------------------------

                        promise = exportService.export(exportOptions, externalDatasourceData, exportProcessCallback);
                        promise.then(
                                function  callback(success) {
                                    if (success === true) {
                                        $uibModalInstance.dismiss('success');
                                        /*$timeout(function () {
                                         $uibModalInstance.dismiss('success');
                                         }, 600);*/
                                    } else {
                                        $uibModalInstance.dismiss('error');
                                        /*$timeout(function () {
                                         $uibModalInstance.dismiss('error');
                                         }, 600);*/
                                    }
                                });
                    }
                };
                // </editor-fold>

                $uibModalInstance.result.catch(
                        function cancel(reason) {
                            if (reason !== 'success' && reason !== 'error') {
                                $scope.status.message = 'Datenexport abgebrochen.';
                                $scope.status.type = 'info';
                            }
                        }).finally(function () {
                    //console.log('exportController::finishedWizard -> closing modal');
                    $state.go('main.analysis');
                });

                // <editor-fold defaultstate="collapsed" desc="[!!!!] MOCK DATA (DISABLED) ----------------">        
                /*var loadMockNodes = function (mockNodes) {
                 if (mockNodes.$resolved) {
                 sharedDatamodel.analysisNodes.length = 0;
                 sharedDatamodel.analysisNodes.push.apply(sharedDatamodel.analysisNodes, mockNodes);
                 } else {
                 mockNodes.$promise.then(function (resolvedMockNodes) {
                 loadMockNodes(resolvedMockNodes);
                 });
                 }
                 };
                 
                 if (sharedDatamodel.analysisNodes.length === 0) {
                 loadMockNodes(dataService.getMockNodes());
                 }*/
                // </editor-fold>

                console.log('exportController instance created');
            }
        ]
        );

