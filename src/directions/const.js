/*!
 * Работа с константами
 */

/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, dirObj, adv) {
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName,
		protoStart = dirObj.protoStart,

		i = dirObj.i,
		startI = dirObj.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dirObj.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/^[a-z_][\w\[\].'"\s]*[^=]=[^=]/i.test(command)) {
		var varName = command.split('=')[0].trim();

		if (tplName) {
			if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
				// Попытка повторной инициализации переменной
				if (varCache[tplName][varName] || varICache[tplName][varName]) {
					throw Snakeskin.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw Snakeskin.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в цикле
				if (dirObj.hasPos('forEach')) {
					throw Snakeskin.error(
						'Constant "' + varName + '" can\'t be defined in a loop ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Кеширование
				varCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromVarCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				dirObj.save((!/[.\[]/.test(varName) ? 'var ' : '') + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			dirObj.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + Snakeskin.returnVar(command, dirObj) + ';');
	}
};

var blackWordList = {
	'break': true,
	'case': true,
	'catch': true,
	'continue': true,
	'delete': true,
	'do': true,
	'else': true,
	'false': true,
	'finnaly': true,
	'for': true,
	'function': true,
	'if': true,
	'in': true,
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
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'let': true,
	'const': true,
	'debugger': true,
	'interface': true
};

var comboBlackWordList = {
	'var': true,
	'let': true,
	'const': true
};

/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {!DirObj} dirObj - объект управления директивами
 * @return {string}
 */
Snakeskin.returnVar = function (command, dirObj) {
	var pCount = 0,
		pCountFilter = 0,
		pContent = [command],

		filterStart,
		filter = [];

	var res = command,
		addition = 0;

	function findNext(str, pos) {
		var res = '',
			pCount = 0;

		for (var j = pos; j < str.length; j++) {
			var el = str[j];

			if (/[@#$\w\[\]().]/.test(el)) {
				if (el === '(') {
					pCount++;

				} else if (el === ')') {
					if (pCount) {
						pCount--;

					} else {
						break;
					}
				}

				res += el;

			} else {
				break;
			}
		}

		return res;
	}

	var nword = true,
		posNWord = 0,

		useWith = dirObj.hasPos('with'),
		scope = dirObj.getPos('with');

	var wordAddEnd = 0,
		filterAddEnd = 0;

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2),

			breakNum;

		if (!breakNum) {
			if (el === '(') {
				// Скобка открылась внутри декларации фильтра
				if (filterStart) {
					pCountFilter++;

				} else {
					pContent.unshift([i]);
					pCount++;
				}
			}

			// Расчёт scope:
			// флаг nword показывает, что началось новое слово;
			// флаг posNWord показывает, сколько новых слов нужно пропустить
			if (nword && !posNWord && /[@#$a-z_]/i.test(el)) {
				var word = findNext(command, i),
					uadd = wordAddEnd + addition,

					vres;

				if (el === '@') {
					if (!blackWordList[word] && useWith) {
						vres = word.substring(next === '@' ? 2 : 1);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = 'Snakeskin.Vars[\'' + vres + '\']';
						}

					// Супер глобальная переменная вне with
					} else {
						vres = 'Snakeskin.Vars[\'' + word.substring(next === '@' ? 2 : 1) + '\']';
					}

				} else {
					var clword = word.replace(/#(?:\d+|)/, '');
					if (!blackWordList[word] && useWith) {
						var num = null;

						if (el === '#') {
							num = /#(\d+)/.exec(word);
							num = num ? num[1] : 1;
							num++;
						}

						scope.push({scope: clword});
						var rnum = num = num ? scope.length - num : num;

						vres = scope.reduce(function (str, el, i, data) {
							num = num ? num - 1 : num;
							var val = typeof str.scope === 'undefined' ? str : str.scope;

							if (num === null || num > 0) {
								return val + '.' + el.scope;
							}

							if (i === data.length - 1) {
								return (rnum > 0 ? val + '.' : '') + el.scope;
							}

							return val;
						});

						scope.pop();

					} else {
						vres = clword;
					}
				}

				if (comboBlackWordList[word]) {
					posNWord = 2;

				} else if (!blackWordList[word]) {
					vres = 'Snakeskin.Filters.undef(' + vres + ')';
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					filter[filter.length - 1] += vres;
					filterAddEnd += vres.length - word.length;

				} else {
					res = res.substring(0, i + uadd) + vres + res.substring(i + word.length + uadd);
				}

				i += word.length - 2;
				breakNum = 1;
				continue;

			// Возможно, скоро начнётся новое слово,
			// для которого можно посчитать scope
			} else if (/[^@#$\w\[\].]/.test(el)) {
				nword = true;

				if (posNWord > 0) {
					posNWord--;
				}
			}

			if (!filterStart) {
				// Закрылась скобка, а последующие 2 символа не являются фильтром
				if (el === ')' && (next !== '|' || !/[!$a-z_]/i.test(nnext))) {
					pCount--;
					pContent.shift();
					continue;
				}

			// Составление тела фильтра
			} else if (el !== ')' || pCountFilter) {
				if (el === ')' && pCountFilter) {
					pCountFilter--;
				}

				filter[filter.length - 1] += el;
			}
		}

		if (breakNum) {
			breakNum--;
		}

		// Начало фильтра
		if (next === '|' && /[!$a-z_]/i.test(nnext)) {
			nword = false;

			if (pCount) {
				pContent[0].push(i + 1);

			} else {
				pContent.push([0, i + 1]);
			}

			filter.push(nnext);
			pCountFilter = 0;
			filterStart = true;

			i += 2;
			continue;
		}

		if (filterStart && ((el === ')' && !pCountFilter) || i === command.length - 1)) {
			var length = pContent.length,
				pos = pContent[length - pCount - 1];

			var fbody = res.substring(pos[0] + addition, pos[1] + wordAddEnd - filterAddEnd + addition),
				unEscape = false;

			console.log(fbody, filter);

			var resTmp = filter.reduce(function (res, el) {
				var params = el.split(' '),
					input = params.slice(1).join('').trim();

				return 'Snakeskin.filter[\'' + params.shift() + '\'](' + res +
					(input ? ',' + input : '') + ')';

			}, fbody);

			console.log(res);

			var fstr = filter.join().length + 1;
			res = res.substring(0, pos[0] + addition) +
				resTmp + res.substring(pos[1] + wordAddEnd + addition + fstr);

			addition += resTmp.length - fbody.length - fstr + wordAddEnd;

			wordAddEnd = 0;
			filterAddEnd = 0;
			pContent.splice(length - pCount - 1, 1);

			filter = [];
			filterStart = false;
			pCount--;
		}
	}

	console.info(res);
	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + '' + (!unEscape ? ')' : '');
};