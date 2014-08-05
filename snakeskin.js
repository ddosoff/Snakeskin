module.exports = exports = require('./build/snakeskin.min');

var fs = require('fs');
var path = require('path');

/**
 * Вернуть true, если заданный файл шаблонов соответствует скомпилированному
 * по временной метке
 *
 * @param {string} source - путь к исходному файлу
 * @param {string} result - путь к скомпилированному файлу
 * @return {boolean}
 */
exports.check = function (source, result) {
	if (!fs.existsSync(result)) {
		return false;
	}

	var label = fs.statSync(source).mtime,
		code = fs.readFileSync(result).toString();

	var resLabel = /label <([\d]+)>/.exec(code);

	if (!resLabel) {
		return false;
	}

	return label.valueOf() == resLabel[1];
};

/**
 * Скомпилировать заданный файл и вернуть главную функцию
 *
 * @param {string} src - путь к файлу шаблонов
 * @param {Object=} [opt_params] - дополнительные параметры компиляции
 * @return {Function}
 */
exports.execFile = function (src, opt_params) {
	opt_params = opt_params || {};
	opt_params.commonJS = true;

	var source = fs.readFileSync(src).toString(),
		resSrc = (("" + src) + ".js");

	var tpl;

	if (!this.check(src, resSrc)) {
		fs.writeFileSync(resSrc, this.compile(source, opt_params, {file: src}));
	}

	tpl = require(resSrc);

	if (tpl.init) {
		tpl.init(this);
	}

	return tpl[path.basename(src, '.ss')] || tpl.main || tpl[Object.keys(tpl)[0]] || null;
};