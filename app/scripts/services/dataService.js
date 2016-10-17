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
        ['$q', '$resource', 'ExternalDatasource',
            function ($q, $resource, ExternalDatasource) {
                'use strict';

                var staticResourceFiles, cachedResources,
                        lazyLoadResource, shuffleArray, searchLocations;

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
                                datasources.forEach(function (datasource) {
                                    //invoke  constructor
                                    var externalDatasource = new ExternalDatasource(datasource);
                                    datasource.isGlobal = true;
                                    globalDatasources.push(datasource);
                                });
                                globalDatasources.$promise = $q.when(globalDatasources);
                                globalDatasources.$resolved = true;

                                return globalDatasources;
                            });
                        } else {
                            cachedResources[resourceName] = resource.query();
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
                    }
                };
            }]
        );
