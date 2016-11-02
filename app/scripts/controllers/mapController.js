/*global angular, L, Wkt */
/*jshint sub:true*/

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mapController',
        ['$scope',
            '$timeout',
            'leafletData',
            'configurationService',
            'sharedDatamodel',
            'sharedControllers',
            'featureRendererService',
            function ($scope, $timeout, leafletData, configurationService,
                    sharedDatamodel, sharedControllers, featureRendererService) {
                'use strict';

                var leafletMap, mapId, mapController, config, layerControl, searchGeometryLayerGroup, drawControl,
                        defaults, center, basemaps, overlays, layerControlOptions,
                        drawOptions, maxBounds, setSearchGeometry, gazetteerLocationLayer, layerControlMappings,
                        overlaysNodeLayersIndex, fitBoundsOptions, selectedNode, selectNode, featureLayersWithZoomRestriction,
                        nodeOverlays, setSearchGeometryFromGazetteerLocationLayer;

                mapController = this;
                mapController.mode = $scope.mainController.mode;
                mapId = mapController.mode + '-map';

                config = configurationService.map;

                // define Layer groups
                searchGeometryLayerGroup = new L.FeatureGroup();
                searchGeometryLayerGroup.$name = 'Suchgeometrien';
                searchGeometryLayerGroup.$key = 'searchGeometries';
                gazetteerLocationLayer = null;

                featureLayersWithZoomRestriction = [];
                overlays = [];
                defaults = angular.copy(config.defaults);
                center = angular.copy(config.maxBounds);
                maxBounds = angular.copy(config.maxBounds);
                basemaps = angular.copy(config.basemaps);
                layerControlOptions = angular.copy(config.layerControlOptions);
                drawOptions = angular.copy(config.drawOptions);
                fitBoundsOptions = angular.copy(config.fitBoundsOptions);

                selectedNode = null;
                nodeOverlays = angular.copy(config.nodeOverlays);

                if (mapController.mode === 'search') {
                    mapController.nodes = sharedDatamodel.resultNodes;

                    overlays.push({
                        groupName: configurationService.map.layerGroupMappings['gazetteer'],
                        expanded: false,
                        layers: {}
                    });

                    overlays.push(nodeOverlays);
                    overlaysNodeLayersIndex = 1; // after gazetteer layer ....

                    // drawControl only available in search mode
                    drawControl = new L.Control.Draw({
                        draw: drawOptions,
                        edit: {
                            featureGroup: searchGeometryLayerGroup,
                            remove: false, // disable removal
                            buffer: {
                                replace_polylines: false, // why false? because true does not work !!??!!
                                separate_buffer: false,
                                buffer_style: drawOptions.polygon.shapeOptions
                            }
                        }
                    });
                } else if (mapController.mode === 'analysis') {
                    mapController.nodes = sharedDatamodel.analysisNodes;

                    overlays.push(nodeOverlays);
                    overlays.push({
                        groupName: configurationService.map.layerGroupMappings['external'],
                        expanded: false,
                        layers: {}
                    });
                    overlaysNodeLayersIndex = 0; // before external layers ....
                }

                // TODO: iterate properties
                if (overlays[overlaysNodeLayersIndex].layers[config.layerMappings['BORIS_SITE']].$maxZoom) {
                    featureLayersWithZoomRestriction.push(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['BORIS_SITE']]);
                }
                if (overlays[overlaysNodeLayersIndex].layers[config.layerMappings['EPRTR_INSTALLATION']].$maxZoom) {
                    featureLayersWithZoomRestriction.push(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['EPRTR_INSTALLATION']]);
                }
                if (overlays[overlaysNodeLayersIndex].layers[config.layerMappings['MOSS']].$maxZoom) {
                    featureLayersWithZoomRestriction.push(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['MOSS']]);
                }
                if (overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAGW_STATION']].$maxZoom) {
                    featureLayersWithZoomRestriction.push(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAGW_STATION']]);
                }
                if (overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAOW_STATION']].$maxZoom) {
                    featureLayersWithZoomRestriction.push(overlays[overlaysNodeLayersIndex].layers[config.layerMappings['WAOW_STATION']]);
                }

                // TODO: iterate overlays!
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
                    }
                });

                // Map Controls
                layerControl = L.Control.styledLayerControl(
                        basemaps,
                        overlays,
                        layerControlOptions);

                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ===========================">

                /**
                 * Select a node in the map and changes the feature icon
                 * 
                 * @param {type} node
                 * @returns {execPath|require.main.filename|String}
                 */
                selectNode = function (node) {
                    var icon;
                    //console.log(mapController.mode + '-map::selectNode() -> ' + node.name);
                    // reset selection
                    if (selectedNode !== node && selectedNode !== null && selectedNode.$feature) {
                        icon = featureRendererService.getIconForNode(selectedNode);
                        selectedNode.$feature.setIcon(icon);
                    }

                    if (node.$feature) {
                        selectedNode = node;

                        // highlight only visible features!
                        //if (!node.$feature.$hidden) {
                        icon = featureRendererService.getHighlightIconForNode(selectedNode);
                        selectedNode.$feature.setIcon(icon);
                        //}

                        if (node.$feature.$hidden) {
                            selectedNode.$feature.setOpacity(0);
                        }

                    } else {
                        selectedNode = null;
                    }

                    return selectedNode;
                };

                setSearchGeometryFromGazetteerLocationLayer = function () {
                    if (gazetteerLocationLayer !== null) {
                        var searchGeometryLayer = gazetteerLocationLayer;
                        gazetteerLocationLayer.closePopup();
                        gazetteerLocationLayer.unbindPopup();
                        layerControl.removeLayer(gazetteerLocationLayer);
                        leafletMap.removeLayer(gazetteerLocationLayer);
                        gazetteerLocationLayer = null;

                        searchGeometryLayer.setStyle(drawOptions.polygon.shapeOptions);
                        setSearchGeometry(searchGeometryLayer, 'polygon');

                    } else {
                        console.warn('setSearchGeometryFromGazetteerLocationLayer: no gazetteerLocationLayer available!');
                    }
                };

                /**
                 * Sets the search geometry
                 * 
                 * @param {type} searchGeometryLayer
                 * @param {type} layerType
                 * @returns {undefined}
                 */
                setSearchGeometry = function (searchGeometryLayer, layerType) {
                    if (mapController.mode === 'search') {
                        searchGeometryLayerGroup.clearLayers();
                        if (searchGeometryLayer !== null) {
                            //console.log('setSearchGeometry: ' + layerType);

                            searchGeometryLayer.$name = layerType;
                            searchGeometryLayer.$key = 'searchGeometry';
                            searchGeometryLayerGroup.addLayer(searchGeometryLayer);

                            if (config.options.centerOnSearchGeometry && searchGeometryLayerGroup.getBounds()) {
                                leafletData.getMap(mapId).then(function (map) {
                                    map.fitBounds(searchGeometryLayerGroup.getBounds(), {
                                        animate: true,
                                        pan: {animate: true, duration: 0.6},
                                        zoom: {animate: true},
                                        maxZoom: config.options.preserveZoomOnCenter ? map.getZoom() : null
                                    });
                                });
                            }

                            sharedDatamodel.selectedSearchLocation.id = 1;
                        } else {
                            // ignore
                            // console.warn("mapController:: cannot add empty search geometry layer!");
                        }
                    } else {
                        console.warn("mapController:: cannot add search geometry to analysis map!");
                    }
                };
                //<editor-fold/>

                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">


                /**
                 * Activate the map and set correct size
                 * 
                 * @returns {undefined}
                 */
                mapController.activate = function () {
                    $timeout(function () {
                        if (leafletMap._container && leafletMap._container.parentElement) {
                            var height = leafletMap._container.parentElement.offsetHeight;
                            var width = leafletMap._container.parentElement.offsetWidth;

                            if ((height > 0 && height !== $scope.mapHeight) ||
                                    (width > 0 && width !== $scope.mapWidth)) {
                                $scope.mapHeight = height;
                                $scope.mapWidth = width;

                                console.log(mapController.mode + '-map::activate new size: ' + width + "x" + height);
                                leafletMap.invalidateSize(false);
                            }
                        }
                        //}
                    }, 100);
                };

                /**
                 * Returns the current search location wkt. If no search bbox or polygon
                 * is drawn, retuns the map bounds as wkt;
                 * 
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

                /**
                 * Removes a layer temporarily from the map
                 * 
                 * @param {type} layerKey
                 * @returns {undefined}
                 */
                mapController.unSelectOverlayByKey = function (layerKey) {
                    //console.log(mapController.mode + '-map::unSelectOverlayByKey() -> ' + layerKey);
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.unSelectOverlayByKey(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::unSelectOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                /**
                 * Removes a layer temporarily from the map
                 * 
                 * @param {type} layerKey
                 * @returns {undefined}
                 */
                mapController.unSelectOverlay = function (layer) {
                    //console.log(mapController.mode + '-map::unSelectOverlay() -> ' + layer.length);
                    layerControl.unSelectLayer(layer);
                };

                /**
                 * Adds a temporary layer to the map
                 * 
                 * @param {type} layerKey
                 * @returns {undefined}
                 */
                mapController.selectOverlayByKey = function (layerKey) {
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.selectOverlay(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::selectOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                /**
                 * Adds a temporary layer to the map
                 * 
                 * @param {type} layerKey
                 * @returns {undefined}
                 */
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
                    //console.log(mapController.mode + '-map::removeOverlayByKey() -> ' + layerKey);
                    if (layerKey &&
                            layerControlMappings[layerKey] &&
                            layerControl._Layers[layerControlMappings[layerKey]]) {

                        mapController.removeOverlay(layerControl._Layers[layerControlMappings[layerKey]]);
                    } else {
                        console.warn("mapController::removeOverlayByKey: unknown key '" + layerKey + "'");
                    }
                };

                mapController.removeOverlay = function (layer) {
                    //console.log(mapController.mode + '-map::removeOverlay() -> ' + layer.$key);
                    mapController.unSelectOverlay(layer);
                    layerControl.removeLayer(layer);
                    if (layer.$key) {
                        delete layerControlMappings[layer.$key];
                    }
                };

                mapController.addOverlay = function (layer) {
                    //console.log(mapController.mode + '-map::addOverlay() -> ' + layer.$key);
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

                /**
                 * Helper function called from template to highlight selected node
                 * 
                 * @param {type} node
                 * @returns {Boolean}
                 */
                mapController.isNodeSelected = function (node) {
                    return node === selectedNode;
                };

                /**
                 * Zomm to node on map and select node
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mapController.gotoNode = function (node) {
                    var theSelectedNode, zoom;
                    //console.log(mapController.mode + '-map::gotoNode() -> ' + node.name);
                    zoom = 14;
                    theSelectedNode = selectNode(node);

                    if (theSelectedNode) {
                        // FIXME: probably immediate clustered layer in between!
                        if (theSelectedNode.$feature.__parent &&
                                theSelectedNode.$feature.__parent._group &&
                                theSelectedNode.$feature.__parent._group.$maxZoom) {

                            zoom = theSelectedNode.$feature.__parent._group.$maxZoom;
                            //console.log(mapController.mode + '-map::gotoNode() -> ' + node.name + ' -> apply max zoom: ' + zoom);
                        }

                        leafletMap.setView(selectedNode.$feature.getLatLng(), zoom);
                        //node.$feature.togglePopup();
                    }
                };

                /**
                 * Add single node to anmalysis map
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mapController.addNode = function (node) {
                    //console.log(mapController.mode + '-map::addNode() -> ' + node.name);
                    // FIXME: prevent adding duplicate nodes!
                    if (mapController.mode === 'analysis') {
                        mapController.setNodes([node]);
                    } else {
                        console.warn("mapController:: cannot add Node on search map!");
                    }
                };

                /**
                 * Remove single node from analysis map
                 * 
                 * @param {type} node
                 * @returns {undefined}
                 */
                mapController.removeNode = function (node) {
                    var feature, featureGroupLayer, layerControlId;
                    if (mapController.mode === 'analysis') {
                        if (node && node.$feature && node.$feature.$groupKey) {
                            //console.log(mapController.mode + '-map::removeNode() -> ' + node.name);
                            if (node === selectedNode) {
                                selectedNode = null;
                            }
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

                /**
                 * Remove all nodes from map
                 * 
                 * @returns {undefined}
                 */
                mapController.clearNodes = function () {
                    var nodeLayerControlIds, featureGroupLayer;
                    //console.log(mapController.mode + '-map::clearNodes()');
                    selectedNode = null;
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

                /**
                 * Fit map bounds to all loaded nodes
                 * 
                 * @returns {undefined}
                 */
                mapController.gotoNodes = function () {
                    var bounds, nodeLayerControlIds, featureGroupLayer, nodesFitBoundsOptions;
                    //console.log(mapController.mode + '-map::gotoNodes()');
                    nodesFitBoundsOptions = angular.extend({}, fitBoundsOptions);

                    // FIXME: take from nodeOverlays
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

                            // center only on visible layers!
                            // for some reason, a layer without any features has non-empty bounds ?!
                            if (leafletMap.hasLayer(featureGroupLayer) &&
                                    featureGroupLayer.getLayers() && featureGroupLayer.getLayers().length > 0) {

                                bounds = !bounds ? featureGroupLayer.getBounds() : bounds.extend(featureGroupLayer.getBounds());
                                if (featureGroupLayer.$maxZoom) {
                                    nodesFitBoundsOptions.maxZoom = featureGroupLayer.$maxZoom;
                                }
                            }
                        }
                    });

                    if (bounds) {
                        leafletData.getMap(mapId).then(function (map) {
                            map.fitBounds(bounds, nodesFitBoundsOptions);
                            //console.log('fit bounds:' + JSON.stringify(bounds));
                            //console.log('fit bounds:' + JSON.stringify(nodesFitBoundsOptions));
                        });
                    }
                };

                /**
                 * Set new result or analysis nodes
                 * 
                 * @param {type} nodes
                 * @param {type} fitBounds
                 * @param {type} clearLayers
                 * @returns {undefined}
                 */
                mapController.setNodes = function (nodes, fitBounds, clearLayers) {
                    var featureGroups, featureGroup, featureGroupLayer, theme,
                            layerControlId;

                    //console.log(mapController.mode + '-map::setNodes() -> ' + nodes.length);
                    // check for falsy, undefoined, whatever, ....
                    if (clearLayers !== false && clearLayers !== true) {
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
                        featureGroups = featureRendererService.createNodeFeatureGroups(nodes, selectNode);
                        for (theme in featureGroups) {
                            layerControlId = layerControlMappings[theme];
                            if (layerControlId && layerControl._layers[layerControlId] && layerControl._layers[layerControlId].layer) {
                                featureGroup = featureGroups[theme];
                                featureGroupLayer = layerControl._layers[layerControlId].layer;

                                /*jshint loopfunc:true */
                                featureGroup.forEach(function (feature) {
                                    feature.addTo(featureGroupLayer);
                                    if (featureGroup.$maxZoom) {
                                        var currentZoomLevel = leafletMap.getZoom();

                                        if (currentZoomLevel > featureGroup.$maxZoom) {
                                            feature.setOpacity(0);
                                            feature.$hidden = true;
                                        } else {
                                            feature.setOpacity(1);
                                            feature.$hidden = false;
                                        }
                                    }
                                });

                                layerControl.selectLayer(featureGroupLayer);
                            } else {
                                console.warn("mapController::setNodes unsupported theme (feature group) '" + theme + "'");
                            }

                        }

                        if (fitBounds) {
                            mapController.gotoNodes();
                        }
                    }

                };

                mapController.setGazetteerLocation = function (gazetteerLocation) {
                    if (mapController.mode === 'search') {
                        //console.log('mapController::setGazetteerLocation: ' + gazetteerLocation.name);
                        if (gazetteerLocation !== null) {
                            // remove old layer
                            if (gazetteerLocationLayer !== null) {
                                layerControl.removeLayer(gazetteerLocationLayer);
                                leafletMap.removeLayer(gazetteerLocationLayer);
                                gazetteerLocationLayer = null;
                            }

                            // pass setSearchGeometry function to be called in popup
                            gazetteerLocationLayer =
                                    featureRendererService.createGazetteerLocationLayer(
                                            gazetteerLocation,
                                            setSearchGeometryFromGazetteerLocationLayer);

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


                mapController.applyZoomLevelRestriction = function () {
                    var currentZoomLevel, zoom;
                    //console.log(mapController.mode + '-map::applyZoomLevelRestriction()');

                    // always close popups on close: it may leak the position of a hidden feature!
                    leafletMap.closePopup();
                    currentZoomLevel = leafletMap.getZoom();

                    // check all layers with restrictions
                    featureLayersWithZoomRestriction.forEach(function (featureGroupLayer) {
                        if (leafletMap.hasLayer(featureGroupLayer) && featureGroupLayer.$maxZoom) {
                            featureRendererService.applyZoomLevelRestriction(featureGroupLayer, currentZoomLevel);

                            // if a node is selected when the layer is invisiable (max zoom level exceeded), show the selection
                            // FIXME: find better option to avoid unecessary calls to selectedNode()
                            /*if(selectedNode) {
                             selectNode(selectedNode);
                             }*/
                        }
                    });
                };

                //</editor-fold>

                // register search map event handlers
                if (mapController.mode === 'search') {
                    $scope.$on('gotoLocation()', function (event) {
                        if (mapController.mode === 'search') {
                            //console.log('mapController::gotoLocation(' + sharedDatamodel.selectedGazetteerLocation.name + ')');
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

                    /*$scope.$on('nodesFiltered()', function (event) {
                     console.log('mapController::nodesFiltered');
                     mapController.applyZoomLevelRestriction();
                     });*/
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

                            // ugly workaround for leafleft.buffer plugin which does not set the layer type
                            if (!event.layerType) {
                                event.layerType = 'polygon';
                            }
                            //console.log('draw:created: ' + event.layerType);
                            setSearchGeometry(event.layer, event.layerType);
                            // this is madness!
                            sharedDatamodel.selectedSearchLocation.id = 1;
                            //console.log('searchGeometryLayerGroup size: ' + searchGeometryLayerGroup.getLayers().length);

                            // directly switch to expand mode after drawing polyline
                            if (event.layerType === 'polyline') {
                                // FIXME: prevent search in line geometry if user skiops or cancels expand
                                drawControl._toolbars.edit._modes.buffer.handler.enable();
                            }
                        });

                        /*map.on('draw:edited', function (event) {
                         console.log('draw:edited: ' + event.layers.getLayers().length);
                         console.log('searchGeometryLayerGroup size: ' + searchGeometryLayerGroup.getLayers().length);
                         });*/

                        /*map.on('draw:deleted', function (event) {
                         console.log('draw:deleted: ' + event.layers.getLayers().length);
                         if (event.layers.getLayers().length > 0) {
                         // ugly workaround for leafleft.buffer plugin which does not remove expanded polyline layers
                         event.layers.eachLayer(function (deletedLayer) {
                         searchGeometryLayerGroup.removeLayer(deletedLayer);
                         });
                         }
                         
                         console.log('searchGeometryLayerGroup size: ' + searchGeometryLayerGroup.getLayers().length);
                         if (searchGeometryLayerGroup.getLayers().length === 0) {
                         sharedDatamodel.selectedSearchLocation.id = 0;
                         }
                         });*/

                        /*map.on('draw:buffered', function (event) {
                         console.log('draw:buffered: ' + event.layers.getLayers().length);
                         });*/
                    }

                    map.addControl(layerControl);

                    // not sure why this is needed altough it is already configured in the map directive
                    map.setMaxBounds(maxBounds);
                    map.setZoom(center.zoom);

                    // select the default basemap
                    layerControl.selectLayer(basemaps[0].layers[config.defaultBasemapLayer]);

                    /**
                     * Show or hide features based on zoom level
                     */
                    map.on('zoomend', function () {
                        //console.log(mapController.mode + '-map::zoomed');
                        mapController.applyZoomLevelRestriction();
                    });

                    map.on('layerremove', function (layerEvent) {
                        var removedLayer = layerEvent.layer;
                        //console.log(mapController.mode + '-map::layerremove -> key:' + removedLayer.$key + ', type: ' + removedLayer.constructor.name);

                        if (removedLayer.StyledLayerControl &&
                                layerControl._layers[L.stamp(removedLayer)]) {

                            if (removedLayer.StyledLayerControl.removable) {
                                // bugfix-hack for StyledLayerControl.
                                // FIXME: removes also layers from layercontrol that are just deselected!
                                layerControl.removeLayer(removedLayer);
                            } else {
                                // bugfix-hack for StyledLayerControl: layer deselected instead of removed ...
                                removedLayer.$selected = false;
                            }
                        }

                        /*console.log('mapController:: layer removed: ' + removedLayer.$name +
                         ' (' + L.stamp(removedLayer) + ')');*/

                        if (removedLayer && removedLayer === gazetteerLocationLayer) {
                            //console.log('mapController::gazetteerLocationLayer removed');
                            //gazetteerLocationLayer = null;
                            //layerControl.removeLayer(gazetteerLocationLayer);
                        }
                    });

                    /**
                     * Hide features on may zoom.
                     * This function is necessary, since StyledLayerControl removes 
                     * and adds visiable or hidden layers from map ...
                     */
                    map.on('layeradd', function (layerEvent) {
                        var addedLayer = layerEvent.layer;
                        //console.log(mapController.mode + '-map::layeradd -> key:' + addedLayer.$key + ', type: ' + addedLayer.constructor.name);
                        if (addedLayer.$maxZoom) {
                            featureRendererService.applyZoomLevelRestriction(addedLayer, map.getZoom());
                        }
                    });

                    // analysis nodes added before controller instance created ? ....
                    if (mapController.mode === 'analysis' &&
                            sharedDatamodel.analysisNodes &&
                            sharedDatamodel.analysisNodes.length > 0) {

                        // set nodes and fit bounds manually after delay (to allow map to be rendered)
                        mapController.setNodes(sharedDatamodel.analysisNodes, false);
                        $timeout(function () {
                            mapController.gotoNodes();
                        }, 500);
                    } else if (mapController.mode === 'search' &&
                            sharedDatamodel.resultNodes &&
                            sharedDatamodel.resultNodes.length > 0) {
                        console.warn(sharedDatamodel.resultNodes.length + ' result nodes available before search map controler instance created: possible sticky state synchrnoisation problem!');

                        // set nodes and fit bounds manually after delay (to allow map to be rendered)
                        mapController.setNodes(sharedDatamodel.resultNodes, false, true);
                        $timeout(function () {
                            mapController.gotoNodes();
                        }, 500);
                    }
                });

                // leak this to parent scope
                // FIXME: use sharedControllers Service instead
                $scope.$parent.mapController = mapController;

                if (mapController.mode === 'analysis') {
                    sharedControllers.analysisMapController = mapController;
                    console.log('analysisMapController instance created');
                } else {
                    sharedControllers.searchMapController = mapController;
                    console.log('searchMapController instance created');
                }

                mapController.activate();

            }]
        );
