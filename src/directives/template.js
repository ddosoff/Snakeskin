'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import esprima from '../deps/esprima';
import Snakeskin from '../core';

import { nmeRgxp, nmsRgxp, nmssRgxp } from '../parser/name';
import { ws } from '../helpers/string';
import { applyDefEscape, escapeDoubleQuotes } from '../helpers/escape';
import { concatProp } from '../helpers/literals';
import { stringRender, templateRank } from '../consts/other';

import {

	$write,
	$scope,
	$templates,
	$cache,
	$args,
	$argsRes,
	$output,
	$extList,
	$extMap

} from '../consts/cache';

['async', 'template', 'interface', 'placeholder'].forEach((dir) => {
	Snakeskin.addDirective(
		dir,

		{
			block: true,
			deferInit: true,
			group: [dir, 'template', 'rootTemplate', 'define'],
			notEmpty: true,
			placement: 'global'
		},

		function (command, commandLength, type, raw, jsDoc) {
			if (this.name === 'async') {
				this.async = true;
				const dir = command.split(' ');
				return Snakeskin.Directives[dir[0]].call(this, dir.slice(1).join(' ').trim(), commandLength, dir[0], raw, jsDoc);
			}

			const
				env = this.environment,
				nms = env.namespace;

			if (!nms) {
				return this.error(`the directive "${this.name}" can't be declared without namespace`);
			}

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			let
				tplName = this.replaceFileNamePatterns(this.getFnName(command)),
				prfx = ['', ''],
				pos;

			if (/\*/.test(tplName)) {
				prfx[1] = '*';
				tplName = tplName.replace(prfx[1], '');
				this.generator = true;
			}

			if (this.async) {
				prfx[0] = 'async';
			}

			const
				oldTplName = tplName = nms + concatProp(tplName);

			const setTplName = () => {
				this.info.template = this.tplName = tplName;
				delete $write[oldTplName];
				$write[tplName] = this.name === 'template';
			};

			const
				flags = command.split(/\s+@=\s+/).slice(1);

			let {renderAs} = this;
			for (let i = 0; i < flags.length; i++) {
				const
					[flag, value] = flags[i].split(/\s+/);

				if (flag === 'renderAs') {
					renderAs = this.pasteDangerBlocks(value);
				}
			}

			this.startDir(templateRank[renderAs] < templateRank[type] ? renderAs : type);
			setTplName();

			const
				iface = this.name === 'interface',
				fnArgsKey = this.getFnArgs(command).join().replace(/=(.*?)(?:,|$)/g, '');

			this.save((pos = `/* Snakeskin template: ${tplName}; ${fnArgsKey} */`), {iface, jsDoc});
			if (jsDoc) {
				jsDoc += pos.length;
			}

			const tplNameParts = tplName
				.replace(nmssRgxp, '%')
				.replace(nmsRgxp, '.%')
				.replace(nmeRgxp, '')
				.split('.');

			const
				tplNameLength = tplNameParts.length;

			let shortcut = '';
			[tplName] = tplNameParts;

			if (tplName[0] === '%') {
				try {
					tplName = ws`['${
						applyDefEscape(
							this.returnEvalVal(
								this.out(tplName.slice(1), {unsafe: true})
							)
						)
					}']`;

				} catch (err) {
					return this.error(err.message);
				}

			} else {
				shortcut = tplName;
			}

			let lastName = '';
			for (let i = 1; i < tplNameLength; i++) {
				let el = tplNameParts[i];

				const
					custom = el[0] === '%',
					def = `exports${concatProp(tplName)}`;

				if (custom) {
					el = el.slice(1);
				}

				this.save(
					(pos = ws`
						if (${def} == null) {
							${def} = {};
						}

						${i === 1 && shortcut ? `${this.module === 'native' ? 'export ' : ''}var ${shortcut} = ${def};` : ''}
					`),

					{iface, jsDoc}
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				if (custom) {
					try {
						tplName += ws`['${
							applyDefEscape(
								this.returnEvalVal(
									this.out(el, {unsafe: true})
								)
							)
						}']`;

					} catch (err) {
						return this.error(err.message);
					}

					continue;

				} else if (i === tplNameLength - 1) {
					lastName = el;
				}

				tplName += `.${el}`;
			}

			try {
				esprima.parse(tplName);

			} catch (ignore) {
				return this.error(`invalid "${this.name}" name`);
			}

			const rName = this.pasteDangerBlocks(
				this.replaceDangerBlocks(tplName)
					.replace(nmsRgxp, '.')
					.replace(nmeRgxp, '')

			).replace(/\.['"]/g, '.').replace(/['"]$/, '');

			if (this.templates[rName]) {
				const
					{file, renderAs} = this.templates[rName];

				if (this.file !== file || this.renderAs === renderAs) {
					return this.error(`the template "${tplName}" already defined`);
				}
			}

			setTplName();
			this.templates[rName] = {
				file: this.info.file,
				renderAs: this.renderAs
			};

			this.vars[tplName] = {};
			this.blockTable = {};
			this.blockStructure = {
				children: [],
				name: 'root',
				parent: null
			};

			let parentTplName;
			if (/\)\s+extends\s+/.test(command)) {
				try {
					this.scope.push(this.scope[this.scope.length - 1].replace(/^exports\.?/, ''));
					parentTplName = this.parentTplName = this.getBlockName(/\)\s+extends\s+(.*?)(?=@=|$)/.exec(command)[1], true);
					this.scope.pop();

				} catch (ignore) {
					return this.error(`invalid template name "${this.name}" for inheritance`);
				}

				if ($cache[parentTplName] == null) {
					if (!this.renderAs || this.renderAs === 'template') {
						return this.error(`the specified template "${parentTplName}" for inheritance is not defined`);
					}

					parentTplName = this.parentTplName = undefined;
				}
			}

			const
				parentObj = $output[parentTplName];

			if (parentTplName) {
				if (parentObj.async) {
					prfx[0] = 'async';
					this.async = true;
				}

				if (parentObj.generator) {
					prfx[1] = '*';
					this.generator = true;
				}
			}

			const
				decorators = (parentTplName ? parentObj.decorators : []).concat(this.decorators);

			if (iface) {
				this.save(
					`exports${concatProp(tplName)} = ${prfx[0]} function ${prfx[1]}${tplNameLength > 1 ? lastName : shortcut}(`,
					{iface}
				);

			} else {
				this.save(ws`
					exports${concatProp(tplName)} =
						Snakeskin.decorate([
							${decorators.join()}],
							${prfx[0]} function ${prfx[1]}${tplNameLength > 1 ? lastName : shortcut}(`
				);
			}

			this.decorators = [];
			this.initTemplateCache(tplName);

			if (tplName in $extMap) {
				this.clearScopeCache(tplName);
			}

			const
				scope = $scope['template'],
				parent = scope[parentTplName];

			scope[tplName] = {
				children: {},
				id: this.environment.id,
				parent
			};

			scope[tplName].root = parent ?
				parent.root : scope[tplName];

			if (parent) {
				parent.children[tplName] = scope[tplName];
			}

			$args[tplName] = {};
			$argsRes[tplName] = {};
			$output[tplName] = {
				async: this.async,
				decorators,
				generator: this.generator
			};

			$extMap[tplName] = parentTplName;
			delete $extList[tplName];

			const
				baseParams = {};

			if (!parentTplName) {
				const
					obj = this.params[this.params.length - 1];

				for (let key in obj) {
					if (!obj.hasOwnProperty(key)) {
						break;
					}

					const
						el = obj[key];

					if (key !== 'renderAs' && key[0] !== '@' && el !== undefined) {
						baseParams[key] = el;
					}
				}
			}

			if (parentTplName && !flags.length) {
				flags.push('@skip true');
			}

			for (let i = 0; i < flags.length; i++) {
				delete baseParams[flags[i].split(' ')[0]];
				Snakeskin.Directives['__set__'].call(this, flags[i]);
			}

			for (let key in baseParams) {
				if (!baseParams.hasOwnProperty(key)) {
					break;
				}

				const el = baseParams[key];
				Snakeskin.Directives['__set__'].call(this, [key, key === 'filters' ? el[el.length - 1] : el]);
			}

			const
				args = this.declFnArgs(command, {dir: 'template', parentTplName, tplName});

			this.save(`${args.decl}) {`, {iface});
			this.save(ws`
				var
					__THIS__ = this;

				var
					callee = exports${concatProp(tplName)},
					self = callee.Blocks = {};

				var
					__INLINE_TAGS__ = Snakeskin.inlineTags,
					__INLINE_TAG__;

				var
					__STRING_RESULT__;

				${this.getTplRuntime()}

				var
					$0 = ${stringRender[this.renderMode] ? 'undefined' : '__RESULT__[0]'},
					$class = '';

				var
					__ATTR_STR__,
					__ATTR_TYPE__,
					__ATTR_CACHE__,
					__ATTR_CONCAT_MAP__ = {'class': true};

				function __GET_XML_ATTR_KEY_DECL__(val, cache, empty) {
					if (val != null && val !== '') {
						if (!__ATTR_CONCAT_MAP__[val] || !cache[val] || cache[val][0] === TRUE) {
							cache[val] = [];
						}

						cache[val].push(empty ? TRUE : __ATTR_STR__);
					}

					__ATTR_STR__ = __ATTR_TYPE__ = undefined;
				}

				function __APPEND_XML_ATTR_VAL__(val) {
					__ATTR_STR__ = __ATTR_STR__ + (__ATTR_STR__ ? ' ' : '') + (val != null ? val : '');
				}

				function __GET_XML_ATTRS_DECL_END__(res, link, cache, isDOMRenderMode, stringResult, isXMLDoctype) {
					var __RESULT__ = res;

					if (typeof link === 'undefined' || link !== '?') {
						var base = true;
						var set = function (el, key) {
							if (!base && {'class': true, 'id': true}[key]) {
								return;
							}

							var
								attr = el[0] === TRUE ? isDOMRenderMode || isXMLDoctype ? key : TRUE : el.join(' ');

							if (stringResult) {
								__STRING_RESULT__ += ' ' + key + (attr === TRUE ? '' : '="' + __ESCAPE_D_Q__(attr) + '"');

							} else if (isDOMRenderMode) {
								Snakeskin.setAttribute($0, key, attr);

							} else {
								${this.wrap(`' ' + key + (attr === TRUE ? '' : '="' + __ESCAPE_D_Q__(attr) + '"')`)}
							}
						};

						if (cache['id']) {
							set(cache['id'], 'id');
						}

						if (cache['class']) {
							set(cache['class'], 'class');
						}

						base = false;
						Snakeskin.forEach(cache, set);
					}

					return __RESULT__;
				}

				function __GET_XML_TAG_DECL_END__(res, link, inline, inlineTag, isDOMRenderMode, stringResult, isXMLDoctype) {
					var __RESULT__ = res;

					if (isDOMRenderMode) {
						if (link !== '?') {
							${this.wrap('$0')}
							if (inline && (!inlineTag || inlineTag === true)) {
								$0 = __RESULT__[__RESULT__.length - 1];

							} else if (inlineTag && inlineTag!== true) {
								__RESULT__ = ${this.getResultDecl()};
								$0 = __RESULT__[__RESULT__.length - 1];

							} else {
								__RESULT__.push($0);
							}
						}

					} else {
						if (link !== '?') {
							if (inline && (!inlineTag || inlineTag === true)) {
								if (stringResult) {
									__STRING_RESULT__ += (isXMLDoctype ? '/' : '') + '>';

								} else {
									${this.wrap(`(isXMLDoctype ? '/' : '') + '>'`)}
								}

							} else if (inlineTag && inlineTag !== true) {
								__RESULT__ = ${this.getResultDecl()};

							} else {
								if (stringResult) {
									__STRING_RESULT__ += '>';

								} else {
									${this.wrap(`'>'`)}
								}
							}
						}
					}

					return __RESULT__;
				}

				function __GET_END_XML_TAG_DECL__(
					res,
					link,
					inline,
					inlineTag,
					attrCache,
					callCache,
					callTmp,
					isDOMRenderMode,
					stringResult,
					isXMLDoctype,
					node

				) {
					var __RESULT__ = res;

					if (isDOMRenderMode) {
						if (link !== '?') {
							if (inlineTag) {
								if (inlineTag !== true) {
									__RESULT__ = callCache;
									if (inlineTag in attrCache === false) {
										Snakeskin.setAttribute(node, inlineTag, callTmp);
									}
								}

							} else if (!inline) {
								__RESULT__.pop();
								$0 = __RESULT__[__RESULT__.length - 1];
							}
						}

					} else {
						if (link !== '?') {
							if (inlineTag) {
								if (inlineTag !== true) {
									__RESULT__ = callCache;

									if (inlineTag in attrCache === false) {
										if (stringResult) {
											__STRING_RESULT__ += ' ' + inlineTag + '="' + callTmp + '"';

										} else {
											${this.wrap(`' ' + inlineTag + '="' + callTmp + '"'`)}
										}
									}

									if (stringResult) {
										__STRING_RESULT__ += (isXMLDoctype ? '/' : '') + '>';

									} else {
										${this.wrap(`(isXMLDoctype ? '/' : '') + '>'`)}
									}
								}

							} else if (!inline) {
								if (stringResult) {
									__STRING_RESULT__ += '</' + link + '>';

								} else {
									${this.wrap(`'</' + link + '>'`)}
								}
							}
						}
					}

					return __RESULT__;
				}

				function __TARGET_END__(res, stack, ref) {
					var __RESULT__ = res;

					if (__LENGTH__(__RESULT__)) {
						stack.push({
							key: undefined,
							value: Unsafe(${this.getReturnResultDecl()})
						});
					}

					Snakeskin.forEach(stack, function (el, i) {
						ref[el.key || ref.length] = el.value;
					});

					return __RESULT__;
				}

				function __PUTIN_CALL__(res, pos, stack) {
					var __RESULT__ = res;

					if (pos === true || !pos && __LENGTH__(__RESULT__)) {
						stack.push(Unsafe(${this.getReturnResultDecl()}));
						__RESULT__ = ${this.getResultDecl()};
					}

					return __RESULT__;
				}

				function __PUTIN_TARGET__(res, pos, stack, key) {
					var __RESULT__ = res;

					if (pos === true || !pos && __LENGTH__(__RESULT__)) {
						stack.push({
							key: key,
							value: Unsafe(${this.getReturnResultDecl()})
						});

						__RESULT__ = ${this.getResultDecl()};
					}

					return __RESULT__;
				}

				var
					__RETURN__ = false,
					__RETURN_VAL__;

				var
					TPL_NAME = "${escapeDoubleQuotes(tplName)}",
					PARENT_TPL_NAME${parentTplName ? ` = "${escapeDoubleQuotes(parentTplName)}"` : ''};

				${args.def}
			`);

			const preDefs = this.preDefs[tplName];
			if ((!$extMap[tplName] || parentTplName) && preDefs) {
				this.source =
					this.source.slice(0, this.i + 1) +
					preDefs.text +
					this.source.slice(this.i + 1);

				delete this.preDefs[tplName];
			}
		},

		function (command, commandLength) {
			const
				tplName = String(this.tplName),
				diff = this.getDiff(commandLength);

			$cache[tplName] = this.source.slice(this.startTemplateI, this.i - diff);
			$templates[tplName] = this.blockTable;

			if (this.parentTplName) {
				this.info.line = this.startTemplateLine;
				this.lines.splice(this.startTemplateLine, this.lines.length);

				this.source =
					this.source.slice(0, this.startTemplateI) +
					this.getTplFullBody(tplName) +
					this.source.slice(this.i - diff);

				this.initTemplateCache(tplName);
				this.startDir(this.structure.name);
				this.i = this.startTemplateI - 1;
				this.parentTplName = undefined;
				this.blockTable = {};
				this.vars[tplName] = {};
				return;
			}

			const
				iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', {iface});

			} else {
				this.save(ws`
						${this.consts.join('')}
						return ${this.getReturnResultDecl()};
					});

					Snakeskin.cache["${escapeDoubleQuotes(tplName)}"] = exports${concatProp(tplName)};
				`);
			}

			this.save(
				'/* Snakeskin template. */',
				{iface}
			);

			this.popParams();
			this.canWrite = true;
			this.tplName = undefined;
			this.async = false;
			this.generator = false;
			delete this.info.template;
		}

	);
});
