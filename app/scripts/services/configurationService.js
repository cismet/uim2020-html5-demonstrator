/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L */
/*jshint sub:true*/

angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('configurationService',
        [function () {
                'use strict';

                var configurationService, austriaBasemapLayer, esriTopographicBasemapLayer, osmBasemapLayer,
                        openTopoBasemapLayer, borisFeatureGroup, eprtrFeatureGroup,
                        mossFeatureGroup, wagwFeatureGroup, waowFeatureGroup, basemapLayers,
                        overlayLayers, overlays, basemapLayerOpacity;

                configurationService = this;

                configurationService.developmentMode = true;

                configurationService.cidsRestApi = {};
                //configurationService.cidsRestApi.host = 'http://localhost:8890';
                configurationService.cidsRestApi.host = 'http://DEMO-NOTEBOOK:8890';
                configurationService.cidsRestApi.domain = 'UDM2020-DI';
                configurationService.cidsRestApi.defaultRestApiSearch = 'de.cismet.cids.custom.udm2020di.serversearch.DefaultRestApiSearch';
                //configurationService.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //configurationService.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                configurationService.authentication = {};
                configurationService.authentication.domain = configurationService.cidsRestApi.domain;
                configurationService.authentication.username = 'uba';
                configurationService.authentication.password = '';
                configurationService.authentication.role = 'UDM2020';
                configurationService.authentication.cookie = 'de.cismet.uim2020-html5-demonstrator.identity';



                configurationService.searchService = {};
                configurationService.searchService.defautLimit = 10;
                configurationService.searchService.maxLimit = 50;
                configurationService.searchService.host = configurationService.cidsRestApi.host;


                configurationService.map = {};

                configurationService.map.options = {};
                configurationService.map.options.centerOnSearchGeometry = true;
                configurationService.map.options.preserveZoomOnCenter = false;

                configurationService.map.home = {};
                configurationService.map.home.lat = 47.61;
                configurationService.map.home.lng = 13.782778;
                configurationService.map.home.zoom = 8;
                configurationService.map.maxBounds = new L.latLngBounds(
                        L.latLng(46.372299, 9.53079),
                        L.latLng(49.02071, 17.160749));


                /* jshint ignore:start */
                configurationService.map.layerControlOptions = {
                    container_width: '250px',
                    container_maxHeight: '900px',
                    group_maxHeight: '400px',
                    exclusive: false
                };
                /* jshint ignore:end */

                configurationService.map.layerGroupMappings = {
                    'basemaps': 'Grundkarten',
                    'nodes': 'Themen',
                    'gazetteer': 'Aktueller Ort',
                    'external': 'Externe Datenquellen'
                };

                configurationService.map.layerMappings = {
                    'basemap_at': 'Verwaltungsgrundkarte',
                    'arcgisonline_com': 'ArcGIS Topographic',
                    'opentopomap_org': 'OpenTopoMap',
                    'openstreetmap_org': 'OpenStreetMap',
                    'BORIS_SITE': 'Bodenmesstellen',
                    'EPRTR_INSTALLATION': 'ePRTR Einrichtungen',
                    'MOSS': 'Moose',
                    'WAOW_STATION': 'Wassermesstellen',
                    'WAGW_STATION': 'Grundwassermesstellen'
                };

                configurationService.map.defaultBasemapLayer = 'Verwaltungsgrundkarte';

                basemapLayerOpacity = 0.6;

                austriaBasemapLayer = new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>',
                    opacity: basemapLayerOpacity/*,
                     reuseTiles: true,
                     updateWhenIdle: true*/
                });
                austriaBasemapLayer.$name = configurationService.map.layerMappings['basemap_at'];
                austriaBasemapLayer.$key = 'basemap_at';
                austriaBasemapLayer.$groupName = 'Grundkarten';
                austriaBasemapLayer.$groupKey = 'basemaps';

                esriTopographicBasemapLayer = L.esri.basemapLayer('Topographic', {
                    opacity: basemapLayerOpacity
                });
                esriTopographicBasemapLayer.$name = configurationService.map.layerMappings['arcgisonline_com'];
                esriTopographicBasemapLayer.$key = 'arcgisonline_com';
                esriTopographicBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                esriTopographicBasemapLayer.$groupKey = 'basemaps';

                //'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                openTopoBasemapLayer = new L.TileLayer(
                        'http://opentopomap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)',
                            opacity: basemapLayerOpacity
                        });
                openTopoBasemapLayer.$name = configurationService.map.layerMappings['opentopomap_org'];
                openTopoBasemapLayer.$key = 'opentopomap_org';
                openTopoBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                openTopoBasemapLayer.$groupKey = 'basemaps';

                osmBasemapLayer = new L.TileLayer(
                        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
                            opacity: basemapLayerOpacity
                        });
                osmBasemapLayer.$name = configurationService.map.layerMappings['openstreetmap_org'];
                osmBasemapLayer.$key = 'openstreetmap_org';
                osmBasemapLayer.$groupName = configurationService.map.layerGroupMappings['basemaps'];
                osmBasemapLayer.$groupKey = 'basemaps';

                basemapLayers = {};
                basemapLayers[configurationService.map.layerMappings['basemap_at']] = austriaBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['arcgisonline_com']] = esriTopographicBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['opentopomap_org']] = openTopoBasemapLayer;
                basemapLayers[configurationService.map.layerMappings['openstreetmap_org']] = osmBasemapLayer;

                configurationService.map.defaults = {
                    minZoom: configurationService.map.home.zoom,
                    //maxZoom: 18,
                    maxBounds: configurationService.map.maxBounds,
                    /*path: {
                     weight: 10,
                     color: '#800000',
                     opacity: 1
                     },*/
                    controls: {
                        layers: {
                            visible: false,
                            position: 'bottomright',
                            collapsed: true
                        }
                    },
                    tileLayer: '' // if disabled, ngLeaflet will *always* request OSM BG Layer (useful for  Verwaltungsgrundkarte)
                            /*tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                             tileLayerOptions: {
                             attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
                             opacity: basemapLayerOpacity,
                             reuseTiles: false,
                             updateWhenIdle: false,
                             unloadInvisibleTiles: true
                             }*/
                };

                /**
                 * styledLayerControl baseMaps!
                 */
                configurationService.map.basemaps = [
                    {
                        groupName: configurationService.map.layerGroupMappings['basemaps'],
                        expanded: true,
                        layers: basemapLayers
                    }
                ];

                borisFeatureGroup = new L.FeatureGroup();
                borisFeatureGroup.$name = configurationService.map.layerMappings['BORIS_SITE'];
                borisFeatureGroup.$key = 'BORIS_SITE';
                borisFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                borisFeatureGroup.$groupKey = 'nodes';
                borisFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                eprtrFeatureGroup = new L.FeatureGroup();
                eprtrFeatureGroup.$name = configurationService.map.layerMappings['EPRTR_INSTALLATION'];
                eprtrFeatureGroup.$key = 'EPRTR_INSTALLATION';
                eprtrFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                eprtrFeatureGroup.$groupKey = 'nodes';
                eprtrFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                mossFeatureGroup = new L.FeatureGroup();
                mossFeatureGroup.$name = configurationService.map.layerMappings['MOSS'];
                mossFeatureGroup.$key = 'MOSS';
                mossFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                mossFeatureGroup.$groupKey = 'nodes';
                mossFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                wagwFeatureGroup = new L.FeatureGroup();
                wagwFeatureGroup.$name = configurationService.map.layerMappings['WAGW_STATION'];
                wagwFeatureGroup.$key = 'WAGW_STATION';
                wagwFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                wagwFeatureGroup.$groupKey = 'nodes';
                wagwFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                waowFeatureGroup = new L.FeatureGroup();
                waowFeatureGroup.$name = configurationService.map.layerMappings['WAOW_STATION'];
                waowFeatureGroup.$key = 'WAOW_STATION';
                waowFeatureGroup.$groupName = configurationService.map.layerGroupMappings['nodes'];
                waowFeatureGroup.$groupKey = 'nodes';
                waowFeatureGroup.StyledLayerControl = {
                    removable: false,
                    visible: false
                };

                overlayLayers = {};
                overlayLayers[configurationService.map.layerMappings['BORIS_SITE']] = borisFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['EPRTR_INSTALLATION']] = eprtrFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['MOSS']] = mossFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['WAGW_STATION']] = wagwFeatureGroup;
                overlayLayers[configurationService.map.layerMappings['WAOW_STATION']] = waowFeatureGroup;

                configurationService.map.nodeOverlays = {
                    groupName: configurationService.map.layerGroupMappings['nodes'],
                    expanded: true,
                    layers: overlayLayers
                };

                // angular.extend creates a shallow copy!
                // angular.copy creates a deep copy!
                // angular.merge creates a deep copy!
                configurationService.map.searchOverlays = [];
                angular.merge([],
                        [
                            {
                                groupName: configurationService.map.layerGroupMappings['gazetteer'],
                                expanded: false,
                                layers: {}
                            }
                        ],
                        overlays);

                configurationService.map.analysisOverlays = angular.merge([],
                        overlays,
                        [
                            {
                                groupName: configurationService.map.layerGroupMappings['external'],
                                expanded: false,
                                layers: {}
                            }
                        ]);


                configurationService.map.drawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: {
                            color: '#006d2c',
                            clickable: true
                        },
                        showArea: true,
                        metric: true
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#006d2c',
                            clickable: true
                        },
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };


                configurationService.map.fitBoundsOptions = {
                    animate: true,
                    pan: {animate: true, duration: 0.75},
                    zoom: {animate: true},
                    maxZoom: null
                };

                configurationService.featureRenderer = {};
                configurationService.featureRenderer.gazetteerStyle = {
                    color: '#8856a7',
                    fillColor: '#feb24c',
                    fillOpacity: 0.3,
                    fill: true,
                    weight: 4,
                    riseOnHover: false,
                    clickable: false
                };
                configurationService.featureRenderer.defaultStyle = {
                    color: '#0000FF',
                    fill: false,
                    weight: 2,
                    riseOnHover: true,
                    clickable: false
                };
                configurationService.featureRenderer.highlightStyle = {
                    fillOpacity: 0.4,
                    fill: true,
                    fillColor: '#1589FF',
                    riseOnHover: true,
                    clickable: false
                };

                configurationService.featureRenderer.icons = {};
                configurationService.featureRenderer.icons.BORIS_SITE = L.icon({
                    iconUrl: 'icons/showel_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0]
                });
                configurationService.featureRenderer.icons.WAGW_STATION = L.icon({
                    iconUrl: 'icons/wagw_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0]
                });
                configurationService.featureRenderer.icons.WAOW_STATION = L.icon({
                    iconUrl: 'icons/waow_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0]
                });
                configurationService.featureRenderer.icons.EPRTR_INSTALLATION = L.icon({
                    iconUrl: 'icons/factory_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0]
                });
                configurationService.featureRenderer.icons.MOSS = L.icon({
                    iconUrl: 'icons/grass_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0]
                });

                configurationService.featureRenderer.highlightIcons = {};
                configurationService.featureRenderer.highlightIcons.BORIS_SITE = L.icon({
                    iconUrl: 'icons/showel_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0],
                    shadowUrl: "icons/icon_shadow.png",
                    shadowSize: [28, 28],
                    shadowAnchor: [14, 14]
                });
                configurationService.featureRenderer.highlightIcons.WAGW_STATION = L.icon({
                    iconUrl: 'icons/wagw_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0],
                    shadowUrl: "icons/icon_shadow.png",
                    shadowSize: [24, 24],
                    shadowAnchor: [12, 12]
                });
                configurationService.featureRenderer.highlightIcons.WAOW_STATION = L.icon({
                    iconUrl: 'icons/waow_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0],
                    shadowUrl: "icons/icon_shadow.png",
                    shadowSize: [24, 24],
                    shadowAnchor: [12, 12]
                });
                configurationService.featureRenderer.highlightIcons.EPRTR_INSTALLATION = L.icon({
                    iconUrl: 'icons/factory_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0],
                    shadowUrl: "icons/icon_shadow.png",
                    shadowSize: [24, 24],
                    shadowAnchor: [12, 12]
                });
                configurationService.featureRenderer.highlightIcons.MOSS = L.icon({
                    iconUrl: 'icons/grass_16.png',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                    popupAnchor: [0, 0],
                    shadowUrl: "icons/icon_shadow.png",
                    shadowSize: [24, 24],
                    shadowAnchor: [12, 12]
                });

                configurationService.featureRenderer.layergroupNames = {};
                configurationService.featureRenderer.layergroupNames.MOSS = 'Moose';
                configurationService.featureRenderer.layergroupNames.EPRTR_INSTALLATION = 'ePRTR Einrichtungen';
                configurationService.featureRenderer.layergroupNames.WAOW_STATION = 'Wassermesstellen';
                configurationService.featureRenderer.layergroupNames.WAGW_STATION = 'Grundwassermesstellen';
                configurationService.featureRenderer.layergroupNames.BORIS_SITE = 'Bodenmesstellen';


                configurationService.multiselect = {};
                configurationService.multiselect.settings = {
                    styleActive: true,
                    displayProp: 'name',
                    idProp: 'id',
                    buttonClasses: 'btn btn-default navbar-btn cs-search-multiselect'
                };
                configurationService.multiselect.translationTexts = {
                    checkAll: 'Alles auswählen',
                    uncheckAll: 'Alles abwählen',
                    enableSearch: 'Suche aktivieren',
                    disableSearch: 'Suche deaktivieren',
                    selectionCount: ' ausgewählt',
                    selectionOf: ' von ',
                    searchPlaceholder: 'Suche...',
                    buttonDefaultText: 'Auswählen',
                    dynamicButtonTextSuffix: 'ausgewählt',
                    selectGroup: 'Alle auswählen: '
                };
            }]);