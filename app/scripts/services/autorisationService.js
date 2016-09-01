angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        )
// autorisationService service's purpose is to wrap up authorize functionality
// it basically just checks to see if the authenticationService is authenticated and checks the root state 
// to see if there is a state that needs to be authorized. if so, it does a role check.
// this is used by the state resolver to make sure when you refresh, hard navigate, or drop onto a
// route, the app resolves your identity before it does an authorize check. after that,
// authorize is called from $stateChangeStart to make sure the authenticationService is allowed to change to
// the desired state
        .factory('autorisationService', ['$rootScope', '$state', '$previousState', 'authenticationService',
            function ($rootScope, $state, $previousState, authenticationService) {
                'use strict';
                return {
                    authorize: function () {
                        return authenticationService.identity()
                                .then(function () {
                                    var isAuthenticated = authenticationService.isAuthenticated();

                                    if ($rootScope.toState.data.roles && 
                                            $rootScope.toState.data.roles.length > 0 && 
                                            !authenticationService.isInAnyRole($rootScope.toState.data.roles)) {
                                        if (isAuthenticated) {
                                            console.warn('user is not in any role');
                                            $previousState.memo('autorisation');
                                            //$state.go('accessdenied'); // user is signed in but not authorized for desired state
                                        } else {
                                            // user is not authenticated. stow the state they wanted before you
                                            // send them to the signin state, so you can return them when you're done
                                            $previousState.memo('autorisation');

                                            // now, send them to the signin state so they can log in
                                            $state.go('signin');
                                        }
                                    }
                                });
                    }
                };
            }
        ]);
