/* 
 * Copyright (C) 2016 cismet GmbH, Saarbruecken, Germany
 *
 *                                ... and it just works.
 *
 */

/*global angular, shp, L, Math*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'importController', [
            '$scope', '$uibModalInstance', 'dataService', 'featureRendererService', 'sharedDatamodel',
            'sharedControllers', 'localDatasource',
            function ($scope, $uibModalInstance, dataService, featureRendererService, sharedDatamodel,
                    sharedControllers, localDatasource) {
                'use strict';
                var importController, mapController, handleZipFile, convertToLayer;

                importController = this;
                mapController = sharedControllers.analysisMapController;

                importController.importFile = null;
                importController.maxFilesize = '10MB';
                importController.importProgress = 0;
                importController.importInProgress = false;
                importController.importCompleted = false;
                importController.importError = false;


                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ===========================">
                /**
                 * More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                 * 
                 * @param {type} file
                 * @returns {undefined}
                 */
                handleZipFile = function (file) {
                    var reader = new FileReader();

                    localDatasource.name = file.name.split(".").slice(0, 1).pop();
                    localDatasource.fileName = file.name;

                    /*reader.onload = function () {
                     if (reader.readyState !== 2 || reader.error) {
                     console.error("File could not be read! Code " + reader.error);
                     return;
                     } else {
                     convertToLayer(reader.result, file.name);
                     }
                     };*/

                    reader.onloadstart = function () {
                        importController.importInProgress = true;
                        console.log('onloadstart -> importController.importInProgress:' + importController.importInProgress);
                        if (reader.readyState !== 2 || reader.error) {
                            //console.error("File could not be read! Code " + reader.error);
                            //return;
                        } else {

                        }
                    };

                    reader.onprogress = function (progressEvent) {
                        importController.importInProgress = true;
                        var max, current;
                        if (progressEvent.lengthComputable) {
                            max = event.total;
                            current = event.loaded;

                            //console.log('importProgress: ' + current + '(' + Math.min(100, parseInt(100.0 * current / max)) + '%)');
                            importController.importProgress =
                                    Math.min(100, parseInt(100.0 * current / max));

                        } else {
                            importController.importProgress = 100;
                        }
                    };

                    reader.onloadend = function (event) {
                        var arrayBuffer, error;
                        
                        

                        arrayBuffer = event.target.result;
                        error = event.target.error;

                        if (error) {
                            console.error("File could not be read! Code " + error.code);
                            importController.importProgress = 0;
                            importController.importInProgress = false;
                            importController.importError = true;
                        } else {
                            importController.importProgress = 100;
                            console.log('onloadend -> importController.onloadend: ' + 
                                    importController.importProgress);
                            convertToLayer(arrayBuffer, file.name);
                        }
                    };

                    reader.readAsArrayBuffer(file);
                };

                // </editor-fold>


                convertToLayer = function convertToLayer(buffer) {
                    var overlayLayer;
                    
                    shp(buffer).then(function (geojson) {
                        console.log('importController::convertToLayer: processing ' + 
                                geojson.features.length + "' GeoJson Features");
                        overlayLayer = featureRendererService.createOverlayLayer(
                                localDatasource, geojson, function (max, current) {
                                    if (current === max) {
                                        importController.importProgress = 100 +
                                                Math.min(100, parseInt(100.0 * current / max));
                                    } else {
                                        importController.importProgress = 200;
                                    }

                                    if (importController.importProgress === 200) {
                                        importController.importInProgress = false;
                                        importController.importCompleted = true;
                                    }
                                });

                        sharedDatamodel.localDatasources.push(localDatasource);
                        mapController.addOverlay(overlayLayer);
                    });
                };

                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                importController.import = function () {
                    if (importController.importFile !== null) {
                        handleZipFile(importController.importFile);
                    } else {
                        $uibModalInstance.dismiss('cancel');
                    }
                };

                importController.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                importController.close = function () {
                    $uibModalInstance.close(localDatasource);
                };
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc="=== DISABLED ===========================">

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

                /*
                 setFiles = function (element) {
                 console.log('files:', element.files);
                 // Turn the FileList object into an Array
                 importController.importFiles = [];
                 for (var i = 0; i < element.files.length; i++) {
                 importController.importFiles.push(element.files[i]);
                 }
                 };*/
                // </editor-fold>

            }]);
