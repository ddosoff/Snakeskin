/* Snakeskin v3.4.0, generated at <1404375954884> Thu Jul 03 2014 12:25:54 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() { /* Snakeskin template: param_base; a, b  */
        this.param_base = function(a, b) {
            b = b != null ? b : 1;
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_base',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_base'] = this.param_base;
        } /* Snakeskin template. */ /* Snakeskin template: param_child;  */
        this.param_child = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_child',
                PARENT_TPL_NAME = 'param_base';
            var b = 2;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_child'] = this.param_child;
        } /* Snakeskin template. */ /* Snakeskin template: param_child2;  */
        this.param_child2 = function() {
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_child2',
                PARENT_TPL_NAME = 'param_child';
            var b = 3;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_child2'] = this.param_child2;
        } /* Snakeskin template. */ /* Snakeskin template: param_base2; @a  */
        this.param_base2 = function(a) {
            a = a != null ? a : {
                a: 1
            };
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_base2',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.a));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_base2'] = this.param_base2;
        } /* Snakeskin template. */ /* Snakeskin template: param_child22; @a */
        this.param_child22 = function(a) {
            a = a != null ? a : {
                a: 1
            };
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_child22',
                PARENT_TPL_NAME = 'param_base2';
            __RESULT__ += ' ';
            __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(a.a));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_child22'] = this.param_child22;
        } /* Snakeskin template. */ /* Snakeskin template: param_base3; @a  */
        this.param_base3 = function(a) {
            a = a != null ? a : {
                a: {
                    c: 1
                }
            };
            var __RESULT__ = '',
                $_;
            var __STR__;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'param_base3',
                PARENT_TPL_NAME;
            __RESULT__ += ' ';
            var b = 2;
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            var __a__proto_365 = void 0 != null ? void 0 : a.a;
            var ____I_PROTO___foo_with_65 = 1;
            ____I_PROTO___foo_with_65: while (____I_PROTO___foo_with_65--) {
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(__a__proto_365.c));
                __RESULT__ += ' ';
                __RESULT__ += Snakeskin.Filters.html(Snakeskin.Filters.undef(b));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        if (typeof Snakeskin !== 'undefined') {
            Snakeskin.cache['param_base3'] = this.param_base3;
        } /* Snakeskin template. */
    }
}).call(this);