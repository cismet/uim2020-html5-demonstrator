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
        'de.cismet.uim2020-html5-demonstrator.services'
        ).service('sharedControllers',
        [function () {
                'use strict';

                this.appController = undefined;
                this.mainController = undefined;
                this.analysisMapController = undefined;
                this.searchController = undefined;
                this.analysisMapController = undefined;
                this.searchMapController = undefined;
                this.searchListController = undefined;
                this.protocolController = undefined;
            }]);