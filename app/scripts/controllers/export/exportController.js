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
            '$scope', '$state', '$uibModalInstance', 'sharedDatamodel',
            function ($scope, $state, $uibModalInstance, sharedDatamodel) {
                'use strict';

                var exportController;
                exportController = this;
                
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
                    return $scope.wizard.currentStep === 'Export';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Konfiguration';
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

                exportController.finishedWizard = function () {
                    $uibModalInstance.dismiss('close');
                };

                $uibModalInstance.result.catch(
                        function cancel(reason) {
                        $scope.status.message = 'Export abgebrochen';
                        $scope.status.type = 'info';
                    
                }).finally(function () {
                    $state.go('main.analysis.map');
                });

                $scope.close = function () {
                    $uibModalInstance.dismiss('close');
                };

                $scope.$on("$stateChangeStart", function (evt, toState) {
                    if (!toState.$$state().includes['modal.export']) {
                        console.log('exportController::$stateChangeStart: $uibModalInstance.close');
                        $uibModalInstance.dismiss('close');
                    } else {
                        console.log('exportController::$stateChangeStart: ignore ' + toState);
                    }
                });
            }
        ]
        );

