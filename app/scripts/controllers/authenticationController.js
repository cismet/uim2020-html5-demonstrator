angular.module(
        'de.cismet.uim2020-html5-demonstrator.controllers'
        ).controller(
        'authenticationController',
        [
            '$scope',
            '$state',
            '$previousState',
            'authenticationService',
            function ($scope, $state, $previousState, authenticationService) {
                'use strict';

                this.signIn = function () {

                    // here, we fake authenticating and give a fake user
                    authenticationService.authenticate({
                        name: 'Test User',
                        roles: ['User']
                    });

                    if ($previousState.get("authentication") && 
                            $previousState.get("authentication").state && 
                            $previousState.get("authentication").state.name !== 'main.authentication') {
                        $previousState.go('authentication');
                    } else {
                        $state.go('main.search.map');
                    }
                };
            }
        ]
        );
