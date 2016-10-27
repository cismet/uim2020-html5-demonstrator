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
        ).factory('ExportEntitiesCollection',
        [
            function () {
                'use strict';

                function ExportEntitiesCollection(className, title) {
                    this.className = className;
                    this.title = title;
                    this.parameters = [];
                    this.parametersKeys = [];
                    this.exportPKs = [];
                    this.objectIds = [];
                    this.selected = false;
                    this.exportDatasource = null;
                    this.exportFormat = null;

                    /**
                     * Parameters not available for filtering
                     */
                    this.forbiddenParameters = [];
                }

                ExportEntitiesCollection.prototype.clear = function () {
                    this.parametersKeys.length = 0;
                    this.parameters.length = 0;
                    this.exportPKs.length = 0;
                };

                /**
                 * Add a new distinct parameter to the collection and set selected property
                 * to true by default
                 * 
                 * @param {type} parameter
                 * @returns {Boolean}
                 */
                ExportEntitiesCollection.prototype.addParameter = function (parameter) {
                    // only add parameters not yet in list 
                    if (parameter && parameter.parameterpk &&
                            this.forbiddenParameters.indexOf(parameter.parameterpk === -1) &&
                            this.parametersKeys.indexOf(parameter.parameterpk) === -1)
                    {
                        this.parametersKeys.push(parameter.parameterpk);
                        // push a shallow copy
                        this.parameters.push(angular.extend({}, parameter));
                        return true;
                    }

                    return false;
                };

                ExportEntitiesCollection.prototype.removeParameter = function (key) {
                    return delete this.parameters[key];
                };

                ExportEntitiesCollection.prototype.isEmpty = function () {
                    return this.parameters.length === 0;
                };

                ExportEntitiesCollection.prototype.size = function () {
                    return  this.parameters.length;
                };

                /**
                 * Add all supported parameters from nodes that match the configured className and
                 * parametergroupkey
                 * 
                 * @param {type} nodes
                 * @param {type} clear
                 * @param {type} sort
                 * @return {undefined}
                 */
                ExportEntitiesCollection.prototype.addAllParametersFromNodes = function (nodes, clear, sort) {
                    var i, node, parameters;
                    if (nodes !== null && nodes.length > 0) {
                        for (i = 0; i < nodes.length; ++i) {
                            node = nodes[i];
                            this.addAllParametersFromNode(node);
                        }
                    }

                    return this.parameters;
                };

                ExportEntitiesCollection.prototype.addAllParametersFromNode = function (node, clear, sort) {
                    var parameters;

                    if (typeof node.$exportPK !== 'undefined' && node.$exportPK !== null &&
                            this.exportPKs.indexOf(node.$exportPK) === -1 &&
                            node.$data !== 'undefined' && node.$data !== null &&
                            node.$data.probenparameter !== 'undefined' && node.$data.probenparameter !== null &&
                            (this.className === 'ALL' || this.className === node.$className)) {

                        // add object id (needed for MOSS Export)
                        if (typeof node.LEGACY_OBJECT_ID !== 'undefined' && node.LEGACY_OBJECT_ID !== null &&
                                this.objectIds.indexOf(node.LEGACY_OBJECT_ID) === -1) {
                            this.objectIds.push(node.LEGACY_OBJECT_ID);
                        }

                        // add the export PK!
                        this.exportPKs.push(node.$exportPK);

                        // Attention: collects also parameters of filtered nodes! (node.$filtered)
                        if (node.$className === 'EPRTR_INSTALLATION') {
                            parameters = node.$data.releaseparameters;
                        } else {
                            parameters = node.$data.probenparameter;
                        }

                        // add the parameters
                        this.addAllParameters(parameters, clear, sort);
                    }
                };

                ExportEntitiesCollection.prototype.addAllParameters = function (parameters, clear, sort) {
                    var i;
                    if (clear === true) {
                        this.clear();
                    }

                    for (i = 0; i < parameters.length; i++) {
                        this.addParameter(parameters[i]);
                    }

                    if (sort === true) {
                        this.parameters.sort(function (a, b) {
                            if (a.parametername > b.parametername) {
                                return 1;
                            }
                            if (a.parametername < b.parametername) {
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                    }

                    return this.parameters;
                };

                ExportEntitiesCollection.prototype.selectAllParameters = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = true;
                    });
                };


                ExportEntitiesCollection.prototype.deselectAllParameters = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = false;
                    });
                };

                ExportEntitiesCollection.prototype.invertParameterSelection = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = !parameter.selected;
                    });
                };

                ExportEntitiesCollection.prototype.allParametersSelected = function () {
                    this.parameters.every(function (parameter, index, array) {
                        if (!parameter.selected) {
                            return false;
                        }
                    });

                    return true;
                };

                ExportEntitiesCollection.prototype.allParametersDeselected = function () {
                    this.parameters.every(function (parameter, index, array) {
                        if (parameter.selected) {
                            return false;
                        }
                    });

                    return true;
                };

                ExportEntitiesCollection.prototype.getSelectedParameters = function () {
                    var selectedParameters = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === true) {
                            selectedParameters.push(parameter);
                        }
                    });

                    return selectedParameters;
                };

                ExportEntitiesCollection.prototype.getDeselectedParameters = function () {
                    var deselectedParameters = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === false) {
                            deselectedParameters.push(parameter);
                        }
                    });

                    return deselectedParameters;
                };

                ExportEntitiesCollection.prototype.getSelectedParameterKeys = function () {
                    var selectedKeys = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === true) {
                            selectedKeys.push(parameter.parameterpk);
                        }
                    });

                    return selectedKeys;
                };

                ExportEntitiesCollection.prototype.getDeselectedParameterKeys = function () {
                    var deselectedKeys = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === false) {
                            deselectedKeys.push(parameter.parameterpk);
                        }
                    });

                    return deselectedKeys;
                };

                ExportEntitiesCollection.prototype.isSelected = function () {
                    return this.selected;
                };

                ExportEntitiesCollection.prototype.setSelected = function (selected) {
                    this.selected = selected;
                };

                ExportEntitiesCollection.prototype.toggleSelection = function () {
                    this.selected = !this.selected;
                    return this.selected;
                };

                ExportEntitiesCollection.prototype.hasExportDatasource = function (exportDatasource) {
                    if (this.exportDatasource !== null &&
                            this.exportDatasource.equals(exportDatasource)) {
                        return true;
                    } else {
                        return false;
                    }
                };

                return ExportEntitiesCollection;
            }]
        );

