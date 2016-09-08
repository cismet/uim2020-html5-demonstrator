/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular, L */
angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('sharedDatamodel',
        [function () {
                'use strict';

                // search selection
                this.selectedSearchThemes = [];
                this.selectedSearchPollutants = [];
                this.selectedGazetteerLocation = {};
                this.selectedSearchGeometry = {};
                this.selectedSearchLocation = {};

                //search results
                this.resultNodes = [];
                this.analysisNodes = [];
            }]);