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
        ).factory('ExportParameterCollection',
        [
            function () {
                'use strict';

                function ExportParameterCollection(className, title) {
                    this.className = className;
                    this.title = title;
                    this.parameters = [];
                    this.parametersKeys = [];

                    /**
                     * Parameters not available for filtering
                     */
                    this.forbiddenParameters = [];
                }

                ExportParameterCollection.prototype.clear = function () {
                    this.parametersKeys.length = 0;
                    this.parameters.length = 0;
                };

                /**
                 * Add a new distinct parameter to the collection and set selected property
                 * to true by default
                 * 
                 * @param {type} parameter
                 * @returns {Boolean}
                 */
                ExportParameterCollection.prototype.addParameter = function (parameter) {
                    // only add parameters not yet in list 
                    if (parameter && parameter.parameterpk &&
                            this.forbiddenParameters.indexOf(parameter.parameterpk === -1) &&
                            this.parametersKeys.indexOf(parameter.parameterpk) === -1)
                    {
                        this.parametersKeys.push(parameter.parameterpk);
                        // push a shallow copy and extend by selected property
                        this.parameters.push(parameter);
                        return true;
                    }

                    return false;
                };

                ExportParameterCollection.prototype.removeParameter = function (key) {
                    return delete this.parameters[key];
                };

                ExportParameterCollection.prototype.isEmpty = function () {
                    return this.parameters.length === 0;
                };

                ExportParameterCollection.prototype.length = function () {
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
                ExportParameterCollection.prototype.addAllFromNodes = function (nodes, clear, sort) {
                    var i, node, parameters;
                    if (nodes !== null && nodes.length > 0) {
                        for (i = 0; i < nodes.length; ++i) {
                            node = nodes[i];
                            // Attention: collects also parameters of filtered nodes! (node.$filtered)
                            if (node.$data && node.$data.parameters &&
                                    (this.className === 'ALL' || this.className === node.$className)) {
                                parameters = node.$data.parameters;
                                this.addAll(parameters, clear, sort);
                            }
                        }
                    }

                    return this.parameters;
                };

                ExportParameterCollection.prototype.addAll = function (parameters, clear, sort) {
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

                ExportParameterCollection.prototype.selectAll = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = true;
                    });
                };


                ExportParameterCollection.prototype.deselectAll = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = false;
                    });
                };

                ExportParameterCollection.prototype.invertSelection = function () {
                    this.parameters.forEach(function (parameter) {
                        parameter.selected = !parameter.selected;
                    });
                };

                ExportParameterCollection.prototype.allSelected = function () {
                    this.parameters.every(function (parameter, index, array) {
                        if (!parameter.selected) {
                            return false;
                        }
                    });

                    return true;
                };

                ExportParameterCollection.prototype.allDeselected = function () {
                    this.parameters.every(function (parameter, index, array) {
                        if (parameter.selected) {
                            return false;
                        }
                    });

                    return true;
                };

                ExportParameterCollection.prototype.getSelectedParameters = function () {
                    var selectedParameters = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === true) {
                            selectedParameters.push(parameter);
                        }
                    });

                    return selectedParameters;
                };

                ExportParameterCollection.prototype.getDeselectedParameters = function () {
                    var deselectedParameters = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === false) {
                            deselectedParameters.push(parameter);
                        }
                    });

                    return deselectedParameters;
                };

                ExportParameterCollection.prototype.getSelectedKeys = function () {
                    var selectedKeys = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === true) {
                            selectedKeys.push(parameter.parameterpk);
                        }
                    });

                    return selectedKeys;
                };

                ExportParameterCollection.prototype.getDeselectedKeys = function () {
                    var deselectedKeys = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === false) {
                            deselectedKeys.push(parameter.parameterpk);
                        }
                    });

                    return deselectedKeys;
                };

                return ExportParameterCollection;
            }]
        );

