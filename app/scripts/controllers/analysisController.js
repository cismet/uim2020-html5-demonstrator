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
            '$timeout', '$scope', '$state', 'sharedDatamodel', 'sharedControllers',
            'leafletData', 'dataService',
            function ($timeout, $scope, $state, sharedDatamodel,
                    sharedControllers, leafletData, dataService) {
                'use strict';

                var analysisController;
                analysisController = this;

                analysisController.mode = 'map';

                analysisController.clearAnalysisNodes = function () {
                    sharedDatamodel.analysisNodes.length = 0;
                    sharedControllers.analysisMapController.clearNodes();
                };

                analysisController.gotoNodes = function () {
                    sharedControllers.analysisMapController.gotoNodes();
                };

                analysisController.hasNodes = function () {
                    return sharedDatamodel.analysisNodes.length > 0;
                };

                // <editor-fold defaultstate="collapsed" desc="[!!!!] MOCK DATA (DISABLED) ----------------">        
//                var loadMockNodes = function (mockNodes) {
//                 if (mockNodes.$resolved) {
//                 sharedDatamodel.analysisNodes.length = 0;
//                 sharedDatamodel.analysisNodes.push.apply(sharedDatamodel.analysisNodes, mockNodes);
//                 } else {
//                 mockNodes.$promise.then(function (resolvedMockNodes) {
//                 loadMockNodes(resolvedMockNodes);
//                 });
//                 }
//                 };
//                 
//                 loadMockNodes(dataService.getMockNodes());
                // </editor-fold>

                sharedControllers.analysisController = analysisController;
                console.log('analysisController instance created');
            }
        ]
        );
