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
import { any } from '../helpers/gcc';

Snakeskin.addDirective(
	'target',

	{
		block: true,
		deferInit: true,
		group: ['target', 'microTemplate', 'var', 'void'],
		notEmpty: true,
		trim: true
	},

	function (command) {
		const
			short = command.slice(-1) === '/';

		if (short) {
			command = command.slice(0, -1);
		}

		const
			[obj, ref] = command.split(/\s+as\s+(?=[^\s])/);

		if (ref) {
			this.declVar(ref);
		}

		this.startDir(null, {short});
		let str = this.declVars(`__TARGET_REF__ = ${obj}`, {sys: true});
		this.structure.params.ref = this.getVar('__TARGET_REF__');

		if (ref) {
			str += this.out(`var ${ref} = __TARGET_REF__;`, {skipFirstWord: true, unsafe: true});
		}

		if (short) {
			this.append(str);
			end.call(this);
			this.endDir();

		} else {
			this.append(ws`
				${str}
	
				${this.declVars(
					ws`
						__CALL_CACHE__ = __RESULT__,
						__CALL_TMP__ = [],
						__CALL_POS__ = 0
					`,
					{sys: true}
				)}
		
				__RESULT__ = ${this.getResultDecl()};
			`);
		}
	},

	end
);

function end() {
	const
		p = this.structure.params;

	if (p.strongSpace) {
		this.strongSpace.pop();
	}

	if (!p.short) {
		this.append(`__RESULT__ = __TARGET_END__(__RESULT__, ${this.getVar('__CALL_TMP__')}, ${p.ref});`);
	}

	const
		parent = any(this.hasParentMicroTemplate());

	if (parent) {
		this.append(`__RESULT__ = new Raw(${p.ref});`);
		parent.params.strongSpace = true;
		this.strongSpace.push(true);

	} else if (!p.short) {
		this.append(`__RESULT__ = ${this.getVar('__CALL_CACHE__')};`);
	}
}
