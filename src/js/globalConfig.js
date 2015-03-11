/**
 * @file globalConfig.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 全局配置
 **/

define(function (require) {

    var util = require('./tools/util');
    
    var globalConfig;
    var exports = {};
    
    exports.DEFAULT_GLOBAL_TRANSITION_CONFIG = {
        transition: {
            name: 'move',
            duration: 500,
            timingFunction: 'ease'
        },
        direction: 'vertical'
    };

    exports.DEFAULT_COMPONENT_ANIMATION_CONFIG = {
        animation: {
            type: 'none',
            duration: 500,
            timingFunction: 'ease',
            delay: 0,
            iterationCount: 1
        }
    };

    exports.init = function () {
        globalConfig = util.getConfig('.rt-global-config', exports.DEFAULT_GLOBAL_TRANSITION_CONFIG);
    };

    exports.get = function () {
        return globalConfig || {};
    };

    return exports;
});