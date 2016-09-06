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
