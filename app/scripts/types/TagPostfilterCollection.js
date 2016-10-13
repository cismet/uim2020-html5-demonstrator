/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module(
        'de.cismet.uim2020-html5-demonstrator.types'
        ).factory('TagPostfilterCollection',
        [
            function () {
                'use strict';

                function TagPostfilterCollection(className, taggroupkey, title) {
                    this.className = className;
                    this.taggroupkey = taggroupkey;
                    this.title = title;
                    this.tags = [];
                    this.tagsKeys = [];

                    /**
                     * Tags not available for filtering
                     */
                    this.forbiddenTags = ['METplus', 'KWSplus', 'PESTplus', 'THGundLSSplus', 'DNMplus', 'SYSSplus'];
                }

                TagPostfilterCollection.prototype.clear = function () {
                    this.tagsKeys.length = 0;
                    this.tags.length = 0;
                };

                /**
                 * Add a new distinct tag to the collection and set $selected property
                 * to true by default
                 * 
                 * @param {type} tag
                 * @returns {Boolean}
                 */
                TagPostfilterCollection.prototype.addTag = function (tag) {
                    // only add tags not yet in list 
                    if (tag && tag.key && tag.taggroupkey &&
                            this.taggroupkey === tag.taggroupkey &&
                            this.forbiddenTags.indexOf(tag.key) === -1 &&
                            this.tagsKeys.indexOf(tag.key) === -1)
                    {
                        // keep tag keys seperately because indexOf does not work anymore after extending the tag object
                        // don't use js associate arrays: length is always null!!?? :-(
                        this.tagsKeys.push(tag.key);
                        // push a shallow copy and extend by $selected property
                        this.tags.push(angular.extend({
                            '$selected': true}, tag));
                        return true;
                    }

                    return false;
                };

                TagPostfilterCollection.prototype.removeTag = function (key) {
                    return delete this.tags[key];
                };

                TagPostfilterCollection.prototype.isEmpty = function () {
                    return this.tags.length === 0;
                };

                TagPostfilterCollection.prototype.length = function () {
                    return  this.tags.length;
                };

                /**
                 * Add all supported tags from nodes that match the configured className and
                 * taggroupkey
                 * 
                 * @param {type} nodes
                 * @param {type} clear
                 * @param {type} sort
                 * @return {undefined}
                 */
                TagPostfilterCollection.prototype.addAllFromNodes = function (nodes, clear, sort) {
                    var i, node, tags;
                    if (nodes !== null && nodes.length > 0) {
                        for (i = 0; i < nodes.length; ++i) {
                            node = nodes[i];
                            // Attention: collects also tags of filtered nodes! (node.$filtered)
                            if (node.$data && node.$data.tags &&
                                    (this.className === 'ALL' || this.className === node.$className)) {
                                tags = node.$data.tags;
                                this.addAll(tags, clear, sort);
                            }
                        }
                    }

                    return this.tags;
                };

                TagPostfilterCollection.prototype.addAll = function (tags, clear, sort) {
                    var i;
                    if (clear === true) {
                        this.clear();
                    }

                    for (i = 0; i < tags.length; i++) {
                        this.addTag(tags[i]);
                    }

                    if (sort === true) {
                        this.tags.sort(function (a, b) {
                            if (a.key > b.key) {
                                return 1;
                            }
                            if (a.key < b.key) {
                                return -1;
                            }
                            // a must be equal to b
                            return 0;
                        });
                    }

                    return this.tags;
                };

                TagPostfilterCollection.prototype.selectAll = function () {
                    this.tags.forEach(function (tag) {
                        tag.$selected = true;
                    });
                };


                TagPostfilterCollection.prototype.deselectAll = function () {
                    this.tags.forEach(function (tag) {
                        tag.$selected = false;
                    });
                };

                TagPostfilterCollection.prototype.invertSelection = function () {
                    this.tags.forEach(function (tag) {
                        tag.$selected = !tag.$selected;
                    });
                };

                TagPostfilterCollection.prototype.allSelected = function () {
                    this.tags.every(function (tag, index, array) {
                        if (!tag.$selected) {
                            return false;
                        }
                    });

                    return true;
                };

                TagPostfilterCollection.prototype.allDeselected = function () {
                    this.tags.every(function (tag, index, array) {
                        if (tag.$selected) {
                            return false;
                        }
                    });

                    return true;
                };

                TagPostfilterCollection.prototype.getSelectedTags = function () {
                    var selectedTags = [];

                    this.tags.forEach(function (tag) {
                        if (tag.$selected === true) {
                            selectedTags.push(tag);
                        }
                    });

                    return selectedTags;
                };

                TagPostfilterCollection.prototype.getDeselectedTags = function () {
                    var deselectedTags = [];

                    this.tags.forEach(function (tag) {
                        if (tag.$selected === false) {
                            deselectedTags.push(tag);
                        }
                    });

                    return deselectedTags;
                };

                TagPostfilterCollection.prototype.getSelectedKeys = function () {
                    var selectedKeys = [];

                    this.tags.forEach(function (tag) {
                        if (tag.$selected === true) {
                            selectedKeys.push(tag.key);
                        }
                    });

                    return selectedKeys;
                };

                TagPostfilterCollection.prototype.getDeselectedKeys = function () {
                    var deselectedKeys = [];

                    this.tags.forEach(function (tag) {
                        if (tag.$selected === false) {
                            deselectedKeys.push(tag.key);
                        }
                    });

                    return deselectedKeys;
                };

                return TagPostfilterCollection;
            }]
        );

