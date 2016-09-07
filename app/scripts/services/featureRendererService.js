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

                var getFeatureRenderer, getNodeFeatureRenderer, getNodesFeatureRenderers,
                        defaultStyle, highlightStyle, createGazetteerLocationLayer;

                createGazetteerLocationLayer = function (gazetteerLocation) {
                    var wktString, wktObject, geometryCollection;
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
                    if(geometryCollection === true) {
                        return wktObject.toObject().getLayers()[0];
                    } else {
                        return wktObject.toObject();
                    } 
                };

                getNodeFeatureRenderer = function (node, theme) {
                    if (node.hasOwnProperty('geom')) {
                        var wktString, wktObject;
                        wktString = node.geom;
                        wktObject = new Wkt.Wkt();
                        wktObject.read(wktString.substr(wktString.indexOf(';') + 1));

                        var config = {
                            icon: configurationService.featureRenderer.icons[theme],
                            title: node.name
                        };

                        return wktObject.toObject(config);
                    }
                };


                getNodesFeatureRenderers = function (nodes) {
                    var i, node, theme, featureRender, featureRenders;
                    featureRenders = {};
                    for (i = 0; i < nodes.length; ++i) {
                        node = nodes[i];
                        theme = node.classKey.split(".").slice(1, 2).pop();
                        featureRender = getNodeFeatureRenderer(node, theme);

                        if (featureRender) {
                            if (!featureRenders.hasOwnProperty(theme)) {
                                featureRenders[theme] = [];
                            }

                            featureRenders[theme].push(featureRender);
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
                    getFeatureRenderer: getFeatureRenderer,
                    createGazetteerLocationLayer: createGazetteerLocationLayer,
                    defaultStyle: defaultStyle,
                    highlightStyle: highlightStyle
                };
            }
        ]
        );