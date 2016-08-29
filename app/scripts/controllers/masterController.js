/*global angular, L */

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
