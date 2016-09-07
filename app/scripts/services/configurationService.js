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
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('configurationService',
        [function () {
                'use strict';

                var layerBasemap, layerTopographic, layerOsm;

                this.cidsRestApi = {};
                this.cidsRestApi.host = 'http://localhost:8890';
                //this.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //this.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                this.searchService = {};
                this.searchService.username = 'admin@SWITCHON';
                this.searchService.password = 'cismet';
                this.searchService.defautLimit = 10;
                this.searchService.maxLimit = 50;
                this.searchService.host = this.cidsRestApi.host;


                this.map = {};

                this.map.options = {};
                this.map.options.centerOnSearchGeometry = true;
                this.map.options.preserveZoomOnCenter = true;

                this.map.home = {};
                this.map.home.lat = 47.61;
                this.map.home.lng = 13.782778;
                this.map.home.zoom = 7;
                this.map.maxBounds = new L.latLngBounds(
                        L.latLng(46.372299, 9.53079),
                        L.latLng(49.02071, 17.160749));

                this.map.defaults = {
                    minZoom: 7,
                    //maxZoom: 18,
                    maxBounds: this.map.maxBounds,
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
                    //tileLayer: '' // if disabled, Leflet will *always* request OSM BG Layer (useful for  Verwaltungsgrundkarte)
                };

                /* jshint ignore:start */
                this.map.layerControlOptions = {
                    container_width: '300px',
                    container_height: '600px',
                    container_maxHeight: '600px',
                    //group_maxHeight: '300px',
                    exclusive: false
                };
                /* jshint ignore:end */

                this.map.defaultLayer = 'Verwaltungsgrundkarte';


                layerBasemap = new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>'
                });
                layerBasemap.name = 'Verwaltungsgrundkarte';
                layerBasemap.key = 'basemap.at';

                layerTopographic = L.esri.basemapLayer('Topographic');
                layerTopographic.name = 'ArcGIS Topographic';
                layerTopographic.key = 'arcgisonline.com';

                layerOsm = new L.TileLayer(
                        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            id: 'mainmap',
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                        });
                layerOsm.name = 'OpenStreetMap';
                layerOsm.key = 'openstreetmap.org';

                /**
                 * styledLayerControl baseMaps!
                 */
                this.map.basemaps = [
                    {
                        groupName: 'Grundkarten',
                        expanded: true,
                        layers: {
                            'Verwaltungsgrundkarte': layerBasemap,
                            'ArcGIS Topographic': layerTopographic,
                            /*'OpenTopoMap': new L.TileLayer(
                             'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                             id: 'mainmap',
                             attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                             }*/
                            'OpenStreetMap': layerOsm
                        }
                    }
                ];

                this.map.overlays = [];

                this.map.drawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: {
                            color: '#800000',
                            clickable: true
                        },
                        showArea: true,
                        metric: true
                    },
                    rectangle: {
                        shapeOptions: {
                            color: '#800000',
                            clickable: true
                        },
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };

                this.featureRenderer = {};
                this.featureRenderer.defaultStyle = {
                    color: '#0000FF',
                    fill: false,
                    weight: 2,
                    riseOnHover: true,
                    clickable: false
                };
                this.featureRenderer.highlightStyle = {
                    fillOpacity: 0.4,
                    fill: true,
                    fillColor: '#1589FF',
                    riseOnHover: true,
                    clickable: false
                };

                this.featureRenderer.icons = {};
                this.featureRenderer.icons.BORIS_SITE = L.icon({
                    iconUrl: 'icons/showel_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.WAGW_STATION = L.icon({
                    iconUrl: 'icons/wagw_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.WAOW_STATION = L.icon({
                    iconUrl: 'icons/waow_16',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.EPRTR_INSTALLATION = L.icon({
                    iconUrl: 'icons/factory_16.png',
                    iconSize: [16, 16]
                });
                this.featureRenderer.icons.MOSS = L.icon({
                    iconUrl: 'icons/grass_16.png',
                    iconSize: [16, 16]
                });

                this.featureRenderer.layergroupNames = {};
                this.featureRenderer.layergroupNames.MOSS = 'Moose';
                this.featureRenderer.layergroupNames.EPRTR_INSTALLATION = 'ePRTR ePRTR Einrichtungen';
                this.featureRenderer.layergroupNames.WAOW_STATION = 'Wassermesstellen';
                this.featureRenderer.layergroupNames.WAGW_STATION = 'Grundwassermesstellen';
                this.featureRenderer.layergroupNames.BORIS_SITE = 'Bodenmesstellen';


                this.multiselect = {};
                this.multiselect.settings = {
                    styleActive: true,
                    displayProp: 'name',
                    idProp: 'classId',
                    buttonClasses: 'btn btn-default navbar-btn cs-search-multiselect'
                };
                this.multiselect.translationTexts = {
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