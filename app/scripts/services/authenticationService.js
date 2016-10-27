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
        ).factory('authenticationService',
        [
            '$q',
            '$http',
            '$cookieStore',
            'configurationService',
            'base64',
            function ($q, $http, $cookieStore, configurationService, base64) {
                'use strict';
                var _identity, _authenticate,
                        isIdentityResolved, isAuthenticated, isInRole, isInAnyRole,
                        authenticate, resolveIdentity, getIdentity, getAuthorizationToken,
                        clearIdentity;

                _identity = null;

                isIdentityResolved = function () {
                    return angular.isDefined(_identity);
                };

                isAuthenticated = function () {
                    return _identity !== undefined &&
                            _identity !== null &&
                            _identity.authorizationToken !== undefined &&
                            _identity.authorizationToken !== null;
                };

                isInRole = function (role) {
                    if (!isAuthenticated() || !_identity.userGroups) {
                        return false;
                    }

                    return _identity.userGroups.indexOf(role) !== -1;
                };

                isInAnyRole = function (userGroups) {
                    if (!isAuthenticated() || !_identity.userGroups) {
                        return false;
                    }

                    for (var i = 0; i < userGroups.length; i++) {
                        if (this.isInRole(userGroups[i]))
                            return true;
                    }

                    return false;
                };

                authenticate = function (username, domain, password) {
                    var authorizationToken;
                    authorizationToken = 'Basic ' + base64.encode(username + '@' + domain + ':' + password);
                    return _authenticate(authorizationToken);
                };


                /**
                 * Authenticates a user. On success Returns a promise that resolves to the autenticated identiy
                 * and on failure rejects to the $http response object (e.g. check response.status === 401)
                 * 
                 * @param {type} authorizationToken
                 * @returns {nm$_deferred.exports.promise|nm$_deferred.module.exports.promise|$q@call;defer.promise}
                 */
                _authenticate = function (authorizationToken) {
                    var deferred, requestURL, request;
                    // clear identity
                    _identity = null;

                    //$cookieStore.put(configurationService.authentication.cookie, null);
                    requestURL = configurationService.cidsRestApi.host + '/users';
                    deferred = $q.defer();

                    request = {
                        method: 'GET',
                        url: requestURL,
                        headers: {
                            'Authorization': authorizationToken,
                            'Accept': 'application/json'
                        }
                    };

                    $http(request).then(
                            function successCallback(response) {
                                _identity = response.data;
                                _identity.authorizationToken = authorizationToken;
                                $cookieStore.put(configurationService.authentication.cookie, _identity);
                                deferred.resolve(_identity);
                            },
                            function errorCallback(response) {
                                deferred.reject(response);
                            });

                    return deferred.promise;
                };

                /**
                 * Resolves an identity stored in a cookie. After 1st successfull call to this method, the 
                 * identity is directly resolved from a local variable. Returns a promise that resolves
                 * either to the authenticated identity or null.
                 * 
                 * 
                 * @param {type} checkValidity checks server vor validity
                 * @returns {nm$_deferred.exports.promise|nm$_deferred.module.exports.promise|$q@call;defer.promise}
                 */
                resolveIdentity = function (checkValidity) {

                    // already identicated? 
                    if (isAuthenticated()) {
                        return $q.when(_identity);
                    }

                    _identity = $cookieStore.get(configurationService.authentication.cookie);
                    if (!isAuthenticated()) {
                        // may return null or empty object 
                        console.warn("no stored session cookie available, user has to re-authenticate");
                        return $q.when(_identity);
                    }

                    if (checkValidity) {
                        // check if authenticated identity is still valid!
                        return _authenticate(_identity.authorizationToken);
                    } else {
                        return $q.when(_identity);
                    }
                };

                getIdentity = function () {
                    return _identity;
                };

                getAuthorizationToken = function () {
                    return isAuthenticated() ? _identity.authorizationToken : null;
                };
                
                clearIdentity = function () {
                    _identity = null;
                    $cookieStore.put(configurationService.authentication.cookie, null);
                };

                resolveIdentity();

                return {
                    isIdentityResolved: isIdentityResolved,
                    isAuthenticated: isAuthenticated,
                    isInRole: isInRole,
                    isInAnyRole: isInAnyRole,
                    authenticate: authenticate,
                    resolveIdentity: resolveIdentity,
                    getIdentity: getIdentity,
                    getAuthorizationToken: getAuthorizationToken,
                    clearIdentity: clearIdentity
                };
            }
        ]).factory('base64', function () {
    /* jshint ignore:start */
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                console.error("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 !== 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 !== 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
    };
    /* jshint ignore:end */
});
