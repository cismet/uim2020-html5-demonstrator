/*global angular, shp, L*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourcesController', [
            '$scope', '$uibModal', '$document', '$log', 'dataService', 'sharedDatamodel',
            'sharedControllers',
            function ($scope, $uibModal, $document, $log, dataService,
                    sharedDatamodel, sharedControllers) {
                'use strict';

                var externalDatasourcesController, mapController;

                externalDatasourcesController = this;
                mapController = sharedControllers.analysisMapController;

                if (!sharedDatamodel.globalDatasources || sharedDatamodel.globalDatasources.length === 0) {
                    if (dataService.getGlobalDatasources().$resolved) {
                        externalDatasourcesController.globalDatasources = dataService.getGlobalDatasources();
                    } else {
                        dataService.getGlobalDatasources().$promise.then(function (externalDatasources) {
                            externalDatasourcesController.globalDatasources = externalDatasources;
                            externalDatasourcesController.globalDatasources.$resolved = true;
                        });
                    }
                }

                //externalDatasourcesController.selectedGlobalDatasources = sharedDatamodel.selectedGlobalDatasources;
                externalDatasourcesController.localDatasources = sharedDatamodel.localDatasources;
                //externalDatasourcesController.selectedLocalDatasources = sharedDatamodel.selectedLocalDatasources;

                externalDatasourcesController.toggleGlobalDatasourceSelection = function (globalDatasource) {

                    if (!globalDatasource.$layer) {
                        // TODO: contruct and add Layers!
                        globalDatasource.$layer = {
                            $selected: true
                        };
                    }


                    if (globalDatasource.$layer.$selected === true) {
                        globalDatasource.$layer.$selected = false;
                        //mapController.removeOverlay(globalDatasource.$layer);
                    } else {
                        globalDatasource.$layer.$selected = true;
                        // TODO: remove Layers
                        //mapController.addOverlay(globalDatasource.$layer);
                    }
                };

                /**
                 * Add a new local datasource, open external-datasources.html modal
                 *  
                 * @returns {undefined}
                 */
                externalDatasourcesController.addLocalDatasource = function () {
                    var modalInstance = $uibModal.open({
                        animation: false,
                        templateUrl: 'templates/external-datasource-modal.html',
                        controller: 'externalDatasourceModalController',
                        controllerAs: 'externalDatasourceModalController',
                        //size: size,
                        //appendTo:elem,
                        resolve: {
                            localDatasource: function () {
                                return {};
                            }
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

                externalDatasourcesController.removeLocalDatasource = function (localDatasource) {
                    var idx = externalDatasourcesController.localDatasources.indexOf(localDatasource);
                    if (idx > -1) {
                        // calls also remove on map
                        externalDatasourcesController.toggleLocalDatasourceSelection(false);
                        externalDatasourcesController.localDatasources.splice(idx, 1);
                    } else {
                        console.warn("externalDatasourcesController::removeLocalDatasource: unkwon datasource?!");
                    }
                };

                externalDatasourcesController.toggleLocalDatasourceSelection = function (localDatasource) {

                    if (localDatasource.$layer.$selected === true) {
                        localDatasource.$layer.$selected = false;
                        mapController.removeOverlay(localDatasource.$layer);
                    } else {
                        localDatasource.$layer = true;
                        mapController.addOverlay(localDatasource.$layer);
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

            }]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourceModalController', [
            '$scope', '$uibModalInstance', 'dataService', 'sharedDatamodel',
            'sharedControllers', 'localDatasource',
            function ($scope, $uibModalInstance, dataService, sharedDatamodel,
                    sharedControllers, localDatasource) {
                'use strict';
                var externalDatasourceModalController, mapController, handleZipFile, convertToLayer,
                        setFiles;

                externalDatasourceModalController = this;
                mapController = sharedControllers.analysisMapController;
                
                
                externalDatasourceModalController.importFile = null;

                setFiles = function (element) {
                    console.log('files:', element.files);
                    // Turn the FileList object into an Array
                    externalDatasourceModalController.importFiles = [];
                    for (var i = 0; i < element.files.length; i++) {
                        externalDatasourceModalController.importFiles.push(element.files[i]);
                    }

                };

                //More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                handleZipFile = function (file) {
                    var reader = new FileReader();
                    
                    /*reader.onload = function () {
                        if (reader.readyState !== 2 || reader.error) {
                            console.error("File could not be read! Code " + reader.error);
                            return;
                        } else {
                            convertToLayer(reader.result, file.name);
                        }
                    };*/

                    reader.onloadstart = function () {
                        if (reader.readyState !== 2 || reader.error) {
                            console.error("File could not be read! Code " + reader.error);
                            return;
                        } else {
                            
                        }
                    };
                    
                    reader.onprogress = function (progressEvent) {
                        if (event.lengthComputable) {
                            //progressNode.max = event.total;
                            //progressNode.value = event.loaded;
                            console.log('uploadProgress: ' + progressEvent.loaded + '(' +
                                    Math.min(100, parseInt(100.0 * progressEvent.loaded / progressEvent.total)) + '%');
                        }
                    };

                    reader.onloadend = function (event) {
                        var arrayBuffer, error;
                        
                        arrayBuffer = event.target.result;
                        error = event.target.error;

                        if (error !== null) {
                            console.error("File could not be read! Code " + error.code);
                        } else {
                            //progressNode.max = 1;
                            //progressNode.value = 1;
                            //console.log("Contents: " + contents);
                            console.log('onloadend');
                            convertToLayer(arrayBuffer, file.name);
                        }
                    };

                    // TODO: add localDatasource

                    reader.readAsArrayBuffer(file);
                };

                function onEachFeature(feature, layer) {
                    if (feature.properties) {
                        layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                            return k + ": " + feature.properties[k];
                        }).join("<br />"), {
                            maxHeight: 200
                        });
                    }
                }

                //console.log(gl);

                convertToLayer = function convertToLayer(buffer, fileName) {
                    console.log('convertToLayer: ' + name);
                    var shapeFile = shp(buffer).then(function (geojson) {
                        var i = 0;
                        geojson.fileName = fileName;
                        var shapeFileLayer = L.geoJson(geojson, {
                            onEachFeature: onEachFeature /* function (feature, layer) {
                             if (feature.properties) {
                             layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                             return k + ": " + feature.properties[k];
                             }).join("<br />"), {
                             maxHeight: 200
                             });
                             }
                             console.log('shpProcessingProgress:' + i++);
                             }*/
                        });

//                        shapeFileLayer = L.geoJson(geojson, {
//                            onEachFeature: function (feature, layer) {
//                                if (feature.properties) {
//                                    layer.bindPopup(Object.keys(feature.properties).map(function (k) {
//                                        return k + ": " + feature.properties[k];
//                                    }).join("<br />"), {
//                                        maxHeight: 200
//                                    });
//                                }
//                                console.log('shpProcessingProgress:' + i++);
//                            }
//                        });

                        //shapeFileLayer = L.Shapefile(geojson);
                        //shapeFileLayer = L.shapefile(geojson);

                        shapeFileLayer.$name = fileName;
                        shapeFileLayer.$key = fileName;
                        shapeFileLayer.StyledLayerControl = {
                            removable: true,
                            visible: false
                        };
                        console.log('addOverlay: ' + fileName);
                        mapController.addOverlay(shapeFileLayer);
                        shapeFileLayer.once("data:loaded", function () {
                            console.log("finished loaded shapefile");
                        });


                    });
                };

                externalDatasourceModalController.ok = function () {
                    //$uibModalInstance.close(externalDatasourceModalController.selected.item);
                    $uibModalInstance.close();
                };
                
                externalDatasourceModalController.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                /*$scope.uploadPic = function (file) {
                 
                 console.log(file.name);
                 console.log(file.type);
                 
                 handleZipFile(file);
                 
                 
                 file.upload = Upload.upload({
                 url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                 data: {username: $scope.username, file: file},
                 });
                 
                 file.upload.then(function (response) {
                 $timeout(function () {
                 file.result = response.data;
                 });
                 }, function (response) {
                 if (response.status > 0)
                 $scope.errorMsg = response.status + ': ' + response.data;
                 }, function (evt) {
                 // Math.min is to fix IE which reports 200% sometimes
                 file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 });
                 };*/

            }]);