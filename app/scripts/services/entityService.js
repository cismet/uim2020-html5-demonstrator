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
        ).factory('entityService',
        ['$resource', 'configurationService', 'authenticationService',
            function ($resource, configurationService, authenticationService) {
                'use strict';

                var cidsRestApiConfig, entityResource;

                cidsRestApiConfig = configurationService.cidsRestApi;

                entityResource = $resource(
                        cidsRestApiConfig.host + '/' + cidsRestApiConfig.domain + '.:className/:objectId',
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

                return {
                    entityResource: entityResource
                };
            }]
        );
