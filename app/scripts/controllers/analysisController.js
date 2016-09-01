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
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'analysisController',
        [
            '$scope',
            function ($scope) {
                'use strict';

                $scope.mode = "analysis";
            }
        ]
        );
