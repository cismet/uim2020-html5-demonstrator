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
        ).factory('ExportDatasource',
        [
            function () {
                'use strict';

                function ExportDatasource(externalDatasource) {
                    var _this = this;

                    this.name = externalDatasource.name;
                    this.filename = externalDatasource.filename;
                    this.groupName = '';
                    this.selected = false;
                    this.setGlobal(externalDatasource.global);
                    this.parameters = [];

                    externalDatasource.parameters.forEach(function (parameter) {
                        _this.parameters.push(angular.copy(parameter));
                    });
                }

                ExportDatasource.prototype.setGlobal = function (global) {
                    this.global = global;

                    if (global === true) {
                        this.groupName = 'Eigene lokale Datenquellen';
                    } else {
                        this.groupName = 'Vorkonfigurierte globale Datenquellen';
                    }
                };

                ExportDatasource.prototype.isGlobal = function () {
                    return this.global;
                };

                ExportDatasource.prototype.isSelected = function () {
                    return this.selected;
                };

                ExportDatasource.prototype.setSelected = function (selected) {
                    this.selected = selected;
                };

                ExportDatasource.prototype.toggleSelection = function () {
                    this.selected = !this.selected ? true : false;
                    return this.selected;
                };

                ExportDatasource.prototype.setParameters = function (parameters) {
                    this.parameters.length = 0;
                    parameters.forEach(function (parameter) {
                        this.parameters.push(angular.extend(
                                {}, parameter));
                    });
                };

                ExportDatasource.prototype.equals = function (exportDatasource) {
                    if (typeof exportDatasource !== 'undefined' &&
                            exportDatasource !== null &&
                            exportDatasource.name === this.name &&
                            exportDatasource.filename === this.filename &&
                            exportDatasource.parameters.length === this.parameters.length) {
                        return true;
                    } else {
                        return false;
                    }
                };

                ExportDatasource.prototype.getSelectedParameters = function () {
                    var selectedParameters = [];

                    this.parameters.forEach(function (parameter) {
                        if (parameter.selected === true) {
                            selectedParameters.push(parameter);
                        }
                    });

                    return selectedParameters;
                };

                return ExportDatasource;
            }]
        );
