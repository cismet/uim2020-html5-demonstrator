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
                ['$http', '$q', 'authenticationService', 'configurationService', 'sharedDatamodel', 'ExportEntitiesCollection',
                    function ($http, $q, authenticationService, configurationService, sharedDatamodel, ExportEntitiesCollection) {
                        'use strict';
                        var getExportParametersMap, cidsRestApiConfig;
                        
                        cidsRestApiConfig = configurationService.cidsRestApi;

                        var taskparams = new Blob([JSON.stringify(
                                    {"actionKey": "restApiExportAction",
                                        "description": "Export Meta-Data Repository to CSV",
                                        "parameters":
                                                {"aggregationValues": "egal"}
                                    })], {type: 'application/json'});

                        var file = new Blob([JSON.stringify(
                                    {"actionKey": "restApiExportAction",
                                        "description": "Export Meta-Data Repository to CSV",
                                        "parameters":
                                                {"aggregationValues": "egal"}
                                    })], {type: 'application/json'});

                        var formData = new FormData();
                        formData.append('taskparams', taskparams);
                        formData.append('file', file);

                        /*$.ajax({
                         url: 'http://127.0.0.1:8890/actions/UDM2020-DI.restApiExportAction/tasks?role=all&resultingInstanceType=result',
                         data: formData,
                         cache: false,
                         contentType: false,
                         processData: false,
                         dataType: 'binary',
                         type: 'POST',
                         async: true,
                         headers: { 
                         'Authorization': authenticationService.getAuthorizationToken()
                         },*/
                        var httpRequest = $http({
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
                                'Accept': 'application/zip',
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
                                formData.append("file", new Blob([angular.toJson(data.file)], {type: 'application/json'}));
                                return formData;
                            },
                            responseType: 'arraybuffer',
                            //Create an object that contains the model and files which will be transformed
                            // in the above transformRequest method
                            data: {taskparams: {"actionKey": "restApiExportAction",
                                    "description": "Export Meta-Data Repository to CSV",
                                    "parameters":
                                            {"aggregationValues": "egal"}
                                }, file: {"actionKey": "restApiExportAction",
                                    "description": "Export Meta-Data Repository to CSV",
                                    "parameters":
                                            {"aggregationValues": "egal"}
                                }}
                        });

                        httpRequest.then(
                                function successCallback(response) {
                                    console.log(response.status);
                                    var blob = new Blob([response.data], {type: 'application/octet-stream'});
                                    //console.log(blob);
                                    //console.log(new Blob([ response ]));
                                    //var objectUrl = URL.createObjectURL(blob);
                                    //window.open(objectUrl);  
                                    //$window.open(objectUrl); 

                                    saveAs(blob, "blob.zip");
                                    //saveAs(new Blob([ response ], { type : 'application/octet-stream'}), 'blob2.zip');  
                                },
                                function errorCallback(response) {
                                    console.log(response);
                                });


                        getExportParametersMap = function (analysisNodes) {
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
                            getExportParametersMap: getExportParametersMap
                        };
                    }]);


