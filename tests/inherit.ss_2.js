/* Snakeskin v4.0.0, generated at <1405516215709> Wed Jul 16 2014 17:10:15 GMT+0400 (Московское время (зима)). This code is generated automatically, don't alter it. */
(function() {
    var Snakeskin = global.Snakeskin;
    exports.init = function(obj) {
        Snakeskin = Snakeskin || obj instanceof Object ? obj : require(obj);
        delete exports.init;
        exec.call(exports);
        return exports;
    };

    function exec() {
        var $C = this.$C != null ? this.$C : Snakeskin.Vars.$C,
            async = this.async != null ? this.async : Snakeskin.Vars.async;
        var __$C__ = $C,
            __async__ = async;
        var __FILTERS__ = Snakeskin.Filters,
            __VARS__ = Snakeskin.Vars,
            __LOCAL__ = Snakeskin.LocalVars,
            __STR__, __J__;
        var $_; /* Snakeskin template: inherit_base; val  val2  */
        this.inherit_base = function(val, val2) {
            val = val != null ? val : 1;
            val2 = val2 != null ? val2 : 3;
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_base',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(val2));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(val));
            __RESULT__ += ' ';
            var ____I_PROTO___bar_template_45 = 1;
            ____I_PROTO___bar_template_45: while (____I_PROTO___bar_template_45--) {}
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_base'] = this.inherit_base; /* Snakeskin template. */ /* Snakeskin template: inherit_sub; val  */
        this.inherit_sub = function(val) {
            val = val != null ? val : 2;
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_sub',
                PARENT_TPL_NAME = 'inherit_base';
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var val2 = 3;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(val2));
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(val));
            __RESULT__ += ' ';
            var __i__proto_314 = void 0 != null ? void 0 : 11;
            var ____I_PROTO___bar_template_44 = 1;
            ____I_PROTO___bar_template_44: while (____I_PROTO___bar_template_44--) {
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(__i__proto_314));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            __RESULT__ += ' ';
            __RESULT__ += 'my';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_sub'] = this.inherit_sub; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst;  */
        this.inherit_superTestConst = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                __RESULT__ += ' ';
                var foo = 1;
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_superTestConst'] = this.inherit_superTestConst; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst;  */
        this.inherit_childTestConst = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst',
                PARENT_TPL_NAME = 'inherit_superTestConst';
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_55 = 1;
            ____I_PROTO___a_template_55: while (____I_PROTO___a_template_55--) {
                __RESULT__ += ' ';
                var foo = 2;
                __RESULT__ += ' ';
                __RESULT__ += __FILTERS__.html(__FILTERS__.undef(foo));
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_childTestConst'] = this.inherit_childTestConst; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst2;  */
        this.inherit_superTestConst2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst2',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                __RESULT__ += ' ';
                var a = 1;
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_superTestConst2'] = this.inherit_superTestConst2; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst2;  */
        this.inherit_childTestConst2 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst2',
                PARENT_TPL_NAME = 'inherit_superTestConst2';
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            __RESULT__ += ' ';
            var ____I_PROTO___a_template_56 = 1;
            ____I_PROTO___a_template_56: while (____I_PROTO___a_template_56--) {
                __RESULT__ += ' ';
                var a = 2;
                __RESULT__ += ' ';
                __RESULT__ += ' ';
                var ____I_PROTO___e_template_56 = 1;
                ____I_PROTO___e_template_56: while (____I_PROTO___e_template_56--) {
                    __RESULT__ += ' ';
                    var j = 1;
                    __RESULT__ += ' ';
                    __RESULT__ += __FILTERS__.html(__FILTERS__.undef(j));
                    __RESULT__ += ' ';
                }
                __RESULT__ += ' ';
            }
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_childTestConst2'] = this.inherit_childTestConst2; /* Snakeskin template. */ /* Snakeskin template: inherit_superTestConst3;  */
        this.inherit_superTestConst3 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_superTestConst3',
                PARENT_TPL_NAME;
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var a = {};
            __RESULT__ += ' ';
            a.a = 1;
            __RESULT__ += ' ';
            a['b'] = 2;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.a));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_superTestConst3'] = this.inherit_superTestConst3; /* Snakeskin template. */ /* Snakeskin template: inherit_childTestConst3;  */
        this.inherit_childTestConst3 = function() {
            var __THIS__ = this;
            var __RESULT__ = '',
                $_;
            var __RETURN__ = false,
                __RETURN_VAL__;
            var TPL_NAME = 'inherit_childTestConst3',
                PARENT_TPL_NAME = 'inherit_superTestConst3';
            var $C = __$C__ || typeof $C !== 'undefined' ? $C : Snakeskin.Vars.$C;
            var async = __async__ || typeof async !== 'undefined' ? async : Snakeskin.Vars.async;
            var a = {};
            __RESULT__ += ' ';
            a.a = 2;
            __RESULT__ += ' ';
            a.b = 3;
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.a));
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(a.b));
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache['inherit_childTestConst3'] = this.inherit_childTestConst3; /* Snakeskin template. */
    }
}).call(this);