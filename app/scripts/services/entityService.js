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
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory('entitiyService',
        ['$resource', '$q', '$interval', 'configurationService', 'authenticationService',
            function ($resource, $q, $interval, configurationService, authenticationService) {
                'use strict';

                var cidsRestApiConfig, entityResource;

                cidsRestApiConfig = configurationService.cidsRestApi;

                entityResource = $resource(
                        cidsRestApiConfig.host + '/' + cidsRestApiConfig.domain + '.:classname/:objId',
                        {
                            omitNullValues: true,
                            deduplicate: true
                        },
                        {
                            get: {
                                method: 'GET',
                                isArray: false,
                                headers: {
                                    'Authorization': authenticationService.getAuthorizationToken()
                                }
                            }
                        }
                );
            }]
        );
