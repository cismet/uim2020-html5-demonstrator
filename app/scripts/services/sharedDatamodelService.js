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

                // auth token
                this.identity = null;

                // resolved entity
                this.resolvedEntity = null;

                // search selection
                this.selectedSearchThemes = [];
                this.selectedSearchPollutants = [];
                this.selectedGazetteerLocation = {};
                //this.selectedSearchGeometry = {};
                this.selectedSearchLocation = {
                    id: 0
                };

                // search results
                this.resultNodes = [];
                this.analysisNodes = [];

                // postfilters
                this.filteredResultNodes = [];

                // data import
                this.selectedGlobalDatasources = [];
                this.localDatasources = [];
                this.selectedLocalDatasources = [];

                this.status = {};
                this.status.type = 'success';
                this.status.message = 'UIM-2020 Demonstrator Datenintegration';
                this.status.progress = {};
                this.status.progress.current = 0;
                this.status.progress.max = 0;
            }]);