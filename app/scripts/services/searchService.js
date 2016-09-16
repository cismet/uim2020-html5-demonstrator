/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory('searchService',
        ['$resource', '$q', '$interval', 'configurationService', 'authenticationService',
            function ($resource, $q, $interval, configurationService, authenticationService) {
                'use strict';

                var cidsRestApiConfig, defaultSearchFunction;
                cidsRestApiConfig = configurationService.cidsRestApi;

                /**
                 * Default Search Function exposed by the Service.
                 * 
                 * @param {type} geometry
                 * @param {type} themes
                 * @param {type} pollutants
                 * @param {type} limit
                 * @param {type} offset
                 * @param {type} progressCallback
                 * @returns {undefined}
                 */
                defaultSearchFunction = function (
                        geometry,
                        themes,
                        pollutants,
                        limit,
                        offset,
                        progressCallback) {
                    var deferred, noop, queryObject, defaultSearchResult, defaultRestApiSearch,
                            defaultRestApiSearchResult, timer, fakeProgress;

                    //console.log('searchService::defaultSearchFunction()');

                    // FIXME: get rid of this noop stuff -> makes code unreadable
                    noop = angular.noop;
                    // current value, max value, type, max = -1 indicates indeterminate
                    (progressCallback || noop)(0, -1, 'success');
                    fakeProgress = 1;
                    timer = $interval(function () {
                        (progressCallback || noop)(fakeProgress, -1, 'success');
                        fakeProgress++;
                    }, 100, 100);

                    deferred = $q.defer();

                    queryObject = {
                        'list': [
                            {'key': 'geometry', 'value': geometry},
                            {'key': 'themes', 'value': themes},
                            {'key': 'pollutants', 'value': pollutants}
                        ]
                    };

                    if (offset && limit && limit > 0 && offset > 0 && (offset % limit !== 0)) {
                        offset = 0;
                    }

                    // result of this search operation set a new promise 
                    defaultSearchResult = {
                        $promise: deferred.promise,
                        $resolved: false,
                        $offset: offset,
                        $limit: limit,
                        $length: 0
                    };

                    // remote legagy search core search
                    // FIXME: limit and offset not implemented in legacy search!
                    // currently, limit and offset are appended to the POST query parameter!
                    defaultRestApiSearch = $resource(cidsRestApiConfig.host +
                            '/searches/' + cidsRestApiConfig.domain + '.' + cidsRestApiConfig.defaultRestApiSearch + '/results',
                            {
                                limit: 100,
                                offset: 0,
                                omitNullValues: true,
                                deduplicate: true
                            }, {
                        search: {
                            method: 'POST',
                            params: {
                                limit: '@limit',
                                offset: '@offset'
                            },
                            isArray: false,
                            headers: {
                                'Authorization': authenticationService.getAuthorizationToken()
                            }
                        }
                    });

                    // result of the remote search operation (promise)
                    // starting the search!
                    // FIXME:   limit an offset GET parameters currently not evaluated 
                    //          by the leagcy service. There we have to add them also
                    //          to the queryObject.
                    defaultRestApiSearchResult = defaultRestApiSearch.search({
                        limit: limit,
                        offset: offset},
                            queryObject
                            );

                    defaultRestApiSearchResult.$promise.then(
                            function success(searchResult) {
                                //console.log('searchService::defaultSearchFunction()->success()');
                                var key, i, length, curentNode, dataObject, className;
                                // doing the same as ngResource: copying the results in the already returned obj (shallow)
                                for (key in searchResult) {
                                    if (searchResult.hasOwnProperty(key) &&
                                            !(key.charAt(0) === '$' && key.charAt(1) === '$')) {

                                        defaultSearchResult[key] = searchResult[key];
                                        if (key === '$collection' && angular.isArray(defaultSearchResult.$collection)) {
                                            length = defaultSearchResult.$collection.length;
                                            for (i = 0; i < length; i++) {
                                                curentNode = defaultSearchResult.$collection[i];
                                                if (curentNode.lightweightJson) {

                                                    try {
                                                        dataObject = angular.fromJson(curentNode.lightweightJson);
                                                        curentNode.$data = dataObject;
                                                        delete defaultSearchResult.$collection[i].lightweightJson;
                                                        
                                                        className = curentNode.classKey.split(".").slice(1, 2).pop();

                                                        curentNode.className = dataObject.className ?
                                                                dataObject.className : className;
                                                         
                                                        if(configurationService.featureRenderer.icons[className]) {
                                                            curentNode.$icon = configurationService.featureRenderer.icons[className].iconUrl; 
                                                        }
                                                    } catch (err) {
                                                        console.error(err.message);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                defaultSearchResult.$length = searchResult.$collection ? searchResult.$collection.length : 0;
                                if (!defaultSearchResult.$total || defaultSearchResult.$total === 0) {
                                    defaultSearchResult.$total = defaultSearchResult.length;
                                }

                                deferred.resolve(defaultSearchResult);

                                $interval.cancel(timer);

                                // set current AND max to node count -> signalise search completed
                                (progressCallback || noop)(defaultSearchResult.$length, defaultSearchResult.$length, 'success');
                            }, function error(searchError) {
                        console.log('searchService::defaultSearchFunction()->error()');
                        defaultSearchResult.$error = 'cannot search for resources';
                        defaultSearchResult.$response = searchError;
                        defaultSearchResult.$resolved = true;
                        deferred.reject(defaultSearchResult);
                        $interval.cancel(timer);
                        (progressCallback || noop)(1, 1, 'error');
                    });

                    return defaultSearchResult;
                };

                return {
                    defaultSearch: defaultSearchFunction
                };
            }]
        );
