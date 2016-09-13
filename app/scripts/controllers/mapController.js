/*global angular, L */
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

//                mapController.removeOverlay = function (layer) {
//
//                }

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

                    if (nodes !== null && nodes.length > 0) {
                        featureGroups = featureRendererService.createNodeFeatureGroups(nodes);
                        for (theme in featureGroups) {
                            layerControlId = layerControlMappings[theme];
                            if (layerControlId && layerControl._layers[layerControlId] && layerControl._layers[layerControlId].layer) {
                                featureGroup = featureGroups[theme];
                                featureGroupLayer = layerControl._layers[layerControlId].layer;

                                // clear layers on analysis map
                                if (clearLayers) {
                                    featureGroupLayer.clearLayers();
                                }

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

                $scope.$on('gotoLocation()', function (e) {
                    if (mapController.mode === 'search') {
                        console.log('mapController::gotoLocation(' + sharedDatamodel.selectedGazetteerLocation.name + ')');
                        mapController.setGazetteerLocation(sharedDatamodel.selectedGazetteerLocation);
                    }
                });

                $scope.$on('searchSuccess()', function (e) {
                    console.log(mapId + '::searchSuccess()');
                    if (mapController.mode === 'search' && sharedDatamodel.resultNodes.length > 0) {
                        mapController.setNodes(sharedDatamodel.resultNodes);
                    } /*else if (mapController.mode === 'analysis' && sharedDatamodel.analysisNodes.length > 0) {
                     mapController.setNodes(sharedDatamodel.analysisNodes);
                     }*/
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

                // add all to map
                leafletData.getMap(mapId).then(function (map) {

                    leafletMap = map;

                    // add the layers
                    map.addLayer(searchGeometryLayerGroup);

                    if (mapController.mode === 'search') {
                        map.addControl(drawControl);

                        map.on('draw:created', function (event) {
                            setSearchGeometry(event.layer, event.layerType);
                        });

                        map.on('draw:deleted', function (event) {
                            setSearchGeometry(null);
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
