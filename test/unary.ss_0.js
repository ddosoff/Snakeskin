/* Snakeskin v6.1.3, key <commonJS,false,
,xml,false,false,,stringConcat,true,true,true,,true,true,i18n>, label <1413886610453>, includes <>, generated at <1414919437557>.
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
        var $_ = __LOCAL__['$_3988b']; /* Snakeskin template: unary_index;  */
        this.unary_index = function() {
            var __THIS__ = this,
                __CALLEE__ = __ROOT__.unary_index,
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
            var TPL_NAME = "unary_index",
                PARENT_TPL_NAME;
            __RESULT__ += __FILTERS__.html(typeof foo, false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(1 instanceof Number, false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(__FILTERS__.undef(new Object), false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html('valueOf' in Object.prototype, false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(typeof typeof foo, false, false);
            __RESULT__ += ' ';
            __RESULT__ += __FILTERS__.html(1 instanceof Number instanceof Boolean, false, false);
            __RESULT__ += ' ';
            return __RESULT__;
        };
        Snakeskin.cache["unary_index"] = this.unary_index; /* Snakeskin template. */
    }
}).call(this);
