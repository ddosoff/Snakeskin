# Snakeskin

<img src="http://kobezzza.com/files/snakeskin/logo.svg?1" alt="Snakeskin" width="190" />

*This is Frank, a snake-cowboy who loves templates.*

---

Snakeskin is an awesome JavaScript template engine with the best support for inheritance.

[![NPM version](http://img.shields.io/npm/v/snakeskin.svg?style=flat)](http://badge.fury.io/js/snakeskin)
[![NPM download](https://img.shields.io/npm/dm/snakeskin.svg?style=flat)](http://badge.fury.io/js/snakeskin)
[![NPM dependencies](http://img.shields.io/david/SnakeskinTpl/Snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/Snakeskin#info=dependencies&view=table)
[![NPM devDependencies](http://img.shields.io/david/dev/SnakeskinTpl/Snakeskin.svg?style=flat)](https://david-dm.org/SnakeskinTpl/Snakeskin#info=devDependencies&view=table)

[![Build Status](http://img.shields.io/travis/SnakeskinTpl/Snakeskin.svg?style=flat&branch=master)](https://travis-ci.org/SnakeskinTpl/Snakeskin)
[![Coverage Status](http://img.shields.io/coveralls/SnakeskinTpl/Snakeskin.svg?style=flat)](https://coveralls.io/r/SnakeskinTpl/Snakeskin?branch=master)

[Demo](http://jsfiddle.net/kobezzza/NAPWB/10/)

[Documentation](https://github.com/SnakeskinTpl/Snakeskin/wiki)

[FAQ](https://github.com/SnakeskinTpl/Snakeskin/wiki/faq)

## Features

* 2 types of syntax: classic and Jade-Like;
* Object-oriented approach with very rich features for code-reuse (inheritance, composition, mixing, etc.);
* JS-like set of directives;
* [BEM](http://en.bem.info) (as in [Stylus](https://github.com/LearnBoost/stylus));
* Localization;
* Macros and filters;
* Modules;
* High-speed compilation;
* Work in browsers, as well as on a server ([node.js](http://nodejs.org));
* The engine is written in pure JavaScript and doesn't have any dependencies;
* The source code is designed to work with Google Closure Compiler in advanced mode;
* Good code coverage;
* Detailed [documentation](https://github.com/SnakeskinTpl/Snakeskin/wiki) with examples.

## Plugins

* [Gulp](https://github.com/SnakeskinTpl/gulp-snakeskin)
* [Grunt](https://github.com/SnakeskinTpl/grunt-snakeskin)

### Example

```
- template page(youAreUsingSnakeskin)
	- doctype
	< html lang = en
		< head
			< title :: Snakeskin
			#< script
				if (foo) bar(1 + 5)

		< body
			< h1 :: Snakeskin — the best template engine
			< #container.b-info
				- if youAreUsingSnakeskin
					< p.&__good :: Congratulations, you are using the best!

				- else
					< p.&__bad :: Get on it!

				< p.&__description
					Snakeskin — a client-server template engine with
					simple and straightforward syntax and a rich set of features.
```

```js
page(true);
```

It will transpiled to

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Snakeskin</title>
		<script type="text/javascript">
			if (foo) bar(1 + 5)
		</script>
	</head>
	<body>
		<h1>Snakeskin — the best template engine</h1>
		<div id="container" class="b-info">
			<p class="b-info__good">Congratulations, you are using the best!</p>
			<p class="b-info__description">Snakeskin — a client-server template engine with
				simple and straightforward syntax and a rich set of features.</p>
		</div>
	</body>
</html>
```

## [License](https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE)

The MIT License.
