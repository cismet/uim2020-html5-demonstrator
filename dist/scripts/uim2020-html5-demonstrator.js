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
            'de.cismet.uim2020-html5-demonstrator.filters',
            'ngResource', 'ngAnimate', 'ngSanitize', 'ngCookies',
            'ui.bootstrap', 'ui.bootstrap.modal',
            'ui.router', 'ui.router.modal',
            'ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.previous',
            'leaflet-directive',
            'ngTable', 'angularjs-dropdown-multiselect',
            'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover', 'mgcrea.ngStrap.modal',
            'mgo-angular-wizard', 'ngFileUpload'
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

                var resolveEntity;
                resolveEntity = function ($stateParams) {
                    console.log("resolve entity " + $stateParams.id + "@" + $stateParams.class);
                    return {
                        class: $stateParams.class,
                        id: $stateParams.id
                    };
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
                    },
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
                            controller: 'searchController',
                            controllerAs: 'searchController'
                        },
                        'search-toolbar@main.search': {
                            templateUrl: 'views/search/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    //console.log('main.search.toolbar instance created');
                                    $scope.name = 'main.search.toolbar';
                                    this.name = 'this.main.search.toolbar';
                                }],
                            controllerAs: 'toolbarController'
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
                            templateUrl: 'views/shared/map.html',
                            controller: 'mapController',
                            controllerAs: 'mapController'
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
                            controllerAs: 'listController'
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
                            controller: 'analysisController',
                            controllerAs: 'analysisController'

                        },
                        'analysis-toolbar@main.analysis': {
                            templateUrl: 'views/analysis/toolbar.html',
                            controller: ['$scope',
                                function ($scope) {
                                    //console.log('main.analysis.toolbar instance created');
                                    $scope.name = 'main.analysis.toolbar';
                                    this.name = 'this.main.analysis.toolbar';
                                }],
                            controllerAs: 'toolbarController'
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
                            templateUrl: 'views/shared/map.html',
                            controller: 'mapController',
                            controllerAs: 'mapController'
                        }
                    },
                    onEnter: function () {
                        //console.log("enter main.analysis.map");
                    },
                    onExit: function () {
                        //console.log("exit main.analysis.map");
                    }
                });

                $stateProvider.state('main.protocol', {
                    url: '/protocol',
                    data: {
                        roles: ['User']
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
                    }
                });

                $stateProvider.state("modal", {
                    abstract: true
                });

                $stateProvider.state('modal.entity', {
                    url: '/entity/{class:string}/{id:int}',
                    data: {
                        roles: ['User']
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
                    //onEnter: showEntityModal,
                    modal: true,
                    resolve: {
                        entity: [
                            '$stateParams',
                            resolveEntity
                        ],
                        entityModalInvoker: function ($previousState) {
                            $previousState.memo('entityModalInvoker');
                            return $previousState.get('entityModalInvoker');
                        }
                    }
                });

                $stateProvider.state('modal.export', {
                    url: '/export',
                    data: {
                        roles: ['User']
                    },
                    sticky: false,
                    templateUrl: 'views/export/modal.html',
                    controller: 'exportController',
                    controllerAs: 'exportController',
                    modal: true
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
            '$state',
            '$stateParams',
            '$previousState',
            'configurationService',
            'authenticationService',
            function ($rootScope, $state, $stateParams, $previousState,
                    configurationService, authenticationService) {
                'use strict';
                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                //$rootScope.$previousState = $previousState;

                //$rootScope.$on("$stateChangeError", console.log.bind(console));

                // synchonous call. Gets identity from cookie
                authenticationService.resolveIdentity(false).then(function () {
                    console.log('app.run:: user autenticated from session cookie:' +
                            authenticationService.isAuthenticated());
                });

                // FIXME: asynchronous call
                // Gets identity from cookie and cheks if valid ($http)
                // result is available after ui-ruoter state change! :(
                //authenticationService.resolveIdentity(true);

                $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            //console.log('$stateChangeStart: ' + toState.name);
                            if (toState.name !== 'main.authentication') {
//                                if ((!authenticationService.isIdentityResolved() &&
//                                        !authenticationService.getIdentity()) ||
//                                        !authenticationService.isAuthenticated()) {


                                if (!configurationService.developmentMode && !authenticationService.isAuthenticated()) {
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
angular.module(
    'de.cismet.uim2020-html5-demonstrator.controllers',
    [
         
    ]
);
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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'analysisController',
        [
            '$timeout', '$scope', '$state', 'dataService', 'sharedDatamodel', 'sharedControllers',
            'leafletData',
            function ($timeout, $scope, $state, dataService, sharedDatamodel,
                    sharedControllers, leafletData) {
                'use strict';

                var analysisController;
                analysisController = this;

                console.log('analysisController instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'analysis';
                analysisController.mode = 'map';

                analysisController.clearAnalysisNodes = function () {
                    sharedDatamodel.analysisNodes.length = 0;
                    sharedControllers.analysisMapController.clearNodes();
                };

                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.analysis") && !$state.is("main.analysis")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        analysisController.mode = $state.current.name.split(".").slice(1, 3).pop();
                        //console.log('analysisController::mode: ' + analysisController.mode);

                        // resize the map on stzate change
                        if (analysisController.mode === 'map') {
                            leafletData.getMap('analysis-map').then(function (map) {
                                $timeout(function () {
                                    if (map && map._container.parentElement) {
                                        if (map._container.parentElement.offsetHeight > 0 &&
                                                map._container.parentElement.offsetWidth > 0) {
                                            $scope.mapHeight = map._container.parentElement.offsetHeight;
                                            $scope.mapWidth = map._container.parentElement.offsetWidth;
                                            //console.log('analysisController::stateChangeSuccess new size: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
                                            map.invalidateSize(false);

                                        } else {
                                            //console.warn('analysisController::stateChangeSuccess saved size: ' + $scope.mapWidth + "x" + $scope.mapHeight);
                                            map.invalidateSize(false);
                                        }
                                    }
                                }, 100);
                            });
                        }
                    }
                });
            }
        ]
        );

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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'appController',
        [
            '$state',
            '$previousState',
            'configurationService',
            'sharedDatamodel',
            'authenticationService',
            function (
                    $state,
                    $previousState,
                    configurationService,
                    sharedDatamodel,
                    authenticationService
                    ) {
                'use strict';
                var appController;
                appController = this;

                appController.status = sharedDatamodel.status;
                appController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                appController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
                appController.resultNodes = sharedDatamodel.resultNodes;

                // FIXME: use authenticationController!
                appController.signOut = function () {
                    authenticationService.clearIdentity();
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };
            }
        ]
        );

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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'authenticationController',
        [
            '$scope',
            '$state',
            '$previousState',
            'configurationService',
            'authenticationService',
            function ($scope, $state, $previousState, configurationService, authenticationService) {
                'use strict';

                var authenticationController;
                authenticationController = this;

                $scope.errorStatusCode = -1;
                $scope.errorStatusMessage = null;

                authenticationController.signIn = function (username, password) {

                    $scope.errorStatusCode = -1;
                    $scope.errorStatusMessage = null;

                    var authenticatePromise = authenticationService.authenticate(
                            username,
                            configurationService.authentication.domain,
                            password);

                    authenticatePromise.then(
                            function authenticationSuccess(identity) {
                                console.log('authenticationController::authenticationSuccess: user "' +
                                        identity.user + '" successfully authenticated');

                                if ($previousState.get("authentication") &&
                                        $previousState.get("authentication").state &&
                                        $previousState.get("authentication").state.name !== 'main.authentication') {
                                    $previousState.go('authentication');
                                } else {
                                    $state.go('main.search.map');
                                }
                            }, function authenticationError(httpResponse) {

                        $scope.errorStatusCode = httpResponse.status;
                        $scope.errorStatusMessage = httpResponse.statusText;
                        $scope.password = null;

                        if ($scope.errorStatusCode === -1) {
                            $scope.errorStatusCode = 503;
                        }

                        if (!$scope.errorStatusMessage || $scope.errorStatusMessage === null) {
                            $scope.errorStatusMessage = 'Verbindung zum Anmeldserver nicht möglich';
                        }

                        console.error('authenticationController::authenticationError: user "' +
                                username + '" could not be authenticated: ' + $scope.errorStatusMessage);
                    });
                };

                authenticationController.signOut = function () {
                    $scope.errorStatusCode = -1;
                    $scope.errorStatusMessage = null;
                    $scope.username = null;
                    $scope.password = null;

                    authenticationService.clearIdentity();
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };

                console.log('authenticationController instance created');
            }
        ]
        );

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'entityController', [
            '$scope', '$state', '$stateParams', '$previousState', '$uibModalInstance',
            'entity', 'entityModalInvoker',
            function ($scope, $state, $stateParams, $previousState, $uibModalInstance,
                    entity, entityModalInvoker) {
                'use strict';
                //var isopen = true;
                $scope.class = $stateParams.class;
                $scope.id = $stateParams.id;
                $scope.entity = entity;

                console.log('entityController created');
//                console.log($scope.class + "/" + $scope.id);
//                console.log($scope.entity);
//                console.log('$previousState(entityModalInvoker):' + entityModalInvoker.state);



                $uibModalInstance.result.finally(function () {
                    //$previousState.go("entityModalInvoker"); // return to previous state
                    console.log($previousState.get("entityModalInvoker").state);
                    if ($previousState.get("entityModalInvoker") &&
                            $previousState.get("entityModalInvoker").state) {
                        console.log('entityController::close goto $previousState ' + $previousState.get("entityModalInvoker").state.name);
                        $previousState.go("entityModalInvoker");
                    } else {
                        console.log('entityController::close goto default main.search.map');
                        $state.go('main.search.map');
                    }
                });
                

//                $uibModalInstance.result.finally(function () {
//                    isopen = false;
//                    //console.log($previousState.get("entityModalInvoker").state);
//                    if ($previousState.get("entityModalInvoker") &&
//                            $previousState.get("entityModalInvoker").state) {
//                        console.log('entityController::close goto $previousState ' + $previousState.get("entityModalInvoker").state.name);
//                        $previousState.go("entityModalInvoker");
//                    } else {
//                        console.log('entityController::close goto default main.search.map');
//                        $state.go('main.search.map');
//                    }




                // return to previous state
                //    });
                $scope.close = function () {
                    console.log('entityController::close');
                    $uibModalInstance.dismiss('close');
                };

                $scope.$on("$stateChangeStart", function (evt, toState) {
                    if (!toState.$$state().includes['modal.entity']) {
                        console.log('entityController::$stateChangeStart: $uibModalInstance.close');
                       // $uibModalInstance.dismiss('close');
                    } else {
                        console.log('entityController::$stateChangeStart: ignore ' + toState);
                    }
                });
            }
        ]
        );


/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'exportController', [
            '$scope', '$state', '$stateParams', '$previousState', '$uibModalInstance',
            'entity', 'entityModalInvoker',
            function ($scope, $state, $stateParams, $previousState, $uibModalInstance,
                    entity, entityModalInvoker) {
                'use strict';
                
                var exportController;
                exportController = this;
                
                /**
                 * Wizard status, etc.
                 */
                $scope.wizard = {};
                $scope.wizard.uploadchoice = false;
                $scope.wizard.enterValidators = [];
                $scope.wizard.exitValidators = [];
                $scope.wizard.currentStep = '';
                $scope.wizard.canProceed = true;
                $scope.wizard.canGoBack = false;
                $scope.wizard.hasError = false;
                $scope.wizard.proceedButtonText = 'Weiter';
                $scope.wizard.isFinishStep = function () {
                    return $scope.wizard.currentStep === 'Summary';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Dataset Description';
                };

                $scope.$watch('wizard.currentStep', function (n) {
                    if (n) {
                        if ($scope.wizard.isFinishStep()) {
                            $scope.wizard.proceedButtonText = 'Fertig';
                        } else {
                            $scope.wizard.proceedButtonText = 'Weiter';
                        }

                        $scope.wizard.canGoBack = !$scope.wizard.isFirstStep();

                    } else {
                        $scope.wizard.proceedButtonText = 'Weiter';
                    }
                });
                
                exportController.finishedWizard = function () {
                    $uibModalInstance.dismiss('close');
                };

                $uibModalInstance.result.finally(function () {
                    $state.go('main.analysis.map');
                });

                $scope.close = function () {
                    $uibModalInstance.dismiss('close');
                };

                $scope.$on("$stateChangeStart", function (evt, toState) {
                    if (!toState.$$state().includes['modal.export']) {
                        console.log('exportController::$stateChangeStart: $uibModalInstance.close');
                        $uibModalInstance.dismiss('close');
                    } else {
                        console.log('exportController::$stateChangeStart: ignore ' + toState);
                    }
                });
            }
        ]
        );


/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.odRegistrationController',
        [
            '$scope',
            '$modal',
            '$location',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.searchService',
            // Controller Constructor Function
            function (
                    $scope,
                    $modal,
                    $location,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    searchService
                    ) {
                'use strict';

                var _this, duplicateLink;
                duplicateLink = undefined;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                _this.groupBy = function (item) {

                    if (item.name.indexOf(',') > -1) {
                        return item.name.split(',', 1)[0];
                    } else {
                        return item.name.split(' ', 1)[0];
                    }

                };

                _this.checkLink = function (url) {
                    //console.log(url);
                    if (url) {
                        var searchResultPromise, searchSuccess, searchError;
                        searchSuccess = function (searchResult) {
                            if (searchResult && searchResult.$collection && searchResult.$collection.length > 0) {
                                duplicateLink = 'This dataset is already registered in the SWITCH-ON Spatial Information Platform under the name </strong>"' +
                                        searchResult.$collection[0].name + '"</strong>. Click <a href="'+AppConfig.byod.baseUrl+'/#/resource/' +
                                        searchResult.$collection[0].id + '" title="' +
                                        searchResult.$collection[0].name + '" target="_blank">here</a> to view the dataset meta-data.';

                                $scope.message.text = duplicateLink;
                                $scope.message.icon = 'fa-warning';
                                $scope.message.type = 'info';
                                $scope.wizard.hasError = 'datasetContentlocation';
                            } else {
                                // reset the warning!
                                if($scope.wizard.hasError === 'datasetContentlocation') {
                                    $scope.wizard.hasError = null;
                                }
                                
                                //console.log('resource ' + url + ' not in Meta-Data Repository');
                                duplicateLink = undefined;
                            }
                        };

                        searchError = function (data) {
                            console.error('search error: ' + data);
                            duplicateLink = undefined;
                        };

                        searchResultPromise = searchService.search(url).$promise.then(searchSuccess, searchError);
                    }

                    duplicateLink = undefined;
                };
                
                _this.selectKeywords = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: 'templates/keywordSelection.html',
                        controller: 'de.cismet.sip-html5-resource-registration.controllers.keywordsController',
                        controllerAs: 'keywordsController',
                        keyboard: 'true',
                        size: 'lg',
                        scope: $scope
                    });
                };
                
                _this.gotoUploadTool = function () {
                    var uploadToolUrl = _this.config.uploadtool.baseUrl + 
                            '?datasetname=' + _this.dataset.name;
                    //console.log(uploadToolUrl);
                    $location.url(uploadToolUrl); 
                };
                
                _this.checkUploadName = function () {
                     if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset before uploading ';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoiceName';
                        return false;
                    }
                    
                    return true;
                };

                // load list
                $scope.tags['function'] = tagGroupService.getTagList('function');
                $scope.tags['content type'] = tagGroupService.getTagList('content type');
                $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

                // set default values
//                _this.dataset.representation[0].function = tagGroupService.getTag('function', 'download',
//                        function (tag) {
//                            _this.dataset.representation[0].function = tag;
//                        });
//                
//                _this.dataset.representation[0].contenttype = tagGroupService.getTag('content type', 'application/octet-stream',
//                        function (tag) {
//                            _this.dataset.representation[0].contenttype = tag;
//                        });

                $scope.wizard.enterValidators['Dataset Description'] = function (context) {
                    if (context.valid === true) {
                        $scope.message.text = 'Please provide some general information about the new dataset such as name, description, a (download) link and keywords.';
                        $scope.message.icon = 'fa-info-circle';
                        $scope.message.type = 'success';
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Dataset Description'] = function (context) {
                    context.valid = true;

                    // CONTENT TYPE
                    var isInvalidContenttype = $scope.tags['content type'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].contenttype &&
                                (element.name === _this.dataset.representation[0].contenttype.name)) {
                            _this.dataset.representation[0].contenttype = element;
                            return false;
                        }

                        return true;
                    });

                    // FUNCTION
                    var isInvalidFunction = $scope.tags['function'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].function &&
                                (element.name === _this.dataset.representation[0].function.name)) {
                            _this.dataset.representation[0].function = element;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    // NAME
                    if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetName';
                        context.valid = false;
                    } else if (dataset.$uploaded === undefined) {
                        $scope.message.text = 'Please chose wheter you want to upload a new dataset or to provide a link to anexisting dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoice';
                        context.valid = false;
                    } else if (isInvalidFunction) {
                        $scope.message.text = 'Please select a valid function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].function) {
                        $scope.message.text = 'Please select a function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    }  else if ($scope.odRegistrationForm.datasetContentlocation.$error.url) {
                        // CONTENT LOCATION       
                        $scope.message.text = 'The link to the dataset you have provided is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a> .';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contentlocation) {
                        $scope.message.text = 'Please provide link to the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (duplicateLink) {
                        $scope.message.text = duplicateLink;
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (isInvalidContenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.description) {
                        // DESCRIPTION
                        $scope.message.text = 'Please provide a description of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetDescription';
                        context.valid = false;
                    } else if (!_this.dataset.tags || _this.dataset.tags.length === 0) {
                        $scope.message.text = 'Please assign at least one keyword to the Dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetTags';
                        context.valid = false;
                    }

                    if (context.valid === true) {
                        $scope.wizard.hasError = null;
                    }
                    // no error? -> reset

                    return context.valid;
                };
            }
        ]
        );
/*global angular, shp, L*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'externalDatasourcesController', [
            '$scope', '$uibModal', 'dataService', 'sharedDatamodel', 'sharedControllers',
            function ($scope, $uibModal, dataService, sharedDatamodel, sharedControllers) {
                'use strict';

                var externalDatasourcesController, mapController;

                externalDatasourcesController = this;
                mapController = sharedControllers.analysisMapController;

                // init global datasources list
                if (!sharedDatamodel.globalDatasources ||
                        sharedDatamodel.globalDatasources.length === 0) {
                    if (dataService.getGlobalDatasources().$resolved) {
                        externalDatasourcesController.globalDatasources =
                                dataService.getGlobalDatasources();
                    } else {
                        dataService.getGlobalDatasources().$promise.then(
                                function (externalDatasources) {
                                    externalDatasourcesController.globalDatasources = externalDatasources;
                                    externalDatasourcesController.globalDatasources.$resolved = true;
                                });
                    }
                }

                // init local datasources list
                externalDatasourcesController.localDatasources =
                        sharedDatamodel.localDatasources;

                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                /**
                 * Toggle selection of global datasource -> add to analysis map
                 * 
                 * @param {type} globalDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.toggleGlobalDatasourceSelection =
                        function (globalDatasource) {

                            if (!globalDatasource.$layer) {

                                // TODO: contruct and add Layers!
                                globalDatasource.$layer = {
                                    $selected: true
                                };
                            }

                            if (globalDatasource.$layer.$selected === true) {
                                globalDatasource.$layer.$selected = false;

                                // TODO: remove Layers
                                //mapController.removeOverlay(globalDatasource.$layer);
                            } else {
                                globalDatasource.$layer.$selected = true;

                                // TODO: add Layers
                                //mapController.addOverlay(globalDatasource.$layer);
                            }
                        };

                /**
                 * Add a new local datasource -> open external-datasources.html modal
                 *  
                 * @returns {undefined}
                 */
                externalDatasourcesController.addLocalDatasource =
                        function () {
                            var modalInstance = $uibModal.open({
                                animation: false,
                                templateUrl: 'templates/external-datasource-modal.html',
                                controller: 'importController',
                                controllerAs: 'importController',
                                //size: size,
                                //appendTo:elem,
                                resolve: {
                                    localDatasource: function () {
                                        return {};
                                    }
                                }
                            });

                            // hide the popover
                            $scope.$hide();

                            /*modalInstance.result.then(function (selectedItem) {
                             externalDatasourcesController.selected = selectedItem;
                             console.log(externalDatasourcesController.selected);
                             }, function () {
                             $log.info('Modal dismissed at: ' + new Date());
                             });*/
                        };

                /**
                 * Remove local datasource for list and from map
                 * 
                 * @param {type} localDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.removeLocalDatasource =
                        function (localDatasource) {
                            var idx = externalDatasourcesController.localDatasources.indexOf(localDatasource);
                            if (idx > -1) {
                                // calls also remove on map
                                if(localDatasource.$layer.$selected === true) {
                                    externalDatasourcesController.toggleLocalDatasourceSelection(localDatasource);
                                }
                                
                                externalDatasourcesController.localDatasources.splice(idx, 1);
                            } else {
                                console.warn("externalDatasourcesController::removeLocalDatasource: unkwon datasource?!");
                            }
                        };

                /**
                 * Toggle selection of local datasource -> add to analysis map
                 * 
                 * @param {type} localDatasource
                 * @returns {undefined}
                 */
                externalDatasourcesController.toggleLocalDatasourceSelection =
                        function (localDatasource) {

                            if (localDatasource.$layer.$selected === true) {
                                localDatasource.$layer.$selected = false;
                                mapController.removeOverlay(localDatasource.$layer);
                            } else {
                                localDatasource.$layer.$selected = true;
                                mapController.addOverlay(localDatasource.$layer);
                            }

                            /*var idx = externalDatasourcesController.selectedLocalDatasources.indexOf(localDatasource);
                             if (idx > -1) {
                             externalDatasourcesController.selectedLocalDatasources.splice(idx, 1);
                             mapController.removeOverlay(localDatasource.$layer);
                             } else {
                             externalDatasourcesController.selectedLocalDatasources.push(localDatasource);
                             mapController.addOverlay(localDatasource.$layer);
                             }*/

                            //console.log(globalDatasource.name);
                        };
                //</editor-fold>
            }]);

/* 
 * Copyright (C) 2016 cismet GmbH, Saarbruecken, Germany
 *
 *                                ... and it just works.
 *
 */

/*global angular, shp, L, Math*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'importController', [
            '$scope', '$uibModalInstance', 'dataService', 'featureRendererService', 'sharedDatamodel',
            'sharedControllers', 'localDatasource',
            function ($scope, $uibModalInstance, dataService, featureRendererService, sharedDatamodel,
                    sharedControllers, localDatasource) {
                'use strict';
                var importController, mapController, handleZipFile, convertToLayer;

                importController = this;
                mapController = sharedControllers.analysisMapController;

                importController.importFile = null;
                importController.maxFilesize = '10MB';
                importController.importProgress = 0;
                importController.importInProgress = false;
                importController.importCompleted = false;
                importController.importError = false;


                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ===========================">
                /**
                 * More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                 * 
                 * @param {type} file
                 * @returns {undefined}
                 */
                handleZipFile = function (file) {
                    var reader = new FileReader();

                    localDatasource.name = file.name.split(".").slice(0, 1).pop();
                    localDatasource.fileName = file.name;

                    /*reader.onload = function () {
                     if (reader.readyState !== 2 || reader.error) {
                     console.error("File could not be read! Code " + reader.error);
                     return;
                     } else {
                     convertToLayer(reader.result, file.name);
                     }
                     };*/

                    reader.onloadstart = function () {
                        importController.importInProgress = true;
                        console.log('onloadstart -> importController.importInProgress:' + importController.importInProgress);
                        if (reader.readyState !== 2 || reader.error) {
                            //console.error("File could not be read! Code " + reader.error);
                            //return;
                        } else {

                        }
                    };

                    reader.onprogress = function (progressEvent) {
                        importController.importInProgress = true;
                        var max, current;
                        if (progressEvent.lengthComputable) {
                            max = event.total;
                            current = event.loaded;

                            //console.log('importProgress: ' + current + '(' + Math.min(100, parseInt(100.0 * current / max)) + '%)');
                            importController.importProgress =
                                    Math.min(100, parseInt(100.0 * current / max));

                        } else {
                            importController.importProgress = 100;
                        }
                    };

                    reader.onloadend = function (event) {
                        var arrayBuffer, error;
                        
                        

                        arrayBuffer = event.target.result;
                        error = event.target.error;

                        if (error) {
                            console.error("File could not be read! Code " + error.code);
                            importController.importProgress = 0;
                            importController.importInProgress = false;
                            importController.importError = true;
                        } else {
                            importController.importProgress = 100;
                            console.log('onloadend -> importController.onloadend: ' + 
                                    importController.importProgress);
                            convertToLayer(arrayBuffer, file.name);
                        }
                    };

                    reader.readAsArrayBuffer(file);
                };

                // </editor-fold>


                convertToLayer = function convertToLayer(buffer) {
                    var overlayLayer;
                    
                    shp(buffer).then(function (geojson) {
                        console.log('importController::convertToLayer: processing ' + 
                                geojson.features.length + "' GeoJson Features");
                        overlayLayer = featureRendererService.createOverlayLayer(
                                localDatasource, geojson, function (max, current) {
                                    if (current === max) {
                                        importController.importProgress = 100 +
                                                Math.min(100, parseInt(100.0 * current / max));
                                    } else {
                                        importController.importProgress = 200;
                                    }

                                    if (importController.importProgress === 200) {
                                        importController.importInProgress = false;
                                        importController.importCompleted = true;
                                    }
                                });

                        sharedDatamodel.localDatasources.push(localDatasource);
                        mapController.addOverlay(overlayLayer);
                    });
                };

                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                importController.import = function () {
                    if (importController.importFile !== null) {
                        handleZipFile(importController.importFile);
                    } else {
                        $uibModalInstance.dismiss('cancel');
                    }
                };

                importController.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                importController.close = function () {
                    $uibModalInstance.close(localDatasource);
                };
                // </editor-fold>

                // <editor-fold defaultstate="collapsed" desc="=== DISABLED ===========================">

                /*$scope.uploadPic = function (file) {
                 
                 console.log(file.name);
                 console.log(file.type);
                 
                 handleZipFile(file);
                 
                 
                 file.upload = Upload.upload({
                 url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                 data: {username: $scope.username, file: file},
                 });
                 
                 file.upload.then(function (response) {
                 $timeout(function () {
                 file.result = response.data;
                 });
                 }, function (response) {
                 if (response.status > 0)
                 $scope.errorMsg = response.status + ': ' + response.data;
                 }, function (evt) {
                 // Math.min is to fix IE which reports 200% sometimes
                 file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                 });
                 };*/

                /*
                 setFiles = function (element) {
                 console.log('files:', element.files);
                 // Turn the FileList object into an Array
                 importController.importFiles = [];
                 for (var i = 0; i < element.files.length; i++) {
                 importController.importFiles.push(element.files[i]);
                 }
                 };*/
                // </editor-fold>

            }]);

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'listController',
        [
            '$scope', 'configurationService',
            'sharedDatamodel', 'NgTableParams',
            function ($scope, configurationService,
                    sharedDatamodel, NgTableParams) {
                'use strict';

                var listController, ngTableParams;

                listController = this;
                listController.mode = $scope.mainController.mode;

                listController.resultNodes = sharedDatamodel.resultNodes;
                listController.analysisNodes = sharedDatamodel.analysisNodes;
                
                if (listController.mode === 'search') {
                    listController.nodes = listController.resultNodes;
                } else if (listController.mode === 'analysis') {
                    listController.nodes = listController.analysisNodes;
                }

                /*
                 var groupByClass = function (item) {
                 return "First letter \"" + item.name[0] + "\"";
                 };
                 groupByClass.title = "First Initial";
                 // here's an example where we let the order of data rows determine the sorting of groups
                 groupByClass.sortDirection = undefined;
                 */

                listController.tableColumns = [{
                        field: "classKey",
                        title: "Thema",
                        show: false,
                        groupable: "classKey"
                    }, {
                        field: "name",
                        title: "Name",
                        sortable: "name",
                        show: true,
                    }, {
                        field: "description",
                        title: "Beschreibung",
                        show: true,
                    }];


                ngTableParams = {
                    sorting: {name: 'asc'},
                    count: 500,
                    /*group: {
                     classKey: 'desc'
                     }*/

                };

                listController.tableData = new NgTableParams(
                        ngTableParams, {
                            dataset: listController.nodes,
                            /*groupOptions: {
                             isExpanded: true
                             },*/
                            counts: []
                        });

                $scope.$on('searchSuccess()', function (e) {
                    listController.tableData.reload();
                });

                /*listController.setNodes = function (nodes) {
                 
                 //listController.tableData.reload();
                 listController.tableData.settings({
                 dataset: nodes
                 });
                 };*/

                // leak this to parent scope
                $scope.$parent.listController = listController;
                console.log('new listController instance created from ' + $scope.name);
            }
        ]
        );

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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mainController',
        ['$scope', '$state', '$previousState', 'sharedDatamodel', 'sharedControllers',
            function ($scope, $state, $previousState, sharedDatamodel, sharedControllers) {
                'use strict';

                var mainController;
                mainController = this;

                console.log('mainController::main instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                mainController.mode = $state.current.name.split(".").slice(1, 2).pop();
                
                /**
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mainController.removeAnalysisNode = function (node) {
                    var index = sharedDatamodel.analysisNodes.indexOf(node);
                    if(index !== -1) {
                        sharedDatamodel.analysisNodes.splice(sharedDatamodel.analysisNodes.indexOf(node), 1);
                        // manually update map
                        if(sharedControllers.analysisMapController) {
                            sharedControllers.analysisMapController.removeNode(node);
                        }
                    } else {
                        console.warn("mainController::removeAnalysisNode: node '" + node.name + "' no in list of analysis nodes!");
                    }
                };
                
                /**
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mainController.addAnalysisNode = function (node) {
                    var index = sharedDatamodel.analysisNodes.indexOf(node);
                    if(index !== -1) {
                        console.warn("mainController::addAnalysisNode: node '" + node.name + "' already in list of analysis nodes!");
                    } else {
                        // we cannot add the same feature to two different maps ... :-(
                        var analysisNode = angular.copy(node);
                        analysisNode.$feature = null;
                        
                        // manually update map
                        sharedDatamodel.analysisNodes.push(analysisNode);
                        if(sharedControllers.analysisMapController) {
                            sharedControllers.analysisMapController.addNode(analysisNode);
                        }
                    }
                };
                

                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main") && !$state.is("main")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        mainController.mode = $state.current.name.split(".").slice(1, 2).pop();
                        //console.log('mainController::mainController.mode: ' + mainController.mode + 
                        //        '(toState: ' + toState.name + ')');

                        var previousState = $previousState.get();
                        if (previousState && previousState.state && previousState.state.name) {
                            mainController.previousStateName = previousState.state.name;
                        } else {
                            mainController.previousStateName = undefined;
                        }
                    } else {
                        console.log("mainController::ingoring stateChange '" + $state.name + "'");
                    }
                });
            }]
        );



/*global angular, L, Wkt */
/*jshint sub:true*/

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mapController',
        [
            '$scope',
            '$state',
            '$stateParams',
            'leafletData',
            'configurationService',
            'sharedDatamodel',
            'sharedControllers',
            'featureRendererService',
            function ($scope, $state, $stateParams, leafletData, configurationService,
                    sharedDatamodel, sharedControllers, featureRendererService) {
                'use strict';

                var leafletMap, mapId, mapController, config, layerControl, searchGeometryLayerGroup, drawControl,
                        defaults, center, basemaps, overlays, layerControlOptions,
                        drawOptions, maxBounds, setSearchGeometry, gazetteerLocationLayer, layerControlMappings,
                        overlaysNodeLayersIndex, fitBoundsOptions;

                mapController = this;
                mapController.mode = $scope.mainController.mode;
                mapId = mapController.mode + '-map';

                config = configurationService.map;

                // define Layer groups
                searchGeometryLayerGroup = new L.FeatureGroup();
                searchGeometryLayerGroup.$name = 'Suchgeometrien';
                searchGeometryLayerGroup.$key = 'searchGeometries';
                gazetteerLocationLayer = null;

                overlays = [];
                defaults = angular.copy(config.defaults);
                center = angular.copy(config.maxBounds);
                maxBounds = angular.copy(config.maxBounds);
                basemaps = angular.copy(config.basemaps);
                layerControlOptions = angular.copy(config.layerControlOptions);
                drawOptions = angular.copy(config.drawOptions);
                fitBoundsOptions = angular.copy(config.fitBoundsOptions);

                if (mapController.mode === 'search') {
                    mapController.nodes = sharedDatamodel.resultNodes;
                    sharedControllers.searchMapController = mapController;

                    overlays.push({
                        groupName: configurationService.map.layerGroupMappings['gazetteer'],
                        expanded: false,
                        layers: {}
                    });
                    overlays.push(angular.copy(config.nodeOverlays));
                    overlaysNodeLayersIndex = 1; // after gazetterr layer ....

                    // drawControl only available in search mode
                    drawControl = new L.Control.Draw({
                        draw: drawOptions,
                        /*edit: {
                         featureGroup: searchGeometryLayerGroup
                         }*/
                        edit: false,
                        remove: false
                    });
                } else if (mapController.mode === 'analysis') {
                    mapController.nodes = sharedDatamodel.analysisNodes;
                    sharedControllers.analysisMapController = mapController;

                    overlays.push(angular.copy(config.nodeOverlays));
                    overlays.push({
                        groupName: configurationService.map.layerGroupMappings['external'],
                        expanded: false,
                        layers: {}
                    });
                    overlaysNodeLayersIndex = 0; // before external layers ....
                }

                layerControlMappings = {};
                // Basemap Mappings
                layerControlMappings.basemap_at =
                        L.stamp(basemaps[0].layers[config.layerMappings['basemap_at']]);
                layerControlMappings.arcgisonline_com =
                        L.stamp(basemaps[0].layers[config.layerMappings['arcgisonline_com']]);
                layerControlMappings.opentopomap_org =
                        L.stamp(basemaps[0].layers[config.layerMappings['opentopomap_org']]);
                layerControlMappings.openstreetmap_org =
                        L.stamp(basemaps[0].layers[config.layerMappings['openstreetmap_org']]);

                // overlay mappings
                layerControlMappings.BORIS_SITE =
                        L.stamp(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['BORIS_SITE']]);
                layerControlMappings.EPRTR_INSTALLATION =
                        L.stamp(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['EPRTR_INSTALLATION']]);
                layerControlMappings.MOSS =
                        L.stamp(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['MOSS']]);
                layerControlMappings.WAGW_STATION =
                        L.stamp(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAGW_STATION']]);
                layerControlMappings.WAOW_STATION =
                        L.stamp(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAOW_STATION']]);

                // put angular-leaflet config into $scope-soup ...
                angular.merge($scope, {
                    layers: {
                        // don't configure baselayers in angular-leaflet-directive:
                        // does not synchronise with styledLayerControl!
                    },
                    defaults: defaults,
                    center: center,
                    maxBounds: maxBounds,
                    controls: {
                        scale: true
                    },
                    tileLayer: '' // disabled: loads OSM tiles in background even if not visible!
                });

                // Map Controls
                layerControl = L.Control.styledLayerControl(
                        basemaps,
                        overlays,
                        layerControlOptions);

                setSearchGeometry = function (searchGeometryLayer, layerType) {
                    if (mapController.mode === 'search') {
                        searchGeometryLayerGroup.clearLayers();
                        if (searchGeometryLayer !== null) {

                            searchGeometryLayer.$name = layerType;
                            searchGeometryLayer.$key = 'searchGeometry';
                            searchGeometryLayerGroup.addLayer(searchGeometryLayer);

                            if (config.options.centerOnSearchGeometry) {
                                leafletData.getMap(mapId).then(function (map) {
                                    map.fitBounds(searchGeometryLayerGroup.getBounds(), {
                                        animate: true,
                                        pan: {animate: true, duration: 0.6},
                                        zoom: {animate: true},
                                        maxZoom: config.options.preserveZoomOnCenter ? map.getZoom() : null
                                    });
                                });
                            }
                            searchGeometryLayer.once('click', function (event) {
                                setSearchGeometry(null);
                            });

                            // TODO: set sharedDatamodel.selectedSearchGeometry!
                        }
                    } else {
                        console.warn("mapController:: cannot add search geomatry to analysis map!");
                    }
                };


                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">

                /**
                 * Returns the current search location wkt. If no search bbox or polygon
                 * is drawn, retuns the map bounds as wkt;
                 * @returns {undefined}
                 */
                mapController.getSearchWktString = function () {
                    var searchGeometryLayer, wkt, wktString;
                    // bbox available ....
                    if (searchGeometryLayerGroup.getLayers().length === 1) {
                        searchGeometryLayer = searchGeometryLayerGroup.getLayers()[0];
                    } else {
                        searchGeometryLayer = new L.rectangle(leafletMap.getBounds());
                    }

                    wkt = new Wkt.Wkt().fromObject(searchGeometryLayer);
                    return wkt.write();
                };

                mapController.unSelectOverlayByKey = function (layerKey) {
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.unSelectOverlayByKey(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::unSelectOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                mapController.unSelectOverlay = function (layer) {
                    layerControl.unSelectLayer(layer);
                };

                mapController.selectOverlayByKey = function (layerKey) {
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.selectOverlay(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::selectOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                mapController.selectOverlay = function (layer) {
                    layerControl.selectLayer(layer);

                    leafletMap.fitBounds(layer.getBounds(), {
                        animate: true,
                        pan: {animate: true, duration: 0.6},
                        zoom: {animate: true},
                        maxZoom: null
                    });
                };

                mapController.removeOverlayByKey = function (layerKey) {
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.removeOverlay(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::removeOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                mapController.removeOverlay = function (layer) {
                    mapController.unSelectOverlay(layer);
                    layerControl.removeLayer(layer);
                };

                mapController.addOverlay = function (layer) {
                    if (mapController.mode === 'analysis') {
                        if (layer.$key && layer.$name) {

                            layerControlMappings[layer.$key] =
                                    L.stamp(layer);

                            //console.log('mapController::addOverlay: ' + layer.$name + ' (' + layerControlMappings[layer.$key] + ')');

                            var groupName = layer.$groupName ? layer.$groupName : config.layerGroupMappings['external'];
                            layerControl.addOverlay(
                                    layer,
                                    layer.$name, {
                                        groupName: groupName
                                    });

                            mapController.selectOverlay(layer);


                            /*leafletData.getMap(mapId).then(function (map) {
                             map.fitBounds(layer.getBounds(), {
                             animate: true,
                             pan: {animate: true, duration: 0.6},
                             zoom: {animate: true},
                             maxZoom: null
                             });
                             });*/

                            //layer.addTo(leafletMap); 
                        } else {
                            console.warn("mapController:: cannot add overlay layer without $name and $key property!");
                        }
                    } else {
                        console.warn("mapController:: cannot add overlay to search map!");
                    }
                };

                mapController.gotoNode = function (node) {
                    if (node.$feature) {
                        leafletMap.setView(node.$feature.getLatLng(), 14 /*leafletMap.getZoom()*/);
                        node.$feature.togglePopup();
                    }
                };

                mapController.addNode = function (node) {
                    if (mapController.mode === 'analysis') {
                        mapController.setNodes([node]);

                    } else {
                        console.warn("mapController:: cannot add Node on search map!");
                    }
                };

                mapController.removeNode = function (node) {
                    var feature, featureGroupLayer, layerControlId;
                    if (mapController.mode === 'analysis') {
                        if (node && node.$feature && node.$feature.$groupKey) {
                            feature = node.$feature;
                            // feature belongs to feature layer -> $groupKey
                            layerControlId = layerControlMappings[feature.$groupKey];
                            if (layerControlId && layerControl._layers[layerControlId] && layerControl._layers[layerControlId].layer) {
                                featureGroupLayer = layerControl._layers[layerControlId].layer;
                                featureGroupLayer.removeLayer(feature);
                                node.$feature = null;
                            } else {
                                console.warn("mapController::removeNode unsupported theme (feature group) '" + feature.$groupKey + "'");
                            }
                        } else {
                            console.warn("mapController:: cannot remove Node '" +
                                    node.name + "': $feature is missing!");
                        }
                    } else {
                        console.warn("mapController:: cannot remove  Node on search map!");
                    }
                };

                mapController.clearNodes = function () {
                    var nodeLayerControlIds, featureGroupLayer;

                    nodeLayerControlIds = [
                        layerControlMappings.BORIS_SITE,
                        layerControlMappings.EPRTR_INSTALLATION,
                        layerControlMappings.MOSS,
                        layerControlMappings.WAGW_STATION,
                        layerControlMappings.WAOW_STATION];

                    nodeLayerControlIds.forEach(function (layerControlId) {
                        if (layerControl._layers[layerControlId] &&
                                layerControl._layers[layerControlId].layer) {

                            featureGroupLayer = layerControl._layers[layerControlId].layer;
                            featureGroupLayer.clearLayers();
                        }
                    });
                };

                mapController.setNodes = function (nodes, fitBounds, clearLayers) {
                    var featureGroups, featureGroup, featureGroupLayer, theme,
                            layerControlId, bounds;

                    if (!clearLayers) {
                        clearLayers = mapController.mode === 'search' ? true : false;
                    }

                    if (!fitBounds) {
                        fitBounds = mapController.mode === 'search' ? true : false;
                    }

                    // clear layers on search map
                    if (clearLayers) {
                        mapController.clearNodes();
                    }

                    if (nodes !== null && nodes.length > 0) {
                        featureGroups = featureRendererService.createNodeFeatureGroups(nodes);
                        for (theme in featureGroups) {
                            layerControlId = layerControlMappings[theme];
                            if (layerControlId && layerControl._layers[layerControlId] && layerControl._layers[layerControlId].layer) {
                                featureGroup = featureGroups[theme];
                                featureGroupLayer = layerControl._layers[layerControlId].layer;

                                /*jshint loopfunc:true */
                                featureGroup.forEach(function (feature) {
                                    feature.addTo(featureGroupLayer);
                                });

                                layerControl.selectLayer(featureGroupLayer);
                                if (fitBounds) {
                                    bounds = !bounds ? featureGroupLayer.getBounds() : bounds.extend(featureGroupLayer.getBounds());
                                }
                            } else {
                                console.warn("mapController::setNodes unsupported theme (feature group) '" + theme + "'");
                            }

                            if (bounds) {
                                leafletMap.fitBounds(bounds, fitBoundsOptions);
                            }


                            //console.log(mapId + '::setResultNodes for ' + theme);
                            //featureGroup = featureGroups[theme];


                            // FIXME: clear layers before adding
                            // FIXME: setVisible to true adds duplicate layers ?!!!!!
                            /*layerControl.addOverlay(
                             featureLayer,
                             featureLayer.$name, {
                             groupName: "Themen"
                             });*/
                        }

                        //mapController.nodes = nodes;
                    }

                };

                mapController.setGazetteerLocation = function (gazetteerLocation) {
                    if (mapController.mode === 'search') {
                        console.log('mapController::setGazetteerLocation: ' + gazetteerLocation.name);
                        if (gazetteerLocation !== null) {
                            // remove old layer
                            if (gazetteerLocationLayer !== null) {
                                layerControl.removeLayer(gazetteerLocationLayer);
                                leafletMap.removeLayer(gazetteerLocationLayer);
                                gazetteerLocationLayer = null;
                            }

                            gazetteerLocationLayer =
                                    featureRendererService.createGazetteerLocationLayer(gazetteerLocation);
                            layerControlMappings.gazetteer =
                                    L.stamp(gazetteerLocationLayer);

                            if (gazetteerLocationLayer !== null) {

                                /*gazetteerLocationLayer.StyledLayerControl = {
                                 removable: false,
                                 visible: false
                                 };*/

                                // FIXME: GazetteerLocationLayer added twice!
                                layerControl.addOverlay(
                                        gazetteerLocationLayer,
                                        gazetteerLocationLayer.$name, {
                                            groupName: config.layerGroupMappings['gazetteer']
                                        });

                                layerControl.selectLayer(gazetteerLocationLayer);

                                leafletMap.fitBounds(gazetteerLocationLayer.getBounds(),
                                        fitBoundsOptions);

                                /*leafletData.getMap(mapId).then(function (map) {
                                 map.fitBounds(gazetteerLocationLayer.getBounds(), 
                                 fitBoundsOptions);
                                 });*/

                            } else {
                                mapController.setGazetteerLocation(null);
                            }
                        } else if (gazetteerLocationLayer !== null) {
                            // does not remove the lkayer from map !?!
                            layerControl.removeLayer(gazetteerLocationLayer);
                            leafletMap.removeLayer(gazetteerLocationLayer);
                            gazetteerLocationLayer = null;
                        }
                    } else {
                        console.warn("mapController:: cannot set gazetteerLocation on analysis map!");
                    }
                };

                //</editor-fold>

                // register search map event handlers
                if (mapController.mode === 'search') {
                    $scope.$on('gotoLocation()', function (event) {
                        if (mapController.mode === 'search') {
                            console.log('mapController::gotoLocation(' + sharedDatamodel.selectedGazetteerLocation.name + ')');
                            mapController.setGazetteerLocation(sharedDatamodel.selectedGazetteerLocation);
                        }
                    });

                    $scope.$on('searchSuccess()', function (event) {
                        // reset search geom
                        setSearchGeometry(null);
                        // Gesamter Kartenausschnitt
                        sharedDatamodel.selectedSearchLocation.id = 0;
                        if (sharedDatamodel.resultNodes.length > 0) {
                            mapController.setNodes(sharedDatamodel.resultNodes);
                        } else {
                            mapController.clearNodes();
                        }
                        /*else if (mapController.mode === 'analysis' && sharedDatamodel.analysisNodes.length > 0) {
                         mapController.setNodes(sharedDatamodel.analysisNodes);
                         }*/
                    });

                    $scope.$on('searchError()', function (event) {
                        // reset search geom
                        setSearchGeometry(null);
                        // Gesamter Kartenausschnitt
                        sharedDatamodel.selectedSearchLocation.id = 0;
                        mapController.clearNodes();

                    });

                    $scope.$on('setSearchLocation()', function (event) {
                        if (sharedDatamodel.selectedSearchLocation.id === 0) {
                            setSearchGeometry(null);
                            sharedDatamodel.selectedSearchLocation.id = 0;
                        }
                    });
                }

                // <editor-fold defaultstate="collapsed" desc="=== DISABLED               ===========================">
                /*$scope.$watch(function () {
                 // Return the "result" of the watch expression.
                 return(mapController.zoom);
                 }, function (newZoom, oldZoom) {
                 //console.log('newZoom:' + newZoom + " = this.zoom:" + mapController.zoom);
                 if (mapController.zoom && newZoom !== oldZoom) {
                 $state.go('main.' + $scope.mainController.mode + '.map', {'zoom': mapController.zoom},
                 {'inherit': true, 'notify': false, 'reload': false}).then(
                 function (state)
                 {
                 console.log(state);
                 });
                 } else {
                 console.log('oldZoom:' + oldZoom + " = this.zoom:" + mapController.zoom);
                 $state.go('main.analysis.map', {'zoom': undefined},
                 {'inherit': true, 'notify': false, 'reload': false}).then(function (state) {
                 console.log(state);
                 });
                 }
                 });*/

                /*mapController.setNodes = function (nodes) {
                 if (mapController.mode === 'search') {
                 var layerGroups, theme, featureLayer;
                 if (nodes !== null && nodes.length > 0) {
                 layerGroups = featureRendererService.createNodeFeatureLayers(nodes);
                 for (theme in layerGroups) {
                 console.log(mapId + '::setResultNodes for ' + theme);
                 featureLayer = layerGroups[theme];
                 // FIXME: clear layers before adding
                 // FIXME: setVisible to true adds duplicate layers ?!!!!!
                 layerControl.addOverlay(
                 featureLayer,
                 featureLayer.$name, {
                 groupName: "Themen"
                 });
                 }
                 
                 //mapController.nodes = nodes;
                 }
                 } else {
                 console.warn("mapController:: cannot setNodes on analysis map!");
                 }
                 };*/
                //</editor-fold>

                // add all to map
                leafletData.getMap(mapId).then(function (map) {

                    leafletMap = map;

                    // add the layers
                    map.addLayer(searchGeometryLayerGroup);

                    if (mapController.mode === 'search') {
                        map.addControl(drawControl);

                        map.on('draw:created', function (event) {
                            setSearchGeometry(event.layer, event.layerType);
                            // this is madness!
                            sharedDatamodel.selectedSearchLocation.id = 1;
                        });

                        map.on('draw:deleted', function (event) {
                            setSearchGeometry(null);
                            sharedDatamodel.selectedSearchLocation.id = 0;
                        });
                    }

                    map.addControl(layerControl);

                    // not sure why this is needed altough it is already configured in the map directive
                    map.setMaxBounds(maxBounds);
                    map.setZoom(center.zoom);

                    // select the default basemap
                    layerControl.selectLayer(basemaps[0].layers[config.defaultBasemapLayer]);

                    // FIXME: removes also layers from layercontrol that are just deselected!
                    map.on('layerremove', function (layerEvent) {
                        var removedLayer = layerEvent.layer;


                        if (removedLayer.StyledLayerControl &&
                                removedLayer.StyledLayerControl.removable &&
                                layerControl._layers[L.stamp(removedLayer)]) {
                            // bugfix-hack for StyledLayerControl.
                            layerControl.removeLayer(removedLayer);
                        }

                        console.log('mapController:: layer removed: ' + removedLayer.$name +
                                ' (' + L.stamp(removedLayer) + ')');

                        if (removedLayer && removedLayer === gazetteerLocationLayer) {
                            console.log('mapController::gazetteerLocationLayer removed');
                            //gazetteerLocationLayer = null;
                            //layerControl.removeLayer(gazetteerLocationLayer);
                        }
                    });

                    // analysis nodes added bofre controller instance created ....
                    if (mapController.mode === 'analysis' &&
                            sharedDatamodel.analysisNodes &&
                            sharedDatamodel.analysisNodes.length > 0) {

                        mapController.setNodes(sharedDatamodel.analysisNodes);
                    }
                });

                // leak this to parent scope
                // FIXME: use sharedControllers Service instead
                $scope.$parent.mapController = mapController;

                console.log($scope.mainController.mode + ' map controller instance created');
            }]
        );

/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular,Wkt*/
angular.module(
    'de.cismet.uim2020-html5-demonstrator.controllers'
    ).controller(
    'searchController',
    [
        '$rootScope', '$window', '$timeout', '$scope', '$state', '$uibModal', 'leafletData',
        'configurationService', 'sharedDatamodel', 'sharedControllers', 'dataService', 'searchService',
        function ($rootScope, $window, $timeout, $scope, $state, $uibModal, leafletData,
            configurationService, sharedDatamodel, sharedControllers, dataService, searchService) {
            'use strict';
            var searchController, searchProcessCallback, showProgressModal, progressModal;
            searchController = this;
            // set default mode according to default route in app.js 
            searchController.mode = 'map';
            searchController.status = sharedDatamodel.status;
            // === Configurations ==========================================
            // <editor-fold defaultstate="collapsed" desc="   - Search Locations Selection Box Configuration">
            // TODO: add coordinates to selectedSearchLocation on selection!
            searchController.searchLocations = dataService.getSearchLocations();
            //sharedDatamodel.selectedSearchLocation = 0; //angular.copy(searchController.searchLocations[0]);
            searchController.selectedSearchLocation = sharedDatamodel.selectedSearchLocation;
            searchController.searchLocationsSettings = angular.extend(
                {},
                configurationService.multiselect.settings, {
                    showCheckAll: false,
                    showUncheckAll: false,
                    styleActive: false,
                    closeOnSelect: true,
                    scrollable: false,
                    displayProp: 'name',
                    idProp: 'id',
                    enableSearch: false,
                    smartButtonMaxItems: 1,
                    selectionLimit: 1, // -> the selection model will contain a single object instead of array. 
                    externalIdProp: 'id' // -> Full Object as model
                });
            searchController.selectedSearchLocationEvents = {
                onItemSelect: function (selectedSearchLocation) {
                    // Gesamter Kartenausschnitt
                    if (selectedSearchLocation.id === 0) {
                        $scope.$broadcast('setSearchLocation()');
                    }
                }
            };
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc="   - Search Themes Selection Box Configuration">
            searchController.searchThemes = dataService.getSearchThemes();
            searchController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
            searchController.searchThemesSettings = angular.extend(
                {},
                configurationService.multiselect.settings, {
                    smartButtonMaxItems: 0,
                    idProp: 'className',
                    smartButtonTextConverter: function (itemText, originalItem) {
                        return searchController.selectedSearchThemes.length === 1 ?
                            '1 Thema ausgewählt' : '';
                    }
                });
            searchController.searchThemesTranslationTexts = angular.extend(
                {},
                configurationService.multiselect.translationTexts, {
                    buttonDefaultText: 'Themen auswählen',
                    dynamicButtonTextSuffix: 'Themen ausgewählt'
                });
            // FIXME: translationTexts not updated in directive
            // See https://github.com/cismet/uim2020-html5-demonstrator/issues/2
            /*searchController.selectEvents = {
             onItemSelect: function (item) {
             searchController.searchThemesTranslationTexts.dynamicButtonTextSuffix =
             searchController.selectedSearchThemes.length === 1 ?
             'Thema ausgewählt' : 'Themen ausgewählt';
             console.log(searchController.searchThemesTranslationTexts.dynamicButtonTextSuffix);
             }
             };*/
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc="   - Search Pollutants Selection Box Configuration">
            if (dataService.getSearchPollutants().$resolved) {
                searchController.searchPollutants = dataService.getSearchPollutants();
            } else {
                dataService.getSearchPollutants().$promise.then(function (searchPollutants) {
                    searchController.searchPollutants = searchPollutants;
                });
            }

            searchController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
            searchController.searchPollutantsSettings = angular.extend(
                {},
                configurationService.multiselect.settings, {
                    scrollableHeight: '600px',
                    scrollable: true,
                    displayProp: 'pollutant_name',
                    idProp: 'pollutant_key',
                    searchField: 'pollutant_name',
                    enableSearch: true,
                    showEnableSearchButton: false,
                    selectByGroups: ['Metalle und Schwermetalle']
                });
            searchController.searchPollutantsTranslationTexts = angular.extend(
                {},
                configurationService.multiselect.translationTexts, {
                    buttonDefaultText: 'Schadstoffe auswählen',
                    dynamicButtonTextSuffix: 'Schadstoffe ausgewählt'
                });
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc="   - Gazetteer Locations Selection Box Configuration">
            if (dataService.getGazetteerLocations().$resolved) {
                searchController.gazetteerLocations = dataService.getGazetteerLocations();
            } else {
                dataService.getGazetteerLocations().$promise.then(function (gazetteerLocations) {
                    searchController.gazetteerLocations = gazetteerLocations;
                });
            }

            searchController.selectedGazetteerLocation = sharedDatamodel.selectedGazetteerLocation;
            searchController.gazetteerLocationsSettings = angular.extend(
                {},
                configurationService.multiselect.settings, {
                    styleActive: false,
                    closeOnSelect: true,
                    scrollableHeight: '600px',
                    scrollable: true,
                    displayProp: 'name',
                    idProp: '$self',
                    searchField: 'name',
                    enableSearch: true,
                    smartButtonMaxItems: 1,
                    selectionLimit: 1, // -> the selection model will contain a single object instead of array. 
                    externalIdProp: '' // -> Full Object as model
                });
            searchController.gazetteerLocationsTranslationTexts = angular.extend(
                {},
                configurationService.multiselect.translationTexts, {
                    buttonDefaultText: 'Ort auswählen'
                });
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ====================================">

            showProgressModal = function () {
                var modalScope;
                //console.log('searchController::showProgress()');
                modalScope = $rootScope.$new(true);
                modalScope.status = searchController.status;
                progressModal = $uibModal.open({
                    templateUrl: 'templates/search-progress-modal.html',
                    scope: modalScope,
                    size: 'lg',
                    backdrop: 'static'/*,
                     resolve: {searchController:searchController}*/
                });
                // check if the eror occurred before the dialog has actually been shown
                progressModal.opened.then(function () {
                    if (searchController.status.type === 'error') {
                        progressModal.close();
                    }
                });
            };
            searchProcessCallback = function (current, max, type) {
                //console.log('searchProcess: type=' + type + ', current=' + current + ", max=" + max)
                // the maximum object count
                searchController.status.progress.max = 100;
                // the scaled progress: 0 <fake progress> 100 <real progress> 200
                // searchController.searchStatus.current = ...

                // start of search (indeterminate)
                if (max === -1 && type === 'success') {
                    // count up fake progress to 100
                    searchController.status.progress.current = current;
                    if (current < 95) {
                        searchController.status.message = 'Die Suche im UIM2020-DI Indexdatenbestand wird durchgeführt';
                        searchController.status.type = 'success';
                    } else {
                        searchController.status.message = 'Die UIM2020-DI Server sind z.Z. ausgelastet, bitte warten Sie einen Augenblick.';
                        searchController.status.type = 'warning';
                    }

                    // search completed
                } else if (current === max && type === 'success') {
                    if (current > 0) {
                        searchController.status.progress.current = 100;
                        searchController.status.message = 'Suche erfolgreich, ' +
                            (current === 1 ? 'eine Messstelle' : (current + ' Messstellen')) + ' im UIM2020-DI Indexdatenbestand gefunden.';
                        searchController.status.type = 'success';
                    } else {
                        // feature request #59
                        searchController.status.progress.current = 100;
                        searchController.status.message = 'Es wurden keine zu den Suchkriterien passenden Messstellen im UIM2020-DI Indexdatenbestand gefunden';
                        searchController.status.type = 'warning';
                    }

                    if (progressModal) {
                        // wait 1/2 sec before closing to allow the progressbar to advance to 100% (see #59)
                        $timeout(function () {
                            progressModal.close();
                        }, 500);
                    }
                    // search error ...
                } else if (type === 'error') {
                    searchController.status.progress.current = 100;
                    searchController.status.message = 'Die Suche konnte aufgrund eines Server-Fehlers nicht durchgeführt werden.';
                    searchController.status.type = 'danger';
                    $timeout(function () {
                        if (progressModal) {
                            progressModal.close(searchController.status.message);
                        }
                    }, 2000);
                }
            };
            // </editor-fold>
            // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
            searchController.gotoLocation = function () {
                // TODO: check if paramters are selected ...

                // check state, activate map if necessary
                if (searchController.mode !== 'map') {
                    $state.go('^.map'); // will go to the sibling map state.
                    // $state.go('main.search.map');
                }

                $scope.$broadcast('gotoLocation()');
            };
            
            /**
             * Main Search Function
             * 
             * @returns {undefined}
             */
            searchController.search = function (mockNodes) {
                var geometry, themes, pollutants, limit, offset;

                geometry = sharedControllers.searchMapController.getSearchWktString();
                themes = [];
                pollutants = [];
                limit = 500;
                offset = 0;

                sharedDatamodel.selectedSearchThemes.forEach(function (theme) {
                    themes.push(theme.id);
                });

                sharedDatamodel.selectedSearchPollutants.forEach(function (pollutant) {
                    pollutants.push(pollutant.id);
                });
                
                showProgressModal();
                
                searchService.defaultSearch(
                    geometry,
                    themes,
                    pollutants,
                    limit,
                    offset,
                    searchProcessCallback).$promise.then(
                    function (searchResult)
                    {
                        sharedDatamodel.resultNodes.length = 0;
                        if (searchResult.$collection && searchResult.$collection.length > 0) {
                            //console.log(success);
                            //
                             // The .push method can take multiple arguments, so by using 
                             // .apply to pass all the elements of the second array as 
                             // arguments to .push, you can get the result you want because
                             // resultNodes.push(searchResult.$collection) would push the 
                             // array object, not its elements!!!
                             //
                            sharedDatamodel.resultNodes.push.apply(
                                sharedDatamodel.resultNodes, searchResult.$collection);
                        }

                        $scope.$broadcast('searchSuccess()');
                    },
                    function (searchError) {
                        //console.log(searchError);
                        sharedDatamodel.resultNodes.length = 0;
                        $scope.$broadcast('searchError()');
                    });

                // <editor-fold defaultstate="collapsed" desc="[!!!!] MOCK DATA (DISABLED) ----------------">        
                /*                    
                if(mockNodes === null || mockNodes === undefined) {
                    mockNodes = dataService.getMockNodes();
                }             
                                    
                 if (mockNodes.$resolved) {
                 
                //var tmpMockNodes;
                 
                 sharedDatamodel.resultNodes.length = 0;
                 // must use push() or the reference in other controllers is destroyed!
                 //tmpMockNodes = angular.copy(mockNodes.slice(0, 20));
                 //tmpMockNodes = angular.copy(mockNodes);
                 //sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, tmpMockNodes);
                 sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, mockNodes);
                 $scope.$broadcast('searchSuccess()');
                 
                 
                 } else {
                 mockNodes.$promise.then(function (resolvedMockNodes) {
                 searchController.search(resolvedMockNodes);
                 });
                 }*/
                // </editor-fold>
            };
            // </editor-fold>

            // TODO: put into parent scope?
            $scope.$on('$stateChangeSuccess', function (toState) {
                if ($state.includes("main.search") && !$state.is("main.search")) {
                    //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                    searchController.mode = $state.current.name.split(".").slice(1, 3).pop();
                    //console.log('searchController::mode: ' + searchController.mode);

                    // resize the map on state change
                    if (searchController.mode === 'map') {
                        leafletData.getMap('search-map').then(function (map) {
                            $timeout(function () {
                                if (map && map._container.parentElement) {
                                    if (map._container.parentElement.offsetHeight > 0 &&
                                        map._container.parentElement.offsetWidth) {
                                        $scope.mapHeight = map._container.parentElement.offsetHeight;
                                        $scope.mapWidth = map._container.parentElement.offsetWidth;
                                        //console.log('searchController::stateChangeSuccess new size: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
                                        map.invalidateSize(false);
                                    } else {
                                        //console.warn('searchController::stateChangeSuccess saved size: ' + $scope.mapWidth + "x" + $scope.mapHeight);
                                        map.invalidateSize(false);
                                    }
                                }
                            }, 100);
                        });
                    }
                }
            });
            //                var fireResize = function () {
            //                    //$scope.currentHeight = $window.innerHeight - $scope.navbarHeight;
            //                    //$scope.currentWidth = $window.innerWidth - ($scope.toolbarShowing ? $scope.toolbarWidth : 0);
            //                    leafletData.getMap('search-map').then(function (map) {
            //                        if (map && map._container.parentElement) {
            //                            console.log('searchController::fireResize: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
            //                            $scope.mapHeight = map._container.parentElement.offsetHeight;
            //                            $scope.mapWidth = map._container.parentElement.offsetWidth;
            //                            //map.invalidateSize(animate);
            //                        }
            //
            //                    });
            //                };
            //
            //                angular.element($window).bind('resize', function () {
            //                    fireResize(false);
            //                });

            console.log('searchController instance created');
        }
    ]
    );

// module initialiser for the directives, shall always be named like that so that concat will pick it up first!
// however, the actual directives implementations shall be put in their own files
angular.module(
    'de.cismet.uim2020-html5-demonstrator.directives',
    [
       
    ]
);
/*globals angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.directives'
        ).directive('ngSize', [
    '$rootScope',
    function ($rootScope) {
        'use strict';
        return {
            restrict: 'A',
            controller: 
        [
            '$scope',
            function ($scope) {
                 $scope.size = {};
                 
            }],
            link: function ($scope, element) {
           

                var handler, exists;

                $rootScope.ngSizeDimensions = (angular.isArray($rootScope.ngSizeDimensions)) ? $rootScope.ngSizeDimensions : [];
                $rootScope.ngSizeWatch = (angular.isArray($rootScope.ngSizeWatch)) ? $rootScope.ngSizeWatch : [];

                handler = function () {
                    angular.forEach($rootScope.ngSizeWatch, function (el, i) {
                        // Dimensions Not Equal?
                        if ($rootScope.ngSizeDimensions[i][0] !== el.offsetWidth ||
                                $rootScope.ngSizeDimensions[i][1] !== el.offsetHeight) {
                            // Update Them
                            $rootScope.ngSizeDimensions[i] = [el.offsetWidth, el.offsetHeight];
                            // Update Scope?
                            $rootScope.$broadcast('size::changed', i);
                        }
                    });
                };

                // Add Element to Chain?
                exists = false;
                angular.forEach($rootScope.ngSizeWatch, function (el, i) {
                    if (el === element[0]) {
                        exists = i;
                    }
                });

                // Ok.
                if (exists === false) {
                    $rootScope.ngSizeWatch.push(element[0]);
                    $rootScope.ngSizeDimensions.push([element[0].offsetWidth, element[0].offsetHeight]);
                    exists = $rootScope.ngSizeWatch.length - 1;
                }

                // Update Scope?
                $scope.$on('size::changed', function (event, i) {
                    // Relevant to the element attached to *this* directive
                    if (i === exists) {
                        if(!$scope.size) {
                            $scope.size = {};
                        }
                        
                        $scope.size.width = $rootScope.ngSizeDimensions[i][0];
                        $scope.size.height = $rootScope.ngSizeDimensions[i][1];
                              
                        console.log('width: ' + $scope.size.width);
                        console.log('height: ' +  $scope.size.height);
                    }
                });

                // Refresh: 100ms
                if (!window.ngSizeHandler) {
                    window.ngSizeHandler = setInterval(handler, 10);
                }
                    

                // Window Resize?
                angular.element(window).on('resize', handler);

            }
        };
    }]);
angular.module(
    'de.cismet.uim2020-html5-demonstrator.filters',
    [
    ]
);

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
        'de.cismet.uim2020-html5-demonstrator.filters'
        ).filter(
        'descriptionFilter',
        function () {
            'use strict';

            return function (data) {
                var description = 'keine Beschreibung verfügbar';
                // BORIS
                if (data.literatur || data.institut) {
                    if (data.literatur) {
                        description = data.literatur;
                        if (data.institut) {
                            description += (' (' + data.institut + ")");
                        }
                    } else {
                        description = data.institut;
                    }
                    // EPRTR
                } else if (data.naceclass || data.erasid) {
                    if (data.naceclass) {
                        description = data.naceclass;
                    } else {
                        description = data.erasid;
                    }
                    // WAxW
                } else if (data.zustaendigestelle || data.bundesland) {
                    if (data.zustaendigestelle) {
                        description = data.zustaendigestelle;
                        if (data.bundesland && data.bundesland !== data.zustaendigestelle) {
                            description += (' (' + data.bundesland + ")");
                        }
                    } else {
                        description = data.bundesland;
                    }
                    // MOSS
                } else if (data.labno || data.sampleid) {
                    if (data.labNo) {
                        description = 'Labornummer: ' + data.labNo;
                    } else {
                        description = data.sampleid;
                    }
                }
                return description;
            };
        }
);

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
    'de.cismet.uim2020-html5-demonstrator.filters'
    ).filter(
    'textLengthFilter',
    function () {
        'use strict';

        var escapePattern, getRegex;

        escapePattern = /[-\/\\^$*+?.()|[\]{}]/g;

        getRegex = function (s, f) {
            return new RegExp('[' + s.replace(escapePattern, '\\$&') + ']', f);
        };

        /* filter to cut of text if it is longer than the given length. if the input or the txtlen are null or undefined
         * the filter will return 'null'. the filter has the following parameters
         * 
         * - input: string, the text input, if it is not a string the behaviour may not be as expected
         * - txtLen: integer, the length of the resulting string, including 'tpl'
         * - exact: boolean (default=false), if the result string should exactly match 'txtLen' or if it should try to 
         *   cut of the text after a white space character. In any case the resulting string will not exceed 'txtLen'.
         * - tpl: string (default='[...]', the string to use as indicator that the text has been cut off. If the text 
         *   is actually shorter than txtLen it will not be appended.
         * - sentence: boolean (default=false), the filter tries to match one or more sentences within 'txtLen'. 
         *   If 'txtLen' is '0' it will use the first full sentence regardless of the length of the result. 
         *   If 'sentence' is set to 'true' 'exact' will be ignored.
         *   If no sentence is found using the 'sentenceDelimiters' the behaviour is the same as if sentence is set to
         *   'false' which implies that only the 'tpl' is returned if 'txtLen' is '0'
         * - sentenceDelimiters: string (default='.!?;:')
         * */
        return function (input, txtLen, exact, tpl, sentence, sentenceDelimiters) {
            var _exact, _sentence, _sentenceDelimiters, _tpl, match, out, regex;

            if (!input || txtLen === undefined || txtLen === null) {
                return null;
            }

            if (txtLen >= input.length) {
                out = input;
            } else {
                if (exact === undefined || exact === null) {
                    _exact = false;
                } else {
                    _exact = exact;
                }

                if (tpl === undefined || tpl === null) {
                    _tpl = '[...]';
                } else {
                    _tpl = tpl;
                }

                if (sentence === undefined || sentence === null) {
                    _sentence = false;
                } else {
                    _sentence = sentence;
                }

                if (sentenceDelimiters === undefined || sentenceDelimiters === null) {
                    _sentenceDelimiters = '.!?;:';
                } else {
                    _sentenceDelimiters = sentenceDelimiters;
                }

                if (_sentence && txtLen === 0) {
                    match = input.match(getRegex(_sentenceDelimiters, ''));
                    if (match) {
                        if (match.index >= input.length - 1) {
                            out = input;
                        } else {
                            out = input.substr(0, match.index + 1) + ' ' + _tpl;
                        }
                    } else {
                        // nothing found, thus processing as if sentence == false,
                        // which basically means only the tpl (len = 0)
                        out = _tpl;
                    }
                } else {
                    out = input.substr(0, txtLen - _tpl.length);

                    if (_sentence) {
                        regex = getRegex(_sentenceDelimiters, 'g');
                        match = 0;
                        // one char less as we add one if matched
                        while (regex.exec(out.substr(0, out.length - 1)) !== null) {
                            match = regex.lastIndex;
                        }
                        if (match > 0) {
                            out = out.substr(0, match + 1) + ' ';
                        }
                    }

                    if (_exact) {
                        out += _tpl;
                    } else {
                        match = out.match(/\s+\w*$/);
                        if (match) {
                            out = out.substr(0, match.index + 1) + _tpl;
                        } else {
                            out += _tpl;
                        }
                    }
                }
            }

            return out;
        };
    }
);

// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.uim2020-html5-demonstrator.services',
    [
        'ngResource'
    ]
);
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
        ).factory('authenticationService',
        [
            '$q',
            '$http',
            '$cookieStore',
            'configurationService',
            'base64',
            function ($q, $http, $cookieStore, configurationService, base64) {
                'use strict';
                var _identity, _authenticate,
                        isIdentityResolved, isAuthenticated, isInRole, isInAnyRole,
                        authenticate, resolveIdentity, getIdentity, getAuthorizationToken,
                        clearIdentity;

                _identity = null;

                isIdentityResolved = function () {
                    return angular.isDefined(_identity);
                };

                isAuthenticated = function () {
                    return _identity !== undefined &&
                            _identity !== null &&
                            _identity.authorizationToken !== undefined &&
                            _identity.authorizationToken !== null;
                };

                isInRole = function (role) {
                    if (!isAuthenticated() || !_identity.userGroups) {
                        return false;
                    }

                    return _identity.userGroups.indexOf(role) !== -1;
                };

                isInAnyRole = function (userGroups) {
                    if (!isAuthenticated() || !_identity.userGroups) {
                        return false;
                    }

                    for (var i = 0; i < userGroups.length; i++) {
                        if (this.isInRole(userGroups[i]))
                            return true;
                    }

                    return false;
                };

                authenticate = function (username, domain, password) {
                    var authorizationToken;
                    authorizationToken = 'Basic ' + base64.encode(username + '@' + domain + ':' + password);
                    return _authenticate(authorizationToken);
                };


                /**
                 * Authenticates a user. On success Returns a promise that resolves to the autenticated identiy
                 * and on failure rejects to the $http response object (e.g. check response.status === 401)
                 * 
                 * @param {type} authorizationToken
                 * @returns {nm$_deferred.exports.promise|nm$_deferred.module.exports.promise|$q@call;defer.promise}
                 */
                _authenticate = function (authorizationToken) {
                    var deferred, requestURL, request;
                    // clear identity
                    _identity = null;

                    //$cookieStore.put(configurationService.authentication.cookie, null);
                    requestURL = configurationService.cidsRestApi.host + '/users';
                    deferred = $q.defer();

                    request = {
                        method: 'GET',
                        url: requestURL,
                        headers: {
                            'Authorization': authorizationToken,
                            'Accept': 'application/json'
                        }
                    };

                    $http(request).then(
                            function successCallback(response) {
                                _identity = response.data;
                                _identity.authorizationToken = authorizationToken;
                                $cookieStore.put(configurationService.authentication.cookie, _identity);
                                deferred.resolve(_identity);
                            },
                            function errorCallback(response) {
                                deferred.reject(response);
                            });

                    return deferred.promise;
                };

                /**
                 * Resolves an identity stored in a cookie. After 1st successfull call to this method, the 
                 * identity is directly resolved from a local variable. Returns a promise that resolves
                 * either to the authenticated identity or null.
                 * 
                 * 
                 * @param {type} checkValidity checks server vor validity
                 * @returns {nm$_deferred.exports.promise|nm$_deferred.module.exports.promise|$q@call;defer.promise}
                 */
                resolveIdentity = function (checkValidity) {

                    // already identicated? 
                    if (isAuthenticated()) {
                        return $q.when(_identity);
                    }

                    _identity = $cookieStore.get(configurationService.authentication.cookie);
                    if (!isAuthenticated()) {
                        // may return null or empty object 
                        console.warn("no stored session cookie available, user has to re-authenticate");
                        return $q.when(_identity);
                    }

                    if (checkValidity) {
                        // check if authenticated identity is still valid!
                        return _authenticate(_identity.authorizationToken);
                    } else {
                        return $q.when(_identity);
                    }
                };

                getIdentity = function () {
                    return _identity;
                };

                getAuthorizationToken = function () {
                    return isAuthenticated() ? _identity.authorizationToken : null;
                };

                clearIdentity = function () {
                    _identity = null;
                    $cookieStore.put(configurationService.authentication.cookie, null);
                };

                resolveIdentity();

                return {
                    isIdentityResolved: isIdentityResolved,
                    isAuthenticated: isAuthenticated,
                    isInRole: isInRole,
                    isInAnyRole: isInAnyRole,
                    authenticate: authenticate,
                    resolveIdentity: resolveIdentity,
                    getIdentity: getIdentity,
                    getAuthorizationToken: getAuthorizationToken,
                    clearIdentity: clearIdentity
                };
            }
        ]).factory('base64', function () {
    /* jshint ignore:start */
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                console.error("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
    };
    /* jshint ignore:end */
});

angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        )
// autorisationService service's purpose is to wrap up authorize functionality
// it basically just checks to see if the authenticationService is authenticated and checks the root state 
// to see if there is a state that needs to be authorized. if so, it does a role check.
// this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
// route, the app resolves your identity before it does an authorize check. after that,
// authorize is called from $stateChangeStart to make sure the authenticationService is allowed to change to
// the desired state
        .factory('autorisationService', ['$rootScope', '$state', '$previousState', 'authenticationService',
            function ($rootScope, $state, $previousState, authenticationService) {
                'use strict';
                return {
                    authorize: function () {
                        return authenticationService.identity()
                                .then(function () {
                                    var isAuthenticated = authenticationService.isAuthenticated();

                                    if ($rootScope.toState.data.roles && 
                                            $rootScope.toState.data.roles.length > 0 && 
                                            !authenticationService.isInAnyRole($rootScope.toState.data.roles)) {
                                        if (isAuthenticated) {
                                            console.warn('user is not in any role');
                                            $previousState.memo('autorisation');
                                            //$state.go('accessdenied'); // user is signed in but not authorized for desired state
                                        } else {
                                            // user is not authenticated. stow the state they wanted before you
                                            // send them to the signin state, so you can return them when you're done
                                            $previousState.memo('autorisation');

                                            // now, send them to the signin state so they can log in
                                            $state.go('signin');
                                        }
                                    }
                                });
                    }
                };
            }
        ]);

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
/*jshint sub:true*/

angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('configurationService',
        [function () {
                'use strict';

                var configurationService, austriaBasemapLayer, esriTopographicBasemapLayer, osmBasemapLayer,
                        openTopoBasemapLayer, borisFeatureGroup, eprtrFeatureGroup,
                        mossFeatureGroup, wagwFeatureGroup, waowFeatureGroup, basemapLayers,
                        overlayLayers, overlays;

                configurationService = this;
                
                configurationService.developmentMode = true;
                
                configurationService.cidsRestApi = {};
                configurationService.cidsRestApi.host = 'http://localhost:8890';
                configurationService.cidsRestApi.domain = 'UDM2020-DI';
                configurationService.cidsRestApi.defaultRestApiSearch = 'de.cismet.cids.custom.udm2020di.serversearch.DefaultRestApiSearch';
                //configurationService.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //configurationService.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                configurationService.authentication = {};
                configurationService.authentication.domain = configurationService.cidsRestApi.domain;
                configurationService.authentication.username = 'uba';
                configurationService.authentication.password = '';
                configurationService.authentication.cookie = 'de.cismet.uim2020-html5-demonstrator.identity';

                

                configurationService.searchService = {};
                configurationService.searchService.defautLimit = 10;
                configurationService.searchService.maxLimit = 50;
                configurationService.searchService.host = configurationService.cidsRestApi.host;


                configurationService.map = {};

                configurationService.map.options = {};
                configurationService.map.options.centerOnSearchGeometry = true;
                configurationService.map.options.preserveZoomOnCenter = false;

                configurationService.map.home = {};
                configurationService.map.home.lat = 47.61;
                configurationService.map.home.lng = 13.782778;
                configurationService.map.home.zoom = 7;
                configurationService.map.maxBounds = new L.latLngBounds(
                        L.latLng(46.372299, 9.53079),
                        L.latLng(49.02071, 17.160749));

                configurationService.map.defaults = {
                    minZoom: 7,
                    //maxZoom: 18,
                    maxBounds: configurationService.map.maxBounds,
                    /*path: {
                     weight: 10,
                     color: '#800000',
                     opacity: 1
                     },*/
                    controls: {
                        layers: {
                            visible: false,
                            position: 'bottomright',
                            collapsed: true
                        }
                    }
                    //tileLayer: '' // if disabled, Leflet will *always* request OSM BG Layer (useful for  Verwaltungsgrundkarte)
                };

                /* jshint ignore:start */
                configurationService.map.layerControlOptions = {
                    container_width: '300px',
                    container_height: '600px',
                    container_maxHeight: '600px',
                    //group_maxHeight: '300px',
                    exclusive: false
                };
                /* jshint ignore:end */

                configurationService.map.layerGroupMappings = {
                    'basemaps': 'Grundkarten',
                    'nodes': 'Themen',
                    'gazetteer': 'Aktueller Ort',
                    'external': 'Externe Datenquellen'
                };

                configurationService.map.layerMappings = {
                    'basemap_at': 'Verwaltungsgrundkarte',
                    'arcgisonline_com': 'ArcGIS Topographic',
                    'opentopomap_org': 'OpenTopoMap',
                    'openstreetmap_org': 'OpenStreetMap',
                    'BORIS_SITE': 'Bodenmesstellen',
                    'EPRTR_INSTALLATION': 'ePRTR Einrichtungen',
                    'MOSS': 'Moose',
                    'WAOW_STATION': 'Wassermesstellen',
                    'WAGW_STATION': 'Grundwassermesstellen'
                };

                configurationService.map.defaultBasemapLayer = 'Verwaltungsgrundkarte';

                austriaBasemapLayer = new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>'
                });
                austriaBasemapLayer.$name = configurationService.map.layerMappings['basemap_at'];
                austriaBasemapLayer.$key = 'basemap_at';
                austriaBasemapLayer.$groupName = 'Grundkarten';
                austriaBasemapLayer.$groupKey = 'basemaps';

                esriTopographicBasemapLayer = L.esri.basemapLayer('Topographic');
                esriTopographicBasemapLayer.$name = configurationService.map.layerMappings['arcgisonline_com'];
                esriTopographicBasemapLayer.$key = 'arcgisonline_com';
                esriTopographicBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                esriTopographicBasemapLayer.$groupKey = 'basemaps';

                //'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                openTopoBasemapLayer = new L.TileLayer(
                        'http://opentopomap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                        });
                openTopoBasemapLayer.$name = configurationService.map.layerMappings['opentopomap_org'];
                openTopoBasemapLayer.$key = 'opentopomap_org';
                openTopoBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                openTopoBasemapLayer.$groupKey = 'basemaps';

                osmBasemapLayer = new L.TileLayer(
                        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                        });
                osmBasemapLayer.$name = configurationService.map.layerMappings['openstreetmap_org'];
                osmBasemapLayer.$key = 'openstreetmap_org';
                osmBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                osmBasemapLayer.$groupKey = 'basemaps';

                basemapLayers = {};
                basemapLayers[configurationService.map.layerMappings['basemap_at']] = austriaBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['arcgisonline_com']] = esriTopographicBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['opentopomap_org']] = openTopoBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['openstreetmap_org']] = osmBasemapLayer;

                /**
                 * styledLayerControl baseMaps!
                 */
                configurationService.map.basemaps = [
                    {
                        groupName: configurationService.map.layerGroupMappings['basemaps'],
                        expanded: true,
                        layers: basemapLayers
                    }
                ];

                borisFeatureGroup = new L.FeatureGroup();
                borisFeatureGroup.$name = configurationService.map.layerMappings['BORIS_SITE'];
                borisFeatureGroup.$key = 'BORIS_SITE';
                borisFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                borisFeatureGroup.$groupKey = 'nodes';
                borisFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                eprtrFeatureGroup = new L.FeatureGroup();
                eprtrFeatureGroup.$name = configurationService.map.layerMappings['EPRTR_INSTALLATION'];
                eprtrFeatureGroup.$key = 'EPRTR_INSTALLATION';
                eprtrFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                eprtrFeatureGroup.$groupKey = 'nodes';
                eprtrFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                mossFeatureGroup = new L.FeatureGroup();
                mossFeatureGroup.$name = configurationService.map.layerMappings['MOSS'];
                mossFeatureGroup.$key = 'MOSS';
                mossFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                mossFeatureGroup.$groupKey = 'nodes';
                mossFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                wagwFeatureGroup = new L.FeatureGroup();
                wagwFeatureGroup.$name = configurationService.map.layerMappings['WAGW_STATION'];
                wagwFeatureGroup.$key = 'WAGW_STATION';
                wagwFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                wagwFeatureGroup.$groupKey = 'nodes';
                wagwFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                waowFeatureGroup = new L.FeatureGroup();
                waowFeatureGroup.$name = configurationService.map.layerMappings['WAOW_STATION'];
                waowFeatureGroup.$key = 'WAOW_STATION';
                waowFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                waowFeatureGroup.$groupKey = 'nodes';
                waowFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                overlayLayers = {};
                overlayLayers[configurationService.map.layerMappings['BORIS_SITE']] = borisFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['EPRTR_INSTALLATION']] = eprtrFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['MOSS']] = mossFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['WAGW_STATION']] = wagwFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['WAOW_STATION']] = waowFeatureGroup;

                configurationService.map.nodeOverlays = {
                        groupName: configurationService.map.layerGroupMappings['nodes'],
                        expanded: true,
                        layers: overlayLayers
                    };

                // angular.extend creates a shallow copy!
                // angular.copy creates a deep copy!
                // angular.merge creates a deep copy!
                configurationService.map.searchOverlays = [];angular.merge([],
                        [
                            {
                                groupName: configurationService.map.layerGroupMappings['gazetteer'],
                                expanded: false,
                                layers: {}
                            }
                        ],
                        overlays);

                configurationService.map.analysisOverlays = angular.merge([],
                        overlays,
                        [
                            {
                                groupName: configurationService.map.layerGroupMappings['external'],
                                expanded: false,
                                layers: {}
                            }
                        ]);


                configurationService.map.drawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: {
                            color: '#006d2c',
                            clickable: true
                        },
                        showArea: true,
                        metric: true
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#006d2c',
                            clickable: true
                        },
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };


                configurationService.map.fitBoundsOptions = {
                    animate: true,
                    pan: {animate: true, duration: 0.6},
                    zoom: {animate: true},
                    maxZoom: null
                };

                configurationService.featureRenderer = {};
                configurationService.featureRenderer.gazetteerStyle = {
                    color: '#8856a7',
                    fillColor: '#feb24c',
                    fillOpacity: 0.3,
                    fill: true,
                    weight: 4,
                    riseOnHover: false,
                    clickable: false
                };
                configurationService.featureRenderer.defaultStyle = {
                    color: '#0000FF',
                    fill: false,
                    weight: 2,
                    riseOnHover: true,
                    clickable: false
                };
                configurationService.featureRenderer.highlightStyle = {
                    fillOpacity: 0.4,
                    fill: true,
                    fillColor: '#1589FF',
                    riseOnHover: true,
                    clickable: false
                };

                configurationService.featureRenderer.icons = {};
                configurationService.featureRenderer.icons.BORIS_SITE = L.icon({
                    iconUrl: 'icons/showel_16.png',
                    iconSize: [16, 16]
                });
                configurationService.featureRenderer.icons.WAGW_STATION = L.icon({
                    iconUrl: 'icons/wagw_16.png',
                    iconSize: [16, 16]
                });
                configurationService.featureRenderer.icons.WAOW_STATION = L.icon({
                    iconUrl: 'icons/waow_16.png',
                    iconSize: [16, 16]
                });
                configurationService.featureRenderer.icons.EPRTR_INSTALLATION = L.icon({
                    iconUrl: 'icons/factory_16.png',
                    iconSize: [16, 16]
                });
                configurationService.featureRenderer.icons.MOSS = L.icon({
                    iconUrl: 'icons/grass_16.png',
                    iconSize: [16, 16]
                });

                configurationService.featureRenderer.layergroupNames = {};
                configurationService.featureRenderer.layergroupNames.MOSS = 'Moose';
                configurationService.featureRenderer.layergroupNames.EPRTR_INSTALLATION = 'ePRTR ePRTR Einrichtungen';
                configurationService.featureRenderer.layergroupNames.WAOW_STATION = 'Wassermesstellen';
                configurationService.featureRenderer.layergroupNames.WAGW_STATION = 'Grundwassermesstellen';
                configurationService.featureRenderer.layergroupNames.BORIS_SITE = 'Bodenmesstellen';


                configurationService.multiselect = {};
                configurationService.multiselect.settings = {
                    styleActive: true,
                    displayProp: 'name',
                    idProp: 'id',
                    buttonClasses: 'btn btn-default navbar-btn cs-search-multiselect'
                };
                configurationService.multiselect.translationTexts = {
                    checkAll: 'Alles auswählen',
                    uncheckAll: 'Alles abwählen',
                    enableSearch: 'Suche aktivieren',
                    disableSearch: 'Suche deaktivieren',
                    selectionCount: ' ausgewählt',
                    selectionOf: ' von ',
                    searchPlaceholder: 'Suche...',
                    buttonDefaultText: 'Auswählen',
                    dynamicButtonTextSuffix: 'ausgewählt',
                    selectGroup: 'Alle auswählen: '
                };
            }]);
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
                        lazyLoadResource, shuffleArray, searchLocations;

                searchLocations = [
                    {
                        name: 'Gesamter Kartenausschnitt',
                        id: 0,
                        geometry: null
                    }, {
                        name: 'Boundingbox Auswahl',
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

                        cachedResources[resourceName] = resource.query();
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
        ).factory('entitiyService',
        ['$resource', '$q', '$interval', 'configurationService', 'authenticationService',
            function ($resource, $q, $interval, configurationService, authenticationService) {
                'use strict';

                var cidsRestApiConfig, entityResource;

                cidsRestApiConfig = configurationService.cidsRestApi;

                entityResource = $resource(
                        cidsRestApiConfig.host + '/' + cidsRestApiConfig.domain + '.:classname/:objId',
                        {
                            omitNullValues: true,
                            deduplicate: true
                        },
                        {
                            get: {
                                method: 'GET',
                                isArray: false,
                                headers: {
                                    'Authorization': authenticationService.getAuthorizationToken()
                                }
                            }
                        }
                );
            }]
        );

/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L, Wkt */

angular.module(
    'de.cismet.uim2020-html5-demonstrator.services'
    ).factory(
    'featureRendererService',
    ['configurationService',
        function (configurationService) {
            'use strict';

            var config, getFeatureRenderer, createNodeFeature,
                createGazetteerLocationLayer, createNodeFeatureGroups,
                createOverlayLayer;

            config = configurationService.featureRenderer;

            // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ===========================">
            /**
             * Helper Method for creating a Feature (Leaflet Marker) from a cids 
             * JSON Node Object
             * 
             * @param {type} node
             * @param {type} theme
             * @returns {featureRendererService_L18.createNodeFeature.feature}
             */
            createNodeFeature = function (node, theme) {
                if (node.hasOwnProperty('cachedGeometry')) {
                    var wktString, wktObject, feature, icon;

                    if (node.cachedGeometry) {
                        icon = config.icons[theme];
                        wktString = node.cachedGeometry;
                        wktObject = new Wkt.Wkt();
                        wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                        // the Leaflet Marker Configuration
                        var objectConfig = {
                            icon: icon,
                            title: node.name
                        };

                        feature = wktObject.toObject(objectConfig);
                        feature.bindPopup(node.name);
                        feature.$name = node.name;
                        feature.$key = node.objectKey;
                        feature.$groupKey = theme;

                        node.$feature = feature;
                        node.$icon = icon.options.iconUrl;

                        return feature;
                    } else {
                        console.warn('no cached geometry for node ' + node.name + ' (' + node.objectKey + ')');
                        return null;
                    }
                }
            };
            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc="=== Public Service API Functions =============================">
            /**
             * Creates a new GazetteerLocationLayer from a gazetteer Location
             * JSON Object (see data/gazetteerLocations.json)
             * 
             * @param {type} gazetteerLocation
             * @returns {featureRendererService_L18.createGazetteerLocationLayer.featureLayer}
             */
            createGazetteerLocationLayer = function (gazetteerLocation) {
                var wktString, wktObject, geometryCollection, featureLayer;
                if (gazetteerLocation.hasOwnProperty('area')) {
                    wktString = gazetteerLocation.area.geo_field;
                    geometryCollection = false;
                } else if (gazetteerLocation.hasOwnProperty('geometry')) {
                    wktString = gazetteerLocation.geometry.geo_field;
                    geometryCollection = true;
                } else {
                    return null;
                }

                wktObject = new Wkt.Wkt();
                wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                if (geometryCollection === true) {
                    featureLayer = wktObject.toObject().getLayers()[0];
                } else {
                    featureLayer = wktObject.toObject();
                }

                featureLayer.setStyle(angular.copy(config.gazetteerStyle));
                featureLayer.$name = gazetteerLocation.name;
                featureLayer.$key = 'gazetteerLocation';

                // not needed atm:
                //gazetteerLocation.$layer = featureLayer;

                return featureLayer;
            };

            /**
             * Creates arrays of Node Features (Markers) from an array of 
             * cids JSON Node objects. Does not create Feature groups directly, 
             * since the respective feature groups (EPRTR, BORIS, ...) are maintained
             * by the StyleLayers Control of the Analysis / Search Map
             * 
             * @param {type} nodes
             * @returns {Array}
             */
            createNodeFeatureGroups = function (nodes) {
                var i, node, theme, feature, featureGroup, featureGroups;
                featureGroups = [];
                for (i = 0; i < nodes.length; ++i) {
                    node = nodes[i];
                    theme = node.classKey.split(".").slice(1, 2).pop();
                    feature = createNodeFeature(node, theme);

                    if (feature) {
                        if (!featureGroups.hasOwnProperty(theme)) {
                            featureGroup = [];
                            featureGroups[theme] = featureGroup;
                        } else {
                            featureGroup = featureGroups[theme];
                        }

                        featureGroup.push(feature);
                    }
                }

                return featureGroups;
            };

            /**
             * 
             * @param {type} buffer
             * @param {type} fileName
             * @returns {undefined}
             * 
             */
            createOverlayLayer = function (localDatasource, geojson, progressCallBack) {
                var i = 0;
                var overlayLayer;

                geojson.fileName = localDatasource.fileName;

                // onEachFeature: Helper Method for GeoJson Features to open a popup dialog for each Feature
                overlayLayer = L.geoJson(geojson, {
                    onEachFeature: function (feature, layer) {
                        if (feature.properties) {
                            layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                                return k + ": " + feature.properties[k];
                            }).join("<br />"), {
                                maxHeight: 200
                            });
                        }

                        if (progressCallBack) {
                            progressCallBack(geojson.features.length, i++);
                        }
                    }

                    /**
                     var promise = $q(function (resolve, reject) {
                     if (feature.properties) {
                     layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                     return k + ": " + feature.properties[k];
                     }).join("<br />"), {
                     maxHeight: 200
                     });
                     }
                     resolve({max: geojson.features.length, current: i++});
                     });
                     
                     if (progressCallBack) {
                     promise.then(function (progress) {
                     progressCallBack(progress.max, progress.current);
                     });
                     }*/

                });

                overlayLayer.$name = localDatasource.name;
                overlayLayer.$key = localDatasource.fileName;
                overlayLayer.$selected = true;
                overlayLayer.StyledLayerControl = {
                    removable: true,
                    visible: false
                };

                localDatasource.$layer = overlayLayer;

                return overlayLayer;
            };



            // </editor-fold>

            // <editor-fold defaultstate="collapsed" desc="=== DISABLED =============================">
            /*
             createNodeFeatureLayers = function (nodes) {
             var i, node, theme, featureGroup, featureRender, featureRenders;
             featureRenders = {};
             for (i = 0; i < nodes.length; ++i) {
             node = nodes[i];
             theme = node.classKey.split(".").slice(1, 2).pop();
             featureRender = createNodeFeatureRenderer(node, theme);
             
             if (featureRender) {
             if (!featureRenders.hasOwnProperty(theme)) {
             featureGroup = new L.FeatureGroup();
             featureGroup.$name = config.layergroupNames[theme];
             featureGroup.$key = theme;
             featureGroup.StyledLayerControl = {
             removable: false,
             visible: false
             };
             featureRenders[theme] = featureGroup;
             } else {
             featureGroup = featureRenders[theme];
             }
             
             featureRender.addTo(featureGroup);
             }
             }
             
             return featureRenders;
             };*/


            //L.marker([51.5, -0.09])

            //defaultStyle = {color: '#0000FF', fill: false, weight: 2, riseOnHover: true, clickable: false};
            //highlightStyle = {fillOpacity: 0.4, fill: true, fillColor: '#1589FF', riseOnHover: true, clickable: false};

            /**
             * Returns a "Feature Renderer" (Leaflet Layer) for a resource.
             * If the resources contains a WMS preview representation a WMS Layer
             * is instantiated and returned, otherwise, the spatialextent (geom)
             * of the resourc eis used.
             *
             * @param {type} obj
             * @returns {L.TileLayer.WMS|featureRendererService_L7.getFeatureRenderer.renderer}
             */
            getFeatureRenderer = function (obj) {
                // this is only an indirection to hide the conrete implementation
                // however, as not specified yet, we hardcode this for now

                var wktString, wktObject, renderer, objectStyle;

                renderer = null;

                // the geo_field property comes from the server so ...  
                // if no preview (WMS layer representation) is found,
                // use the spatial extent
                if (!renderer && obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                    wktString = obj.spatialcoverage.geo_field; // jshint ignore:line
                    wktObject = new Wkt.Wkt();
                    wktObject.read(wktString.substr(wktString.indexOf(';') + 1));
                    objectStyle = Object.create(config.defaultStyle);
                    if (obj.name) {
                        objectStyle.title = obj.name;
                    }
                    renderer = wktObject.toObject(objectStyle);
                    renderer.setStyle(config.defaultStyle);
                }


                if (obj &&
                    obj.$self &&
                    obj.$self.substr(0, 18).toLowerCase() === '/switchon.resource') {
                    if (obj.representation) {
                        obj.representation.every(function (representation) {
                            var capabilities, layername;

                            if (representation.name && representation.contentlocation &&
                                representation.type && representation.type.name === 'aggregated data' &&
                                representation['function'] && representation['function'].name === 'service' &&
                                representation.protocol) {

                                // PRIORITY on TMS!
                                if (representation.protocol.name === 'WWW:TILESERVER') {
                                    renderer = L.tileLayer(representation.contentlocation,
                                        {
                                            // FIXME: make configurable per layer
                                            tms: 'true',
                                            zIndex: 999
                                        });

                                    // unfortunately leaflet does not parse the capabilities, etc, thus no bounds present :(
                                    // todo: resolve performance problems with multipoint / multipolygon!
                                    renderer.getBounds = function () {
                                        // the geo_field property comes from the server so ...  
                                        if (obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                                            wktString = obj.spatialcoverage.geo_field; // jshint ignore:line
                                            wktObject = new Wkt.Wkt();
                                            wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                                            return wktObject.toObject().getBounds();
                                        }
                                    };

                                    // disable the layer by default and show it only when it is selected!
                                    renderer.setOpacity(0.0);
                                    //renderer.bringToBack();
                                } else if (representation.protocol.name === 'OGC:WMS-1.1.1-http-get-capabilities') {
                                    capabilities = representation.contentlocation;
                                    layername = representation.name;
                                    renderer = L.tileLayer.wms(
                                        capabilities,
                                        {
                                            layers: layername,
                                            format: 'image/png',
                                            transparent: true,
                                            version: '1.1.1',
                                            zIndex: 999
                                        }
                                    );

                                    // unfortunately leaflet does not parse the capabilities, etc, thus no bounds present :(
                                    // todo: resolve performance problems with multipoint / multipolygon!
                                    renderer.getBounds = function () {
                                        // the geo_field property comes from the server so ...  
                                        if (obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                                            wktString = obj.spatialcoverage.geo_field; // jshint ignore:line
                                            wktObject = new Wkt.Wkt();
                                            wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                                            return wktObject.toObject().getBounds();
                                        }
                                    };

                                    // disable the layer by default and show it only when it is selected!
                                    renderer.setOpacity(0.0);
                                    //renderer.bringToBack();
                                }
                            }

                            // execute callback function until renderer is found 
                            return renderer === null;
                        });
                    }
                }

                return renderer;
            };

            // </editor-fold>

            return {
                createNodeFeatureGroups: createNodeFeatureGroups,
                createGazetteerLocationLayer: createGazetteerLocationLayer,
                createOverlayLayer: createOverlayLayer,
                defaultStyle: config.defaultStyle,
                highlightStyle: config.highlightStyle
            };
        }
    ]
    );
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global Wkt */

angular.module('de.cismet.uim2020-html5-demonstrator.services')
        .factory('geoTools', 
        ['leafletData',
    function (leafletData) {
            'use strict';
            var wicket, defaultStyle, noDrawOptions, defaultDrawOptions, 
                    readSpatialCoverageFunction, writeSpatialCoverageFunction, 
                    fireResizeFunction;
            
            wicket = new Wkt.Wkt();
            defaultStyle = {color: '#0000FF', fillOpacity: 0.3, weight: 2, fill: true, fillColor: '#1589FF', riseOnHover: true, clickable: true};
            
            defaultDrawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: defaultStyle,
                        showArea: true,
                        metric: true,
                        allowIntersection: false,
                        drawError: {
                            color: '#e1e100', // Color the shape will turn when intersects
                            message: '<strong>Oh snap!<strong> you can\'t draw that!</strong>' // Message that will show when intersect
                        }       
                    },
                    rectangle: {
                        shapeOptions: defaultStyle,
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };
                
            noDrawOptions = { 
                polyline: false,
                polygon: false,
                rectangle: false,
                circle: false,
                marker: false
            };
            
            
            
            readSpatialCoverageFunction = function(dataset) {
                if(dataset.spatialcoverage && dataset.spatialcoverage.geo_field) { // jshint ignore:line
                    var wktString = dataset.spatialcoverage.geo_field; // jshint ignore:line
                    
                    // WKT from REST API contains EPSG definition. 
                    // WKT from data upload tool does not!
                    if(wktString.indexOf(';') !== -1) {
                        wicket.read(wktString.substr(wktString.indexOf(';') + 1));
                    } else {
                        wicket.read(wktString);
                    }
                    var layer = wicket.toObject(defaultStyle);
                    layer.setStyle(defaultStyle);
                    return layer;
                }

                return undefined;
            };
            
            writeSpatialCoverageFunction = function(dataset, wktString) {
                if(wktString && dataset.spatialcoverage) { // jshint ignore:line
                    var wktStringWithSRS = 'SRID=4326;'+wktString;
                    dataset.spatialcoverage.geo_field = wktStringWithSRS; // jshint ignore:line
                }
            };

            fireResizeFunction = function (mapid) {
                leafletData.getMap(mapid).then(function (map) {
                    setTimeout(function(){ map.invalidateSize();}, 50);
                });
            };
            
        
        return {
            wicket:wicket,
            defaultStyle:defaultStyle,
            defaultDrawOptions:defaultDrawOptions,
            noDrawOptions:noDrawOptions,
            readSpatialCoverage:readSpatialCoverageFunction,
            writeSpatialCoverage:writeSpatialCoverageFunction,
            fireResize:fireResizeFunction
        };    
	}]);



/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L, Wkt */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory(
        'objectRendererService',
        ['configurationService',
            function (configurationService) {
                'use strict';
                
                var getObjectIcon;


                getObjectIcon = function (classKey) {
                    return classKey;
                };

                return {
                    getObjectIcon: getObjectIcon
                };
            }
        ]
        );
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
                        {
                            'key': 'geometry', 'value': geometry
                        },
                        {
                            'key': 'themes', 'value': themes
                        },
                        {
                            'key': 'pollutants', 'value': pollutants
                        }
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
                    offset: offset
                },
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

                                        className = curentNode.classKey.split(".").slice(1, 2).pop();

                                        if (configurationService.featureRenderer.icons[className]) {
                                            curentNode.$icon = configurationService.featureRenderer.icons[className].options.iconUrl;
                                        }

                                        // FIXME: extract class name from CS_CLASS description (server-side)
                                        if (configurationService.featureRenderer.layergroupNames[className]) {
                                            className = configurationService.featureRenderer.layergroupNames[className];
                                        }

                                        curentNode.className = className;

                                        if (curentNode.lightweightJson) {

                                            try {
                                                dataObject = angular.fromJson(curentNode.lightweightJson);
                                                curentNode.$data = dataObject;
                                                delete defaultSearchResult.$collection[i].lightweightJson;
                                                // FIXME: extract class name from CS_CLASS description (server-side)
                                                curentNode.className = dataObject.className ?
                                                    dataObject.className : className;
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
        ).service('sharedControllers',
        [function () {
                'use strict';

                this.appController = undefined;
                this.mainController = undefined;
                this.analysisMapController = undefined;
                this.searchController = undefined;
                this.analysisMapController = undefined;
                this.searchMapController = undefined;
                this.searchListController = undefined;
                this.protocolController = undefined;
            }]);
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
        ).service('sharedDatamodel',
        [function () {
                'use strict';

                // auth token
                this.identity = null;
                
                // search selection
                this.selectedSearchThemes = [];
                this.selectedSearchPollutants = [];
                this.selectedGazetteerLocation = {};
                //this.selectedSearchGeometry = {};
                this.selectedSearchLocation = {
                    id:0
                };

                // search results
                this.resultNodes = [];
                this.analysisNodes = [];
                
                // data import
                this.selectedGlobalDatasources = [];
                this.localDatasources = [];
                this.selectedLocalDatasources = [];
                
                this.status = {};
                this.status.type = 'success';
                this.status.message = 'UIM-2020 Demonstrator Datenintegration';
                this.status.progress = {};
                this.status.progress.current = 0;
                this.status.progress.max = 0;  
            }]);