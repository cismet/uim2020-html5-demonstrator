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
        ).factory('configurationService',
        [function () {
                'use strict';

                var config = {};

                config.cidsRestApi = {};
                config.cidsRestApi.host = 'http://localhost:8890';
                //config.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
                //config.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

                config.searchService = {};
                config.searchService.username = 'admin@SWITCHON';
                config.searchService.password = 'cismet';
                config.searchService.defautLimit = 10;
                config.searchService.maxLimit = 50;
                config.searchService.host = config.cidsRestApi.host;

                config.map = {};

                config.map.home = {};
                config.map.home.lat = 47.61;
                config.map.home.lng = 13.782778;
                config.map.home.zoom = 8;
                config.map.maxBounds = {};
                config.map.maxBounds.southWest = [90, -180]; // top left corner of map
                config.map.maxBounds.northEast = [-90, 180];  // bottom right corner  





                config.map.defaults = {
                    minZoom: 2,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    },
                    controls: {
                        layers: {
                            visible: false,
                            position: 'bottomright',
                            collapsed: true
                        }
                    },
                    tileLayer: ''
                };

                /* jshint ignore:start */
                config.map.layerControlOptions = {
                    container_width: '300px',
                    container_maxHeight: '350px',
                    group_maxHeight: '300px',
                    exclusive: true
                };
                /* jshint ignore:end */

                config.map.defaultLayer = new L.tileLayer("http://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
                    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
                    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.isticktoit.net">isticktoit.net</a>'
                });

                /**
                 * styledLayerControl baseMaps!
                 */
                config.map.basemaps = [
                    {
                        groupName: 'Grundkarten',
                        expanded: true,
                        layers: {
                            'Verwaltungsgrundkarte': config.map.defaultLayer,
                            'ArcGIS Topographic': L.esri.basemapLayer('Topographic'),
                            /*'OpenTopoMap': new L.TileLayer(
                             'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                             id: 'mainmap',
                             attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                             }*/
                            'OpenStreetMap': new L.TileLayer(
                                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                                        id: 'mainmap',
                                        attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                                    })

                        }
                    }
                ];

                config.map.overlays = [];


                config.gui = {};
                // Development Mode (e.g. enable untested features)
                config.gui.dev = false;

                config.objectInfo = {};
                config.objectInfo.resourceJsonUrl = 'http://' +
                        config.searchService.username + ':' +
                        config.searchService.password + '@' +
                        config.searchService.host.replace(/.*?:\/\//g, '');
                config.objectInfo.resourceXmlUrl = 'http://tl-243.xtr.deltares.nl/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

                config.byod = {};
                //config.byod.baseUrl = 'http://tl-243.xtr.deltares.nl/byod';
                config.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';

                config.uploadtool = {};
                config.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';

                return config;
            }]);