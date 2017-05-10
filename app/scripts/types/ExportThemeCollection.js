/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.types'
        ).factory('ExportThemeCollection',
        ['ExportEntitiesCollection', 'DEVELOPMENT_MODE',
            function (ExportEntitiesCollection, DEVELOPMENT_MODE) {
                'use strict';

                /**
                 * A *collection* of export Themes
                 * Export Theme = Class (Bodenmessstellen, ePRTR Einrichtungen, ...)
                 * 
                 * @param {type} analysisNodes
                 * @return {ExportThemeCollectionL#16.ExportThemeCollection}
                 */
                function ExportThemeCollection(analysisNodes) {
                    var _this = this;
                    _this.exportEntitiesCollections = [];

                    if (typeof analysisNodes !== 'undefined' && analysisNodes !== null &&
                            analysisNodes.length > 0) {

                        analysisNodes.forEach(function (node) {
                            var exportEntitiesCollection;
                            if (typeof _this.exportEntitiesCollections[node.$className] === 'undefined' ||
                                    _this.exportEntitiesCollections[node.$className] === null) {

                                var newExportEntitiesCollection = new ExportEntitiesCollection(node.$className, node.$classTitle);

                                _this.exportEntitiesCollections[node.$className] = newExportEntitiesCollection;
                                // necessary because ngRepeat does not work with associative arrays!        
                                _this.exportEntitiesCollections.push(newExportEntitiesCollection);
                            }

                            exportEntitiesCollection = _this.exportEntitiesCollections[node.$className];
                            exportEntitiesCollection.addAllParametersFromNode(node);
                        });
                    } else {
                        console.warn("ExportThemeCollection::constructor -> no analysis nodes available!");
                    }
                }

                ExportThemeCollection.prototype.size = function () {
                    var _this = this;
                    return Object.keys(
                            _this.exportEntitiesCollections).map(function (key)
                    {
                        return _this.exportEntitiesCollections.hasOwnProperty(key);
                    }).length;
                };

                ExportThemeCollection.prototype.getExportEntitiesCollection = function (className) {
                    return this.exportEntitiesCollections[className];
                };

                ExportThemeCollection.prototype.getSelectedExportEntitiesCollections = function () {
                    var selectedExportEntitiesCollections = [];
                    this.exportEntitiesCollections.forEach(function (exportEntitiesCollection) {
                        if (exportEntitiesCollection.isSelected()) {
                            selectedExportEntitiesCollections.push(exportEntitiesCollection);
                        }

                    });

                    return selectedExportEntitiesCollections;
                };

                ExportThemeCollection.prototype.setExportEntitiesCollectionSelected = function (className, selected) {
                    var exportEntitiesCollection = this.getExportEntitiesCollection(className);
                    if (typeof exportEntitiesCollection !== 'undefined' && exportEntitiesCollection !== null) {
                        exportEntitiesCollection.setSelected(selected);
                    } else {
                        console.warn('ExportThemeCollection::setExportEntitiesCollectionSelected -> unknow theme "' + className + '"');
                    }
                };
                
                ExportThemeCollection.prototype.selectAllExportEntitiesCollections = function () {
                    this.exportEntitiesCollections.forEach(function (exportEntitiesCollection) {
                        //if(DEVELOPMENT_MODE === true)console.log('change "' + exportEntitiesCollection.title + '" selected from ' + exportEntitiesCollection.isSelected() + ' to true');
                        exportEntitiesCollection.setSelected(true);
                    });
                };


                ExportThemeCollection.prototype.deselectAllExportEntitiesCollections = function () {
                    this.exportEntitiesCollections.forEach(function (exportEntitiesCollection) {
                        //if(DEVELOPMENT_MODE === true)console.log('change "' + exportEntitiesCollection.title + '" selected from ' + exportEntitiesCollection.isSelected() + ' to false');
                        exportEntitiesCollection.setSelected(false);
                    });
                };

                ExportThemeCollection.prototype.invertExportEntitiesCollectionsSelection = function () {
                    this.exportEntitiesCollections.forEach(function (exportEntitiesCollection) {
                        //if(DEVELOPMENT_MODE === true)console.log('change "' + exportEntitiesCollection.title + '" selected from ' + exportEntitiesCollection.isSelected() + ' to ' + !exportEntitiesCollection.isSelected());
                        exportEntitiesCollection.setSelected(!exportEntitiesCollection.isSelected());
                    });
                };

                ExportThemeCollection.prototype.allExportEntitiesCollectionsSelected = function () {
                    if(this.exportEntitiesCollections === null || this.exportEntitiesCollections.length === 0) {
                        return false;
                    }
                    
                    return this.exportEntitiesCollections.every(function (exportEntitiesCollection, index, array) {
                        //if(DEVELOPMENT_MODE === true)console.log('is "' + exportEntitiesCollection.title + '" selected: ' + exportEntitiesCollection.isSelected());
                        return exportEntitiesCollection.isSelected();
                    });
                };

                ExportThemeCollection.prototype.allExportEntitiesCollectionsDeselected = function () {
                    if(this.exportEntitiesCollections === null || this.exportEntitiesCollections.length === 0) {
                        return true;
                    }
                    
                    return this.exportEntitiesCollections.every(function (exportEntitiesCollection, index, array) {
                        return !exportEntitiesCollection.isSelected();
                    });
                };
                
                ExportThemeCollection.prototype.toggleExportEntitiesCollectionsSelection = function () {
                    if(this.exportEntitiesCollections === null || this.exportEntitiesCollections.length === 0) {
                        return false;
                    }
                    
                    if(this.allExportEntitiesCollectionsSelected() === true) {
                        this.deselectAllExportEntitiesCollections();
                    } else {
                        this.selectAllExportEntitiesCollections();
                    }

                    return true;
                };

                return ExportThemeCollection;
            }]
        );

