/**
 * @file util.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 一些有用的小方法，单独列在这里
 **/

define(function (require) {
    var exports = {};

    // 合并对象，属性冲突以first为准
    // @return {object} 合并后的对象 
    exports.merge = function (first, second) {
        if (!first) {
            return second;
        } else {
            for (var key in second) {
                if (typeof second[key] === 'object') {
                    first[key] = exports.merge(first[key], second[key]);
                } else if (first[key] == undefined) {
                    first[key] = second[key];
                }
            }
        }
        return first;
    };

    exports.camel2hyphen = function (name) {
        return name.replace(/[A-Z]/g, function (ele) {
            return ('-' + ele.toLowerCase());
        });
    };

    return exports;
});