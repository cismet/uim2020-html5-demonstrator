angular.module('').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/my-directive.html',
    "<div>\r" +
    "\n" +
    "    The 'templates' folder contains template htmls of directives that will automagically be processed during build.<br>\r" +
    "\n" +
    "    The 'scripts/directives' folder contains the actual directives that will automagically be processed during build.<br>\r" +
    "\n" +
    "    {{description}}<br>\r" +
    "\n" +
    "    {{info}}\r" +
    "\n" +
    "</div>"
  );

}]);
