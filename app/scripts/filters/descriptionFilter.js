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
        'de.cismet.uim2020-html5-demonstrator.filters'
        ).filter(
        'descriptionFilter',
        function () {
            'use strict';

            return function (data) {
                var description = 'keine Beschreibung verfügbar';
                // BORIS
                if (data.literatur || data.institut) {
                    if (data.literatur) {
                        description = data.literatur;
                        if (data.institut) {
                            description += (' (' + data.institut + ")");
                        }
                    } else {
                        description = data.institut;
                    }
                    // EPRTR
                } else if (data.naceclass || data.erasid) {
                    if (data.naceclass) {
                        description = data.naceclass;
                    } else {
                        description = data.erasid;
                    }
                    // WAxW
                } else if (data.zustaendigestelle || data.bundesland) {
                    if (data.zustaendigestelle) {
                        description = data.zustaendigestelle;
                        if (data.bundesland && data.bundesland !== data.zustaendigestelle) {
                            description += (' (' + data.bundesland + ")");
                        }
                    } else {
                        description = data.bundesland;
                    }
                    // MOSS
                } else if (data.labno || data.sampleid) {
                    if (data.labNo) {
                        description = 'Labornummer: ' + data.labNo;
                    } else {
                        description = data.sampleid;
                    }
                }
                return description;
            };
        }
);
