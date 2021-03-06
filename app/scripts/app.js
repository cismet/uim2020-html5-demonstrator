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
var app = angular.module(
        'de.cismet.uim2020-html5-demonstrator',
        [
            'de.cismet.uim2020-html5-demonstrator.controllers',
            'de.cismet.uim2020-html5-demonstrator.directives',
            'de.cismet.uim2020-html5-demonstrator.services',
            'de.cismet.uim2020-html5-demonstrator.types',
            'de.cismet.uim2020-html5-demonstrator.filters',
            'ngResource', 'ngAnimate', 'ngSanitize', 'ngCookies',
            'ui.bootstrap', 'ui.bootstrap.modal', 'ui.bootstrap.datepickerPopup', 
            'angular.filter','ui.router', 'ui.router.modal',
            'ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.previous',
            'ui-leaflet', 'nemLogging',
            'ngTable', 'angularjs-dropdown-multiselect',
            'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.modal',
            'mgo-angular-wizard', 'ngFileUpload'
        ]
        );

app.constant('DEVELOPMENT_MODE', true);

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
            'DEVELOPMENT_MODE',
            function ($logProvider, $stateProvider, $urlRouterProvider, DEVELOPMENT_MODE) {
                'use strict';

                //$logProvider.debugEnabled(DEVELOPMENT_MODE);
                $logProvider.debugEnabled(false);

                var resolveEntity;

                /**
                 * Resolve the entity to be shown in the entity modal (object info)
                 * @param {type} $stateParams
                 * @returns {app_L40.resolveEntity.appAnonym$2}
                 */
                /**
                 * 
                 * @param {type} $q
                 * @param {type} $stateParams
                 * @param {type} entityService
                 * @param {type} sharedDatamodel
                 * @returns {nm$_deferred.exports.promise|nm$_deferred.module.exports.promise|$q@call;defer.promise}
                 */
                resolveEntity = function ($q, $stateParams, configurationService, entityService, sharedDatamodel) {
                    if(DEVELOPMENT_MODE === true)console.log("resolve entity " + $stateParams.id + "@" + $stateParams.class);

                    var entityResource, deferred, className, objectId, dataObject;

                    deferred = $q.defer();
                    className = $stateParams.class;
                    objectId = $stateParams.id;

                    /*entityResource = {
                     class: $stateParams.class,
                     id: $stateParams.id
                     };*/

                    entityResource = entityService.entityResource.get({
                        className: className,
                        objectId: objectId
                    }).$promise.then(
                            function (resolvedEntity) {
                                sharedDatamodel.status.message = 'Object "' + resolvedEntity.name + "' aus dem UIM2020-DI Indexdatenbestand geladen.";
                                sharedDatamodel.status.type = 'success';

                                // ----------------------------------------------------------
                                // Extend the resolved object by local properties
                                // ----------------------------------------------------------

                                resolvedEntity.$className = className;

                                if (configurationService.featureRenderer.icons[className]) {
                                    resolvedEntity.$icon = configurationService.featureRenderer.icons[className].options.iconUrl;
                                }

                                // FIXME: extract class name from CS_CLASS description (server-side)
                                if (configurationService.featureRenderer.layergroupNames[className]) {
                                    resolvedEntity.$classTitle = configurationService.featureRenderer.layergroupNames[className];
                                } else {
                                    resolvedEntity.$classTitle = className;
                                }

                                if (resolvedEntity.src_content) {
                                    try {
                                        dataObject = angular.fromJson(resolvedEntity.src_content);
                                        resolvedEntity.$data = dataObject;
                                        delete resolvedEntity.src_content;
                                    } catch (err) {
                                        var message = 'Das Objekt "' + objectId + '@' + className +
                                                '" konnte nicht geladen werden: ' + err.message;
                                        sharedDatamodel.status.message = message;
                                        sharedDatamodel.status.type = 'warning';
                                        sharedDatamodel.resolvedEntity = null;
                                        deferred.reject(message);
                                    }
                                }

                                // ----------------------------------------------------------

                                sharedDatamodel.resolvedEntity = resolvedEntity;
                                deferred.resolve(resolvedEntity);
                            },
                            function () {
                                var message = 'Das Objekt "' + objectId + '@' + className +
                                        '" konnte nicht im UIM2020-DI Indexdatenbestand gefunden werden!';
                                //console.warn(message);
                                sharedDatamodel.status.message = message;
                                sharedDatamodel.status.type = 'warning';
                                sharedDatamodel.resolvedEntity = null;
                                deferred.reject(message);
                            }
                    );

                    return deferred.promise;
                };

                // <editor-fold defaultstate="collapsed" desc=" showEntityModal() " >
                /**
                 * Opens a modal window and remebers the previous state.
                 * Note: Function not needed anymore since we use angular-ui-router-uib-modal:
                 * model: true
                 * 
                 * @param {type} $previousState
                 * @param {type} $uibModal
                 * @param {type} entityModalInvoker
                 * @param {type} entity
                 * @returns {undefined}
                 */
//                showEntityModal = function ($previousState, $uibModal, entityModalInvoker, entity) {
//                    console.log('showEntityModal');
//                    $previousState.memo("entityModalInvoker"); // remember the previous state with memoName "modalInvoker"
//
//                    $uibModal.open({
//                        templateUrl: 'views/entity/modal.html',
//                        backdrop: 'static',
//                        controller: 'entityController',
//                        resolve: {
//                            entityModalInvoker: entityModalInvoker,
//                            entity: entity
//                        },
//                        /*controller:
//                                ['$scope', '$uibModalInstance',
//                                    function ($scope, $uibModalInstance) {
//                                        console.log("$uibModal controller created");
//                                        var isopen = true;
//                                        $uibModalInstance.result.finally(function () {
//                                            isopen = false;
//                                            $previousState.go("entityModalInvoker"); // return to previous state
//                                        });
//                                        $scope.close = function () {
//                                            $uibModalInstance.dismiss('close');
//                                        };
//                                        $scope.$on("$stateChangeStart", function (evt, toState) {
//                                            if (!toState.$$state().includes['modal.entity']) {
//                                                console.log('app::$stateChangeStart::showEntityModal: ' + toState.$$state().name);
//                                                $uibModalInstance.dismiss('close');
//                                            } else {
//                                                console.log('app::$stateChangeStart::showEntityModal: ignore ' + toState.$$state().name);
//                                            }
//                                        });
//                                    }],*/
//                        controllerAs: 'entityController'
//                    });
//                };
                //</editor-fold>

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

                // The resolve property is an optional map of dependencies which should be 
                // injected into the controller. If any of these dependencies are promises, 
                // they will be resolved and converted to a value before the controller is instantiated 
                // and the $routeChangeSuccess event is fired.
                $stateProvider.state("main", {
                    abstract: true,
                    sticky: true,
                    url: '',
                    views: {
                        'main': {
                            templateUrl: 'views/main.html',
                            controller: 'mainController',
                            controllerAs: 'mainController'
                        }
                    },
                    deepStateRedirect: {
                        default: {
                            state: "main.search"
                        }
                    }
                    // disabled since resolve is called after stateChangeStart event! :-(
                    /*resolve: {
                     identity: [
                     'authenticationService',
                     function resolveIdentity(authenticationService) {
                     // call get getIdentity() before main state is instantiated
                     console.log('main::resolveIdentity isAuthenticated: ' + authenticationService.isAuthenticated());
                     return authenticationService.resolveIdentity();
                     }
                     ]
                     }*/
                });

                $stateProvider.state('main.authentication', {
                    url: '/login',
                    data: {
                        roles: ['UDM2020']
                    },
                    views: {
                        'authentication@main': {
                            templateUrl: 'views/authentication/login.html',
                            controller: 'authenticationController',
                            controllerAs: 'authenticationController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.authentication");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.authentication");
                    }
                });

                $stateProvider.state('main.search', {
                    url: '/search',
                    data: {
                        roles: ['UDM2020']
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
                            controller: 'searchController',
                            controllerAs: 'searchController'
                        },
                        'search-toolbar@main.search': {
                            templateUrl: 'views/search/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    if(DEVELOPMENT_MODE === true)console.log('main.search.toolbar instance created');
                                    $scope.name = 'main.search.toolbar';
                                    this.name = 'this.main.search.toolbar';
                                }],
                            controllerAs: 'toolbarController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.search");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.search");
                    }
                });

                $stateProvider.state('main.search.map', {
                    url: '/map?{center:int}&{zoom:int}',
                    data: {
                        roles: ['UDM2020']
                    },
                    sticky: true,
                    views: {
                        'search-map@main.search': {
                            templateUrl: 'views/shared/map.html',
                            controller: 'mapController',
                            controllerAs: 'mapController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.search.map");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.search.map");
                    }
                });

                $stateProvider.state('main.search.list', {
                    url: '/list',
                    data: {
                        roles: ['UDM2020']
                    },
                    sticky: true,
                    views: {
                        'search-list@main.search': {
                            templateUrl: 'views/search/list.html',
                            controller: 'listController',
                            controllerAs: 'listController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.search.list");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.search.list");
                    }
                });

                $stateProvider.state('main.analysis', {
                    url: '/analysis',
                    data: {
                        roles: ['UDM2020']
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
                            controller: 'analysisController',
                            controllerAs: 'analysisController'

                        },
                        'analysis-toolbar@main.analysis': {
                            templateUrl: 'views/analysis/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    if(DEVELOPMENT_MODE === true)console.log('main.analysis.toolbar instance created');
                                    $scope.name = 'main.analysis.toolbar';
                                    this.name = 'this.main.analysis.toolbar';
                                }],
                            controllerAs: 'toolbarController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.analysis");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.analysis");
                    }
                });

                $stateProvider.state('main.analysis.map', {
                    url: '/map?{center:int}&{zoom:int}',
                    data: {
                        roles: ['UDM2020']
                    },
                    views: {
                        'analysis-map@main.analysis': {
                            templateUrl: 'views/shared/map.html',
                            controller: 'mapController',
                            controllerAs: 'mapController'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.analysis.map");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.analysis.map");
                    }
                });

                $stateProvider.state('main.protocol', {
                    url: '/protocol',
                    data: {
                        roles: ['UDM2020']
                    },
                    sticky: true,
                    deepStateRedirect: true,
                    templateUrl: 'views/protocol/index.html',
                    controller: ['$scope',
                        function ($scope) {
                            console.log('main.protocol created');
                            $scope.name = 'main.protocol';
                            this.name = 'this.main.protocol';
                        }],
                    controllerAs: 'protocolController',
                    views: {
                        'protocol@main': {
                            templateUrl: 'views/protocol/index.html'
                        }
                    },
                    onEnter: function () {
                       if(DEVELOPMENT_MODE === true)console.log("enter main.protocol");
                    },
                    onExit: function () {
                       if(DEVELOPMENT_MODE === true)console.log("exit main.protocol");
                    }
                });

                $stateProvider.state("modal", {
                    abstract: true
                });

                $stateProvider.state('modal.entity', {
                    url: '/entity/{class:string}/{id:int}',
                    data: {
                        roles: ['UDM2020']
                    },
                    sticky: false,
                    backdrop: 'static',
                    /*controller: ['$scope',
                     function ($scope) {
                     console.log('modal.entity created');
                     $scope.name = 'modal.entity';
                     this.name = 'this.modal.entity';
                     }],*/
                    templateUrl: 'views/entity/modal.html',
                    controller: 'entityController',
                    controllerAs: 'entityController',
                    size: 'lg', // unbelievable gefrickel: pass options to $uibModel.open() function  ..... 
                    //onEnter: showEntityModal,
                    modal: true,
                    resolve: {
                        entity: [
                            '$q', '$stateParams', 'configurationService', 'entityService', 'sharedDatamodel',
                            resolveEntity
                        ],
                        entityModalInvoker: function ($previousState) {
                            if ($previousState.get() && $previousState.get().state) {
                                var previousState = $previousState.get().state;

                                // don't memo the modal state!
                                if (previousState.name.indexOf('modal') !== 0) {
                                    if(DEVELOPMENT_MODE === true)console.log('entityModalInvoker: saving previous state ' + previousState.name);
                                    $previousState.memo('entityModalInvoker');
                                    return $previousState.get('entityModalInvoker');
                                }
                                if(DEVELOPMENT_MODE === true)console.log('entityModalInvoker: ignoring previous state ' + previousState.name);
                            }
                        }
                    }
                });

                $stateProvider.state('modal.export', {
                    url: '/analysis/export',
                    data: {
                        roles: ['UDM2020']
                    },
                    sticky: false,
                    templateUrl: 'views/export/modal.html',
                    controller: 'exportController',
                    controllerAs: 'exportController',
                    backdrop: 'static', // this is js-madness: put modal properties into state options!
                    size: 'lg',
                    modal: true/*,
                     resolve: {
                     exportModalInvoker: function ($previousState) {
                     if ($previousState.get() && $previousState.get().state) {
                     var previousState = $previousState.get().state;
                     if (previousState.name.indexOf('modal') !== 0) {
                     $previousState.memo('exportModalInvoker');
                     return $previousState.get('exportModalInvoker');
                     }
                     }
                     }
                     }*/
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
        ['$rootScope',
            '$anchorScroll',
            '$state',
            '$stateParams',
            '$previousState',
            'configurationService',
            'authenticationService',
            'DEVELOPMENT_MODE',
            function ($rootScope, $anchorScroll, $state, $stateParams, $previousState,
                    configurationService, authenticationService, DEVELOPMENT_MODE) {
                'use strict';
                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                //$rootScope.$previousState = $previousState;
                //$rootScope.$on("$stateChangeError", console.log.bind(console));

                $anchorScroll.yOffset = 50; // always scroll by 50 extra pixels

                // synchonous call. Gets identity from cookie
                authenticationService.resolveIdentity(false).then(function () {
                    console.log('app.run:: user autenticated from session cookie:' +
                            authenticationService.isAuthenticated());
                });

                // FIXME: asynchronous call
                // Gets identity from cookie and checks if valid ($http)
                // result is available after ui-ruoter state change! :(
                //authenticationService.resolveIdentity(true);

                $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            if(DEVELOPMENT_MODE === true)console.log('$stateChangeStart: ' + toState.name);
                            if (toState.name !== 'main.authentication') {
//                                if ((!authenticationService.isIdentityResolved() &&
//                                        !authenticationService.getIdentity()) ||
//                                        !authenticationService.isAuthenticated()) {


                                if (!authenticationService.isAuthenticated()) {
                                    console.warn('user not logged in, toState:' + toState.name + ', fromState:' + fromState.name);
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
                                else if (fromState.name === '' && toState.name.split(".").slice(0, 1).pop() === 'modal') {
                                    // cancel initial transition
                                    event.preventDefault();
                                    // Go to the default background state. (Don't update the URL)
                                    $state.go("main.search.map", undefined, {location: false}).then(function () {
                                        // OK, background is loaded, now go to the original modalstate
                                        $state.go(toState, toParams);
                                    });
                                }
                            } else {
                                $previousState.memo('authentication');
                            }
                        });
            }
        ]
        );