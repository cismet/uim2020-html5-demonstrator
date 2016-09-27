/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'entityController', [
            '$scope', '$state', '$stateParams', '$previousState', '$uibModalInstance',
            'entity', 'entityModalInvoker', 'entityService',
            function ($scope, $state, $stateParams, $previousState, $uibModalInstance,
                    entity, entityModalInvoker, entityService) {
                'use strict';

                var entityController;

                entityController = this;

                //$scope.class = $stateParams.class;
                //$scope.id = $stateParams.id;
                
                $scope.entity = entity;
                //entityController.entity = entity;
                
                entityController.template = 'templates/entity/'+entity.$className+'.html';
                

                /*entity.$promise.then(
                        function (obj) {
                            console.log(obj.$self);
                            //deferred.resolve(obj);
                        },
                        function () {
                            var message = 'Das Objekt "' + objectId + '@' + className +
                                    '" konnte nicht im UIM2020-DI Indexdatenbestand gefunden werden!';
                            console.warn(message);
                            //deferred.reject(message);
                        }
                );*/

                /*var entityResource = entityService.entityResource.get({
                 className: entity.class,
                 objectId: entity.id
                 });*/

                console.log('entityController created');
//                console.log($scope.class + "/" + $scope.id);
//                console.log($scope.entity);
//                console.log('$previousState(entityModalInvoker):' + entityModalInvoker.state);

                entityController.close = function () {
                    //console.log('entityController::close');
                    $uibModalInstance.close('close');
                };


                /**
                 * Called when the modal is closed: go to previous state
                 */
                $uibModalInstance.result.then(function (data) {
                    // modal was closed by the user by pressing one of the close buttons -> go to previous state
                    if(data === 'close') {

                        if ($previousState.get("entityModalInvoker") &&
                                $previousState.get("entityModalInvoker").state) {
                            console.log('entityController::close('+data+') goto $previousState ' + $previousState.get('entityModalInvoker').state.name);
                            $previousState.go('entityModalInvoker');
                            $previousState.forget('entityModalInvoker');
                        } else {
                            console.log('entityController::close('+data+') goto default main.search.map');
                            $state.go('main.search.map');
                        }
                    } else {
                        // ignore:  modal was closed implicitely by state transition -> dont go to previous state!
                    }
                });



                /*
                 $scope.$on("$stateChangeStart", function (evt, toState) {
                 if (!toState.$$state().includes['modal.entity']) {
                 console.log('entityController::$stateChangeStart: $uibModalInstance.close');
                 $uibModalInstance.dismiss('close');
                 } else {
                 console.log('entityController::$stateChangeStart: ignore ' + toState.$$state().name);
                 }
                 });*/
            }
        ]
        );

