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
        'objectRendererService',
        ['configurationService',
            function (configurationService) {
                'use strict';
                
                var getObjectIcon;


                getObjectIcon = function (classKey) {
                    return classKey;
                };

                return {
                    getObjectIcon: getObjectIcon
                };
            }
        ]
        );