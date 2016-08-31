/*global angular*/

// main app module registration
var app = angular.module(
        'de.cismet.uim2020-html5-demonstrator',
        [
            'ngResource', 'ngAnimate', 'ngSanitize',
            'ui.bootstrap', 'ui.bootstrap.tpls',
            'ui.router',
            'ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.previous',
            'leaflet-directive',
            'ngTable',
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

                $logProvider.debugEnabled(false);


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

                //$urlRouterProvider.when('/search', '/search/map');
                //$urlRouterProvider.when('/analysis', '/analysis/map');
                $urlRouterProvider.otherwise('/search/map');



                /*$stateProvider.state('login', {
                 url: '/login',
                 templateUrl: 'views/loginView.html'
                 });*/

                $stateProvider.state("main", {
                    abstract: true,
                    url: '',
                    views: {
                        'main@': {
                            templateUrl: 'views/main.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main instance created');
                                    $scope.name = 'main';
                                    this.name = 'this.main';
                                }],
                            controllerAs: 'mainVm'
                        }
                    }
                });

                $stateProvider.state('main.authentication', {
                    url: '/login',
                    data: {
                        roles: ['User']
                    },
                    views: {
                        'authentication@main': {
                            templateUrl: 'views/authentication/login.html',
                            controller: 'authenticationController',
                            controllerAs: 'authenticationController'
                        }
                    }
                });

                $stateProvider.state('main.search', {
                    url: '/search',
                    data: {
                        roles: ['User']
                    },
                    sticky: true,
                    deepStateRedirect: {
                        default: {
                            state: "main.search.map",
                            params: {zoom: "15"}
                        }
                    },
                    views: {
                        'search@main': {
                            templateUrl: 'views/search/index.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.search instance created');
                                    $scope.name = 'main.search';
                                    this.name = 'this.main.search';
                                }],
                            controllerAs: 'searchVm'
                        },
                        'search-toolbar@main.search': {
                            templateUrl: 'views/search/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.search.toolbar instance created');
                                    $scope.name = 'main.search.toolbar';
                                    this.name = 'this.main.search.toolbar';
                                }],
                            controllerAs: 'toolbarVm'
                        }
                    }

                });

                $stateProvider.state('main.search.map', {
                    url: '/map?{center:int}&{zoom:int}',
                    data: {
                        roles: ['User']
                    },
                    sticky: true,
                    views: {
                        'search-map@main.search': {
                            templateUrl: 'views/search/map.html',
                            controller: 'mapController',
                            controllerAs: 'mapVm'
                        }
                    }
                });

                $stateProvider.state('main.search.list', {
                    url: '/list',
                    data: {
                        roles: ['User']
                    },
                    sticky: true,
                    views: {
                        'search-list@main.search': {
                            templateUrl: 'views/search/list.html',
                            controller: 'listController',
                            controllerAs: 'listVm'
                        }
                    }
                });

                $stateProvider.state('main.analysis', {
                    url: '/analysis',
                    data: {
                        roles: ['User']
                    },
                    sticky: true,
                    deepStateRedirect: {
                        default: {
                            state: "main.analysis.map",
                            params: {zoom: "14"}
                        }
                    },
                    views: {
                        'analysis@main': {
                            templateUrl: 'views/analysis/index.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis instance created');
                                    $scope.name = 'main.analysis';
                                    this.name = 'this.main.analysis';
                                }],
                            controllerAs: 'analysisVm'

                        },
                        'analysis-toolbar@main.analysis': {
                            templateUrl: 'views/analysis/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis.toolbar instance created');
                                    $scope.name = 'main.analysis.toolbar';
                                    this.name = 'this.main.analysis.toolbar';
                                }],
                            controllerAs: 'toolbarVm'
                        }
                    }
                });

                $stateProvider.state('main.analysis.map', {
                    url: '/map?{center:int}&{zoom:int}',
                    data: {
                        roles: ['User']
                    },
                    views: {
                        'analysis-map@main.analysis': {
                            templateUrl: 'views/analysis/map.html',
                            controller: ['$scope', '$stateParams', '$state',
                                function ($scope, $stateParams, $state) {
                                    console.log('main.analysis.map instance created');
                                    $scope.name = 'main.analysis.map';
                                    var _this = this;
                                    this.name = 'this.main.analysis.map';
                                    this.center = $stateParams.center;
                                    this.zoom = $stateParams.zoom;


                                    $scope.$watch(function () {
                                        // Return the "result" of the watch expression.
                                        return(_this.zoom);
                                    }, function (newZoom, oldZoom) {
                                        //console.log('newZoom:' + newZoom + " = this.zoom:" + _this.zoom);
                                        if (_this.zoom && newZoom !== oldZoom) {
                                            $state.go('main.analysis.map', {'zoom': _this.zoom},
                                                    {'inherit': true, 'notify': false, 'reload': false}).then(
                                                    function (state)
                                                    {
                                                        console.log(state);
                                                    });
                                        } else {
                                            //console.log('oldZoom:' + oldZoom + " = this.zoom:" + _this.zoom);
//                                            $state.go('main.analysis.map', {'zoom': undefined},
//                                                    {'inherit': true, 'notify': false, 'reload': false}).then(function (state) {
//                                                console.log(state);
//                                            });
                                        }
                                    });
                                }],
                            controllerAs: 'mapVm'
                        }
                    },
                    onEnter: function () {
                        console.log("enter main.analysis.map");
                    },
                    onExit: function () {
                        console.log("exit main.analysis.map");
                    }
                });

                $stateProvider.state('main.analysis.list', {
                    url: '/list',
                    data: {
                        roles: ['User']
                    },
                    views: {
                        'analysis-list@main.analysis': {
                            templateUrl: 'views/analysis/list.html',
                            controller: ['$scope',
                                function ($scope) {
                                    console.log('main.analysis.list instance created');
                                    $scope.name = 'main.analysis.list';
                                    this.name = 'this.main.analysis.list';
                                }],
                            controllerAs: 'listVm'
                        }
                    }
                });

                $stateProvider.state('main.protocol', {
                    url: '/protocol',
                    data: {
                        roles: ['User']
                    },
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
            '$previousState',
            'authenticationService',
            'autorisationService',
            function ($rootScope, $state, $stateParams, $previousState, authenticationService, autorisationService) {
                'use strict';
                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                $rootScope.$on("$stateChangeError", console.log.bind(console));

                $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {

                            if (toState.name !== 'main.authentication') {
                                if ((!authenticationService.isIdentityResolved() 
                                        && !authenticationService.getIdentity()) 
                                        || !authenticationService.isAuthenticated()) {
                                    console.warn('user not logged in!');
                                    event.preventDefault();
                                    $previousState.memo('authentication');
                                    $state.go('main.authentication');
                                } /*else if ($rootScope.toState.data.roles
                                 && $rootScope.toState.data.roles.length > 0
                                 && !authenticationService.isInAnyRole($rootScope.toState.data.roles)) {
                                 
                                 console.warn('user is not in any role');
                                 event.preventDefault();
                                 $previousState.memo('autorisation');
                                 $state.go('main.accessdenied'); // user is signed in but not authorized for desired state
                                 }*/
                            } else {
                                $previousState.memo('authentication');
                            }
                        });
            }
        ]
        );