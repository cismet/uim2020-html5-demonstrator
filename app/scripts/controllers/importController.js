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
            '$q', '$scope', '$timeout', '$window', '$uibModalInstance', 'configurationService', 'featureRendererService', 'sharedDatamodel',
            'sharedControllers', 'localDatasource',
            function ($q, $scope, $timeout, $window, $uibModalInstance, configurationService, featureRendererService, sharedDatamodel,
                    sharedControllers, localDatasource) {
                'use strict';
                var config, importController, mapController, handleZipFile, convertToLayer,
                        updateProgress;

                importController = this;
                config = configurationService.import;
                mapController = sharedControllers.analysisMapController;

                importController.importFile = null;
                importController.maxFilesize = config.maxFilesize;
                importController.importProgress = 0;
                importController.importInProgress = false;
                importController.importCompleted = false;
                importController.importError = false;
                importController.status = sharedDatamodel.status;
                importController.status.type = 'primary';
                importController.status.message = 'Wählen sie eine gezippte Shape Datei aus, um den Datenimport zu starten.';

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

                    reader.onloadstart = function () {
                        if (reader.error) {
                            importController.importProgress = 0;
                            importController.importInProgress = false;
                            importController.importCompleted = false;
                            importController.importError = true;
                            importController.status.type = 'danger';
                            importController.status.message = 'Die Datei "' + localDatasource.fileName + '" konnte nicht geladen werden: ' + reader.error;
                        } else {
                            $scope.$apply(function () {
                                importController.importInProgress = true;
                                importController.status.type = 'primary';
                                importController.status.message = 'Die Datei "' + localDatasource.fileName + '" wird geladen.';
                            });
                        }
                    };

                    reader.onprogress = function (progressEvent) {

                        $scope.$apply(function () {
                            importController.importInProgress = true;
                            importController.importCompleted = false;
                        });

                        var max, current;
                        if (progressEvent.lengthComputable) {
                            max = event.total;
                            current = event.loaded;

                            //console.log('importController::onprogress -> importProgress: ' + current + '/' + max +
                            //        ' (' + Math.min(100, parseInt(100.0 * current / max)) + '%)');

                            $scope.$apply(function () {
                                importController.importProgress =
                                        Math.min(100, parseInt(100.0 * current / max));
                            });

                        } else {
                            $scope.$apply(function () {
                                importController.importProgress = 100;
                            });
                        }
                    };

                    reader.onloadend = function (event) {
                        var arrayBuffer, error;

                        arrayBuffer = event.target.result;
                        error = event.target.error;

                        if (error) {
                            console.error('importController::onloadend -> File could not be read! Code ' + error.code);
                            $scope.$apply(function () {
                                importController.importProgress = 0;
                                importController.importInProgress = false;
                                importController.importError = true;
                                importController.importCompleted = false;
                                importController.status.type = 'danger';
                                importController.status.message = 'Die Datei "' + localDatasource.fileName + '" konnte nicht geladen werden: ' + reader.error;
                            });
                        } else {
                            $scope.$apply(function () {
                                importController.importProgress = 100;
                            });

                            //console.log('importController::onloadend -> importController.onloadend progress: ' +
                            //        importController.importProgress);



                            $timeout(function () {
                                importController.importProgress = 100;
                                importController.status.type = 'primary';
                                importController.status.message = 'Die Datei "' + localDatasource.fileName + '" wird verarbeitet.';

                                convertToLayer(arrayBuffer, file.name);
                            }, 500);

                            //console.log('importController::onloadend -> importController.onloadend progress: ' +
                            //        importController.importProgress);
                        }
                    };

                    reader.readAsArrayBuffer(file);
                };

                // </editor-fold>

                updateProgress = function (max, current) {
                    var importProgress = 0;

                    if (current < max) {
                        importProgress = 100 +
                                Math.min(100, parseInt(100.0 * current / max));

                        // update only every 1% step
                        if (importProgress > importController.importProgress) {
                            $scope.$apply(function () {
                                importController.importProgress = importProgress;
                            });
                            //console.log('importController::convertToLayer: importProgress = ' + 
                            //        importProgress + ' (' + current + '/' + max + ')');
                        }
                    } else { // finished
                        importProgress = 200;
                        //console.log('importController::convertToLayer: importProgress FINISHED = ' + 
                        //        importProgress + ' (' + current + '/' + max + ')');
                        $scope.$apply(function () {
                            importController.importProgress = 200;
                            importController.importInProgress = false;
                            importController.importCompleted = true;
                            importController.status.type = 'success';
                            importController.status.message = 'Die Datei "' + localDatasource.fileName + '" wurde importiert.';
                        });
                    }
                };

                convertToLayer = function convertToLayer(buffer) {
                    var promise;

                    promise = shp(buffer).then(
                            function success(geojson) {
                                var isCreateOverlayLayer = true;
                                //console.log('importController::convertToLayer: processing ' +
                                //        geojson.features.length + ' GeoJson Features');

                                importController.status.type = 'primary';
                                importController.status.message = geojson.features.length + ' Features bereit zum Verarbeiten.';

                                if (geojson.features.length > config.maxFeatureCount) {
                                    isCreateOverlayLayer = $window.confirm('Die Datei enhält mehr als ' + config.maxFeatureCount + ' Features.\n' +
                                            'Wollen Sie diese wirklich importieren?');
                                }

                                if (isCreateOverlayLayer === true) {
                                    importController.status.message = geojson.features.length + ' Features werden verarbeitet.';
                                    // return new promise
                                    return featureRendererService.createOverlayLayer(
                                            localDatasource, geojson, updateProgress);
                                } else {
                                    return $q.reject('Zu viele Features');
                                }
                            }, function error(reason) {
                        console.error('importController::convertToLayer: could not process "' +
                                localDatasource.fileName + '": ' + reason);

                        importController.importProgress = 0;
                        importController.importInProgress = false;
                        importController.importError = true;
                        importController.importCompleted = false;
                        importController.status.type = 'danger';
                        importController.status.message = 'Die Datei "' + localDatasource.fileName + '" konnte nicht verarbeitet werden: ' + reason;
                    });

                    promise.then(
                            function success(overlayLayer) {
                                //console.log('importController::convertToLayer: GeoJson Features successfully processed');
                                $timeout(function () {
                                    //console.log('importController::convertToLayer: adding  ' + overlayLayer.getLayers().length + ' GeoJson Features to map');
                                    mapController.addOverlay(overlayLayer);
                                    //console.log('importController::convertToLayer: ' + overlayLayer.getLayers().length + ' GeoJson Features added to map');
                                    sharedDatamodel.localDatasources.push(localDatasource);

                                    importController.importProgress = 200;
                                    importController.importInProgress = false;
                                    importController.importCompleted = true;
                                    importController.status.type = 'success';
                                    importController.status.message = overlayLayer.getLayers().length +
                                            ' Features aus der Datei "' + localDatasource.fileName + '" wurden der Karte hinzugefügt';
                                }, 500);
                            },
                            function error(reason) {
                                $timeout(function () {
                                    console.log('importController::convertToLayer: failed: ' + reason);
                                    importController.importProgress = 0;
                                    importController.importInProgress = false;
                                    importController.importError = true;
                                    importController.importCompleted = false;
                                    importController.status.type = 'danger';
                                    importController.status.message = 'Die Datei "' + localDatasource.fileName + '" konnte nicht verarbeitet werden: ' + reason;
                                }, 100);
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
