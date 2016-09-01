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
                                        } /*else {
                                            console.log('oldZoom:' + oldZoom + " = this.zoom:" + _this.zoom);
                                            $state.go('main.analysis.map', {'zoom': undefined},
                                                    {'inherit': true, 'notify': false, 'reload': false}).then(function (state) {
                                                console.log(state);
                                            });
                                        }*/
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
            function ($rootScope, $state, $stateParams, $previousState, authenticationService) {
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

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mapController',
        [
            '$scope',
            function ($scope) {
                'use strict';

                console.log('new mapController instance created from ' + $scope.name);


            }
        ]
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
            'appConfig',
            'authenticationService',
            'leafletData',
            'geoTools',
            function (
                    $scope,
                    $state,
                    $previousState,
                    appConfig,
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
                _this.config = appConfig;
                wicket = geoTools.wicket;
                defaultStyle = geoTools.defaultStyle;
                defaultDrawOptions = geoTools.defaultDrawOptions;
                noDrawOptions = geoTools.noDrawOptions;
                readSpatialCoverage = geoTools.readSpatialCoverage;
                writeSpatialCoverage = geoTools.writeSpatialCoverage;
                fireResize = geoTools.fireResize;
                $scope.mapData = {};
                $scope.mapData.center = _this.config.mapView.home;
                $scope.mapData.defaults = {
                    tileLayer: _this.config.mapView.backgroundLayer,
                    //tileLayerOptions: {noWrap: true},
                    //maxZoom: 14,
                    attributionControl: true,
                    minZoom: _this.config.minZoom,
                    path: defaultStyle

                };
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

// module initialiser for the directives, shall always be named like that so that concat will pick it up first!
// however, the actual directives implementations shall be put in their own files
angular.module(
    'de.cismet.uim2020-html5-demonstrator.directives',
    [
       
    ]
);
/*global angular*/

angular.module(
    'de.cismet.uim2020-html5-demonstrator.directives'
).directive('myDirective',
    [
        function () {
            'use strict';

            return {
                restrict: 'E',
                templateUrl: 'templates/my-directive.html',
                scope: {},
                controller: 'myDirectiveController'
            };
        }
    ]);

angular.module(
    'de.cismet.uim2020-html5-demonstrator.factories',
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

angular.module(
    'de.cismet.uim2020-html5-demonstrator.factories'
).factory('appConfig',
    [function () {
        'use strict'; 

        var appConfig = {};
        
        appConfig.cidsRestApi = {};
        appConfig.cidsRestApi.host = 'http://localhost:8890';
        //appConfig.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
        //appConfig.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = appConfig.cidsRestApi.host;
        
        appConfig.mapView = {};
        appConfig.mapView.backgroundLayer = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        appConfig.mapView.home = {};
        appConfig.mapView.home.lat = 49.245166;
        appConfig.mapView.home.lng = 6.936809;
        appConfig.mapView.home.zoom = 4;
        appConfig.mapView.maxBounds = {};
        appConfig.mapView.maxBounds.southWest = [90, -180]; // top left corner of map
        appConfig.mapView.maxBounds.northEast = [-90, 180];  // bottom right corner  
        appConfig.mapView.minZoom = 2;

        appConfig.gui = {};
        // Development Mode (e.g. enable untested features)
        appConfig.gui.dev = false;

        appConfig.objectInfo = {};
        appConfig.objectInfo.resourceJsonUrl = 'http://' +
        appConfig.searchService.username + ':' +
        appConfig.searchService.password + '@' +
        appConfig.searchService.host.replace(/.*?:\/\//g, '');
        appConfig.objectInfo.resourceXmlUrl = 'http://tl-243.xtr.deltares.nl/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

        appConfig.byod = {};
        //appConfig.byod.baseUrl = 'http://tl-243.xtr.deltares.nl/byod';
        appConfig.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';
        
        appConfig.uploadtool = {};
        appConfig.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        return appConfig;
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

angular.module(
    'de.cismet.uim2020-html5-demonstrator.services'
).factory('configurationService',
    [function () {
        'use strict'; 

        var appConfig = {};
        
        appConfig.cidsRestApi = {};
        appConfig.cidsRestApi.host = 'http://localhost:8890';
        //appConfig.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
        //appConfig.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = appConfig.cidsRestApi.host;
        
        appConfig.mapView = {};
        appConfig.mapView.backgroundLayer = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        appConfig.mapView.home = {};
        appConfig.mapView.home.lat = 49.245166;
        appConfig.mapView.home.lng = 6.936809;
        appConfig.mapView.home.zoom = 4;
        appConfig.mapView.maxBounds = {};
        appConfig.mapView.maxBounds.southWest = [90, -180]; // top left corner of map
        appConfig.mapView.maxBounds.northEast = [-90, 180];  // bottom right corner  
        appConfig.mapView.minZoom = 2;

        appConfig.gui = {};
        // Development Mode (e.g. enable untested features)
        appConfig.gui.dev = false;

        appConfig.objectInfo = {};
        appConfig.objectInfo.resourceJsonUrl = 'http://' +
        appConfig.searchService.username + ':' +
        appConfig.searchService.password + '@' +
        appConfig.searchService.host.replace(/.*?:\/\//g, '');
        appConfig.objectInfo.resourceXmlUrl = 'http://tl-243.xtr.deltares.nl/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

        appConfig.byod = {};
        //appConfig.byod.baseUrl = 'http://tl-243.xtr.deltares.nl/byod';
        appConfig.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';
        
        appConfig.uploadtool = {};
        appConfig.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        return appConfig;
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


