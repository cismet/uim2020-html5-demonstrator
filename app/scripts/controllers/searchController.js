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
            '$rootScope', '$window', '$timeout', '$scope', '$state', '$uibModal', 'leafletData',
            'configurationService', 'sharedDatamodel', 'dataService', 'searchService',
            function ($rootScope, $window, $timeout, $scope, $state, $uibModal, leafletData,
                    configurationService, sharedDatamodel, dataService, searchService) {
                'use strict';

                var searchController, searchProcessCallback, showProgress, progressModal;
                searchController = this;
                // set default mode according to default route in app.js 
                searchController.mode = 'map';
                searchController.status = sharedDatamodel.status;

                // === Configurations ==========================================
                // <editor-fold defaultstate="collapsed" desc="   - Search Locations Selection Box Configuration">
                // TODO: add coordinates to selectedSearchLocation on selection!
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
                // <editor-fold defaultstate="collapsed" desc="=== Local Helper Functions ====================================">

                showProgress = function () {
                    var modalScope;
                    console.log('searchController::showProgress()');
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

                searchProcessCallback = function (current, max, type) {

                    console.log('searchProcess: type=' + type + ', current=' + current + ", max=" + max)
                    // the maximum object count
                    searchController.status.progress.max = 100;
                    // the scaled progress: 0 <fake progress> 100 <real progress> 200
                    // searchController.searchStatus.current = ...

                    // start of search (indeterminate)
                    if (max === -1 && type === 'success') {
                        // count up fake progress to 100
                        searchController.status.progress.current = current;

                        if (current < 95) {
                            searchController.status.message = 'Search for resource Meta-Data is in progress, please wait.';
                            searchController.status.type = 'success';
                        } else {
                            searchController.status.message = 'The SWITCH-ON Meta-Data Repository is under heavy load, please wait for the search to continue.';
                            searchController.status.type = 'warning';
                        }

                        // search completed
                    } else if (current === max && type === 'success') {
                        if (current > 0) {
                            searchController.status.progress.current = 100;
                            searchController.status.message = 'Search completed, Meta-Data of ' + current +
                                    (current > 1 ? ' resources' : ' resource') + ' retrieved from the SWITCH-ON Meta-Data Repository.';
                            searchController.status.type = 'success';

                        } else {
                            // feature request #59
                            searchController.status.progress.current = 100;
                            searchController.status.message = 'Search completed, but no matching resources found in the SWITCH-ON Meta-Data Repository.';
                            searchController.status.type = 'warning';
                        }

                        if (progressModal) {
                            // wait 1/2 sec before closing to allow the progressbar
                            // to advance to 100% (see #59)
                            // 
                            // doesn't work anymore?!
                            // 
                            //$timeout(function () {
                            //    progressModal.close();
                            //}, 100);
                        }
                        // search error ...
                    } else if (type === 'error') {
                        searchController.status.progress.current = 100;
                        searchController.status.message = 'Search could not be perfomed: ';
                        searchController.status.type = 'danger';

                        $timeout(function () {
                            progressModal.close(searchController.status.message);
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

                // FIXME: implement Mock Function
                searchController.search = function (mockNodes) {
                    if (!mockNodes) {
                        mockNodes = dataService.getMockNodes();
                    }

                    if (mockNodes.$resolved) {

                        console.log('searchController::search()');
                        showProgress();

                        searchService.defaultSearch(
                                'SRID=4326;POLYGON((8.61328125 51.23440735163459,7.734374999999999 48.922499263758255,12.480468749999998 48.28319289548349,13.095703125 49.83798245308484,11.074218749999998 51.890053935216926,8.61328125 51.23440735163459))',
                                [21, 81, 82, 201, 62],
                                ['Al', 'As', 'Cd', 'Pb'],
                                99999,
                                0,
                                searchProcessCallback).$promise.then(function (success) {
                            console.log(success);
                        }, function (error) {
                            console.log(error);
                            //progressModal.close(error);
                            //progressModal.dismiss(error);
                        });

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
                // </editor-fold>

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

                console.log('searchController instance created');
            }
        ]
        );
