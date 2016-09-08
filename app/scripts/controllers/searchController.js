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
        'searchController',
        [
            '$window', '$timeout', '$scope', '$state', 'leafletData',
            'configurationService', 'sharedDatamodel', 'dataService',
            function ($window, $timeout, $scope, $state, leafletData,
                    configurationService, sharedDatamodel, dataService) {
                'use strict';

                var searchController, fireResize, mapController;

                searchController = this;

                // Configurations: 
                // <editor-fold defaultstate="collapsed" desc="   - Gazetteer Locations Selection Box Configuration">
                // TODO: add coordinates to selectedSearchLocation on selection!
                searchController.searchLocations = [{
                        name: 'Gesamter Kartenausschnitt',
                        id: 0,
                        geometry: null
                    }, {
                        name: 'Boundingbox Auswahl',
                        id: 1,
                        geometry: null
                    }]

                searchController.searchLocations = dataService.getSearchLocations();
                sharedDatamodel.selectedSearchLocation = angular.copy(searchController.searchLocations[0]);
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
                            externalIdProp: '' // -> Full Object as model
                        });
                // </editor-fold>
                // <editor-fold defaultstate="collapsed" desc="   - Search Themes Selection Box Configuration">
                searchController.searchThemes = dataService.getSearchThemes();
                searchController.selectedSearchThemes = sharedDatamodel.selectedSearchThemes;
                searchController.searchThemesSettings = angular.extend(
                        {},
                        configurationService.multiselect.settings, {
                            smartButtonMaxItems: 0,
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

                console.log('searchController instance created');
                //$scope.name = 'main';
                //mainController.name = 'this.main';
                //$scope.mode = 'search';
                searchController.mode = 'map';

//                var fireResize = function () {
//                    //$scope.currentHeight = $window.innerHeight - $scope.navbarHeight;
//                    //$scope.currentWidth = $window.innerWidth - ($scope.toolbarShowing ? $scope.toolbarWidth : 0);
//                    leafletData.getMap('search-map').then(function (map) {
//                        if (map && map._container.parentElement) {
//                            console.log('searchController::fireResize: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
//                            $scope.mapHeight = map._container.parentElement.offsetHeight;
//                            $scope.mapWidth = map._container.parentElement.offsetWidth;
//                            //map.invalidateSize(animate);
//                        }
//
//                    });
//                };
//
//                angular.element($window).bind('resize', function () {
//                    fireResize(false);
//                });



                searchController.gotoLocation = function () {
                    // TODO: check if paramters are selected ...

                    // check state, activate map if necessary
                    if (searchController.mode !== 'map') {
                        $state.go('^.map'); // will go to the sibling map state.
                        // $state.go('main.search.map');
                    }

                    $scope.$broadcast('gotoLocation()');
                };

                // FIXME: implement Mock Function
                searchController.search = function (mockNodes) {
                    if (!mockNodes) {
                        mockNodes = dataService.getMockNodes();
                    }

                    if (mockNodes.$resolved) {
                        var tmpMockNodes;

                        sharedDatamodel.resultNodes.length = 0;
                        // must use push() or the referenc ein other controllers is destroyed!
                        //tmpMockNodes = angular.copy(mockNodes.slice(0, 20));
                        tmpMockNodes = angular.copy(mockNodes);
                        sharedDatamodel.resultNodes.push.apply(sharedDatamodel.resultNodes, tmpMockNodes);

                        sharedDatamodel.analysisNodes.length = 0;
                        // make a copy -> 2 map instances -> 2 feature instances needed
                        //tmpMockNodes = angular.copy(mockNodes.slice(5, 15));
                        //sharedDatamodel.analysisNodes.push.apply(sharedDatamodel.analysisNodes, tmpMockNodes);

                        $scope.$broadcast('searchSuccess()');

                        // access controller from child scope leaked into parent scope
                        //$scope.mapController.setNodes(mockNodes.slice(0, 10));
                        //$scope.listController.setNodes(mockNodes.slice(0, 15));


                    } else {
                        mockNodes.$promise.then(function (resolvedMockNodes) {
                            searchController.search(resolvedMockNodes);
                        });
                    }
                };

                // TODO: put into parent scope?
                $scope.$on('$stateChangeSuccess', function (toState) {
                    if ($state.includes("main.search") && !$state.is("main.search")) {
                        //$scope.mode = $state.current.name.split(".").slice(1, 2).pop();
                        searchController.mode = $state.current.name.split(".").slice(1, 3).pop();
                        //console.log('searchController::mode: ' + searchController.mode);

                        // resize the map on state change
                        if (searchController.mode === 'map') {
                            leafletData.getMap('search-map').then(function (map) {
                                $timeout(function () {
                                    if (map && map._container.parentElement) {
                                        if (map._container.parentElement.offsetHeight > 0 &&
                                                map._container.parentElement.offsetWidth) {
                                            $scope.mapHeight = map._container.parentElement.offsetHeight;
                                            $scope.mapWidth = map._container.parentElement.offsetWidth;
                                            //console.log('searchController::stateChangeSuccess new size: ' + map._container.parentElement.offsetWidth + "x" + map._container.parentElement.offsetHeight);
                                            map.invalidateSize(false);

                                        } else {
                                            //console.warn('searchController::stateChangeSuccess saved size: ' + $scope.mapWidth + "x" + $scope.mapHeight);
                                            map.invalidateSize(false);
                                        }
                                    }
                                }, 100);
                            });
                        }
                    }
                });
            }
        ]
        );
