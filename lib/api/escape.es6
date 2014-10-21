/*!
 * Методы и функции для экранирования
 */

var sysEscapeMap = {};

sysEscapeMap['\\'] = true;
sysEscapeMap[I18N] = true;
sysEscapeMap[LEFT_BLOCK] = true;
sysEscapeMap[ADV_LEFT_BLOCK] = true;
sysEscapeMap[SINGLE_COMMENT.charAt(0)] = true;
sysEscapeMap[MULT_COMMENT_START.charAt(0)] = true;
sysEscapeMap[CONCAT_COMMAND] = true;
sysEscapeMap[CONCAT_END] = true;
sysEscapeMap[IGNORE_COMMAND] = true;
sysEscapeMap[INLINE_COMMAND.trim().charAt(0)] = true;

for (let key in baseShortMap) {
	if (!baseShortMap.hasOwnProperty(key)) {
		continue;
	}

	sysEscapeMap[key.charAt(0)] = true;
}

var strongSysEscapeMap = {};

strongSysEscapeMap['\\'] = true;
strongSysEscapeMap[SINGLE_COMMENT.charAt(0)] = true;
strongSysEscapeMap[MULT_COMMENT_START.charAt(0)] = true;

var includeSysEscapeMap = {};
includeSysEscapeMap['\\'] = true;

for (let key in includeDirMap) {
	if (!includeDirMap.hasOwnProperty(key)) {
		continue;
	}

	includeSysEscapeMap[key.charAt(0)] = true;
}

var escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

var escapeEndMap = {
	'-': true,
	'+': true,
	'*': true,
	'%': true,
	'~': true,
	'>': true,
	'<': true,
	'^': true,
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'!': true,
	'?': true,
	':': true,
	'(': true,
	'{': true,
	'[': true
};

var escapeEndWordMap = {
	'typeof': true,
	'void': true,
	'instaceof': true,
	'delete': true,
	'in': true,
	'new': true
};

var bMap = {
	'(': true,
	'[': true,
	'{': true
};

var closeBMap = {
	')': true,
	']': true,
	'}': true
};

var pMap = {
	'(': true,
	'[': true
};

var closePMap = {
	')': true,
	']': true
};

function escapeBackslash(str) {
	return String(str).replace(/\\/g, '\\\\');
}

function escapeSingleQuote(str) {
	return String(str)
		.replace(/'/g, '\\\'');
}

function escapeDoubleQuote(str) {
	return String(str)
		.replace(/"/g, '\\\"');
}

function applyDefEscape(str) {
	return escapeNextLine(
		String(str)
			.replace(/\\/g, '\\\\')
			.replace(/'/g, '\\\'')
	);
}

function escapeNextLine(str) {
	return String(str)
		.replace(/\n/g, '\\n')
		.replace(/\v/g, '\\v')
		.replace(/\r/g, '\\r');
}

if (typeof window === 'undefined' && typeof global !== 'undefined') {
	global.EscaperIsLocal = true;
}

//#include ../../node_modules/escaper/lib/escaper.js

var escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

/**
 * Заметить блоки вида ' ... ', " ... ", / ... /, ` ... `, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_ в указанной строке
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	return Escaper.replace(str, true, this.quotContent, true);
};

/**
 * Заметить __ESCAPER_QUOT__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	return Escaper.paste(str, this.quotContent);
};

/**
 * Заметить __SNAKESKIN__номер_ в указанной строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteTplVarBlocks = function (str) {
	return str.replace(/__SNAKESKIN__(\d+)_/g, (sstr, pos) => this.dirContent[pos]);
};
