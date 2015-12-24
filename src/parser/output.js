'use strict';

// jscs:disable requireTemplateStrings
// jscs:disable validateOrderInObjectKeys

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import esprima from '../deps/esprima';
import Snakeskin from '../core';
import Parser from './constructor';
import { concatProp } from '../helpers/literals';
import { r } from '../helpers/string';
import * as rgxp from '../consts/regs';
import { $consts, $scope } from '../consts/cache';
import {

	FILTER,
	MODS,
	G_MOD,
	L_MOD,
	P_OPEN,
	P_CLOSE

} from '../consts/literals';

const blackWords = {
	'+': true,
	'++': true,
	'-': true,
	'--': true,
	'~': true,
	'~~': true,
	'!': true,
	'!!': true,
	'break': true,
	'case': true,
	'catch': true,
	'continue': true,
	'delete': true,
	'do': true,
	'else': true,
	'false': true,
	'finally': true,
	'for': true,
	'function': true,
	'if': true,
	'in': true,
	'of': true,
	'instanceof': true,
	'new': true,
	'null': true,
	'return': true,
	'switch': true,
	'this': true,
	'throw': true,
	'true': true,
	'try': true,
	'typeof': true,
	'var': true,
	'const': true,
	'let': true,
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'debugger': true,
	'interface': true,
	'async': true,
	'await': true
};

const unaryBlackWords = {
	'new': true,
	'typeof': true,
	'instanceof': true,
	'in': true,
	'of': true
};

const undefUnaryBlackWords = {
	'new': true
};

const comboBlackWords = {
	'var': true,
	'const': true,
	'let': true
};

const
	nextWordCharRgxp = new RegExp(`[${r(G_MOD)}${r(L_MOD)}$+\\-~!${rgxp.w}[\\]().]`);

/**
 * Returns a full word from a string
 *
 * @param {string} str - source string
 * @param {number} pos - start search position
 * @return {{word: string, finalWord: string, unary: string}}
 */
Parser.prototype.getWordFromPos = function (str, pos) {
	let
		word = '',
		res = '',
		nRes = '';

	let
		pCount = 0,
		diff = 0;

	let
		start = 0,
		pContent = null;

	let
		unary,
		unaryStr = '';

	for (let i = pos, j = 0; i < str.length; i++, j++) {
		const
			el = str[i];

		if (pCount || nextWordCharRgxp.test(el) || (el === ' ' && (unary = unaryBlackWords[word]))) {
			if (el === ' ') {
				word = '';

			} else {
				word += el;
			}

			if (unary) {
				unaryStr = unaryStr || res;
				unary = false;
			}

			if (pContent !== null && (pCount > 1 || (pCount === 1 && !P_CLOSE[el]))) {
				pContent += el;
			}

			if (P_OPEN[el]) {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (P_CLOSE[el]) {
				if (pCount) {
					pCount--;

					if (!pCount) {
						let
							startD = start,
							endD = j;

						if (nRes) {
							startD = start + diff;
							endD = j + diff + pContent.length;
						}

						nRes =
							res.slice(0, startD) +
							(pContent && this.out(pContent, {unsafe: true})) +
							res.slice(endD);

						diff = nRes.length - res.length;
						pContent = null;
					}

				} else {
					break;
				}
			}

			res += el;
			if (nRes) {
				nRes += el;
			}

		} else {
			break;
		}
	}

	return {
		word: res,
		finalWord: nRes || res,
		unary: unaryStr
	};
};

const
	propRgxp = new RegExp(`[${rgxp.w}]`);

/**
 * Returns true, if a string part is a property of an object literal
 *
 * @param {string} str - source string
 * @param {number} start - start search position
 * @param {number} end - end search position
 * @return {boolean}
 */
function isSyOL(str, start, end) {
	let res;

	while (start--) {
		const
			el = str[start];

		if (!rgxp.eol.test(el)) {
			res = el === '?';
			break;
		}

		if (!rgxp.eol.test(el) && (!propRgxp.test(el) || el === '?')) {
			if (el === '{' || el === ',') {
				break;
			}

			res = true;
			break;
		}
	}

	if (!res) {
		for (let i = end; i < str.length; i++) {
			const
				el = str[i];

			if (!rgxp.eol.test(el)) {
				return el === ':';
			}
		}
	}

	return false;
}

/**
 * Returns true, if the next non-whitespace character
 * in a string is the assignment (=)
 *
 * @param {string} str - source string
 * @param {number} pos - start search position
 * @return {boolean}
 */
function isNextAssign(str, pos) {
	for (let i = pos; i < str.length; i++) {
		const
			el = str[i];

		if (!rgxp.eol.test(el)) {
			return el === '=' && str[i + 1] !== '=';
		}
	}

	return false;
}

const unMap = {
	'!html': true,
	'!undef': true
};

const
	unUndefLabel = '{undef}',
	unUndefRgxp = new RegExp(r(unUndefLabel), 'g');

const
	ssfRgxp = /__FILTERS__\./,
	nextCharRgxp = new RegExp(`[${r(G_MOD)}${r(L_MOD)}$+\\-~!${rgxp.w}]`),
	newWordRgxp = new RegExp(`[^${r(G_MOD)}${r(L_MOD)}$${rgxp.w}[\\].]`);

const
	numRgxp = /[0-9]/,
	modRgxp = new RegExp(`${r(L_MOD)}(?:\\d+|)`),
	strongModRgxp = new RegExp(`${r(L_MOD)}(\\d+)`);

const
	multPropRgxp = /\[|\./,
	firstPropRgxp = /([^.[]+)(.*)/,
	propValRgxp = /[^-+!(]+/;

const esprimaHackFn = (str) => str
	.trim()
	.replace(/^({.*)/, '($0)')
	.replace(/^\[(?!\s*])/, '$[')
	.replace(/\byield\b/g, '')
	.replace(/(?:break|continue) [_]{2,}I_PROTO__[${rgxp.w}]+;/, '');

const
	dangerRgxp = /\)\s*(?:{|=>)/,
	functionRgxp = /\bfunction\b/;

/**
 * Prepares a command to output:
 * binds to the scope and initialization filters
 *
 * @param {string} command - source command
 * @param {?{
 *   unsafe: (?boolean|undefined),
 *   skipFirstWord: (?boolean|undefined),
 *   skipValidation: (?boolean|undefined)
 * }=} [opt_params] - additional parameters:
 *
 *   *) [unsafe=false] - if is true, then default filters won't be applied to the resulting string
 *   *) [skipFirstWord=false] - if is true, then the first word in the string will be skipped
 *   *) [skipValidation=true] - if is false, then the resulting string won't be validated
 *
 * @return {string}
 */
Parser.prototype.out = function (command, opt_params) {
	const
		{unsafe, skipFirstWord, skipValidation} = opt_params || {};

	const
		{tplName, structure} = this,
		Filters = $C(Snakeskin.Filters);

	if (dangerRgxp.test(command)) {
		this.error('unsupported syntax');
		return '';
	}

	// DEFINITIONS:
	// Parenthesis = (

	let res = command;

	// The number of open parentheses in the string
	// (open parenthesis inside the filter aren't considered)
	let pCount = 0;

	// The number of open parentheses inside a filter:
	// |foo (1 + 2) / 3
	let pCountFilter = 0;

	// The array of positions for opening and closing parenthesis (pCount),
	// goes in ascending order of nested blocks, such as:
	// ((a + b)) => [[1, 7], [0, 8]]
	const pContent = [];

	// true, if there is a filter declaration
	let filterStart = false;

	// true, if there is a filter-wrapper, ie
	// (2 / 3)|round
	let filterWrapper = false;

	// Arrays of final filters and real filters,
	// for example:
	// {with foo}
	//     {bar |ucfirst bar()|json}
	// {end}
	//
	// rvFilter => ['ucfirst bar()', 'json']
	// filter => ['ucfirst foo.bar()', 'json']
	let
		filter = [],
		rvFilter = [];

	// true, if it is possible to calculate the word
	let nWord = !skipFirstWord;

	// The number of words to skip
	let posNWord = 0;

	// Scope
	const
		{scope} = this,
		useWith = Boolean(scope.length);

	// Shifts
	let
		addition = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	// true, if the !html filter is applied
	let unEscape = !this.escapeOutput;

	// true, if the !undef filter is applied
	let
		unUndef = !this.replaceUndef,
		globalUnUndef = unUndef;

	const
		vars = structure.children ? structure.vars : structure.parent.vars;

	let
		ref = this.hasBlock('block', true),
		type;

	if (ref) {
		ref = ref.params.name;
		type = 'block';

	} else if (this.proto) {
		ref = this.proto.name;
		type = 'proto';
	}

	if (ref && !$scope[type][tplName]) {
		ref = false;
	}

	function search(obj, val, extList) {
		if (!obj) {
			return false;
		}

		const def = vars[`${val}_${obj.id}`];

		if (def) {
			return def;
		}

		if (extList.length && obj.children[extList[0]]) {
			return search(obj.children[extList.shift()], val, extList);
		}

		return false;
	}

	const replacePropVal = (sstr) => {
		let def = vars[sstr];

		if (!def) {
			let refCache = ref &&
				$scope[type][tplName][ref];

			if (!refCache || refCache.parent && (!refCache.overridden || this.hasParent('__super__'))) {
				if (refCache) {
					def = search(refCache.root, sstr, getExtList(String(tplName)));
				}

				let tplCache = tplName &&
					$scope['template'][tplName];

				if (!def && tplCache && tplCache.parent) {
					def = search(tplCache.root, sstr, getExtList(String(tplName)));
				}
			}

			if (!def && refCache) {
				def = vars[`${sstr}_${refCache.id}`];
			}

			if (!def) {
				def = vars[`${sstr}_${this.environment.id}`] || vars[`${sstr}_00`];
			}
		}

		if (def) {
			return def.value;
		}

		return sstr;
	};

	function addScope(str) {
		if (multPropRgxp.test(str)) {
			let fistProp = firstPropRgxp.exec(str);
			fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);
			return fistProp.slice(1).join('');
		}

		return str.replace(propValRgxp, replacePropVal);
	}

	if (!command) {
		this.error('invalid syntax');
		return '';
	}

	const
		commandLength = command.length,
		end = commandLength - 1;

	const
		cacheLink = replacePropVal('$_');

	let
		isFilter,
		breakNum;

	for (let i = 0; i < commandLength; i++) {
		const
			el = command[i],
			next = command[i + 1],
			nNext = command[i + 2];

		if (!breakNum) {
			if (el === '(') {
				// Parenthesis opened inside a filter declaration
				if (filterStart) {
					pCountFilter++;

				} else {
					pContent.unshift([i + wordAddEnd]);
					pCount++;
				}
			}

			// Calculation of a scope:
			// nWord indicates that started a new word;
			// posNWord indicates how many new words to skip
			if (nWord && !posNWord && nextCharRgxp.test(el)) {
				const
					nextStep = this.getWordFromPos(command, i);

				let
					uAdd = wordAddEnd + addition,
					{word, finalWord} = nextStep,
					tmpFinalWord,
					vRes;

				if (nextStep.unary) {
					tmpFinalWord = finalWord.split(' ');
					finalWord = tmpFinalWord[tmpFinalWord.length - 1];
				}

				// If true, then the word is:
				// not from blacklist,
				// not a filter,
				// not a number,
				// not a Escaper literal,
				// not a property ({property: )
				let canParse = !blackWords[word] && !pCountFilter && !ssfRgxp.test(word) && !isFilter &&
					isNaN(Number(word)) && !rgxp.escaperPart.test(word) && !isSyOL(command, i, i + word.length);

				if (canParse && functionRgxp.test(word)) {
					this.error('unsupported syntax');
					return '';
				}

				// Export of numeric literals
				if (numRgxp.test(el)) {
					vRes = finalWord;

				// Export global and super-globals
				} else if ((useWith && !MODS[el] || el === G_MOD && (useWith ? next === G_MOD : true)) && canParse) {
					if (useWith) {
						vRes = next === G_MOD ?
							finalWord.slice(2) : finalWord;

						// Super-global variable within "with"
						if (next === G_MOD) {
							vRes = `__VARS__${concatProp(vRes)}`;

						} else {
							vRes = addScope(vRes);
						}

					// Super-global variable without "with"
					} else {
						vRes = `__VARS__${concatProp(finalWord.slice(next === G_MOD ? 2 : 1))}`;
					}

				} else {
					let
						rfWord = finalWord.replace(modRgxp, '');

					if (canParse && useWith && MODS[el]) {
						if (el === G_MOD) {
							rfWord = rfWord.slice(1);
						}

						let num = 0;

						// Clarification of a scope
						if (el === L_MOD) {
							const val = strongModRgxp.exec(finalWord);
							num = val ? val[1] : 1;
						}

						if (num && (scope.length - num) <= 0) {
							vRes = addScope(rfWord);

						} else {
							vRes = addScope(scope[scope.length - 1 - num]) + concatProp(rfWord);
						}

					} else {
						if (canParse) {
							vRes = addScope(rfWord);

						} else if (tplName && rfWord === 'this' && !this.hasParent(this.getGroup('selfThis'))) {
							vRes = '__THIS__';

						} else {
							vRes = rfWord;
						}
					}
				}

				if (canParse &&
					isNextAssign(command, i + word.length) &&
					tplName &&
					$consts[tplName] &&
					$consts[tplName][vRes]
				) {

					this.error(`constant "${vRes}" is already defined`);
					return '';
				}

				if (nextStep.unary) {
					tmpFinalWord[tmpFinalWord.length - 1] = vRes;
					vRes = tmpFinalWord.join(' ');
				}

				// This word is a composite system,
				// skip 2 words
				if (comboBlackWords[finalWord]) {
					posNWord = 2;

				} else if (
					canParse &&
					!unsafe && !filterStart &&
					(!nextStep.unary || undefUnaryBlackWords[nextStep.unary]) &&
					!globalUnUndef
				) {

					vRes = `${unUndefLabel}(${vRes})`;
				}

				wordAddEnd += vRes.length - word.length;
				nWord = false;

				if (filterStart) {
					const last = filter.length - 1;
					filter[last] += vRes;
					rvFilter[last] += word;
					filterAddEnd += vRes.length - word.length;

				} else {
					res = res.slice(0, i + uAdd) + vRes + res.slice(i + word.length + uAdd);
				}

				i += word.length - 2;
				breakNum = 1;
				continue;

			// Maybe soon will start a new word
			} else if (newWordRgxp.test(el)) {
				nWord = true;

				if (posNWord) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Closing parenthesis, and the next two characters aren't filter
					if (next !== FILTER || !rgxp.filterStart.test(nNext)) {
						if (pCount) {
							pCount--;
						}

						pContent.shift();
						continue;

					} else {
						filterWrapper = true;
					}
				}

			// Filter body
			} else if (el !== ')' || pCountFilter) {
				const last = filter.length - 1;
				filter[last] += el;
				rvFilter[last] += el;
			}
		}

		if (i === end && pCount && !filterWrapper && el !== ')') {
			this.error('missing closing or opening parenthesis in the template');
			return '';
		}

		// Closing of a local or a global filter
		if (filterStart && !pCountFilter && (el === ')' && !breakNum || i === end)) {
			const
				[pos] = pContent,
				fAdd = wordAddEnd - filterAddEnd + addition,
				fBody = res.slice(pos[0] + (pCount ? addition : 0), pos[1] + fAdd),
				arr = [];

			$C(filter).forEach((el) => {
				if (unMap[el]) {
					if (el === '!html' && (!pCount || filterWrapper)) {
						unEscape = true;

					} else if (el === '!undef') {
						unUndef = true;
					}

				} else {
					arr.push(el);
				}
			});

			filter = arr;
			let resTmp = fBody.trim();

			if (!resTmp) {
				resTmp = 'void 0';
			}

			$C(filter).forEach((el) => {
				const
					params = el.split(' '),
					input = params.slice(1).join(' ').trim(),
					current = params.shift().split('.');

				let bind;
				if (Filters.in(current)) {
					const
						filterParams = Filters.get(current)['ssFilterParams'];

					if (filterParams) {
						bind = filterParams['bind'];

						if (filterParams['!html']) {
							unEscape = true;
						}

						if (filterParams['!undef']) {
							unUndef = true;
						}
					}
				}

				resTmp =
					`(${cacheLink} = __FILTERS__${$C(current).reduce((str, el) => str += `['${el}']`, '')}` +
						(filterWrapper || !pCount ? '.call(this,' : '') +
						resTmp +
						(bind ? `,${bind.join(',')}` : '') +
						(input ? `,${input}` : '') +
						(filterWrapper || !pCount ? ')' : '') +
					')'
				;
			});

			resTmp = resTmp.replace(unUndefRgxp, unUndef ? '' : '__FILTERS__.undef');
			unUndef = globalUnUndef;

			const
				fstr = rvFilter.join().length + 1;

			res = pCount ?
				res.slice(0, pos[0] + addition) +
					resTmp +
					res.slice(pos[1] + fAdd + fstr) :

				resTmp;

			pContent.shift();
			filter = [];
			rvFilter = [];
			filterStart = false;

			if (pCount) {
				pCount--;
				filterWrapper = false;
			}

			wordAddEnd += resTmp.length - fBody.length - fstr;

			if (!pCount) {
				addition += wordAddEnd - filterAddEnd;
				wordAddEnd = 0;
				filterAddEnd = 0;
			}
		}

		// Closing parenthesis inside a filter
		if (el === ')' && pCountFilter && !breakNum) {
			pCountFilter--;

			if (!pCountFilter) {
				const
					last = filter.length - 1,
					cache = filter[last];

				filter[last] = this.out(cache, {skipFirstWord: true, logic: true, skipValidation: true});
				const
					length = filter[last].length - cache.length;

				wordAddEnd += length;
				filterAddEnd += length;

				if (i === end) {
					i--;
					breakNum = 1;
				}
			}
		}

		isFilter = el === FILTER;
		if (breakNum) {
			breakNum--;
		}

		// After 2 iteration begins a filter
		if (next === FILTER && rgxp.filterStart.test(nNext)) {
			nWord = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filterStart = true;
			if (!pCountFilter) {
				filter.push(nNext);
				rvFilter.push(nNext);
				i += 2;
			}

		} else if (i === 0 && el === FILTER && rgxp.filterStart.test(next)) {
			nWord = false;

			if (!filterStart) {
				pContent.push([0, i]);
			}

			filterStart = true;
			if (!pCountFilter) {
				filter.push(next);
				rvFilter.push(next);
				i++;
			}
		}
	}

	res = res.replace(unUndefRgxp, '__FILTERS__.undef');
	if (skipValidation !== false) {
		try {
			esprima.parse(esprimaHackFn(res));

		} catch (err) {
			this.error(err.message.replace(/.*?: (\w)/, (sstr, $1) => $1.toLowerCase()));
			return '';
		}
	}

	if (!unEscape && !unsafe) {
		res = `__FILTERS__.html(${res}, ${this.attr}, ${this.attrEscape})`;
	}

	return res;
};
