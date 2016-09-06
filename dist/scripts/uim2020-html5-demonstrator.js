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
            'ngTable',
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
            '$scope', 'NgTableParams',
            function ($scope, NgTableParams) {
                'use strict';
                var _this = this;
                var data = [{name: "Moroni", age: 50} /*,*/];
                _this.tableParams = new NgTableParams({}, {dataset: data});
                
                console.log('new listController instance created from ' + $scope.name);
            }
        ]
        );

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mainController',
        ['$scope', '$state', '$previousState',
            function ($scope, $state, $previousState) {
                'use strict';
                
                var mainController;
                mainController = this;
                
                
                console.log('mainController::main instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                mainController.mode =  $state.current.name.split(".").slice(1, 2).pop();


                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main") && !$state.is("main")) {  
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        mainController.mode = $state.current.name.split(".").slice(1, 2).pop();
                        console.log('mainController::mainController.mode: ' +mainController.mode);
                        
                        var previousState = $previousState.get();
                        if(previousState && previousState.state && previousState.state.name) {
                            mainController.previousStateName = previousState.state.name;
                        } else {
                            mainController.previousStateName = undefined;
                        }
                    } else {
                        console.log("mainController::ingoring stateChange '"+ $state.name +"'");
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
            function ($scope, $state, $stateParams, leafletData, configurationService) {
                'use strict';

                var mapController, config, layerControl, searchGroup, drawControl,
                        defaults, center, basemaps, overlays, layerControlOptions,
                        drawOptions, maxBounds;

                mapController = this;

                config = configurationService.map;


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

                layerControl = L.Control.styledLayerControl(
                        basemaps,
                        overlays,
                        layerControlOptions);

                searchGroup = new L.FeatureGroup();

                drawControl = new L.Control.Draw({
                    draw: drawOptions,
                    edit: {
                        featureGroup: searchGroup
                    }
                });

                leafletData.getMap($scope.mainController.mode + "-map").then(function (map) {

                    map.addLayer(searchGroup);
                    map.addControl(drawControl);
                    map.addControl(layerControl);

                    // not sure why this is needed altough it is already configured in the map directive
                    map.setMaxBounds(maxBounds);
                    map.setZoom(center.zoom);

                    //layerControl.selectLayer(basemaps[0].layers[config.defaultLayer]);


                    map.on('draw:created', function (event) {
                        //setSearchGeom(event.layer);
                    });

                    map.on('draw:deleted', function (event) {
                        event.layers.eachLayer(function (layer) {
                            if (layer === $scope.searchGeomLayer) {
                                //setSearchGeom(null);
                            }
                        });
                    });
                });

                console.log($scope.mainController.mode + ' map controller instance created');


                //mapController.center = $stateParams.center;
                // mapController.zoom = $stateParams.zoom;


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
            }]
        );

/*global angular, L */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'masterController',
        [
            '$scope',
            '$state',
            '$previousState',
            'configurationService',
            'authenticationService',
            'leafletData',
            'geoTools',
            function (
                    $scope,
                    $state,
                    $previousState,
                    configurationService,
                    authenticationService,
                    leafletData,
                    geoTools
                    ) {
                'use strict';
                var _this, config, fireResize, southWest, northEast, maxBounds,
                        drawControls, layerGroup, wicket, defaultStyle, defaultDrawOptions,
                        noDrawOptions, writeSpatialCoverage,
                        readSpatialCoverage, drawControlsEnabled, shpfile;
                _this = this;
                _this.config = configurationService;
                wicket = geoTools.wicket;
                defaultStyle = geoTools.defaultStyle;
                defaultDrawOptions = geoTools.defaultDrawOptions;
                noDrawOptions = geoTools.noDrawOptions;
                readSpatialCoverage = geoTools.readSpatialCoverage;
                writeSpatialCoverage = geoTools.writeSpatialCoverage;
                fireResize = geoTools.fireResize;
                
                //draw control initialisation
                layerGroup = new L.FeatureGroup();
                drawControls = new L.Control.Draw({
                    draw: defaultDrawOptions,
                    edit: {
                        featureGroup: layerGroup
                    }
                });
                drawControlsEnabled = true;


                _this.signOut = function() {
                    authenticationService.authenticate(null);
                    $state.go('main.authentication');
                    $previousState.memo('authentication');
                  };

                leafletData.getMap('mainmap').then(function (map) {
                    map.addLayer(layerGroup);
                    map.addControl(drawControls);
                    map.on('draw:created', function (event) {
                        //console.log(event.layerType + ' created'); 
                        layerGroup.clearLayers();
                        layerGroup.addLayer(event.layer);
                        //wicket.fromObject(event.layer);
                        // _this.contentLocation = {};
                        // _this.contentLocation.name = 'New ' + event.layerType;
                        //_this.contentLocation.type = event.layerType;
                        //_this.contentLocation.layer = event.layer;
                        //_this.contentLocation.wkt = wicket.write();

                    });
                    map.on('draw:edited', function () {
                        //console.log(event.layers.getLayers().length + ' edited'); 
                        //layerGroup.addLayer(event.layers.getLayers()[0]);

                        //wicket.fromObject(event.layers.getLayers()[0]);
                        // _this.contentLocation = Object.create(_this.contentLocation);
                        //  if(_this.contentLocation.name.indexOf('(edited)') === -1) {
                        //      _this.contentLocation.name += ' (edited)';
                        //  }
                        //_this.contentLocation.layer = event.layers.getLayers()[0];
                        //_this.contentLocation.wkt = wicket.write();
                    });
                    map.on('draw:deleted', function (event) {
                        console.log(event.layers.getLayers().length + ' deleted');
                        layerGroup.clearLayers();
                        //   _this.contentLocation = null;
                    });
                });
                var url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3dtIiwiYSI6InFoYkpvS00ifQ.WHqQ_q865NKjIQB6Wpoi2w';

                var attributionText = '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
                var optionsObject = {
                    attribution: attributionText};
                var mq = L.tileLayer(url, optionsObject);
                var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                });


//                var boundaries = new L.WFS({
//                    url: 'http://demo.opengeo.org/geoserver/ows',
//                    typeNS: 'topp',
//                    typeName: 'tasmania_state_boundaries',
//                    crs: L.CRS.EPSG4326,
//                    geometryField: 'the_geom',
//                    style: {
//                        color: 'blue',
//                        weight: 2
//                    },
//                    showExisting: false
//                });
//
//                var roads = new L.WFS({
//                    url: 'http://demo.opengeo.org/geoserver/ows',
//                    typeNS: 'topp',
//                    typeName: 'tasmania_cities',
//                    crs: L.CRS.EPSG4326,
//                    geometryField: 'the_geom',
//                    style: {
//                        color: 'black',
//                        weight: 1
//                    },
//                    showExisting: false
//                });
//
//                var cities = new L.WFS({
//                    url: 'https://secure.umweltbundesamt.at/spatial-r/services/public/clc/MapServer/WFSServer?',
//                    crs: L.CRS.EPSG4326,
//                    geometryField: 'the_geom',
//                    showExisting: true
//                });

                leafletData.getMap('mainmap').then(function (map) {
                    //boundaries.addTo(map);
                    //cities.addTo(map);
                    //roads.addTo(map);

                    $scope.map = map;

//                    var i = 0;
//                map.eachLayer(function (layer) {
//                   if(layer) {
//                       $scope['layer'+i] = layer;
//                       i++;
//                   }
//                });

                });

                var overlays = {
                    "DRAW": layerGroup
                            // "CLC": roads,
                            // "Wassermessstellen": cities,
                            // "ePRTR Emittenten": boundaries
                };
                var lc = L.control.layers({
                    "ESRI StreetMap": watercolor,
                    "OpenTopoMap": mq
                }, overlays);
                leafletData.getMap('mainmap').then(function (m) {
                    lc.addTo(m);
                });

                leafletData.getMap('mainmap').then(function (m) {
                    m.setView([42.09618442380296, -71.5045166015625], 8);
                    var watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
                        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
                    }).addTo(m);
                    shpfile = new L.Shapefile('bower_components/leaflet-shapefile/congress.zip', {
                        onEachFeature: function (feature, layer) {
                            if (feature.properties) {
                                layer.bindPopup(Object.keys(feature.properties).map(function (k) {
                                    return k + ": " + feature.properties[k];
                                }).join("<br />uiui"), {
                                    maxHeight: 200
                                });
                            }


                        }
                    });
                    shpfile.addTo(m);
                    shpfile.once("data:loaded", function () {
                        //    console.log("finished loaded shapefile: " + JSON.stringify(shpfile.toGeoJSON()));
                    });



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

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'searchController',
        [
            '$window', '$timeout', '$scope', '$state', 'leafletData',
            function ($window, $timeout, $scope, $state, leafletData) {
                'use strict';

                var searchController, fireResize;
                searchController = this;

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




                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.search") && !$state.is("main.search")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        searchController.mode = $state.current.name.split(".").slice(1, 3).pop();
                        //console.log('searchController::mode: ' + searchController.mode);
                        
                        // resize the map on stzate change
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
        ).factory('configurationService',
        [function () {
                'use strict';

                var config = {};

                config.cidsRestApi = {};
                config.cidsRestApi.host = 'http://localhost:8890';
                //config.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //config.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                config.searchService = {};
                config.searchService.username = 'admin@SWITCHON';
                config.searchService.password = 'cismet';
                config.searchService.defautLimit = 10;
                config.searchService.maxLimit = 50;
                config.searchService.host = config.cidsRestApi.host;

                config.map = {};

                config.map.home = {};
                config.map.home.lat = 47.61;
                config.map.home.lng = 13.782778;
                config.map.home.zoom = 7;
                config.map.maxBounds = new L.latLngBounds(
                        L.latLng(46.372299, 9.53079),
                        L.latLng(49.02071, 17.160749));

                config.map.defaults = {
                    minZoom: 7,
                    //maxZoom: 18,
                    maxBounds: config.map.maxBounds,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    },
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
                config.map.layerControlOptions = {
                    container_width: '300px',
                    container_maxHeight: '350px',
                    group_maxHeight: '300px',
                    exclusive: true
                };
                /* jshint ignore:end */

                config.map.defaultLayer = 'Verwaltungsgrundkarte';
                /**
                 * styledLayerControl baseMaps!
                 */
                config.map.basemaps = [
                    {
                        groupName: 'Grundkarten',
                        expanded: true,
                        layers: {
                            'Verwaltungsgrundkarte': new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                                subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                                attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>'
                            }),
                            'ArcGIS Topographic': L.esri.basemapLayer('Topographic'),
                            /*'OpenTopoMap': new L.TileLayer(
                             'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                             id: 'mainmap',
                             attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                             }*/
                            'OpenStreetMap': new L.TileLayer(
                                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        id: 'mainmap',
                                        attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                                    })

                        }
                    }
                ];

                config.map.overlays = [];

                config.map.drawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: {
                            color: '#800000'
                        },
                        showArea: true,
                        metric: true
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#800000',
                            clickable: false
                        },
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };


                config.gui = {};
                // Development Mode (e.g. enable untested features)
                config.gui.dev = false;

                config.objectInfo = {};
                config.objectInfo.resourceJsonUrl = 'http://' +
                        config.searchService.username + ':' +
                        config.searchService.password + '@' +
                        config.searchService.host.replace(/.*?:\/\//g, '');
                config.objectInfo.resourceXmlUrl = 'http://tl-243.xtr.deltares.nl/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

                config.byod = {};
                //config.byod.baseUrl = 'http://tl-243.xtr.deltares.nl/byod';
                config.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';

                config.uploadtool = {};
                config.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';

                return config;
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


