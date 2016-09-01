/*globals angular*/
angular.module(
        'de.cismet.uim2020-html5-demonstrator.directives'
        ).directive('ngSize', [
    '$rootScope',
    function ($rootScope) {
        'use strict';
        return {
            restrict: 'A',
            controller: 
        [
            '$scope',
            function ($scope) {
                 $scope.size = {};
                 
            }],
            link: function ($scope, element) {
           

                var handler, exists;

                $rootScope.ngSizeDimensions = (angular.isArray($rootScope.ngSizeDimensions)) ? $rootScope.ngSizeDimensions : [];
                $rootScope.ngSizeWatch = (angular.isArray($rootScope.ngSizeWatch)) ? $rootScope.ngSizeWatch : [];

                handler = function () {
                    angular.forEach($rootScope.ngSizeWatch, function (el, i) {
                        // Dimensions Not Equal?
                        if ($rootScope.ngSizeDimensions[i][0] !== el.offsetWidth ||
                                $rootScope.ngSizeDimensions[i][1] !== el.offsetHeight) {
                            // Update Them
                            $rootScope.ngSizeDimensions[i] = [el.offsetWidth, el.offsetHeight];
                            // Update Scope?
                            $rootScope.$broadcast('size::changed', i);
                        }
                    });
                };

                // Add Element to Chain?
                exists = false;
                angular.forEach($rootScope.ngSizeWatch, function (el, i) {
                    if (el === element[0]) {
                        exists = i;
                    }
                });

                // Ok.
                if (exists === false) {
                    $rootScope.ngSizeWatch.push(element[0]);
                    $rootScope.ngSizeDimensions.push([element[0].offsetWidth, element[0].offsetHeight]);
                    exists = $rootScope.ngSizeWatch.length - 1;
                }

                // Update Scope?
                $scope.$on('size::changed', function (event, i) {
                    // Relevant to the element attached to *this* directive
                    if (i === exists) {
                        if(!$scope.size) {
                            $scope.size = {};
                        }
                        
                        $scope.size.width = $rootScope.ngSizeDimensions[i][0];
                        $scope.size.height = $rootScope.ngSizeDimensions[i][1];
                              
                        console.log('width: ' + $scope.size.width);
                        console.log('height: ' +  $scope.size.height);
                    }
                });

                // Refresh: 100ms
                if (!window.ngSizeHandler) {
                    window.ngSizeHandler = setInterval(handler, 10);
                }
                    

                // Window Resize?
                angular.element(window).on('resize', handler);

            }
        };
    }]);