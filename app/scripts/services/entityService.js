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

                // FIXME: authenticationService.getAuthorizationToken() not update after new user login
                entityResource = $resource(
                        cidsRestApiConfig.host + '/' + cidsRestApiConfig.domain + '.:className/:objectId',
                        {
                            omitNullValues: true,
                            deduplicate: true,
                            role: 'default' // FIXME: retrieve role f5rom identity
                            
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
