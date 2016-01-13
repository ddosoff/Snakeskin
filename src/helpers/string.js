'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { any } from './gcc';
import { isString } from './types';

const
	wsRgxp = /^\s+|[\r\n]+/mg;

/**
 * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
 *
 * @param {!Array.<string>} strings
 * @param {...string} expr
 * @return {string}
 */
export function ws(strings, expr) {
	expr = [].slice.call(arguments, 1);
	return any($C(strings).reduce((str, el, i) => str + el.replace(wsRgxp, ' ') + (i in expr ? expr[i] : ''), ''));
}

const
	rRgxp = /([\\\/'*+?|()\[\]{}.^$-])/g;

/**
 * Escapes RegExp characters in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function r(str) {
	return str.replace(rRgxp, '\\$1');
}
