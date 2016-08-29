angular.module(
    'de.cismet.uim2020-html5-demonstrator.services'
).factory('myService',
    [
        function () {
            'use strict';

            return {
                tellMe: function () { 
                    return 'The \'scripts/services\' folder contains the actual services that will automagically be processed during build.'; 
                }
            };
        }
    ]);
