/*global angular, L */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'mapController',
        [
            '$scope',
            'leafletData',
            'configurationService',
            function ($scope, leafletData, configurationService) {
                'use strict';

                var config, layerControl, searchGroup, drawControl;
                config = configurationService.map;

                // put angular-leaflet config into $scope-soup ...
                angular.extend($scope, {
                    layers: {
                        // don't configure baselayers in angular-leaflet-directive:
                        // does not synchronise with styledLayerControl!
                    },
                    defaults: config.defaults,
                    center: config.home,
                    controls: {
                        scale: true
                    },
                    tileLayer: '' // disabled: loads OSM tiles in background even if not visible!
                });

                layerControl = L.Control.styledLayerControl(
                        config.basemaps, config.overlays, config.layerControlOptions);

                searchGroup = new L.FeatureGroup();

                drawControl = new L.Control.Draw({
                    draw: {
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
                    },
                    edit: {
                        featureGroup: searchGroup
                    }
                });

                leafletData.getMap('map-' + $scope.mode).then(function (map) {

                    map.addLayer(searchGroup);
                    map.addControl(drawControl);
                    map.addControl(layerControl);

                    layerControl.selectLayer(config.defaultLayer);

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

                console.log('map-' + $scope.mode + ' instance created');
            }
        ]
        );
