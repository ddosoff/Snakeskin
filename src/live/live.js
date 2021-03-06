'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { isArray } from '../helpers/types';

/**
 * Special Snakeskin class for escaping HTML entities from an object
 *
 * @constructor
 * @param {?} obj - source object
 * @param {?string=} [opt_attr] - type of attribute declaration
 */
Snakeskin.HTMLObject = function (obj, opt_attr) {
	this.value = obj;
	this.attr = opt_attr;
};

/**
 * StringBuffer constructor
 *
 * @constructor
 * @return {!Array}
 */
Snakeskin.StringBuffer = function () {
	return [];
};

/**
 * @param {!Function} child
 * @param {!Function} parent
 */
function inherit(child, parent) {
	/** @constructor */
	const F = function () {
		this.constructor = child;
	};

	F.prototype = parent.prototype;
	child.prototype = new F();
}

/**
 * Node constructor
 * @constructor
 */
Snakeskin.Node = function () {};

/**
 * Returns the number of child elements
 * @return {number}
 */
Snakeskin.Node.prototype.length = function () {
	return this.value.childNodes.length;
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin.Node.prototype.textContent = function () {
	return this.value.textContent;
};

/**
 * DocumentFragment constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin.DocumentFragment = function (renderMode) {
	this.renderMode = renderMode;
	this.value = document.createDocumentFragment();
};

inherit(Snakeskin.DocumentFragment, Snakeskin.Node);

/**
 * Appends a child to the document fragment
 * @param {?} el - element for appending
 */
Snakeskin.DocumentFragment.prototype.appendChild = function (el) {
	this.value.appendChild(el);
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin.DocumentFragment.prototype.textContent = function () {
	const
		children = this.value.childNodes;

	let res = '';
	for (let i = 0; i < children.length; i++) {
		res += children[i].outerHTML || children[i].textContent;
	}

	return res;
};

/**
 * Element constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} name - element name
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin.Element = function (name, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createElement(name);
};

inherit(Snakeskin.Element, Snakeskin.Node);

/**
 * Appends a child to the element
 * @param {?} el - element for appending
 */
Snakeskin.Element.prototype.appendChild = function (el) {
	this.value.appendChild(el);
};

/**
 * Sets an attribute to the element
 *
 * @param {string} name - attribute name
 * @param {string} val - attribute value
 */
Snakeskin.Element.prototype.setAttribute = function (name, val) {
	this.value.setAttribute(name, val);
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin.Element.prototype.textContent = function () {
	return this.value.outerHTML;
};

/**
 * Comment constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} text - comment text
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin.Comment = function (text, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createComment(text);
};

inherit(Snakeskin.Comment, Snakeskin.Node);

/**
 * Text constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} text
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin.Text = function (text, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createTextNode(text);
};

inherit(Snakeskin.Text, Snakeskin.Node);

/**
 * Map of inline tag names
 * @const
 */
Snakeskin.inlineTags = {
	'html': {
		'area': 'href',
		'base': 'href',
		'br': true,
		'col': true,
		'embed': 'src',
		'hr': true,
		'img': 'src',
		'input': 'value',
		'link': 'href',
		'meta': 'content',
		'param': 'value',
		'source': 'src',
		'track': 'src',
		'wbr': true
	},

	'xml': {

	}
};

/**
 * Appends a value to the specified element
 *
 * @param {(!Snakeskin.DocumentFragment|!Snakeskin.Element)} el - base element
 * @param {?} val - value for appending
 * @param {string} renderMode - rendering mode of templates
 * @return {(!Snakeskin.Element|!Snakeskin.Comment|!Snakeskin.Text)}
 */
Snakeskin.appendChild = function (el, val, renderMode) {
	if (val instanceof Snakeskin.Node === false) {
		val = new Snakeskin.Text(String(val), renderMode);
	}

	if (el) {
		el.appendChild(val.value);
	}

	return val;
};

/**
 * Sets an attribute to the specified element
 *
 * @param {!Snakeskin.Node} node - source element
 * @param {string} name - attribute name
 * @param {?} val - attribute value
 */
Snakeskin.setAttribute = function (node, name, val) {
	node.setAttribute(name, val instanceof Snakeskin.Node ? val.textContent() : String(val));
};

const
	keys = (() => /\[native code]/.test(Object.keys && Object.keys.toString()) && Object.keys)();

/**
 * Common iterator
 * (with hasOwnProperty for objects)
 *
 * @param {(Array|Object|undefined)} obj - source object
 * @param {(
 *   function(?, ?, !Array, {isFirst: boolean, isLast: boolean, length: number})|
 *   function(?, ?, !Object, {i: number, isFirst: boolean, isLast: boolean, length: number})
 * )} callback - callback function
 */
Snakeskin.forEach = function (obj, callback) {
	if (!obj) {
		return;
	}

	let
		length = 0;

	if (isArray(obj)) {
		length = obj.length;
		for (let i = 0; i < length; i++) {
			if (callback(obj[i], i, obj, {isFirst: i === 0, isLast: i === length - 1, length}) === false) {
				break;
			}
		}

	} else if (keys) {
		const
			arr = keys(obj);

		length = arr.length;
		for (let i = 0; i < length; i++) {
			if (callback(obj[arr[i]], arr[i], obj, {i, isFirst: i === 0, isLast: i === length - 1, length}) === false) {
				break;
			}
		}

	} else {
		if (callback.length >= 4) {
			for (const key in obj) {
				if (!obj.hasOwnProperty(key)) {
					break;
				}

				length++;
			}
		}

		let i = 0;
		for (const key in obj) {
			if (!obj.hasOwnProperty(key)) {
				break;
			}

			if (callback(obj[key], key, obj, {i, isFirst: i === 0, isLast: i === length - 1, length}) === false) {
				break;
			}

			i++;
		}
	}
};

/**
 * Object iterator
 * (without hasOwnProperty)
 *
 * @param {(Object|undefined)} obj - source object
 * @param {function(?, string, !Object, {i: number, isFirst: boolean, isLast: boolean, length: number})} callback - callback function
 */
Snakeskin.forIn = function (obj, callback) {
	if (!obj) {
		return;
	}

	let
		length = 0,
		i = 0;

	if (callback.length >= 4) {
		/* eslint-disable guard-for-in */
		for (const ignore in obj) {
			length++;
		}
		/* eslint-enable guard-for-in */
	}

	for (const key in obj) {
		if (callback(obj[key], key, obj, {i, isFirst: i === 0, isLast: i === length - 1, length}) === false) {
			break;
		}

		i++;
	}
};

/**
 * Decorates a function by another functions
 *
 * @param {!Array<!Function>} decorators - array of decorator functions
 * @param {!Function} fn - source function
 * @return {!Function}
 */
Snakeskin.decorate = function (decorators, fn) {
	Snakeskin.forEach(decorators, (decorator) => fn = decorator(fn) || fn);
	fn.decorators = decorators;
	return fn;
};
