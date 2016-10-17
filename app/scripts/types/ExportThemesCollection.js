/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.types'
        ).factory('ExportEntitiesMap',
        ['ExportEntitiesCollection',
            function (ExportEntitiesCollection) {
                'use strict';

                function ExportThemesCollection(analysisNodes) {

                    this.exportThemes = [];
                    this.selectedThemes = [];

                    analysisNodes.forEach(function (node) {
                        if (typeof this.exportParametersMap[node.$className] === 'undefined' ||
                                this.exportParametersMap[node.$className] === null) {
                            this.exportParametersMap[node.$className] =
                                    new ExportEntitiesCollection(node.$className, node.$classTitle);
                        }

                        ExportEntitiesCollection = this.exportParametersMap[node.$className];
                        ExportEntitiesCollection.addAllFromNode(node);
                    });

                }

                ExportThemesCollection.prototype.size = function () {
                    return Object.keys(
                            this.exportParametersMap).map(function (key)
                    {
                        return this.exportParametersMap.hasOwnProperty(key);
                    }).length;
                };

                ExportThemesCollection.prototype.getExportEntitiesCollectionFor = function (className) {
                    return this.exportParametersMap[className];
                };

                return ExportThemesCollection;
            }]
        );

