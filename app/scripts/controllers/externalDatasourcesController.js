/*global angular, shp, L*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourcesController', [
            '$scope', '$uibModal', 'dataService', 'sharedDatamodel', 'sharedControllers',
            'ExternalDatasource',
            function ($scope, $uibModal, dataService, sharedDatamodel, sharedControllers,
                    ExternalDatasource) {
                'use strict';

                var externalDatasourcesController, mapController;

                externalDatasourcesController = this;
                mapController = sharedControllers.analysisMapController;

                // init global datasources list
                if (!sharedDatamodel.globalDatasources ||
                        sharedDatamodel.globalDatasources.length === 0) {

                    var globalDatasources = dataService.getGlobalDatasources();

                    if (globalDatasources.$resolved) {
                        sharedDatamodel.globalDatasources = globalDatasources;
                        externalDatasourcesController.globalDatasources = sharedDatamodel.globalDatasources;
                    } else {
                        var resolve = function (externalDatasources) {
                            sharedDatamodel.globalDatasources = externalDatasources;
                            sharedDatamodel.globalDatasources.$resolved = true;
                            externalDatasourcesController.globalDatasources = sharedDatamodel.globalDatasources;
                        };

                        if (globalDatasources.$promise) {
                            globalDatasources.$promise.then(resolve);
                        } else {
                            globalDatasources.then(resolve);
                        }
                    }
                }

                // init local datasources list
                externalDatasourcesController.localDatasources =
                        sharedDatamodel.localDatasources;

                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                /**
                 * Toggle selection of global datasource -> add to analysis map
                 * 
                 * @param {type} globalDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.toggleGlobalDatasourceSelection =
                        function (globalDatasource) {

                            if (!globalDatasource.$layer) {

                                // TODO: construct and add Layers!
                                globalDatasource.$layer = {
                                    $selected: true
                                };
                            }

                            if (globalDatasource.$layer.$selected === true) {
                                globalDatasource.$layer.$selected = false;

                                // TODO: remove Layers
                                //mapController.removeOverlay(globalDatasource.$layer);
                            } else {
                                globalDatasource.$layer.$selected = true;

                                // TODO: add Layers
                                //mapController.addOverlay(globalDatasource.$layer);
                            }
                        };

                /**
                 * Add a new local datasource -> open external-datasources.html modal
                 *  
                 * @returns {undefined}
                 */
                externalDatasourcesController.addLocalDatasource =
                        function () {
                            var modalInstance = $uibModal.open({
                                animation: false,
                                templateUrl: 'templates/external-datasource-modal.html',
                                controller: 'importController',
                                controllerAs: 'importController',
                                //size: size,
                                //appendTo:elem,
                                resolve: {
                                    localDatasource: new ExternalDatasource()
                                }
                            });

                            // hide the popover
                            $scope.$hide();

                            /*modalInstance.result.then(function (selectedItem) {
                             externalDatasourcesController.selected = selectedItem;
                             console.log(externalDatasourcesController.selected);
                             }, function () {
                             $log.info('Modal dismissed at: ' + new Date());
                             });*/
                        };

                /**
                 * Remove local datasource for list and from map
                 * 
                 * @param {type} localDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.removeLocalDatasource =
                        function (localDatasource) {
                            var idx = externalDatasourcesController.localDatasources.indexOf(localDatasource);
                            if (idx > -1) {
                                // remove from map and styled layer control
                                mapController.removeOverlay(localDatasource.$layer);

                                // remove list and also from shared datamodel
                                externalDatasourcesController.localDatasources.splice(idx, 1);
                            } else {
                                console.warn("externalDatasourcesController::removeLocalDatasource: unkwon datasource?!");
                            }
                        };

                /**
                 * Toggle selection of local datasource -> add to analysis map
                 * 
                 * @param {type} localDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.toggleLocalDatasourceSelection =
                        function (localDatasource) {

                            if (localDatasource.isSelected() === true) {
                                localDatasource.setSelected(false);
                                mapController.unSelectOverlay(localDatasource.$layer);
                            } else {
                                localDatasource.setSelected(true);
                                mapController.selectOverlay(localDatasource.$layer);
                            }

                            /*var idx = externalDatasourcesController.selectedLocalDatasources.indexOf(localDatasource);
                             if (idx > -1) {
                             externalDatasourcesController.selectedLocalDatasources.splice(idx, 1);
                             mapController.removeOverlay(localDatasource.$layer);
                             } else {
                             externalDatasourcesController.selectedLocalDatasources.push(localDatasource);
                             mapController.addOverlay(localDatasource.$layer);
                             }*/

                            //console.log(globalDatasource.name);
                        };
                //</editor-fold>
            }]);
