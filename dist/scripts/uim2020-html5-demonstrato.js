// main app module registration
var app = angular.module(
    'de.cismet.sip-html5-resource-registration',
    [
        'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'leaflet-directive',
        'mgo-angular-wizard','ui.select', 'uuid',
        'de.cismet.sip-html5-resource-registration.controllers',
        'de.cismet.sip-html5-resource-registration.directives',
        'de.cismet.sip-html5-resource-registration.services',
        'de.cismet.sip-html5-resource-registration.factories',
        'de.cismet.sip-html5-resource-registration.filters' 
    ]
);


app.config(function($logProvider){
  'use strict';
  $logProvider.debugEnabled(false);
});
angular.module(
    'de.cismet.sip-html5-resource-registration.controllers',
    [
         
    ]
);
// module initialiser for the directives, shall always be named like that so that concat will pick it up first!
// however, the actual directives implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.directives',
    [
       
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.factories',
    [
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.filters',
    [
    ]
);

// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.services',
    [
        'ngResource'
    ]
);