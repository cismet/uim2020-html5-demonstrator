/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global angular,URL */

angular.module('de.cismet.uim2020-html5-demonstrator.services')
        .factory('exportService',
                ['$http', '$interval', 'authenticationService', 'configurationService',
                    function ($http, $interval, authenticationService, configurationService) {
                        'use strict';
                        var cidsRestApiConfig, exportFunction, getExportParametersMapFunction;

                        cidsRestApiConfig = configurationService.cidsRestApi;

                        /**
                         * 
                         * @param {type} exportOptions
                         * @param {type} externalDatasource
                         * @param {type} progressCallback
                         * @returns {undefined}
                         */
                        exportFunction = function (exportOptions, externalDatasourceData, progressCallback) {

                            var noop, timer, fakeProgress, httpRequest, promise;

                            // FIXME: get rid of this noop stuff -> makes code unreadable
                            noop = angular.noop;
                            // current value, max value, type, max = -1 indicates indeterminate
                            (progressCallback || noop)(0, -1, 'success');
                            fakeProgress = 0;

                            /**
                             * Runs 30.000ms (500*60), after 1500 ms progress 
                             */
                            timer = $interval(function () {
                                (progressCallback || noop)(fakeProgress, -1, 'success');

                                //-> max 300 ticks, update every 0,5 second

                                // after 30 intervals (15sec) already 70% (7*30=210) of max ticks (300) used
                                if (fakeProgress < 270) {
                                    fakeProgress += 7;
                                } else {
                                    fakeProgress += 3; // next 50% of timer count last 30% of ticks!
                                }

                                fakeProgress++;
                                // Number of milliseconds between each function call.
                                // Number of times to repeat. If not set, or 0, will repeat indefinitely.    
                            }, 500, 60); //  30.000ms (500*60)

                            httpRequest = $http({
                                method: 'POST',
                                url: cidsRestApiConfig.host + '/actions/' +
                                        cidsRestApiConfig.domain + '.' +
                                        cidsRestApiConfig.restApiExportAction +
                                        '/tasks',
                                params: {
                                    'role': configurationService.authentication.role,
                                    'resultingInstanceType': 'result'
                                },
                                //IMPORTANT!!! You might think this should be set to 'multipart/form-data' 
                                // but this is not true because when we are sending up files the request 
                                // needs to include a 'boundary' parameter which identifies the boundary 
                                // name between parts in this multi-part request and setting the Content-type 
                                // manually will not set this boundary parameter. For whatever reason, 
                                // setting the Content-type to 'false' will force the request to automatically
                                // populate the headers properly including the boundary parameter.
                                headers: {
                                    'Accept': 'application/zip,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/vnd.ms-excel,text/csv; charset=UTF-8',
                                    'Content-Type': undefined,
                                    'Authorization': authenticationService.getAuthorizationToken()},
                                //This method will allow us to change how the data is sent up to the server
                                // for which we'll need to encapsulate the model data in 'FormData'
                                transformRequest: function (data) {
                                    var formData = new FormData();
                                    //need to convert our json object to a string version of json otherwise
                                    // the browser will do a 'toString()' on the object which will result 
                                    // in the value '[Object object]' on the server.
                                    formData.append("taskparams", new Blob([angular.toJson(data.taskparams)], {type: 'application/json'}));
                                    if (typeof data.file !== 'undefined' && data.file !== null) {
                                        formData.append("file", data.file);
                                        console.log('exportService::export -> sending "' + data.file.type + '" file');
                                    } else {
                                        console.log('exportService::export -> do not sending body parameter (file is null)');
                                    }
                                    return formData;
                                },
                                // set responseType to blob!
                                responseType: 'blob',
                                //Create an object that contains the model and files which will be transformed
                                // in the above transformRequest method
                                // Important:  transfer exportOptions as quoted JSON String, otherwise Jersey will deserilaize Json to LinkedHashMap!
                                data: {
                                    taskparams: {'actionKey': 'restApiExportAction',
                                        'description': 'Export Meta-Data Repository to CSV',
                                        'parameters': {'\exportOptions': angular.toJson(exportOptions)}},
                                    file: externalDatasourceData
                                }
                            });

                            promise = httpRequest.then(
                                    function successCallback(response) {
                                        //var blob = new Blob([response.data], {type: 'application/octet-stream'});
                                        var blob, extension, exportFile;
                                        blob = response.data;

                                        if (blob.type && blob.type.includes('csv')) {
                                            extension = 'csv';
                                        } else if (blob.type && blob.type.includes('vnd.ms-excel')) {
                                            extension = 'xls';
                                        } else if (blob.type && blob.type.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                                            extension = 'xlsx';
                                        } else {
                                            extension = 'zip';
                                        }

                                        exportFile = configurationService.export.exportFileBase + '.' + extension;

                                        console.debug('exportService::export -> success, saving export to "' +
                                                exportFile + '" (' + blob.type + ')');

                                        saveAs(blob, exportFile);

                                        $interval.cancel(timer);
                                        // set current AND max to node count -> signalise search completed
                                        (progressCallback || noop)(300, 300, 'success');

                                        return true;
                                    },
                                    function errorCallback(response) {
                                        $interval.cancel(timer);
                                        (progressCallback || noop)(1, 1, 'error');
                                        console.error('exportService::export -> error during export: ' +
                                                response.statusText + ' (' + response.status + '):\n' + angular.toJson(response.data));
                                        return false;
                                    });

                            return promise;
                        };

                        /**
                         * 
                         * @param {type} analysisNodes
                         * @returns {exportService_L16.getExportParametersMap.exportParametersMap}
                         */
                        getExportParametersMapFunction = function (analysisNodes) {
                            var exportParametersMap, ExportEntitiesCollection;

                            exportParametersMap = {};
                            exportParametersMap.$size = 0;

                            analysisNodes.forEach(function (node) {
                                if (typeof exportParametersMap[node.$className] === 'undefined' ||
                                        exportParametersMap[node.$className] === null) {
                                    exportParametersMap[node.$className] =
                                            new ExportEntitiesCollection(node.$className, node.$classTitle);
                                    exportParametersMap.$size++;
                                }

                                ExportEntitiesCollection = exportParametersMap[node.$className];
                                ExportEntitiesCollection.addAllFromNode(node);
                            });

                            return exportParametersMap;
                        };

                        return {
                            export: exportFunction,
                            getExportParametersMap: getExportParametersMapFunction
                        };
                    }]);