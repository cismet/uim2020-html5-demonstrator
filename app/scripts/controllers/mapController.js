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


                mapController.resultNodes = sharedDatamodel.resultNodes;
                mapController.analysisNodes = sharedDatamodel.analysisNodes;

                if (mapController.mode === 'search') {
                    mapController.nodes = mapController.resultNodes;
                } else if (mapController.mode === 'analysis') {
                    mapController.nodes = mapController.analysisNodes;
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
                    if (node.$feature) {
                        leafletMap.setView(node.$feature.getLatLng(), 14 /*leafletMap.getZoom()*/);
                        node.$feature.togglePopup();
                    }
                };


                mapController.setNodes = function (nodes) {
                    var layerGroups, theme, featureLayer;
                    if (nodes !== null && nodes.length > 0) {
                        layerGroups = featureRendererService.createNodeFeatureLayers(nodes);
                        for (theme in layerGroups) {
                            console.log(mapId+'::setResultNodes for ' + theme);
                            featureLayer = layerGroups[theme];
                            // FIXME: clear layers before adding
                            // FIXME: setVisible to true adds duplicate layers
                            layerControl.addOverlay(
                                    featureLayer,
                                    featureLayer.$name, {
                                        groupName: "Themen"
                                    });
                        }

                        //mapController.nodes = nodes;
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
                                    gazetteerLocationLayer.$name, {
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
                    console.log(mapId+'::searchSuccess()');
                    if (mapController.mode === 'search' && sharedDatamodel.resultNodes.length > 0) {
                        mapController.setNodes(sharedDatamodel.resultNodes);
                    } else if (mapController.mode === 'analysis' && sharedDatamodel.analysisNodes.length > 0) {
                        mapController.setNodes(sharedDatamodel.analysisNodes);
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
