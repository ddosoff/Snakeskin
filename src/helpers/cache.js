'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { NULL } from '../consts/links';
import { IS_NODE } from '../consts/hacks';
import { $globalCache, $globalFnCache } from '../consts/cache';
import { escapeEOLs } from './escape';

/**
 * Returns data from the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 * @return {(string|undefined)}
 */
export function getFromCache(key, code, params, ctx) {
	if (IS_NODE && ctx !== NULL && $globalFnCache[key]) {
		$C($globalFnCache[key][code]).forEach((el, key) => {
			ctx[key] = el;
		});
	}

	const
		cache = $globalCache[key] && $globalCache[key][code];

	if (!cache) {
		return;
	}

	if (params.words) {
		if (!cache.words) {
			return;
		}

		$C(cache.words).forEach((el, key) => {
			params.words[key] = el;
		});
	}

	if (params.debug) {
		if (!cache.debug) {
			return;
		}

		$C(cache.debug).forEach((el, key) => {
			params.debug[key] = el;
		});
	}

	return cache.text;
}

/**
 * Returns a cache key for the current SS process
 *
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 * @return {?string}
 */
export function getCacheKey(params, ctx) {
	return params.language ?
		null : JSON.stringify([
			params.exports,
			ctx !== NULL,
			escapeEOLs(params.eol),
			params.tolerateWhitespaces,
			params.renderAs,
			params.renderMode,
			params.prettyPrint,
			params.ignore,
			params.localization,
			params.i18nFn,
			params.literalBounds,
			params.bemFilter,
			params.filters,
			params.useStrict
		]);
}

/**
 * Saves compiled template functions in the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 */
export function saveIntoFnCache(key, code, params, ctx) {
	if (ctx === NULL) {
		return;
	}

	ctx['init'](Snakeskin);
	if (!key || !(params.cache || $globalCache[key])) {
		return;
	}

	$globalFnCache[key] = $C.extend(false, $globalFnCache[key], {[code]: ctx});
}

/**
 * Saves templates in the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Parser} parser - instance of a Parser class
 */
export function saveIntoCache(key, code, params, parser) {
	if (!key || !(params.cache || $globalCache[key])) {
		return;
	}

	$globalCache[key] = $C.extend(false, $globalCache[key], {
		[code]: {
			debug: params.debug,
			text: parser.result,
			words: params.words
		}
	});
}
