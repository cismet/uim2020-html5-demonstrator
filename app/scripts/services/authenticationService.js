angular.module(
        'de.cismet.uim2020-html5-demonstrator.services'
        ).factory('authenticationService', ['$q', '$http', '$timeout',
    function ($q, $http, $timeout) {
        'use strict';
        var _identity, _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }

                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i]))
                        return true;
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;

                // for this demo, we'll store the identity in localStorage. 
                // For you, it could be a cookie, sessionStorage, whatever
                if (identity)
                    localStorage.setItem("de.cismet.uim2020-html5-demonstrator.identity", angular.toJson(identity));
                else
                    localStorage.removeItem("de.cismet.uim2020-html5-demonstrator.identity");
            },
            getIdentity: function (force) {
                //var deferred = $q.defer();

                if (force === true) {
                     _identity = undefined;
                    _authenticated = false;
                    return _identity;
                }
                   

                // check and see if we have retrieved the identity data from the server. 
                // if we have, reuse it by immediately resolving
                
                /*if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }*/
      
 
                // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
                //                   $http.get('/svc/account/identity', { ignoreErrors: true })
                //                        .success(function(data) {
                //                            _identity = data;
                //                            _authenticated = true;
                //                            deferred.resolve(_identity);
                //                        })
                //                        .error(function () {
                //                            _identity = null;
                //                            _authenticated = false;
                //                            deferred.resolve(_identity);
                //                        });

                // for the sake of the demo, we'll attempt to read the identity from localStorage. 
                // the example above might be a way if you use cookies or need to retrieve the latest identity from an api
                // i put it in a timeout to illustrate deferred resolution
                
                /*
                var self = this;
                $timeout(function () {
                    _identity = angular.fromJson(localStorage.getItem("de.cismet.uim2020-html5-demonstrator.identity"));
                    self.authenticate(_identity);
                    deferred.resolve(_identity);
                }, 1000);

                return deferred.promise;
                */
                
                var storage = localStorage.getItem("de.cismet.uim2020-html5-demonstrator.identity");
                if(storage) {
                    _identity = angular.fromJson(storage);
                    _authenticated = true;
                }
                
                
                return _identity;
            }
        };
    }
]);
