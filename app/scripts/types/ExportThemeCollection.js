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
        ).factory('ExportThemeCollection',
        ['ExportEntitiesCollection',
            function (ExportEntitiesCollection) {
                'use strict';

                function ExportThemesCollection(analysisNodes) {
                    var _this = this;
                    _this.exportEntitiesCollections = [];

                    if (typeof analysisNodes !== 'undefined' && analysisNodes !== null
                            && analysisNodes.length > 0) {

                        analysisNodes.forEach(function (node) {
                            var exportEntitiesCollection;
                            if (typeof _this.exportEntitiesCollections[node.$className] === 'undefined' ||
                                    _this.exportEntitiesCollections[node.$className] === null) {
                                _this.exportEntitiesCollections[node.$className] =
                                        new ExportEntitiesCollection(node.$className, node.$classTitle);
                            }

                            exportEntitiesCollection = _this.exportEntitiesCollections[node.$className];
                            exportEntitiesCollection.addAllParametersFromNode(node);
                        });
                    } else {
                        console.warn("ExportThemesCollection::constructor -> no analysis nodes available!");
                    }
                }

                ExportThemesCollection.prototype.size = function () {
                    var _this = this;
                    return Object.keys(
                            _this.exportEntitiesCollections).map(function (key)
                    {
                        return _this.exportEntitiesCollections.hasOwnProperty(key);
                    }).length;
                };

                ExportThemesCollection.prototype.getExportEntitiesCollection = function (className) {
                    return this.exportEntitiesCollections[className];
                };

                ExportThemesCollection.prototype.getSelectedExportEntitiesCollections = function () {
                    var selectedExportEntitiesCollections = [];
                    this.exportEntitiesCollections.forEach(function (exportEntitiesCollection) {
                        if (exportEntitiesCollection.isSelected()) {
                            selectedExportEntitiesCollections.push(exportEntitiesCollection);
                        }

                    });

                    return selectedExportEntitiesCollections;
                };

                ExportThemesCollection.prototype.setExportEntitiesCollectionSelected = function (className, selected) {
                    var exportEntitiesCollection = this.getExportEntitiesCollection(className);
                    if (typeof exportEntitiesCollection !== 'undefined' && exportEntitiesCollection !== null) {
                        exportEntitiesCollection.setSelected(selected);
                    } else {
                        console.warn('ExportThemesCollection::setExportEntitiesCollectionSelected -> unknow theme "' + className + '"');
                    }
                };

                return ExportThemesCollection;
            }]
        );

