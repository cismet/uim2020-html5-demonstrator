// main app module registration
var app = angular.module(
    'de.cismet.uim2020-html5-demonstrator',
    [
        'ngResource','ngAnimate', 'ngSanitize',
        'ui.router',
        'leaflet-directive',
        'mgo-angular-wizard',
        'de.cismet.uim2020-html5-demonstrator.controllers',
        'de.cismet.uim2020-html5-demonstrator.directives',
        'de.cismet.uim2020-html5-demonstrator.services',
        'de.cismet.uim2020-html5-demonstrator.filters',
        'de.cismet.uim2020-html5-demonstrator.factories'
    ]
);

app.config(
    [
        '$logProvider',
        '$stateProvider',
        '$urlRouterProvider',
        function ($logProvider, $stateProvider, $urlRouterProvider) {
            'use strict';

            $logProvider.debugEnabled(false);     

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

            $urlRouterProvider.otherwise('/recherche');

            $stateProvider.state('login', {
                url: '/login',
                templateUrl: 'views/loginView.html'
            });
            
            $stateProvider.state('recherche', {
                url: '/recherche',
                templateUrl: 'views/rechercheView.html'
            });
            
            $stateProvider.state('auswertung', {
                url: '/auswertung',
                templateUrl: 'views/auswertungView.html'
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