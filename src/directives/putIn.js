'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'putIn',

	{
		block: true,
		deferInit: true,
		group: ['putIn', 'void'],
		shorthands: {'*': 'putIn ', '/*': 'end putIn'},
		trim: true
	},

	function (ref) {
		this.startDir(null, {ref});

		const
			{parent} = this.structure;

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			pos = this.out('__CALL_POS__', {unsafe: true});

		switch (parent.name) {
			case 'call':
				parent.params.chunks++;
				this.append(ws`
					if (!${pos} && Snakeskin.length(__RESULT__)) {
						${tmp}.push(${this.getReturnResultDecl()});
						__RESULT__ = ${this.getResultDecl()};
					}

					${pos}++;
				`);

				break;

			case 'target':
				this.append(ws`
					if (!${pos} && Snakeskin.length(__RESULT__)) {
						${tmp}.push({
							key: '${ref}',
							value: Unsafe(${this.getReturnResultDecl()})
						});

						__RESULT__ = ${this.getResultDecl()};
					}

					${pos}++;
				`);

				break;

			default:
				this.append(ws`
					${this.declVars(`__CALL_CACHE__ = ${this.getReturnResultDecl()}`, {sys: true})}
					__RESULT__ = ${this.getResultDecl()};
				`);
		}
	},

	function () {
		const
			{structure} = this,
			{ref} = structure.params;

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		switch (structure.parent.name) {
			case 'call':
				this.append(ws`
					${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
					__RESULT__ = ${this.getResultDecl()};
				`);

				break;

			case 'target':
				this.append(ws`
					${tmp}.push({
						key: '${ref}',
						value: Unsafe(${this.getReturnResultDecl()})
					});

					__RESULT__ = ${this.getResultDecl()};
				`);

				break;

			default:
				this.append(ws`
					${this.out(`${ref} = ${this.getReturnResultDecl()}`, {unsafe: true})};
					__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
				`);
		}
	}

);
