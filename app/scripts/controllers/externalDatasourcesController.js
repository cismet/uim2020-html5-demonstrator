/*global angular, shp, L*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourcesController', [
            '$scope', '$uibModal', '$document', '$log', 'dataService', 'sharedDatamodel',
            function ($scope, $uibModal, $document, $log, dataService, sharedDatamodel) {
                'use strict';
                var externalDatasourcesController = this;

                if (dataService.getGlobalDatasources().$resolved) {
                    externalDatasourcesController.globalDatasources = dataService.getGlobalDatasources();
                } else {
                    dataService.getGlobalDatasources().$promise.then(function (externalDatasources) {
                        externalDatasourcesController.globalDatasources = externalDatasources;
                    });
                }
                externalDatasourcesController.selectedGlobalDatasources = sharedDatamodel.selectedGlobalDatasources;

                externalDatasourcesController.localDatasources = sharedDatamodel.localDatasources;
                externalDatasourcesController.selectedLocalDatasources = sharedDatamodel.selectedLocalDatasources;

                externalDatasourcesController.toggleGlobalDatasourceSelection = function (globalDatasource) {
                    var idx = externalDatasourcesController.selectedGlobalDatasources.indexOf(globalDatasource);
                    if (idx > -1) {
                        externalDatasourcesController.selectedGlobalDatasources.splice(idx, 1);
                    } else {
                        externalDatasourcesController.selectedGlobalDatasources.push(globalDatasource);
                    }

                    console.log(globalDatasource.name);
                };

                externalDatasourcesController.items = ['item1', 'item2', 'item3'];

                externalDatasourcesController.animationsEnabled = true;

                externalDatasourcesController.openExternalDatasourceModal = function (size) {

                    //var elem = angular.element( document.querySelector( '#externalDatasourcesPopover' ) );

                    var modalInstance = $uibModal.open({
                        animation: false,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: 'templates/external-datasource-modal.html',
                        controller: 'externalDatasourceModalController',
                        controllerAs: 'externalDatasourceModalController',
                        size: size,
                        //appendTo:elem,
                        resolve: {
                            items: function () {
                                return externalDatasourcesController.items;
                            }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        externalDatasourcesController.selected = selectedItem;
                        console.log(externalDatasourcesController.selected);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };



            }]);

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourceModalController', [
            '$scope', '$uibModalInstance', 'dataService', 'sharedDatamodel',
            'sharedControllers',
            function ($scope, $uibModalInstance, dataService, sharedDatamodel,
                    sharedControllers) {
                'use strict';
                var externalDatasourceModalController, handleZipFile, convertToLayer,
                        setFiles;

                var mapController;

                externalDatasourceModalController = this;
                externalDatasourceModalController.importFile = null;

                mapController = sharedControllers.analysisMapController;

                $scope.uploadPic = function (file) {

                    console.log(file.name);
                    console.log(file.type);

                    handleZipFile(file);


//                    file.upload = Upload.upload({
//                        url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//                        data: {username: $scope.username, file: file},
//                    });
//
//                    file.upload.then(function (response) {
//                        $timeout(function () {
//                            file.result = response.data;
//                        });
//                    }, function (response) {
//                        if (response.status > 0)
//                            $scope.errorMsg = response.status + ': ' + response.data;
//                    }, function (evt) {
//                        // Math.min is to fix IE which reports 200% sometimes
//                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//                    });
                };



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
                    reader.onload = function () {
                        if (reader.readyState !== 2 || reader.error) {
                            console.error("File could not be read! Code " + reader.error);
                            return;
                        } else {

                            //convertToLayer(reader.result, file.name);
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
                        var contents = event.target.result,
                                error = event.target.error;

                        if (error !== null) {
                            console.error("File could not be read! Code " + error.code);
                        } else {
                            //progressNode.max = 1;
                            //progressNode.value = 1;
                            //console.log("Contents: " + contents);
                            console.log('onloadend');
                            convertToLayer(contents, file.name);
                        }
                    };

                    reader.readAsArrayBuffer(file);
                };

                function onEachFeature(feature, layer) {
                    // does this feature have a property named popupContent?
                    if (feature.properties && feature.properties.popupContent) {
                        layer.bindPopup(feature.properties.popupContent);
                        console.log('onEachFeature');
                    }
                }

                var geojsonFeature = {
                    "type": "Feature",
                    "properties": {
                        "name": "Coors Field",
                        "amenity": "Baseball Stadium",
                        "popupContent": "This is where the Rockies play!"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [-104.99404, 39.75621]
                    }
                };

                var gl = L.geoJson(geojsonFeature, {
                    onEachFeature: onEachFeature
                });

                //console.log(gl);

                convertToLayer = function convertToLayer(buffer, fileName) {
                    console.log('convertToLayer: ' + name);
                    var shapeFile = shp(buffer).then(function (geojson) {
                        var i = 0;
                        geojson.fileName = fileName;
                        var shapeFileLayer = L.shapefile(geojson, {
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

                externalDatasourceModalController.items = ['item1', 'item2', 'item3'];
                externalDatasourceModalController.selected = {
                    item: externalDatasourceModalController.items[0]
                };
                externalDatasourceModalController.ok = function () {
                    $uibModalInstance.close(externalDatasourceModalController.selected.item);
                };
                externalDatasourceModalController.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]);