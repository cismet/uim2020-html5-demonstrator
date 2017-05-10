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
        ).factory('ExternalDatasource',
        [
            function () {
                'use strict';

                /**
                 * ExternalDatasource = SHP File
                 * 
                 * @param {type} externalDatasource
                 * @return {ExternalDatasourceL#15.ExternalDatasource}
                 */
                function ExternalDatasource(externalDatasource) {
                    var _this = this;

                    this.name = null;
                    this.filename = null;
                    this.global = false;
                    this.parameters = [];
                    this.data = null;

                    // copy properties from externalDatasource object (angular resource)
                    // and ignore $resolved and $promise
                    if (externalDatasource) {
                        for (var key in externalDatasource) {
                            if (externalDatasource.hasOwnProperty(key) && _this.hasOwnProperty(key) &&
                                    key !== '$resolved' && key !== '$promise') {
                                _this[key] = externalDatasource[key];
                            }
                        }
                    }
                }

                ExternalDatasource.prototype.isSelected = function () {
                    if (typeof this.$layer !== 'undefined' &&
                            this.$layer !== null &&
                            typeof this.$layer.$selected !== 'undefined' &&
                            this.$layer.$selected === true) {
                        return true;
                    }

                    return false;
                };

                ExternalDatasource.prototype.setSelected = function (selected) {
                    if (typeof this.$layer !== 'undefined' && this.$layer !== null) {
                        this.$layer.$selected = selected;
                    } else {
                        console.warn('ExternalDatasource::setSelected -> cannot set selected property of datasource "' +
                                filename + '", $layer property is null');
                    }
                };

                ExternalDatasource.prototype.setLayer = function (layer) {
                    this.$layer = layer;
                };

                ExternalDatasource.prototype.setParameters = function (parameters) {
                    this.parameters.length = 0;
                    this.parameters.push.apply(this.parameters, parameters);
                };

                return ExternalDatasource;
            }]
        );

