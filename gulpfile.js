var
	gulp = require('gulp'),
	path = require('path'),
	fs = require('fs');

var
	babel = require('gulp-babel'),
	monic = require('gulp-monic'),
	gcc = require('gulp-closure-compiler'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	replace = require('gulp-replace'),
	wrap = require('gulp-wrap'),
	bump = require('gulp-bump'),
	download = require('gulp-download'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	run = require('gulp-run'),
	glob = require('glob');

function getVersion() {
	var file = fs.readFileSync(path.join(__dirname, 'lib/core.js'));
	return /VERSION\s*(?::|=)\s*\[(\d+,\s*\d+,\s*\d+)]/.exec(file)[1]
		.split(/\s*,\s*/)
		.join('.');
}

function getBuilds() {
	delete require.cache[require.resolve('./builds')];
	return Object(require('./builds'));
}

var map = {
	jscs: 'https://raw.githubusercontent.com/kobezzza/project-settings/master/.jscsrc',
	gitignore: 'https://raw.githubusercontent.com/kobezzza/project-settings/master/.gitignore',
	gitattributes: 'https://raw.githubusercontent.com/kobezzza/project-settings/master/.gitattributes',
	editorconfig: 'https://raw.githubusercontent.com/kobezzza/project-settings/master/.editorconfig'
};

for (var key in map) {
	if (!map.hasOwnProperty(key)) {
		continue;
	}

	(function (key, url) {
		gulp.task('get-settings:' + key, ['build'], function () {
			download([url]).pipe(gulp.dest('./'));
		});
	})(key, map[key]);
}

gulp.task('get-settings', ['build'], function () {
	download(
		Object.keys(map).map(function (key) {
				return map[key]
			}
		)).pipe(gulp.dest('./'));
});

gulp.task('build', function (cb) {
	var
		builds = getBuilds(),
		i = 0;

	gulp.src('./lib/**/*.js')
		.pipe(babel({
			compact: false,
			highlightCode: false,
			auxiliaryComment: 'istanbul ignore next',

			loose: 'all',
			blacklist: [
				'es3.propertyLiterals',
				'es3.memberExpressionLiterals',
				'strict'
			],

			optional: [
				'spec.undefinedToVoid',
				'runtime'
			]
		}))

		.pipe(gulp.dest('./tmp'))
		.on('end', function () {
			for (var key in builds) {
				if (!builds.hasOwnProperty(key)) {
					continue;
				}

				i++;
				(function (key) {
					var fullHead =
						'/*!\n' +
						' * Snakeskin v' + getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') + '\n' +
						' * https://github.com/SnakeskinTpl/Snakeskin\n' +
						' *\n' +
						' * Released under the MIT license\n' +
						' * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE\n' +
						' *\n' +
						' * Date: ' + new Date().toUTCString() + '\n' +
						' */\n\n';

					run('node node_modules/mcjs/cli tmp/core.js', {silent: true}).exec()

						// Fix for @param {foo} [bar=1] -> @param {foo} [bar]
						.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))

						// Whitespaces in string templates
						.pipe(replace(/\/\* cbws \*\/"[\s\S]*?[^\\"]";?(?:$|[}]+$|[)]+;?$)/gm, function (sstr) {
							return sstr
								.replace(/\\n|\\t/g, '')
								.replace(/\\[\r\n]/g, ' ');
						}))

						.pipe(header(fullHead))
						.pipe(rename(key + '.js'))
						.pipe(gulp.dest('./dist'))
						.on('end', function () {
							i--;

							if (!i) {
								cb();
							}
						});
				})(key);
			}
		});

	/*for (var key in builds) {
		gulp.src('./lib/!**.js')
			.pipe(run('node node_modules/mcjs/cli').exec());*/


		/*gulp.src('./lib/core.js')
			.pipe(monic({
				flags: builds[key]
			}))

			.pipe(babel({
				compact: false,
				highlightCode: false,
				auxiliaryComment: 'istanbul ignore next',

				loose: 'all',
				blacklist: [
					'es3.propertyLiterals',
					'es3.memberExpressionLiterals',
					'strict'
				],

				optional: [
					'spec.undefinedToVoid'
				]
			}))

			.pipe(wrap(
				'(function () {' +
					'\n' +
					'\'use strict\';' +
					'\n' +
					'var self = this;' +
					'\n' +
					'<%= contents %>' +
					'\n' +
				'}).call(new Function(\'return this\')());'
			))

			.pipe(replace(/\/\/\/\/#include/g, '//#include'))
			.pipe(monic())

			// Fix for @param {foo} [bar=1] -> @param {foo} [bar]
			.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))

			// Whitespaces in string templates
			.pipe(replace(/\/\* cbws \*\/"[\s\S]*?[^\\"]";?(?:$|[}]+$|[)]+;?$)/gm, function (sstr) {
				return sstr
					.replace(/\\n|\\t/g, '')
					.replace(/\\[\r\n]/g, ' ');
			}))

			.pipe(header(fullHead))
			.pipe(rename(key + '.js'))
			.pipe(gulp.dest('./dist/'))

			.on('end', function () {
				i--;

				if (!i) {
					cb();
				}
			});
	}*/
});

gulp.task('predefs', function (cb) {
	download([
		'https://raw.githubusercontent.com/google/closure-compiler/master/externs/fileapi.js',
		'https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jasmine.js'
	])
		.pipe(gulp.dest('./predefs/src/ws'))
		.on('end', function () {
			gulp.src('./predefs/src/index.js')
				.pipe(monic())
				.pipe(gulp.dest('./predefs/build'))
				.on('end', cb);
		});
});

gulp.task('test', ['build'], function (cb) {
	gulp.src('./dist/snakeskin.js')
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			gulp.src(['./test/test.dev.js'])
				.pipe(jasmine())
				.pipe(istanbul.writeReports())
				.on('end', cb);
		});
});

gulp.task('compile', ['predefs', 'test'], function (cb) {
	var
		builds = getBuilds(),
		i = 0;

	for (var key in builds) {
		if (!builds.hasOwnProperty(key)) {
			continue;
		}

		i++;
		gulp.src(path.join('./dist/', key + '.js'))
			.pipe(gcc({
				fileName: key + '.min.js',
				compilerPath: './bower_components/closure-compiler/compiler.jar',
				continueWithWarnings: true,

				compilerFlags: {
					compilation_level: 'ADVANCED',
					use_types_for_optimization: null,

					language_in: 'ES6',
					language_out: 'ES5',

					externs: [
						'./predefs/build/index.js'
					],

					jscomp_off: [
						'nonStandardJsDocs'
					],

					jscomp_warning: [
						'invalidCasts',
						'accessControls',
						'checkDebuggerStatement',
						'checkRegExp',
						'checkTypes',
						'const',
						'constantProperty',
						'deprecated',
						'externsValidation',
						'missingProperties',
						'visibility',
						'missingReturn',
						'duplicate',
						'internetExplorerChecks',
						'suspiciousCode',
						'uselessCode',
						'misplacedTypeAnnotation',
						'typeInvalidation'
					]
				}
			}))

			.pipe(header(
				'/*! Snakeskin v' + getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') +
				' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n'
			))

			.pipe(replace(/\(function\(.*?\)\{/, '$&\'use strict\';'))
			.pipe(gulp.dest('./dist/'))
			.on('end', cb);
	}
});

gulp.task('bump', function () {
	gulp.src('./*.json')
		.pipe(bump({version: getVersion()}))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
	gulp.watch('./lib/**/*.js', ['build']);
	gulp.watch('./lib/core.js', ['bump']);
});

gulp.task('default', ['compile', 'bump']);
