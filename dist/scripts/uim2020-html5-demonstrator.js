/*global angular*/

// main app module registration
var app = angular.module(
        'de.cismet.uim2020-html5-demonstrator',
        [
            'de.cismet.uim2020-html5-demonstrator.controllers',
            'de.cismet.uim2020-html5-demonstrator.directives',
            'de.cismet.uim2020-html5-demonstrator.services',
            'de.cismet.uim2020-html5-demonstrator.filters',
            'ngResource', 'ngAnimate', 'ngSanitize',
            'ui.bootstrap', 'ui.bootstrap.modal',
            'ui.router', 'ui.router.modal',
            'ct.ui.router.extras.sticky', 'ct.ui.router.extras.dsr', 'ct.ui.router.extras.previous',
            'leaflet-directive',
            'ngTable', 'angularjs-dropdown-multiselect',
            'mgo-angular-wizard'
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

                var resolveEntity, showEntityModal;
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
                });

                $stateProvider.state('main.authentication', {
                    url: 'login',
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
                                    console.log('main.search.toolbar instance created');
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
                                    console.log('main.analysis.toolbar instance created');
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
                    modal:true,
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
            function ($rootScope, $state, $stateParams, $previousState, authenticationService) {
                'use strict';
                // It's very handy to add references to $state and $stateParams to the $rootScope
                // so that you can access them from any scope within your applications.For example,
                // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
                // to active whenever 'contacts.list' or one of its decendents is active.
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                //$rootScope.$previousState = $previousState;

                //$rootScope.$on("$stateChangeError", console.log.bind(console));

                $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {

                            if (toState.name !== 'main.authentication') {
                                if ((!authenticationService.isIdentityResolved() &&
                                        !authenticationService.getIdentity()) ||
                                        !authenticationService.isAuthenticated()) {
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
            '$timeout', '$scope', '$state', 'leafletData',
            function ($timeout, $scope, $state, leafletData) {
                'use strict';

                var analysisController;
                analysisController = this;
                
                console.log('analysisController instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'analysis';
                analysisController.mode = 'map';
                
                    $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.analysis") && !$state.is("main.analysis")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        analysisController.mode = $state.current.name.split(".").slice(1, 3).pop();
                        console.log('analysisController::mode: ' + analysisController.mode);
                        
                        // resize the map on stzate change
                        if (analysisController.mode === 'map') {
                            leafletData.getMap('analysis-map').then(function (map) {
                                $timeout(function () {
                                    if (map && map._container.parentElement) {
                                        if (map._container.parentElement.offsetHeight > 0 &&
                                                map._container.parentElement.offsetWidth  > 0) {
                                            $scope.mapHeight = map._container.parentElement.offsetHeight;
                                            $scope.mapWidth = map._container.parentElement.offsetWidth;
                                            console.log('analysisController::stateChangeSuccess new size: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
                                            map.invalidateSize(false);

                                        } else {
                                            console.warn('analysisController::stateChangeSuccess saved size: ' + $scope.mapWidth + "x" + $scope.mapHeight);
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

/*global angular, L */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'appController',
        [
            '$scope',
            '$state',
            '$previousState',
            'configurationService',
            'sharedDatamodel',
            'authenticationService',
            function (
                    $scope,
                    $state,
                    $previousState,
                    configurationService,
                    sharedDatamodel,
                    authenticationService
                    ) {
                'use strict';
                var appController;

                appController = this;

                appController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                appController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
                appController.resultNodes = sharedDatamodel.resultNodes;

                appController.signOut = function () {
                    authenticationService.authenticate(null);
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                };
            }
        ]
        );

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'authenticationController',
        [
            '$scope',
            '$state',
            '$previousState',
            'authenticationService',
            function ($scope, $state, $previousState, authenticationService) {
                'use strict';

                this.signIn = function () {

                    // here, we fake authenticating and give a fake user
                    authenticationService.authenticate({
                        name: 'Test User',
                        roles: ['User']
                    });

                    if ($previousState.get("authentication") && 
                            $previousState.get("authentication").state && 
                            $previousState.get("authentication").state.name !== 'main.authentication') {
                        $previousState.go('authentication');
                    } else {
                        $state.go('main.search.map');
                    }
                };
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
                        $uibModalInstance.dismiss('close');
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

                if (listController.mode === 'search') {
                    listController.nodes = sharedDatamodel.resultNodes;
                } else if (listController.mode === 'analysis') {
                    listController.nodes = sharedDatamodel.analysisNodes;
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
                    count: 10,
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

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mainController',
        ['$scope', '$state', '$previousState', 'sharedDatamodel',
            function ($scope, $state, $previousState, sharedDatamodel) {
                'use strict';

                var mainController;
                mainController = this;

                console.log('mainController::main instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                mainController.mode = $state.current.name.split(".").slice(1, 2).pop();

                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main") && !$state.is("main")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        mainController.mode = $state.current.name.split(".").slice(1, 2).pop();
                        console.log('mainController::mainController.mode: ' + mainController.mode);

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



/*global angular, L */

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
            'featureRendererService',
            function ($scope, $state, $stateParams, leafletData, configurationService,
                    sharedDatamodel, featureRendererService) {
                'use strict';

                var leafletMap, mapId, mapController, config, layerControl, searchGeometryLayerGroup, drawControl,
                        defaults, center, basemaps, overlays, layerControlOptions,
                        drawOptions, maxBounds, setSearchGeometry, gazetteerLocationLayer;

                mapController = this;
                mapController.mode = $scope.mainController.mode;
                mapId = mapController.mode + '-map';

                config = configurationService.map;


                // define Layer groups
                searchGeometryLayerGroup = new L.FeatureGroup();
                gazetteerLocationLayer = null;

                if (mapController.mode === 'search') {
                    mapController.nodes = sharedDatamodel.resultNodes;
                } else if (mapController.mode === 'analysis') {
                    mapController.nodes = sharedDatamodel.analysisNodes;
                }

                defaults = angular.copy(config.defaults);
                center = angular.copy(config.maxBounds);
                maxBounds = angular.copy(config.maxBounds);
                basemaps = angular.copy(config.basemaps);
                overlays = angular.copy(config.overlays);
                layerControlOptions = angular.copy(config.layerControlOptions);
                drawOptions = angular.copy(config.drawOptions);

                // put angular-leaflet config into $scope-soup ...
                angular.extend($scope, {
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

                overlays = angular.extend(config.overlays, {}, [
                    {
                        groupName: "Aktueller Ort",
                        expanded: true,
                        layers: {}
                    },
                    {
                        groupName: "Themen",
                        expanded: true,
                        layers: {}
                    }
                ]);

                // Map Controls
                layerControl = L.Control.styledLayerControl(
                        basemaps,
                        overlays,
                        layerControlOptions);

                drawControl = new L.Control.Draw({
                    draw: drawOptions,
                    /*edit: {
                     featureGroup: searchGeometryLayerGroup
                     }*/
                    edit: false,
                    remove: false
                });

                // add all to map
                leafletData.getMap(mapId).then(function (map) {

                    leafletMap = map;

                    // add the layers
                    map.addLayer(searchGeometryLayerGroup);
                    map.addControl(drawControl);
                    map.addControl(layerControl);

                    // not sure why this is needed altough it is already configured in the map directive
                    map.setMaxBounds(maxBounds);
                    map.setZoom(center.zoom);

                    layerControl.selectLayer(basemaps[0].layers[config.defaultLayer]);

                    map.on('draw:created', function (event) {
                        setSearchGeometry(event.layer, event.layerType);
                    });

                    map.on('draw:deleted', function (event) {
                        setSearchGeometry(null);
                    });

                    // FIXME: GazetteerLocationLayer not removed from control
                    map.on('layerremove', function (layerEvent) {
                        var removedLayer = layerEvent.layer;
                        if (removedLayer && removedLayer === gazetteerLocationLayer) {
                            console.log('mapController::gazetteerLocationLayer removed');
                            //gazetteerLocationLayer = null;
                            //layerControl.removeLayer(gazetteerLocationLayer);
                        }
                    });
                });

                setSearchGeometry = function (searchGeometryLayer, layerType) {
                    searchGeometryLayerGroup.clearLayers();
                    if (searchGeometryLayer !== null) {
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
                };


                ///public API functions

                mapController.gotoNode = function (node) {
                    if (node.feature) {
                        leafletMap.setView(node.feature.getLatLng(), 14 /*leafletMap.getZoom()*/);
                    }
                };


                mapController.setNodes = function (nodes) {
                    var layerGroups, theme, featureLayer;
                    if (nodes !== null && nodes.length > 0) {
                        layerGroups = featureRendererService.createNodeFeatureLayers(nodes);
                        for (theme in layerGroups) {
                            console.log('mapController::setResultNodes for ' + theme);
                            featureLayer = layerGroups[theme];
                            // FIXME: clear layers before adding
                            // FIXME: setVisible to true adds duplicate layers
                            layerControl.addOverlay(
                                    featureLayer,
                                    featureLayer.name, {
                                        groupName: "Themen"
                                    });
                        }

                        //mapController.nodes = nodes;
                    }

                    if (mapController.nodes !== nodes ||
                            mapController.nodes !== sharedDatamodel.resultNodes ||
                            sharedDatamodel.resultNodes !== nodes) {
                        console.error("mapController::nodes reference (t)error!");
                    }
                };

                mapController.setGazetteerLocation = function (gazetteerLocation) {
                    console.log('mapController::setGazetteerLocation');
                    if (gazetteerLocation !== null) {
                        // remove old layer
                        if (gazetteerLocationLayer !== null) {
                            layerControl.removeLayer(gazetteerLocationLayer);
                            gazetteerLocationLayer = null;
                        }

                        gazetteerLocationLayer =
                                featureRendererService.createGazetteerLocationLayer(gazetteerLocation);
                        if (gazetteerLocationLayer !== null) {
                            gazetteerLocationLayer.StyledLayerControl = {
                                removable: false,
                                visible: false
                            };

                            // FIXME: GazetteerLocationLayer added twice!
                            layerControl.addOverlay(
                                    gazetteerLocationLayer,
                                    gazetteerLocation.name, {
                                        groupName: "Aktueller Ort"
                                    });

                            layerControl.selectLayer(gazetteerLocationLayer);

                            leafletData.getMap(mapId).then(function (map) {
                                map.fitBounds(gazetteerLocationLayer.getBounds(), {
                                    animate: true,
                                    pan: {animate: true, duration: 0.6},
                                    zoom: {animate: true},
                                    maxZoom: null
                                });
                            });
                        } else {
                            mapController.setGazetteerLocation(null);
                        }
                    } else if (gazetteerLocationLayer !== null) {
                        layerControl.removeLayer(gazetteerLocationLayer);
                        gazetteerLocationLayer = null;
                    }
                };



                console.log($scope.mainController.mode + ' map controller instance created');


                //mapController.center = $stateParams.center;
                // mapController.zoom = $stateParams.zoom;

                $scope.$on('gotoLocation()', function (e) {
                    if (mapController.mode === 'search') {
                        console.log('mapController::gotoLocation(' + sharedDatamodel.selectedGazetteerLocation.name + ')');
                        mapController.setGazetteerLocation(sharedDatamodel.selectedGazetteerLocation);
                    }
                });

                $scope.$on('searchSuccess()', function (e) {
                    if (mapController.mode === 'search' && sharedDatamodel.resultNodes.length > 0) {
                        mapController.setNodes(sharedDatamodel.resultNodes);
                    } else if (mapController.mode === 'analysis' && sharedDatamodel.analysisNodes.length > 0) {
                        mapController.setNodes(sharedDatamodel.resultNodes);
                    }
                });

                $scope.$watch(function () {
                    // Return the "result" of the watch expression.
                    return(mapController.zoom);
                }, function (newZoom, oldZoom) {
                    //console.log('newZoom:' + newZoom + " = this.zoom:" + mapController.zoom);
                    if (mapController.zoom && newZoom !== oldZoom) {
                        /*$state.go('main.' + $scope.mainController.mode + '.map', {'zoom': mapController.zoom},
                         {'inherit': true, 'notify': false, 'reload': false}).then(
                         function (state)
                         {
                         console.log(state);
                         });*/
                    } /*else {
                     console.log('oldZoom:' + oldZoom + " = this.zoom:" + mapController.zoom);
                     $state.go('main.analysis.map', {'zoom': undefined},
                     {'inherit': true, 'notify': false, 'reload': false}).then(function (state) {
                     console.log(state);
                     });
                     }*/
                });

                // leak this to parent scope
                $scope.$parent.mapController = mapController;
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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'searchController',
        [
            '$window', '$timeout', '$scope', '$state', 'leafletData',
            'configurationService', 'sharedDatamodel', 'dataService',
            function ($window, $timeout, $scope, $state, leafletData,
                    configurationService, sharedDatamodel, dataService) {
                'use strict';

                var searchController, fireResize, mapController;

                searchController = this;

                // Configurations: 
                // <editor-fold defaultstate="collapsed" desc="   - Search Themes Selection Box Configuration">
                searchController.searchThemes = dataService.getSearchThemes();
                searchController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                searchController.searchThemesSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            smartButtonMaxItems: 0,
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

                console.log('searchController instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                searchController.mode = 'map';

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



                searchController.gotoLocation = function () {
                    // TODO: check if paramters are selected ...

                    // check state, activate map if necessary
                    if (searchController.mode !== 'map') {
                        $state.go('^.map'); // will go to the sibling map state.
                        // $state.go('main.search.map');
                    }

                    $scope.$broadcast('gotoLocation()');
                };

                // FIXME: implement Mock Function
                searchController.search = function (mockNodes) {
                    if (!mockNodes) {
                        mockNodes = dataService.getMockNodes();
                    }

                    if (mockNodes.$resolved) {
                        var tmpMockNodes;

                        sharedDatamodel.resultNodes.length = 0;
                        // must use push() or the referenc ein other controllers is destroyed!
                        tmpMockNodes = angular.copy(mockNodes.slice(0, 20));
                        sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, tmpMockNodes);

                        sharedDatamodel.analysisNodes.length = 0;
                        // make a copy -> 2 map instances -> 2 feature instances needed
                        tmpMockNodes = angular.copy(mockNodes.slice(5, 15));
                        sharedDatamodel.analysisNodes.push.apply(sharedDatamodel.analysisNodes, tmpMockNodes);

                        $scope.$broadcast('searchSuccess()');

                        // access controller from child scope leaked into parent scope
                        //$scope.mapController.setNodes(mockNodes.slice(0, 10));
                        //$scope.listController.setNodes(mockNodes.slice(0, 15));


                    } else {
                        mockNodes.$promise.then(function (resolvedMockNodes) {
                            searchController.search(resolvedMockNodes);
                        });
                    }
                };

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

// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.uim2020-html5-demonstrator.services',
    [
        'ngResource'
    ]
);
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory('authenticationService', ['$q', '$http', '$timeout',
    function ($q, $http, $timeout) {
        'use strict';
        var _identity, _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i]))
                        return true;
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;

                // for this demo, we'll store the identity in localStorage. 
                // For you, it could be a cookie, sessionStorage, whatever
                if (identity)
                    localStorage.setItem("de.cismet.uim2020-html5-demonstrator.identity", angular.toJson(identity));
                else
                    localStorage.removeItem("de.cismet.uim2020-html5-demonstrator.identity");
            },
            getIdentity: function (force) {
                //var deferred = $q.defer();

                if (force === true) {
                     _identity = undefined;
                    _authenticated = false;
                    return _identity;
                }
                   

                // check and see if we have retrieved the identity data from the server. 
                // if we have, reuse it by immediately resolving
                
                /*if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }*/
      
 
                // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
                //                   $http.get('/svc/account/identity', { ignoreErrors: true })
                //                        .success(function(data) {
                //                            _identity = data;
                //                            _authenticated = true;
                //                            deferred.resolve(_identity);
                //                        })
                //                        .error(function () {
                //                            _identity = null;
                //                            _authenticated = false;
                //                            deferred.resolve(_identity);
                //                        });

                // for the sake of the demo, we'll attempt to read the identity from localStorage. 
                // the example above might be a way if you use cookies or need to retrieve the latest identity from an api
                // i put it in a timeout to illustrate deferred resolution
                
                /*
                var self = this;
                $timeout(function () {
                    _identity = angular.fromJson(localStorage.getItem("de.cismet.uim2020-html5-demonstrator.identity"));
                    self.authenticate(_identity);
                    deferred.resolve(_identity);
                }, 1000);

                return deferred.promise;
                */
                
                var storage = localStorage.getItem("de.cismet.uim2020-html5-demonstrator.identity");
                if(storage) {
                    _identity = angular.fromJson(storage);
                    _authenticated = true;
                }
                
                
                return _identity;
            }
        };
    }
]);

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
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('configurationService',
        [function () {
                'use strict';

                var layerBasemap, layerTopographic, layerOsm;

                this.cidsRestApi = {};
                this.cidsRestApi.host = 'http://localhost:8890';
                //this.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //this.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                this.searchService = {};
                this.searchService.username = 'admin@SWITCHON';
                this.searchService.password = 'cismet';
                this.searchService.defautLimit = 10;
                this.searchService.maxLimit = 50;
                this.searchService.host = this.cidsRestApi.host;


                this.map = {};

                this.map.options = {};
                this.map.options.centerOnSearchGeometry = true;
                this.map.options.preserveZoomOnCenter = true;

                this.map.home = {};
                this.map.home.lat = 47.61;
                this.map.home.lng = 13.782778;
                this.map.home.zoom = 7;
                this.map.maxBounds = new L.latLngBounds(
                        L.latLng(46.372299, 9.53079),
                        L.latLng(49.02071, 17.160749));

                this.map.defaults = {
                    minZoom: 7,
                    //maxZoom: 18,
                    maxBounds: this.map.maxBounds,
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
                    },
                    //tileLayer: '' // if disabled, Leflet will *always* request OSM BG Layer (useful for  Verwaltungsgrundkarte)
                };

                /* jshint ignore:start */
                this.map.layerControlOptions = {
                    container_width: '300px',
                    container_height: '600px',
                    container_maxHeight: '600px',
                    //group_maxHeight: '300px',
                    exclusive: false
                };
                /* jshint ignore:end */

                this.map.defaultLayer = 'Verwaltungsgrundkarte';


                layerBasemap = new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>'
                });
                layerBasemap.name = 'Verwaltungsgrundkarte';
                layerBasemap.key = 'basemap.at';

                layerTopographic = L.esri.basemapLayer('Topographic');
                layerTopographic.name = 'ArcGIS Topographic';
                layerTopographic.key = 'arcgisonline.com';

                layerOsm = new L.TileLayer(
                        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            id: 'mainmap',
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                        });
                layerOsm.name = 'OpenStreetMap';
                layerOsm.key = 'openstreetmap.org';

                /**
                 * styledLayerControl baseMaps!
                 */
                this.map.basemaps = [
                    {
                        groupName: 'Grundkarten',
                        expanded: true,
                        layers: {
                            'Verwaltungsgrundkarte': layerBasemap,
                            'ArcGIS Topographic': layerTopographic,
                            /*'OpenTopoMap': new L.TileLayer(
                             'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                             id: 'mainmap',
                             attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                             }*/
                            'OpenStreetMap': layerOsm
                        }
                    }
                ];

                this.map.overlays = [];

                this.map.drawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: {
                            color: '#800000',
                            clickable: true
                        },
                        showArea: true,
                        metric: true
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#800000',
                            clickable: true
                        },
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };

                this.featureRenderer = {};
                this.featureRenderer.defaultStyle = {
                    color: '#0000FF',
                    fill: false,
                    weight: 2,
                    riseOnHover: true,
                    clickable: false
                };
                this.featureRenderer.highlightStyle = {
                    fillOpacity: 0.4,
                    fill: true,
                    fillColor: '#1589FF',
                    riseOnHover: true,
                    clickable: false
                };

                this.featureRenderer.icons = {};
                this.featureRenderer.icons.BORIS_SITE = L.icon({
                    iconUrl: 'icons/showel_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.WAGW_STATION = L.icon({
                    iconUrl: 'icons/wagw_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.WAOW_STATION = L.icon({
                    iconUrl: 'icons/waow_16',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.EPRTR_INSTALLATION = L.icon({
                    iconUrl: 'icons/factory_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.MOSS = L.icon({
                    iconUrl: 'icons/grass_16.png',
                    iconSize: [16, 16]
                });

                this.featureRenderer.layergroupNames = {};
                this.featureRenderer.layergroupNames.MOSS = 'Moose';
                this.featureRenderer.layergroupNames.EPRTR_INSTALLATION = 'ePRTR ePRTR Einrichtungen';
                this.featureRenderer.layergroupNames.WAOW_STATION = 'Wassermesstellen';
                this.featureRenderer.layergroupNames.WAGW_STATION = 'Grundwassermesstellen';
                this.featureRenderer.layergroupNames.BORIS_SITE = 'Bodenmesstellen';


                this.multiselect = {};
                this.multiselect.settings = {
                    styleActive: true,
                    displayProp: 'name',
                    idProp: 'classId',
                    buttonClasses: 'btn btn-default navbar-btn cs-search-multiselect'
                };
                this.multiselect.translationTexts = {
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
                        lazyLoadResource, shuffleArray;

                staticResourceFiles = {
                    'searchThemes': 'data/searchThemes.json',
                    'searchPollutants': 'data/searchPollutants.json',
                    'gazetteerLocations': 'data/gazetteerLocations.json',
                    'filterPollutants': 'data/filterPollutants.json',
                    'mockNodes': 'data/resultNodes.json',
                    'mockObjects': 'data/resultObjects.json'
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
                    getSearchThemes: function () {
                        return lazyLoadResource('searchThemes', true);
                    },
                    getSearchPollutants: function () {
                        return lazyLoadResource('searchPollutants', true);
                    },
                    getGazetteerLocations: function () {
                        return lazyLoadResource('gazetteerLocations', true);
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

/*global angular, L, Wkt */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory(
        'featureRendererService',
        ['configurationService',
            function (configurationService) {
                'use strict';

                var config, getFeatureRenderer, createNodeFeatureRenderer,
                        defaultStyle, highlightStyle, createGazetteerLocationLayer, createNodeFeatureLayers;

                config = configurationService.featureRenderer;

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

                    featureLayer.name = gazetteerLocation.name;
                    featureLayer.key = 'gazetteerLocation';
                    return featureLayer;
                };

                createNodeFeatureRenderer = function (node, theme) {
                    if (node.hasOwnProperty('geometry')) {
                        var wktString, wktObject, featureLayer;
                        wktString = node.geometry;
                        wktObject = new Wkt.Wkt();
                        wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                        var objectConfig = {
                            icon: config.icons[theme],
                            title: node.name
                        };

                        featureLayer = wktObject.toObject(objectConfig);
                        featureLayer.name = node.name;
                        featureLayer.key = node.$self;
                        node.feature = featureLayer;
                        return featureLayer;
                    }
                };


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
                                featureGroup.name = config.layergroupNames[theme];
                                featureGroup.key = theme;
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
                };


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
                        objectStyle = Object.create(defaultStyle);
                        if (obj.name) {
                            objectStyle.title = obj.name;
                        }
                        renderer = wktObject.toObject(objectStyle);
                        renderer.setStyle(defaultStyle);
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

                return {
                    createNodeFeatureLayers: createNodeFeatureLayers,
                    createGazetteerLocationLayer: createGazetteerLocationLayer,
                    defaultStyle: defaultStyle,
                    highlightStyle: highlightStyle
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

/*global angular, L */
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('sharedDatamodel',
        [function () {
                'use strict';

                // search selection
                this.selectedSearchThemes = [];
                this.selectedSearchPollutants = [];
                this.selectedGazetteerLocation = {};
                this.selectedSearchGeometry = {};

                //search results
                this.resultNodes = [];
                this.analysisNodes = [];
            }]);