/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'entityController', [
            '$scope', '$state', '$stateParams', '$previousState', '$uibModalInstance',
            'entity', 'entityModalInvoker',
            function ($scope, $state, $stateParams, $previousState, $uibModalInstance,
                    entity, entityModalInvoker) {
                'use strict';
                //var isopen = true;
                $scope.class = $stateParams.class;
                $scope.id = $stateParams.id;
                $scope.entity = entity;

                console.log('entityController created');
//                console.log($scope.class + "/" + $scope.id);
//                console.log($scope.entity);
//                console.log('$previousState(entityModalInvoker):' + entityModalInvoker.state);



                $uibModalInstance.result.finally(function () {
                    //$previousState.go("entityModalInvoker"); // return to previous state
                    console.log($previousState.get("entityModalInvoker").state);
                    if ($previousState.get("entityModalInvoker") &&
                            $previousState.get("entityModalInvoker").state) {
                        console.log('entityController::close goto $previousState ' + $previousState.get("entityModalInvoker").state.name);
                        $previousState.go("entityModalInvoker");
                    } else {
                        console.log('entityController::close goto default main.search.map');
                        $state.go('main.search.map');
                    }
                });
                

//                $uibModalInstance.result.finally(function () {
//                    isopen = false;
//                    //console.log($previousState.get("entityModalInvoker").state);
//                    if ($previousState.get("entityModalInvoker") &&
//                            $previousState.get("entityModalInvoker").state) {
//                        console.log('entityController::close goto $previousState ' + $previousState.get("entityModalInvoker").state.name);
//                        $previousState.go("entityModalInvoker");
//                    } else {
//                        console.log('entityController::close goto default main.search.map');
//                        $state.go('main.search.map');
//                    }




                // return to previous state
                //    });
                $scope.close = function () {
                    console.log('entityController::close');
                    $uibModalInstance.dismiss('close');
                };

                $scope.$on("$stateChangeStart", function (evt, toState) {
                    if (!toState.$$state().includes['modal.entity']) {
                        console.log('entityController::$stateChangeStart: $uibModalInstance.close');
                       // $uibModalInstance.dismiss('close');
                    } else {
                        console.log('entityController::$stateChangeStart: ignore ' + toState);
                    }
                });
            }
        ]
        );

