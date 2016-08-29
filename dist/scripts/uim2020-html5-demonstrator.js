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
angular.module(
    'de.cismet.uim2020-html5-demonstrator.controllers',
    [
         
    ]
);
/* global L */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'masterController',
        [
            '$scope',
            'appConfig',
            'leafletData',
            'geoTools',
            function (
                    $scope,
                    appConfig,
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

angular.module(
    'de.cismet.uim2020-html5-demonstrator.controllers'
).controller(
    'myDirectiveController',
    [
        '$scope',
        'myService',
        function ($scope, MyService) {
            'use strict';
            
            $scope.description = 'The \'scripts/controllers\' folder contains the actual controllers that will automagically be processed during build.';
            $scope.info = MyService.tellMe();
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



angular.module(
    'de.cismet.uim2020-html5-demonstrator.services'
).factory('myService',
    [
        function () {
            'use strict';

            return {
                tellMe: function () { 
                    return 'The \'scripts/services\' folder contains the actual services that will automagically be processed during build.'; 
                }
            };
        }
    ]);
