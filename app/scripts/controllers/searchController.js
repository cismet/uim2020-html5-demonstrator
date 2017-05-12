/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular,Wkt*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'searchController',
        [
            '$rootScope', '$timeout', '$scope', '$state', '$stickyState', '$uibModal', 'configurationService',
            'sharedDatamodel', 'sharedControllers', 'dataService', 'searchService', 'DEVELOPMENT_MODE',
            function ($rootScope, $timeout, $scope, $state, $stickyState, $uibModal, configurationService, 
                sharedDatamodel, sharedControllers, dataService, searchService, DEVELOPMENT_MODE) {
                'use strict';
                var searchController, searchProgressCallback, showProgressModal, progressModal;
                searchController = this;
                // set default mode according to default route in app.js 
                searchController.mode = 'map';
                searchController.status = sharedDatamodel.status;
                // === Configurations ==========================================
                // <editor-fold defaultstate="collapsed" desc="   - Search Locations Selection Box Configuration">
                // TODO: add coordinates to selectedSearchLocation on selection!
                searchController.searchLocations = dataService.getSearchLocations();
                //sharedDatamodel.selectedSearchLocation = 0; //angular.copy(searchController.searchLocations[0]);
                searchController.selectedSearchLocation = sharedDatamodel.selectedSearchLocation;
                searchController.searchLocationsSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            showCheckAll: false,
                            showUncheckAll: false,
                            styleActive: false,
                            closeOnSelect: true,
                            scrollable: false,
                            displayProp: 'name',
                            idProp: 'id',
                            enableSearch: false,
                            smartButtonMaxItems: 1,
                            selectionLimit: 1, // -> the selection model will contain a single object instead of array. 
                            externalIdProp: 'id' // -> Full Object as model
                        });
                searchController.selectedSearchLocationEvents = {
                    onItemSelect: function (selectedSearchLocation) {
                        // Gesamter Kartenausschnitt
                        if (selectedSearchLocation.id === 0) {
                            $scope.$broadcast('setSearchLocation()');
                        }
                    }
                };
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="   - Search Themes Selection Box Configuration">
                searchController.searchThemes = dataService.getSearchThemes();
                searchController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                searchController.searchThemesSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            smartButtonMaxItems: 0,
                            idProp: 'className',
                            smartButtonTextConverter: function (itemText, originalItem) {
                                return searchController.selectedSearchThemes.length === 1 ?
                                        '1 Thema ausgewählt' : '';
                            }
                        });
                searchController.searchThemesTranslationTexts = angular.extend(
                        {},
                        configurationService.multiselect.translationTexts, {
                            buttonDefaultText: 'Themen auswählen',
                            dynamicButtonTextSuffix: 'Themen ausgewählt'
                        });
                // FIXME: translationTexts not updated in directive
                // See https://github.com/cismet/uim2020-html5-demonstrator/issues/2
                /*searchController.selectEvents = {
                 onItemSelect: function (item) {
                 searchController.searchThemesTranslationTexts.dynamicButtonTextSuffix =
                 searchController.selectedSearchThemes.length === 1 ?
                 'Thema ausgewählt' : 'Themen ausgewählt';
                 console.log(searchController.searchThemesTranslationTexts.dynamicButtonTextSuffix);
                 }
                 };*/
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="   - Search Pollutants Selection Box Configuration">
                if (dataService.getSearchPollutants().$resolved) {
                    searchController.searchPollutants = dataService.getSearchPollutants();
                } else {
                    dataService.getSearchPollutants().$promise.then(function (searchPollutants) {
                        searchController.searchPollutants = searchPollutants;
                    });
                }

                searchController.selectedSearchPollutants = sharedDatamodel.selectedSearchPollutants;
                searchController.searchPollutantsSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            scrollableHeight: '600px',
                            scrollable: true,
                            displayProp: 'pollutant_name',
                            idProp: 'pollutant_key',
                            searchField: 'pollutant_name',
                            enableSearch: true,
                            showEnableSearchButton: false,
                            selectByGroups: ['Metalle und Schwermetalle']
                        });
                searchController.searchPollutantsTranslationTexts = angular.extend(
                        {},
                        configurationService.multiselect.translationTexts, {
                            buttonDefaultText: 'Schadstoffe auswählen',
                            dynamicButtonTextSuffix: 'Schadstoffe ausgewählt'
                        });
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="   - Gazetteer Locations Selection Box Configuration">
                if (dataService.getGazetteerLocations().$resolved) {
                    searchController.gazetteerLocations = dataService.getGazetteerLocations();
                } else {
                    dataService.getGazetteerLocations().$promise.then(function (gazetteerLocations) {
                        searchController.gazetteerLocations = gazetteerLocations;
                    });
                }

                searchController.selectedGazetteerLocation = sharedDatamodel.selectedGazetteerLocation;
                searchController.gazetteerLocationsSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            styleActive: false,
                            closeOnSelect: true,
                            scrollableHeight: '600px',
                            scrollable: true,
                            displayProp: 'name',
                            idProp: '$self',
                            searchField: 'name',
                            enableSearch: true,
                            smartButtonMaxItems: 1,
                            selectionLimit: 1, // -> the selection model will contain a single object instead of array. 
                            externalIdProp: '' // -> Full Object as model
                        });
                searchController.gazetteerLocationsTranslationTexts = angular.extend(
                        {},
                        configurationService.multiselect.translationTexts, {
                            buttonDefaultText: 'Ort auswählen'
                        });
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ====================================">

                showProgressModal = function () {
                    var modalScope;
                    if(DEVELOPMENT_MODE === true)console.log('searchController::showProgress()');
                    modalScope = $rootScope.$new(true);
                    modalScope.status = searchController.status;
                    progressModal = $uibModal.open({
                        templateUrl: 'templates/search-progress-modal.html',
                        scope: modalScope,
                        size: 'lg',
                        backdrop: 'static'/*,
                         resolve: {searchController:searchController}*/
                    });
                    // check if the eror occurred before the dialog has actually been shown
                    progressModal.opened.then(function () {
                        if (searchController.status.type === 'error') {
                            progressModal.close();
                        }
                    });
                };
                searchProgressCallback = function (current, max, type) {
                    // if(DEVELOPMENT_MODE === true)console.log('searchProgress: type=' + type + ', current=' + current + ', max=' + max);
                    // the maximum object count
                    searchController.status.progress.max = 100;
                    // the scaled progress: 0 <fake progress> 100 <real progress> 200
                    // searchController.searchStatus.current = ...

                    // start of search (indeterminate)
                    if (max === -1 && type === 'success') {
                        // count up fake progress to 100
                        searchController.status.progress.current = current;
                        if (current < 95) {
                            searchController.status.message = 'Die Suche im UIM2020-DI Indexdatenbestand wird durchgeführt';
                            searchController.status.type = 'success';
                        } else {
                            searchController.status.message = 'Die UIM2020-DI Server sind z.Z. ausgelastet, bitte warten Sie einen Augenblick.';
                            searchController.status.type = 'warning';
                        }

                        // search completed
                    } else if (current === max && type === 'success') {
                        if (current > 0) {
                            if (current >= configurationService.searchService.maxLimit) {
                                searchController.status.progress.current = 100;
                                searchController.status.message = 'Es können maximal ' + searchController.status.progress.current +
                                        ' Messstellen angezeigt werden. Bitte grenzen Sie den Suchbereich weiter ein.';
                                searchController.status.type = 'info';
                            } else
                            {
                                searchController.status.progress.current = 100;
                                searchController.status.message = 'Suche erfolgreich, ' +
                                        (current === 1 ? 'eine Messstelle' : (current + ' Messstellen')) + ' im UIM2020-DI Indexdatenbestand gefunden.';
                                searchController.status.type = 'success';
                            }
                        } else {
                            // feature request #59
                            searchController.status.progress.current = 100;
                            searchController.status.message = 'Es wurden keine zu den Suchkriterien passenden Messstellen im UIM2020-DI Indexdatenbestand gefunden';
                            searchController.status.type = 'warning';
                        }

                        if (progressModal) {
                            // wait 1/2 sec before closing to allow the progressbar to advance to 100% (see #59)
                            $timeout(function () {
                                progressModal.close();
                            }, 500);
                        }
                        // search error ...
                    } else if (type === 'error') {
                        searchController.status.progress.current = 100;
                        searchController.status.message = 'Die Suche konnte aufgrund eines Server-Fehlers nicht durchgeführt werden.';
                        searchController.status.type = 'danger';
                        $timeout(function () {
                            if (progressModal) {
                                progressModal.close(searchController.status.message);
                            }
                        }, 2000);
                    }
                };
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="=== Public Controller API Functions ===========================">
                searchController.gotoLocation = function () {
                    // TODO: check if paramters are selected ...

                    // check state, activate map if necessary
                    if (searchController.mode !== 'map') {
                        $state.go('^.map'); // will go to the sibling map state.
                        // $state.go('main.search.map');
                    }

                    $scope.$broadcast('gotoLocation()');
                };
                
                searchController.reset = function () {
                    if(DEVELOPMENT_MODE === true)console.log('reset search view');

                    sharedDatamodel.reset();

                    $stickyState.reset('main.search.map');
                    $stickyState.reset('main.search.list');

                    
                    sharedControllers.searchMapController = null;
                    sharedControllers.searchListController = null;
  
                    // reload the whole search state to rewset also the toolbar controllers
                    $state.go('main.search.map',{},{reload: "main.search"});
                };

                /**
                 * Fit bounds to nodes
                 * 
                 * @returns {undefined}
                 */
                searchController.gotoNodes = function () {
                    if (searchController.mode !== 'map') {
                        $state.go('^.map'); // will go to the sibling map state.
                    }

                    sharedControllers.searchMapController.gotoNodes();
                };

                searchController.hasNodes = function () {
                    return sharedDatamodel.resultNodes.length > 0;
                };

                /**
                 * Main Search Function
                 * 
                 * @param {type} mockNodes
                 * @returns {undefined}
                 */
                searchController.search = function (mockNodes) {
                    var geometry, themes, pollutants, limit, offset;

                    geometry = sharedControllers.searchMapController.getSearchWktString();
                    themes = [];
                    pollutants = [];
                    limit = configurationService.searchService.defautLimit;
                    offset = 0;

                    sharedDatamodel.selectedSearchThemes.forEach(function (theme) {
                        themes.push(theme.id);
                    });

                    sharedDatamodel.selectedSearchPollutants.forEach(function (pollutant) {
                        pollutants.push(pollutant.id);
                    });

                    showProgressModal();

                    searchService.defaultSearch(
                            geometry,
                            themes,
                            pollutants,
                            limit,
                            offset,
                            searchProgressCallback).$promise.then(
                            function (searchResult)
                            {
                                sharedDatamodel.resultNodes.length = 0;
                                if (searchResult.$collection && searchResult.$collection.length > 0) {
                                    // The .push method can take multiple arguments, so by using 
                                    // .apply to pass all the elements of the second array as 
                                    // arguments to .push, you can get the result you want because
                                    // resultNodes.push(searchResult.$collection) would push the 
                                    // array object, not its elements!!!
                                    //
                                    sharedDatamodel.resultNodes.push.apply(
                                            sharedDatamodel.resultNodes, searchResult.$collection);
                                    
                                    if(sharedDatamodel.analysisNodes && sharedDatamodel.analysisNodes.length > 0) {
                                        sharedDatamodel.analysisNodes.forEach(function (analysisNode) {
                                            sharedDatamodel.resultNodes.forEach(function (resultNode) {
                                                if (resultNode.objectKey === analysisNode.objectKey) {
                                                    resultNode.$analysis = true;
                                                }
                                            });
                                        });
                                    }
                                }

                                $scope.$broadcast('searchSuccess()');
                            },
                            function (searchError) {
                                //console.log(searchError);
                                sharedDatamodel.resultNodes.length = 0;
                                $scope.$broadcast('searchError()');
                            });

                    // <editor-fold defaultstate="collapsed" desc="[!!!!] MOCK DATA (DISABLED) ----------------">        
                    /*                   
                     if(mockNodes === null || mockNodes === undefined) {
                     mockNodes = dataService.getMockNodes();
                     }             
                     
                     if (mockNodes.$resolved) {
                     
                     //var tmpMockNodes;
                     
                     sharedDatamodel.resultNodes.length = 0;
                     // must use push() or the reference in other controllers is destroyed!
                     //tmpMockNodes = angular.copy(mockNodes.slice(0, 20));
                     //tmpMockNodes = angular.copy(mockNodes);
                     //sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, tmpMockNodes);
                     sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, mockNodes);
                     $scope.$broadcast('searchSuccess()');
                     
                     
                     } else {
                     mockNodes.$promise.then(function (resolvedMockNodes) {
                     searchController.search(resolvedMockNodes);
                     });
                     }*/
                    // </editor-fold>
                };
                // </editor-fold>     

                sharedControllers.searchController = searchController;
                if(DEVELOPMENT_MODE === true)console.log('searchController instance created');
            }
        ]
        );
