// main app module registration
angular.module(
    'eu.water-switch-on.sip',
    [
        'ui.router','ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.bootstrap.tpls', 'leaflet-directive',
        'mgo-angular-wizard',
        'eu.water-switch-on.sip.controllers',
        'eu.water-switch-on.sip.directives',
        'eu.water-switch-on.sip.services',
        'eu.water-switch-on.sip.filters',
        'eu.water-switch-on.sip.factories'
    ]
).config(
    [
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            'use strict';

            var resolveResource;

            resolveResource =  function ($stateParams, $q, searchService, shareService) {
                var deferred, obj, objs;

                deferred = $q.defer();

                objs = shareService.getResourceObjects();
                obj = null;
                if (objs && angular.isArray(objs)) {
                    objs.some(function (resource) {
                        if (resource.id === $stateParams.resId) {
                            obj = resource;
                        }
                        return obj !== null;
                    });
                }

                if (obj) {
                    deferred.resolve(obj);
                } else {
                    searchService.entityResource.get({
                        classname: 'resource',
                        objId: $stateParams.resId
                    }).$promise.then(
                        function (obj) {
                            deferred.resolve(obj);
                        },
                        function () {
                            deferred.reject('No resource with id found: ' + $stateParams.resId);
                        }
                    );
                }

                return deferred.promise;
            };

//            $urlRouterProvider.when();
            $urlRouterProvider.otherwise('/map');

            $stateProvider.state('list', {
                url: '/list',
                templateUrl: 'views/listView.html'
            });
            $stateProvider.state('th', {
                url: '/th',
                templateUrl: 'views/thumbnailView.html'
            });
            $stateProvider.state('map', {
                url: '/map',
                templateUrl: 'views/mapView.html'
            });
            $stateProvider.state('mapObject', {
                url: '/map/object/:resId',
                templateUrl: 'views/mapView.html',
                controller: 'eu.water-switch-on.sip.controllers.mapViewController',
                resolve: {
                    resource: [
                        '$stateParams',
                        '$q',
                        'eu.water-switch-on.sip.services.SearchService',
                        'eu.water-switch-on.sip.services.shareService',
                        resolveResource
                    ]
                }
            });
            $stateProvider.state('profile', {
                url: '/profile',
                templateUrl: 'views/profileView.html'
            });
            $stateProvider.state('login', {
                url: '/login',
                templateUrl: 'views/loginView.html'
            });

            $stateProvider.state('resourceDetail', {
                url: '/resource/:resId',
                templateUrl: 'views/object-detail-view.html',
                controller: 'eu.water-switch-on.sip.controllers.objectDetailController',
                resolve: {
                    resource: [
                        '$stateParams',
                        '$q',
                        'eu.water-switch-on.sip.services.SearchService',
                        'eu.water-switch-on.sip.services.shareService',
                        resolveResource
                    ]
                }
            });
        }
    ]
);
