/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L */
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory('dataService',
        ['$q', '$resource', 'ExternalDatasource', 'configurationService',
            function ($q, $resource, ExternalDatasource, configurationService) {
                'use strict';

                var staticResourceFiles, cachedResources,
                        lazyLoadResource, shuffleArray, searchLocations,
                        extendNode;

                searchLocations = [
                    {
                        name: 'Gesamter Kartenausschnitt',
                        id: 0,
                        geometry: null
                    }, {
                        name: 'Ausgewählte Geometrie',
                        id: 1,
                        geometry: null,
                        disabled: true
                    }
                ];

                staticResourceFiles = {
                    'searchThemes': 'data/searchThemes.json',
                    'searchPollutants': 'data/searchPollutants.json',
                    'gazetteerLocations': 'data/gazetteerLocations.json',
                    'filterPollutants': 'data/filterPollutants.json',
                    'mockNodes': 'data/resultNodes.json',
                    'mockObjects': 'data/resultObjects.json',
                    'globalDatasources': 'data/globalDatasources.json'
                };

                // cached resource data
                cachedResources = [];

                lazyLoadResource = function (resourceName, isArray) {
                    var resource;
                    // cached resource does exist
                    if (cachedResources.hasOwnProperty(resourceName)) {
                        resource = cachedResources[resourceName];
                        if (!resource.$resolved) {
                            console.warn('possible synchonisation problem for cached resource ' + resourceName);
                        }

                        return resource;
                    } else if (staticResourceFiles.hasOwnProperty(resourceName)) {
                        resource = $resource(staticResourceFiles[resourceName], {}, {
                            query: {
                                method: 'GET',
                                params: {
                                },
                                isArray: isArray
                            }
                        });

                        if (resourceName === 'globalDatasources') {
                            cachedResources[resourceName] = resource.query().$promise.then(function success(datasources) {
                                var globalDatasources = [];
                                globalDatasources.$promise = $q.when(globalDatasources);
                                globalDatasources.$resolved = true;
                                datasources.forEach(function (datasource) {
                                    //invoke  constructor
                                    var externalDatasource = new ExternalDatasource(datasource);
                                    externalDatasource.global = true;
                                    globalDatasources.push(externalDatasource);
                                });
                                globalDatasources.$resolved = true;

                                return globalDatasources;
                            });
                        } else {
                            cachedResources[resourceName] = resource.query();
                        }
                        
                        if (resourceName === 'mockNodes') {
                            cachedResources[resourceName].$promise.then(function success(mockNodes) {
                                mockNodes.forEach(function (mockNode) {
                                    mockNode = extendNode(mockNode);
                                });
                            });
                        }

                        return cachedResources[resourceName];
                    } else {
                        console.warn('unknown static resource:' + resourceName);
                        //return array ? [] : {};
                        return null;
                    }
                };

                shuffleArray = function (array) {
                    var m = array.length, t, i;

                    // While there remain elements to shuffle…
                    while (m) {

                        // Pick a remaining element…
                        i = Math.floor(Math.random() * m--);

                        // And swap it with the current element.
                        t = array[m];
                        array[m] = array[i];
                        array[i] = t;
                    }

                    return array;
                };

                extendNode = function (currentNode) {
                    var dataObject, className;
                    className = currentNode.classKey.split(".").slice(1, 2).pop();

                    // ----------------------------------------------------------
                    // Extend the resolved object by local properties
                    // ----------------------------------------------------------

                    /**
                     * filtered node flag!
                     */
                    currentNode.$filtered = false;

                    currentNode.$className = className;

                    if (configurationService.featureRenderer.icons[className]) {
                        currentNode.$icon = configurationService.featureRenderer.icons[className].options.iconUrl;
                    }

                    // FIXME: extract class name from CS_CLASS description (server-side)
                    if (configurationService.featureRenderer.layergroupNames[className]) {
                        currentNode.$classTitle = configurationService.featureRenderer.layergroupNames[className];
                    } else {
                        currentNode.$classTitle = className;
                    }

                    if (currentNode.lightweightJson) {
                        try {
                            dataObject = angular.fromJson(currentNode.lightweightJson);
                            currentNode.$data = dataObject;
                            delete currentNode.lightweightJson;
                            // FIXME: extract class name from CS_CLASS description (server-side)
                            /*currentNode.$classTitle = dataObject.classTitle ?
                             dataObject.classTitle : classTitle;*/

                            // extract PKs for Oracle DWH Export
                            /* jshint loopfunc:true */
                            Object.keys(configurationService.export.exportPKs).forEach(function (key, index) {
                                if (currentNode.$className === key && 
                                        typeof dataObject[configurationService.export.exportPKs[key]] !== 'undefined' &&
                                        dataObject[configurationService.export.exportPKs[key]] !== null) {
                                    // cast to string as generic export action supports only String collection for PKs
                                    currentNode.$exportPK = String(dataObject[configurationService.export.exportPKs[key]]);
                                }
                            });

                            if (typeof currentNode.$exportPK === 'undefined' || currentNode.$exportPK === null) {
                                console.warn('searchService::extractExportPKs -> no export PK found for node ' + currentNode.objectKey);
                            }

                        } catch (err) {
                            console.error(err.message);
                        }
                    }
                    
                    return currentNode;
                };

                //lazyLoadResource('searchPollutants', true);

                return {
                    getSearchLocations: function () {
                        return searchLocations;
                    },
                    getSearchThemes: function () {
                        return lazyLoadResource('searchThemes', true);
                    },
                    getSearchPollutants: function () {
                        return lazyLoadResource('searchPollutants', true);
                    },
                    getGazetteerLocations: function () {
                        return lazyLoadResource('gazetteerLocations', true);
                    },
                    getGlobalDatasources: function () {
                        return lazyLoadResource('globalDatasources', true);
                    },
                    getMockNodes: function () {
                        var mockNodes = lazyLoadResource('mockNodes', true);
                        if (mockNodes.$resolved) {
                            shuffleArray(mockNodes);
                        }

                        return mockNodes;
                    },
                    extendNode: extendNode
                };
            }]
        );
