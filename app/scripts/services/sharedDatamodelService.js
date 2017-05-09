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
                
                var _this;
                _this = this;

                // auth token
                _this.identity = null;

                // resolved entity
                _this.resolvedEntity = null;

                // search selection
                _this.selectedSearchThemes = [];
                _this.selectedSearchPollutants = [];
                _this.selectedGazetteerLocation = {};
                //_this.selectedSearchGeometry = {};
                _this.selectedSearchLocation = {
                    id: 0
                };

                // search results
                _this.resultNodes = [];
                _this.analysisNodes = [];

                // postfilters
                _this.filteredResultNodes = [];

                // data import
                _this.globalDatasources = [];
                _this.localDatasources = [];

                _this.status = {};
                _this.status.type = 'success';
                _this.status.message = 'UIM-2020 Demonstrator Datenintegration';
                _this.status.progress = {};
                _this.status.progress.current = 0;
                _this.status.progress.max = 0;
                
                _this.reset = function() {
                    _this.selectedSearchThemes.length = 0;     
                    _this.selectedSearchPollutants.length = 0;    
                    _this.resultNodes.length = 0;      
                    _this.selectedGazetteerLocation = {};
                    //_this.selectedSearchGeometry = {};
                    _this.selectedSearchLocation.id = 0;
                    _this.filteredResultNodes.length = 0;    
                    _this.status.type = 'success';
                    _this.status.message = 'Recherche zurückgesetzt';
                };
            }]);