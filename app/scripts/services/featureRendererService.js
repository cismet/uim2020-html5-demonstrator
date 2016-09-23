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