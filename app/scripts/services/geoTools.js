/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global angular, Wkt */

angular.module('de.cismet.uim2020-html5-demonstrator.services')
        .factory('geoTools',
                ['leafletData',
                    function (leafletData) {
                        'use strict';
                        var wicket;

                        wicket = new Wkt.Wkt();

                        return {
                            wicket: wicket
                        };
                    }]);


