/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1413959375853>, includes <>, generated at <1414826997498>.
   This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports['init'] = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var __ROOT__ = this,
            self = this;
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __APPEND__ = Snakeskin.appendChild,
            __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __TMP__, __J__;
        var $_ = __LOCAL__['$_7e487']; /* Snakeskin template: simple_output;  */
        this.simple_output = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.simple_output,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "simple_output",
                PARENT_TPL_NAME;
            e = ({
                foo: {
                    my: function() {
                        return 1;
                    }
                }
            });
            a = ({
                foo: 'my',
                n: 'foo'
            });
            __RESULT__ += e[a['n']][a['foo']](1, 2, 3);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(new String([1, 2, 3]).indexOf()), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(($_ = __FILTERS__['replace'].call(this, '{foo}', /^{/gim, '')), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(2 / 2, false, false);
            __RESULT__ += ' ';
            var e;
            var a;
            return __RESULT__;
        };
        Snakeskin.cache["simple_output"] = this.simple_output; /* Snakeskin template. */ /* Snakeskin template: simple_index; name lname */
        /**
         * @return string
         * {template bar}
         */
        this.simple_index = function(name, lname) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.simple_index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "simple_index",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '', false, false);
            __RESULT__ += '!</h1> Foo';
            __RESULT__ += 'bar///1 ';
            return __RESULT__;
        };
        Snakeskin.cache["simple_index"] = this.simple_index; /* Snakeskin template. */ /* Snakeskin template: simple_tpl.index; name lname */
        if (this.simple_tpl == null) {
            this.simple_tpl = {};
        }
        this.simple_tpl.index = function index(name, lname) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.simple_tpl.index,
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "simple_tpl.index",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '', false, false);
            __RESULT__ += '!</h1> ';
            return __RESULT__;
        };
        Snakeskin.cache["simple_tpl.index"] = this.simple_tpl.index; /* Snakeskin template. */ /* Snakeskin template: simple_tpl.foo['index']; name lname */
        if (this.simple_tpl == null) {
            this.simple_tpl = {};
        }
        if (this.simple_tpl.foo == null) {
            this.simple_tpl.foo = {};
        }
        this.simple_tpl.foo['index'] = function(name, lname) {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.simple_tpl.foo['index'],
                callee = __CALLEE__;
            if (!callee.Blocks) {
                var __BLOCKS__ = __CALLEE__.Blocks = {},
                    blocks = __BLOCKS__;
            }
            var __RESULT__ = '',
                __COMMENT_RESULT__, __NODE__, $_;

            function getTplResult(opt_clear) {
                var res = __RESULT__;
                if (opt_clear) {
                    __RESULT__ = '';
                }
                return res;
            }

            function clearTplResult() {
                __RESULT__ = '';
            }
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = "simple_tpl.foo['index']",
                PARENT_TPL_NAME;
            name = arguments[0] = name != null ? name : 'world';
            __RESULT__ += '<h1>Hello ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(name), false, false);
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(lname) ? ' ' + lname : '', false, false);
            __RESULT__ += '!</h1> ';
            a = 1;
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a) === 1 ? 1 : 2, false, false);
            __RESULT__ += ' '; /**<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>*/
            var a;
            return __RESULT__;
        };
        Snakeskin.cache["simple_tpl.foo['index']"] = this.simple_tpl.foo['index']; /* Snakeskin template. */
    }
}).call(this);