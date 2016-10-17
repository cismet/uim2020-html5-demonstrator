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

                function ExternalDatasource(externalDatasource) {
                    var _this = this;

                    this.name = null;
                    this.fileName = null;
                    this.isGlobal = false;

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
                    if (this.$layer !== null &&
                            typeof this.$layer.$selected !== 'undefined' &&
                            this.$layer.$selected === true) {
                        return true;
                    }
                };

                ExternalDatasource.prototype.setSelected = function (selected) {
                    if (this.$layer !== null) {
                        this.$layer.$selected = selected;
                    }
                };

                return ExternalDatasource;
            }]
        );

