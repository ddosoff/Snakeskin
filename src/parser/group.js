'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { $dirGroups } from '../consts/cache';
import { clone } from '../helpers/object';

const
	cache = {};

/**
 * Returns a map of directive names,
 * which belong to the specified groups
 *
 * @param {...string} names - group name
 * @return {!Object.<string, boolean>}
 */
Parser.prototype.getGroup = function (names) {
	const
		inline = this.inlineIterators,
		cacheKey = $C.toArray(arguments).join();

	if (cache[inline] && cache[inline][cacheKey]) {
		return clone(cache[inline][cacheKey]);
	}

	const
		map = {},
		ignore = {};

	$C(arguments).forEach((name) => {
		if (name === 'callback' && inline) {
			$C($dirGroups['inlineIterator']).forEach((el, key) => {
				ignore[key] = true;
			});
		}

		$C($dirGroups[name]).forEach((el, key) => {
			if (ignore[key]) {
				return;
			}

			map[key] = true;
		});
	});

	cache[inline] = cache[inline] || {};
	cache[inline][cacheKey] = clone(map);

	return map;
};

/**
 * Returns an array of directive names,
 * which belong to the specified groups
 *
 * @param {...string} names - group name
 * @return {!Array.<string>}
 */
Parser.prototype.getGroupList = function (names) {
	return Object.keys(this.getGroup(...arguments));
};
