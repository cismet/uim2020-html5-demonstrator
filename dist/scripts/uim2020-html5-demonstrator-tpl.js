angular.module('').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/external-datasource-modal.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 class=\"modal-title\" \r" +
    "\n" +
    "        id=\"modal-title\">\r" +
    "\n" +
    "        Datenimport\r" +
    "\n" +
    "    </h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"modal-body\" id=\"modal-body\">\r" +
    "\n" +
    "    <form name=\"importForm\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"form-group row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <p>Unterstütztes Format: ESRI Shapefile (.SHP, .DBF) in ZIP Archiv.</p>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- Input File Selection -->\r" +
    "\n" +
    "        <div class=\"form-group row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div class=\"input-group\">\r" +
    "\n" +
    "                    <label class=\"input-group-btn\">\r" +
    "\n" +
    "                        <span class=\"btn btn-default\">\r" +
    "\n" +
    "                            Datei auswählen: \r" +
    "\n" +
    "                            <input type=\"file\" \r" +
    "\n" +
    "                                   style=\"display: none;\" \r" +
    "\n" +
    "                                   id=\"importFiles\"\r" +
    "\n" +
    "                                   required\r" +
    "\n" +
    "                                   ng-model=\"importController.importFile\"\r" +
    "\n" +
    "                                   ng-disabled=\"importController.importInProgress || importController.importCompleted\" \r" +
    "\n" +
    "                                   ngf-select\r" +
    "\n" +
    "                                   ngf-model-invalid=\"errorFile\"\r" +
    "\n" +
    "                                   ngf-max-size=\"importController.maxFilesize\"\r" +
    "\n" +
    "                                   ngf-multiple=\"false\" \r" +
    "\n" +
    "                                   ngf-pattern=\"'.zip'\"\r" +
    "\n" +
    "                                   name=\"importFile\">\r" +
    "\n" +
    "                        </span>\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    <input type=\"text\" \r" +
    "\n" +
    "                           class=\"form-control\" \r" +
    "\n" +
    "                           readonly\r" +
    "\n" +
    "                           ng-model=\"importController.importFile.name\">\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- upload file -->\r" +
    "\n" +
    "        <div class=\"form-group row\">\r" +
    "\n" +
    "            <div class=\"col-xs-10\">\r" +
    "\n" +
    "                <div class=\"form-check\">\r" +
    "\n" +
    "                    <label class=\"form-check-label\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" \r" +
    "\n" +
    "                               class=\"form-check-input\"\r" +
    "\n" +
    "                               ng-disabled=\"true\">\r" +
    "\n" +
    "                        Diese Datei allen anderen Nutzern zur Verfügung stellen\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <!-- Upload and Processing Progress -->\r" +
    "\n" +
    "        <div class=\"form-group row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <p>\r" +
    "\n" +
    "                    <i ng-show=\"importForm.importFile.$error.maxSize\">\r" +
    "\n" +
    "                        Die Datei ist zu groß: {{errorFile.size / 1000000|number:1}}MB. \r" +
    "\n" +
    "                        Maximale Dateigröße:  {{importController.maxFilesize}}.\r" +
    "\n" +
    "                    </i>\r" +
    "\n" +
    "                </p>\r" +
    "\n" +
    "                <uib-progressbar class=\"progress-striped\" \r" +
    "\n" +
    "                             ng-class=\"{active:importController.importInProgress}\"\r" +
    "\n" +
    "                             max=\"200\" \r" +
    "\n" +
    "                             value=\"importController.importProgress\"\r" +
    "\n" +
    "                             type=\"primary\">\r" +
    "\n" +
    "                    <!--{{importController.importProgress}}-->\r" +
    "\n" +
    "                </uib-progressbar>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <!-- Import Button -->\r" +
    "\n" +
    "    <button class=\"btn btn-default pull-left\"\r" +
    "\n" +
    "            type=\"button\" \r" +
    "\n" +
    "            ng-disabled=\"!importForm.$valid || importController.importInProgress\"\r" +
    "\n" +
    "            ng-show=\"!importController.importCompleted\" \r" +
    "\n" +
    "            ng-click=\"importController.import()\">\r" +
    "\n" +
    "        Importieren\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Close Button -->\r" +
    "\n" +
    "    <button class=\"btn btn-default pull-left\"\r" +
    "\n" +
    "            type=\"button\" \r" +
    "\n" +
    "            ng-show=\"importController.importCompleted\" \r" +
    "\n" +
    "            ng-click=\"importController.close()\">\r" +
    "\n" +
    "        Schliessen\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Cancel Button -->\r" +
    "\n" +
    "    <button \r" +
    "\n" +
    "        class=\"btn btn-default pull-left\" \r" +
    "\n" +
    "        type=\"button\" \r" +
    "\n" +
    "        ng-disabled=\"importController.importInProgress\" \r" +
    "\n" +
    "        ng-click=\"importController.cancel()\">Abbrechen\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/external-datasources.html',
    "<div class=\"popover\" \r" +
    "\n" +
    "     tabindex=\"-1\" \r" +
    "\n" +
    "     style=\"min-width:500px\" \r" +
    "\n" +
    "     ng-controller=\"externalDatasourcesController as externalDatasourcesController\"\r" +
    "\n" +
    "     id=\"externalDatasourcesPopover\"\r" +
    "\n" +
    "     name=\"externalDatasourcesPopover\">\r" +
    "\n" +
    "    <div class=\"arrow\"></div>\r" +
    "\n" +
    "    <h1 class=\"popover-title\">\r" +
    "\n" +
    "        <button type=\"button\" \r" +
    "\n" +
    "                class=\"close\" \r" +
    "\n" +
    "                ng-click=\"$hide()\">\r" +
    "\n" +
    "            <span class=\"fa fa-close\"></span>\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <big><strong>Externe Datenquellen</strong></big></h1>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!--<div class=\"panel-heading\">\r" +
    "\n" +
    "        <button type=\"button\" \r" +
    "\n" +
    "                class=\"close\" \r" +
    "\n" +
    "                ng-click=\"$hide()\">\r" +
    "\n" +
    "            <span class=\"fa fa-close\"></span>\r" +
    "\n" +
    "        </button>\r" +
    "\n" +
    "        <h4>Externe Datenquellen</h4>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "    <div class=\"popover-content\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <uib-accordion close-others=\"false\">\r" +
    "\n" +
    "            <!-- Vorkonfigurierte globale Datenquellen-->\r" +
    "\n" +
    "            <div uib-accordion-group  \r" +
    "\n" +
    "                 ng-init=\"globalDatasourcesOpen = true\" \r" +
    "\n" +
    "                 is-open=\"globalDatasourcesOpen\"\r" +
    "\n" +
    "                 ng-class=\"{'text-muted': isDisabled}\">\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <uib-accordion-heading>\r" +
    "\n" +
    "                    <div uib-accordion-header \r" +
    "\n" +
    "                         style=\"margin:0px;padding:8px;background-color:#c6e1ec;color:#3d7489\">\r" +
    "\n" +
    "                        Vorkonfigurierte globale Datenquellen\r" +
    "\n" +
    "                        <i class=\"pull-right glyphicon\" \r" +
    "\n" +
    "                           ng-class=\"{'glyphicon-chevron-down': globalDatasourcesOpen, 'glyphicon-chevron-up': !globalDatasourcesOpen}\">\r" +
    "\n" +
    "                        </i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </uib-accordion-heading>\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <div class=\"checkbox\" style=\"width:100%;clear:right\"\r" +
    "\n" +
    "                     ng-repeat=\"globalDatasource in externalDatasourcesController.globalDatasources\">\r" +
    "\n" +
    "                    <label class=\"form-check-label\">\r" +
    "\n" +
    "                        <input \r" +
    "\n" +
    "                            class=\"form-check-input\"\r" +
    "\n" +
    "                            type=\"checkbox\"\r" +
    "\n" +
    "                            name=\"{{globalDatasource.name}}\"\r" +
    "\n" +
    "                            ng-checked=\"globalDatasource.$layer && globalDatasource.$layer.$selected\"\r" +
    "\n" +
    "                            ng-click=\"externalDatasourcesController.toggleGlobalDatasourceSelection(globalDatasource)\"\r" +
    "\n" +
    "                            ng-disabled=\"true\"> \r" +
    "\n" +
    "                        {{globalDatasource.name}}\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Eigene lokale Datenquellen-->\r" +
    "\n" +
    "            <div uib-accordion-group  \r" +
    "\n" +
    "                 ng-init=\"localDatasourcesOpen = true\" \r" +
    "\n" +
    "                 is-open=\"localDatasourcesOpen\">\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <uib-accordion-heading>\r" +
    "\n" +
    "                    <div uib-accordion-header \r" +
    "\n" +
    "                         style=\"margin:0px;padding:8px;background-color:#c6e1ec;color:#3d7489\">\r" +
    "\n" +
    "                        Eigene lokale Datenquellen\r" +
    "\n" +
    "                        <i class=\"pull-right glyphicon\" \r" +
    "\n" +
    "                           ng-class=\"{'glyphicon-chevron-down': localDatasourcesOpen, 'glyphicon-chevron-up': !localDatasourcesOpen}\">\r" +
    "\n" +
    "                        </i>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </uib-accordion-heading>\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <div class=\"checkbox\" style=\"width:100%;clear:right\"\r" +
    "\n" +
    "                     ng-repeat=\"localDatasource in externalDatasourcesController.localDatasources\">\r" +
    "\n" +
    "                    <label class=\"form-check-label\">\r" +
    "\n" +
    "                        <input \r" +
    "\n" +
    "                            class=\"form-check-input\"\r" +
    "\n" +
    "                            type=\"checkbox\"\r" +
    "\n" +
    "                            name=\"{{localDatasource.name}}\"\r" +
    "\n" +
    "                            ng-checked=\"localDatasource.$layer && localDatasource.$layer.$selected\"\r" +
    "\n" +
    "                            ng-click=\"externalDatasourcesController.toggleLocalDatasourceSelection(localDatasource)\"> \r" +
    "\n" +
    "                        {{localDatasource.name}}\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    <a class=\"btn btn-icon pull-right\"\r" +
    "\n" +
    "                       title=\"Lokale Datenquelle entfernen\"\r" +
    "\n" +
    "                       ng-click=\"externalDatasourcesController.removeLocalDatasource(localDatasource)\">\r" +
    "\n" +
    "                        <span class=\"fa fa-minus-circle pull-right\" style=\"color:red\"></span>\r" +
    "\n" +
    "                    </a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                \r" +
    "\n" +
    "                <a class=\"btn btn-icon pull-right\"\r" +
    "\n" +
    "                   title=\"Neue lokale Datenquelle hinzufügen\"\r" +
    "\n" +
    "                   ng-click=\"externalDatasourcesController.addLocalDatasource()\">\r" +
    "\n" +
    "                    <span class=\"fa fa-plus-circle\" style=\"color:green\"></span>\r" +
    "\n" +
    "                </a>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </uib-accordion>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"panel-footer\">\r" +
    "\n" +
    "        <button type=\"button\" \r" +
    "\n" +
    "                class=\"btn btn-default\" \r" +
    "\n" +
    "                ng-click=\"$hide()\">\r" +
    "\n" +
    "            Schliessen\r" +
    "\n" +
    "        </button><!--\r" +
    "\n" +
    "        <button type=\"button\" \r" +
    "\n" +
    "                class=\"btn btn-default\" \r" +
    "\n" +
    "                ng-click=\"popover.saved = true;$hide()\">\r" +
    "\n" +
    "            Abbrechen\r" +
    "\n" +
    "        </button>-->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
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
