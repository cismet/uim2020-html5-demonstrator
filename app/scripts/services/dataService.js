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
        ['$resource',
            function ($resource) {
                'use strict';

                var staticResourceFiles, cachedResources,
                        lazyLoadResource, getCountryListFunction;

                staticResourceFiles = {
                    'searchThemes': 'data/searchThemes.json',
                    'searchPollutants': 'data/searchPollutants.json',
                    'gazetteerLocations': 'data/gazetteerLocations.json',
                    'filterPollutants': 'data/filterPollutants.json',
                    'mockNodes': 'data/mockNodes.json',
                    'mockObjects': 'data/mockObjects.json'
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

                        cachedResources[resourceName] = resource.query();
                        return cachedResources[resourceName];
                    } else {
                        console.warn('unknown static resource:' + resourceName);
                        //return array ? [] : {};
                        return null;
                    }
                };
                
                lazyLoadResource('searchPollutants', true);

                return {
                    getSearchThemes: function () {
                        return lazyLoadResource('searchThemes', true);
                    },
                    getSearchPollutants: function () {
                        return lazyLoadResource('searchPollutants', true);
                    }
                };
            }]
        );
