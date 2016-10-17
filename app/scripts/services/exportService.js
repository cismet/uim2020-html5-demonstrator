/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global angular */

angular.module('de.cismet.uim2020-html5-demonstrator.services')
        .factory('exportService',
                ['$q', 'sharedDatamodel', 'ExportEntitiesCollection',
                    function ($q, sharedDatamodel, ExportEntitiesCollection) {
                        'use strict';
                        var getExportParametersMap;

                        getExportParametersMap = function (analysisNodes) {
                            var exportParametersMap, ExportEntitiesCollection;

                            exportParametersMap = {};
                            exportParametersMap.$size = 0;

                            analysisNodes.forEach(function (node) {
                                if (typeof exportParametersMap[node.$className] === 'undefined' ||
                                        exportParametersMap[node.$className] === null) {
                                    exportParametersMap[node.$className] =
                                            new ExportEntitiesCollection(node.$className, node.$classTitle);
                                    exportParametersMap.$size++;
                                }

                                ExportEntitiesCollection = exportParametersMap[node.$className];
                                ExportEntitiesCollection.addAllFromNode(node);
                            });

                            return exportParametersMap;
                        };

                        return {
                            getExportParametersMap: getExportParametersMap
                        };
                    }]);


