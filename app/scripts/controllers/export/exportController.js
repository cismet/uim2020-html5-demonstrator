/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'exportController', [
            '$scope', '$state', '$stateParams', '$previousState', '$uibModalInstance',
            'entity', 'entityModalInvoker',
            function ($scope, $state, $stateParams, $previousState, $uibModalInstance,
                    entity, entityModalInvoker) {
                'use strict';
                
                var exportController;
                exportController = this;
                
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
                $scope.wizard.isFinishStep = function () {
                    return $scope.wizard.currentStep === 'Summary';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Dataset Description';
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

                $uibModalInstance.result.finally(function () {
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

