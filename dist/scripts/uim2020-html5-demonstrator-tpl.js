angular.module('').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/external-datasource-modal.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\" \n" +
    "        id=\"modal-title\">\n" +
    "        Datenimport\n" +
    "    </h3>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\" id=\"modal-body\">\n" +
    "    <form name=\"importForm\">\n" +
    "\n" +
    "        <div class=\"form-group row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <p>Unterstütztes Format: ESRI Shapefile (.SHP, .DBF) in ZIP Archiv.</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- Input File Selection -->\n" +
    "        <div class=\"form-group row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <label class=\"input-group-btn\">\n" +
    "                        <span class=\"btn btn-default\">\n" +
    "                            Datei auswählen: \n" +
    "                            <input type=\"file\" \n" +
    "                                   style=\"display: none;\" \n" +
    "                                   id=\"importFiles\"\n" +
    "                                   required\n" +
    "                                   ng-model=\"importController.importFile\"\n" +
    "                                   ng-disabled=\"importController.importInProgress || importController.importCompleted\" \n" +
    "                                   ngf-select\n" +
    "                                   ngf-model-invalid=\"errorFile\"\n" +
    "                                   ngf-max-size=\"importController.maxFilesize\"\n" +
    "                                   ngf-multiple=\"false\" \n" +
    "                                   ngf-pattern=\"'.zip'\"\n" +
    "                                   name=\"importFile\">\n" +
    "                        </span>\n" +
    "                    </label>\n" +
    "                    <input type=\"text\" \n" +
    "                           class=\"form-control\" \n" +
    "                           readonly\n" +
    "                           ng-model=\"importController.importFile.name\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- upload file -->\n" +
    "        <div class=\"form-group row\">\n" +
    "            <div class=\"col-xs-10\">\n" +
    "                <div class=\"form-check\">\n" +
    "                    <label class=\"form-check-label\">\n" +
    "                        <input type=\"checkbox\" \n" +
    "                               class=\"form-check-input\"\n" +
    "                               ng-disabled=\"true\">\n" +
    "                        Diese Datei allen anderen Nutzern zur Verfügung stellen\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        \n" +
    "        <!-- Upload and Processing Progress -->\n" +
    "        <div class=\"form-group row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <p>\n" +
    "                    <i ng-show=\"importForm.importFile.$error.maxSize\">\n" +
    "                        Die Datei ist zu groß: {{errorFile.size / 1000000|number:1}}MB. \n" +
    "                        Maximale Dateigröße:  {{importController.maxFilesize}}.\n" +
    "                    </i>\n" +
    "                </p>\n" +
    "                <uib-progressbar class=\"progress-striped\" \n" +
    "                             ng-class=\"{active:importController.importInProgress}\"\n" +
    "                             max=\"200\" \n" +
    "                             value=\"importController.importProgress\"\n" +
    "                             type=\"primary\">\n" +
    "                    <!--{{importController.importProgress}}-->\n" +
    "                </uib-progressbar>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <!-- Import Button -->\n" +
    "    <button class=\"btn btn-default pull-left\"\n" +
    "            type=\"button\" \n" +
    "            ng-disabled=\"!importForm.$valid || importController.importInProgress\"\n" +
    "            ng-show=\"!importController.importCompleted\" \n" +
    "            ng-click=\"importController.import()\">\n" +
    "        Importieren\n" +
    "    </button>\n" +
    "\n" +
    "    <!-- Close Button -->\n" +
    "    <button class=\"btn btn-default pull-left\"\n" +
    "            type=\"button\" \n" +
    "            ng-show=\"importController.importCompleted\" \n" +
    "            ng-click=\"importController.close()\">\n" +
    "        Schliessen\n" +
    "    </button>\n" +
    "\n" +
    "    <!-- Cancel Button -->\n" +
    "    <button \n" +
    "        class=\"btn btn-default pull-left\" \n" +
    "        type=\"button\" \n" +
    "        ng-disabled=\"importController.importInProgress\" \n" +
    "        ng-click=\"importController.cancel()\">Abbrechen\n" +
    "    </button>\n" +
    "</div>"
  );


  $templateCache.put('templates/external-datasources.html',
    "<div class=\"popover\" \n" +
    "     tabindex=\"-1\" \n" +
    "     style=\"min-width:500px\" \n" +
    "     ng-controller=\"externalDatasourcesController as externalDatasourcesController\"\n" +
    "     id=\"externalDatasourcesPopover\"\n" +
    "     name=\"externalDatasourcesPopover\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <h1 class=\"popover-title\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"close\" \n" +
    "                ng-click=\"$hide()\">\n" +
    "            <span class=\"fa fa-close\"></span>\n" +
    "        </button>\n" +
    "        <big><strong>Externe Datenquellen</strong></big></h1>\n" +
    "\n" +
    "    <!--<div class=\"panel-heading\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"close\" \n" +
    "                ng-click=\"$hide()\">\n" +
    "            <span class=\"fa fa-close\"></span>\n" +
    "        </button>\n" +
    "        <h4>Externe Datenquellen</h4>\n" +
    "    </div>-->\n" +
    "    <div class=\"popover-content\">\n" +
    "\n" +
    "        <uib-accordion close-others=\"false\">\n" +
    "            <!-- Vorkonfigurierte globale Datenquellen-->\n" +
    "            <div uib-accordion-group  \n" +
    "                 ng-init=\"globalDatasourcesOpen = true\" \n" +
    "                 is-open=\"globalDatasourcesOpen\"\n" +
    "                 ng-class=\"{'text-muted': isDisabled}\">\n" +
    "                \n" +
    "                <uib-accordion-heading>\n" +
    "                    <div uib-accordion-header \n" +
    "                         style=\"margin:0px;padding:8px;background-color:#c6e1ec;color:#3d7489\">\n" +
    "                        Vorkonfigurierte globale Datenquellen\n" +
    "                        <i class=\"pull-right glyphicon\" \n" +
    "                           ng-class=\"{'glyphicon-chevron-down': globalDatasourcesOpen, 'glyphicon-chevron-up': !globalDatasourcesOpen}\">\n" +
    "                        </i>\n" +
    "                    </div>\n" +
    "                </uib-accordion-heading>\n" +
    "                \n" +
    "                <div class=\"checkbox\" style=\"width:100%;clear:right\"\n" +
    "                     ng-repeat=\"globalDatasource in externalDatasourcesController.globalDatasources\">\n" +
    "                    <label class=\"form-check-label\">\n" +
    "                        <input \n" +
    "                            class=\"form-check-input\"\n" +
    "                            type=\"checkbox\"\n" +
    "                            name=\"{{globalDatasource.name}}\"\n" +
    "                            ng-checked=\"globalDatasource.$layer && globalDatasource.$layer.$selected\"\n" +
    "                            ng-click=\"externalDatasourcesController.toggleGlobalDatasourceSelection(globalDatasource)\"\n" +
    "                            ng-disabled=\"true\"> \n" +
    "                        {{globalDatasource.name}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <!-- Eigene lokale Datenquellen-->\n" +
    "            <div uib-accordion-group  \n" +
    "                 ng-init=\"localDatasourcesOpen = true\" \n" +
    "                 is-open=\"localDatasourcesOpen\">\n" +
    "                \n" +
    "                <uib-accordion-heading>\n" +
    "                    <div uib-accordion-header \n" +
    "                         style=\"margin:0px;padding:8px;background-color:#c6e1ec;color:#3d7489\">\n" +
    "                        Eigene lokale Datenquellen\n" +
    "                        <i class=\"pull-right glyphicon\" \n" +
    "                           ng-class=\"{'glyphicon-chevron-down': localDatasourcesOpen, 'glyphicon-chevron-up': !localDatasourcesOpen}\">\n" +
    "                        </i>\n" +
    "                    </div>\n" +
    "                </uib-accordion-heading>\n" +
    "                \n" +
    "                <div class=\"checkbox\" style=\"width:100%;clear:right\"\n" +
    "                     ng-repeat=\"localDatasource in externalDatasourcesController.localDatasources\">\n" +
    "                    <label class=\"form-check-label\">\n" +
    "                        <input \n" +
    "                            class=\"form-check-input\"\n" +
    "                            type=\"checkbox\"\n" +
    "                            name=\"{{localDatasource.name}}\"\n" +
    "                            ng-checked=\"localDatasource.$layer && localDatasource.$layer.$selected\"\n" +
    "                            ng-click=\"externalDatasourcesController.toggleLocalDatasourceSelection(localDatasource)\"> \n" +
    "                        {{localDatasource.name}}\n" +
    "                    </label>\n" +
    "                    <a class=\"btn btn-icon pull-right\"\n" +
    "                       title=\"Lokale Datenquelle entfernen\"\n" +
    "                       ng-click=\"externalDatasourcesController.removeLocalDatasource(localDatasource)\">\n" +
    "                        <span class=\"fa fa-minus-circle pull-right\" style=\"color:red\"></span>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "                \n" +
    "                <a class=\"btn btn-icon pull-right\"\n" +
    "                   title=\"Neue lokale Datenquelle hinzufügen\"\n" +
    "                   ng-click=\"externalDatasourcesController.addLocalDatasource()\">\n" +
    "                    <span class=\"fa fa-plus-circle\" style=\"color:green\"></span>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "        </uib-accordion>\n" +
    "    </div>\n" +
    "    \n" +
    "    <div class=\"panel-footer\">\n" +
    "        <button type=\"button\" \n" +
    "                class=\"btn btn-default\" \n" +
    "                ng-click=\"$hide()\">\n" +
    "            Schliessen\n" +
    "        </button><!--\n" +
    "        <button type=\"button\" \n" +
    "                class=\"btn btn-default\" \n" +
    "                ng-click=\"popover.saved = true;$hide()\">\n" +
    "            Abbrechen\n" +
    "        </button>-->\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/wizard-step-tpl.html',
    "<section ng-show=\"selected\" ng-class=\"{current: selected, done: completed}\" class=\"step\">\r" +
    "\n" +
    "    <div class=\"panel panel-primary\">\r" +
    "\n" +
    "        <div class=\"panel-heading\">\r" +
    "\n" +
    "            <h1 class=\"panel-title\">{{wzTitle}}</h1>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"panel-body\">\r" +
    "\n" +
    "            <div ng-transclude></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"panel-footer clearfix\">\r" +
    "\n" +
    "            <button type=\"button\" \r" +
    "\n" +
    "                    class=\"btn btn-primary pull-right\" \r" +
    "\n" +
    "                    wz-next \r" +
    "\n" +
    "                    ng-disabled=\"!wzData.canProceed\">\r" +
    "\n" +
    "                {{wzData.proceedButtonText}}\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <span class=\"pull-right\">&nbsp;</span>\r" +
    "\n" +
    "            <button type=\"button\" \r" +
    "\n" +
    "                    class=\"btn btn-default pull-right\" \r" +
    "\n" +
    "                    wz-previous \r" +
    "\n" +
    "                    ng-disabled=\"!wzData.canGoBack\">\r" +
    "\n" +
    "                Zurück\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</section>"
  );


  $templateCache.put('templates/wizard-tpl.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"steps\" ng-transclude></div>\r" +
    "\n" +
    "    <ul class=\"steps-indicator steps-{{getEnabledSteps().length}}\" ng-if=\"!hideIndicators\">\r" +
    "\n" +
    "      <li ng-class=\"{default: !step.completed && !step.selected, \r" +
    "\n" +
    "                  current: step.selected && !step.completed, \r" +
    "\n" +
    "                  done: step.completed && !step.selected, \r" +
    "\n" +
    "                  editing: step.selected && step.completed}\" \r" +
    "\n" +
    "                  ng-repeat=\"step in getEnabledSteps()\">\r" +
    "\n" +
    "        <a ng-click=\"goTo(step)\">{{step.title || step.wzTitle}}</a>\r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
