/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global angular */

angular.module('de.cismet.uim2020-html5-demonstrator.services')
        .factory('postfilterService',
                ['$q', 'sharedDatamodel',
                    function ($q, sharedDatamodel) {
                        'use strict';
                        var filterNodesByTags, getFilteredNodeIndices, resetFilteredNodes;

                        getFilteredNodeIndices = function (nodes, tagPostfilterCollections) {
                            return $q(function (resolve, reject) {
                                var filteredNodesIndices = [];

                                if (sharedDatamodel.resultNodes !== nodes) {
                                    console.error('postfilterService::getFilteredNodeIndices: provided nodes array (' +
                                            nodes.length + ' does not match sharedDatamodel.resultNodes (' +
                                            sharedDatamodel.resultNodes.length + ')!');
                                    reject(filteredNodesIndices);
                                }

                                // process tag filters and add filtered nodes to index
                                tagPostfilterCollections.forEach(function (tagPostfilterCollection) {
                                    nodes.forEach(function (node, index) {
                                        // process only nodes not yet filtered!
                                        if (!filteredNodesIndices.includes(index)) {
                                            // process only filters matching the node class
                                            if (tagPostfilterCollection.className === 'ALL' ||
                                                    tagPostfilterCollection.className === node.$className) {

                                                var tags, deselectedTagKeys, filtered;

                                                tags = node.$data.tags;
                                                deselectedTagKeys = tagPostfilterCollection.getDeselectedKeys();

                                                filtered = !tags.every(function (tag, index, array) {
                                                    // return false if tag is filtered (Array.every stops on false)
                                                    return !deselectedTagKeys.includes(tag.key);
                                                });

                                                if (filtered) {
                                                    filteredNodesIndices.push(index);
                                                }
                                            }
                                        }
                                    });
                                });

                                //console.log('postfilterService: filtered ' + filteredNodesIndices.length + ' nodes of ' + nodes.length + ' available result nodes nodes');
                                resolve(filteredNodesIndices);
                            });
                        };

                        /**
                         * Returns a promise which resolved to the filtered nodes array
                         * @param {type} nodes
                         * @param {type} tagPostfilterCollections
                         * @return {unresolved}
                         */
                        filterNodesByTags = function (nodes, tagPostfilterCollections) {
                            var promise = getFilteredNodeIndices(nodes, tagPostfilterCollections);
                            return promise.then(
                                    function resolve(filteredNodesIndices) {
                                        nodes.forEach(function (node, index, array) {
                                            if (filteredNodesIndices.includes(index)) {
                                                node.$filtered = true;
                                            } else {
                                                node.$filtered = false;
                                            }
                                        });

                                        return filteredNodesIndices;
                                    },
                                    function reject(filteredNodesIndices) {
                                        return filteredNodesIndices;
                                    }
                            );
                        };

                        resetFilteredNodes = function (nodes) {
                            nodes.forEach(function (node, index, array) {
                                node.$filtered = false;
                            });
                        };

                        return {
                            filterNodesByTags: filterNodesByTags,
                            resetFilteredNodes: resetFilteredNodes
                        };
                    }]);


