/*global angular*/

// main app module registration
var app = angular.module(
        'de.cismet.uim2020-html5-demonstrator',
        [
            'ngResource', 'ngAnimate', 'ngSanitize',
            'ui.router', 
            'ct.ui.router.extras.sticky', 
            'ct.ui.router.extras.dsr', 
            'leaflet-directive',
            'mgo-angular-wizard',
            'de.cismet.uim2020-html5-demonstrator.controllers',
            'de.cismet.uim2020-html5-demonstrator.directives',
            'de.cismet.uim2020-html5-demonstrator.services',
            'de.cismet.uim2020-html5-demonstrator.filters',
            'de.cismet.uim2020-html5-demonstrator.factories'
        ]
        );

/**
 * Configuration blocks get executed during the provider registrations and configuration phase. 
 * Only providers and constants can be injected into configuration blocks. 
 * This is to prevent accidental instantiation of services before they have been fully configured.
 */
app.config(
        [
            '$logProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function ($logProvider, $stateProvider, $urlRouterProvider) {
                'use strict';

                $logProvider.debugEnabled(true);


                /*var resolveResource;
                 resolveResource = function ($stateParams, $q, searchService, shareService) {
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
                 };*/

                $urlRouterProvider.otherwise('/recherche');



                /*$stateProvider.state('login', {
                 url: '/login',
                 templateUrl: 'views/loginView.html'
                 });*/

                $stateProvider.state("main", {
                    abstract: true,
                    url: '',
                    views: {
                        'main@': {
                            template: '<div>{{name}}</div><div>{{main.name}}</div><div ui-view="search" ng-show="$state.includes(\'main.search\')"/>\n\
                               \n\<div ui-view="analysis" ng-show="$state.includes(\'main.analysis\')"/>',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main instance created');
                                    $scope.name = 'main';
                                    this.name = 'this.main';
                                }],
                            controllerAs: 'main'
                        }
                    }
                });


                $stateProvider.state('main.search', {
                    url: '/recherche',
                    sticky: true,
                    views: {
                        'search@main': {
                            templateUrl: 'views/search/index.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.search instance created');
                                    $scope.name = 'main.search';
                                    this.name = 'this.main.search';
                                }],
                            controllerAs: 'search'
                        }
                    }

                });

                $stateProvider.state('main.analysis', {
                    url: '/auswertung',
                    sticky: true,
                    deepStateRedirect: true,
                    views: {
                        'analysis@main': {
                            templateUrl: 'views/analysis/index.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis instance created');
                                    $scope.name = 'main.analysis';
                                    this.name = 'this.main.analysis';
                                }],
                            controllerAs: 'main.analysis'
                            
                        },
                        'toolbar@main.analysis': {
                            templateUrl: 'views/analysis/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis.toolbar instance created');
                                    $scope.name = 'main.analysis.toolbar';
                                    this.name = 'this.main.analysis.toolbar';
                                }],
                            controllerAs: 'toolbar'
                        }
                    }
                });

                $stateProvider.state('main.analysis.map', {
                    url: '/karte',
                    views: {
                        'content@main.analysis': {
                            templateUrl: 'views/analysis/map.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis.map instance created');
                                    $scope.name = 'main.analysis.map';
                                    this.name = 'this.main.analysis.map';
                                }],
                            controllerAs: 'main.analysis.map'
                        }
                    }
                });

                $stateProvider.state('main.analysis.list', {
                    url: '/liste',
                    views: {
                        'content@main.analysis': {
                            templateUrl: 'views/analysis/list.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis.list instance created');
                                    $scope.name = 'main.analysis.list';
                                    this.name = 'this.main.analysis.list';
                                }],
                            controllerAs: 'main.analysis.list'
                        }
                    }
                });

                $stateProvider.state('protocol', {
                    url: '/protokollierung',
                    sticky: true,
                    templateUrl: 'views/protocol/index.html'
                });


                /*
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
                 });*/
            }
        ]
        );
/**
 * Run blocks get executed after the injector is created and are used to kickstart the application. 
 * Only instances and constants can be injected into run blocks. 
 * This is to prevent further system configuration during application run time.
 */
app.run(
        [
            '$rootScope',
            '$state',
            '$stateParams',
            '$stickyState',
            function ($rootScope, $state, $stateParams, $stickyState) {
                'use strict';
                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.$on("$stateChangeError", console.log.bind(console));
            }
        ]
        );