/**
 * @file util.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 一些有用的小方法，单独列在这里
 **/

define(function (require) {
    var exports = {};

    exports.getConfig = function (element, defaultConfig) {
        if (!element) {
            return defaultConfig;
        } else if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        var result;
        try {
            result = JSON.parse(element.innerHTML.trim());
        } catch (e) {
            return {};
        }
        if (defaultConfig) {
            exports.merge(result, defaultConfig);
        }
        return result;
    };

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

    /**
     * 资源加载函数
     * @param  {Array|string} resource 资源地址或者地址列表
     * @param  {Function} callback 加载完成后的回调函数
     * @return
     */
    exports.load = function (resource, callback) {
        if (typeof resource === 'undefined') {
            callback && callback();
            return;
        }
        if (typeof resource === 'string') {
            resource = [resource];
        }
        var total = resource.length;
        if (total === 0) {
            callback && callback();
            return;
        }
        resource.forEach(function (url, index) {
            var img = new Image;
            img.src = url;
            img.addEventListener('load', function () {
                img = null;
                --total <= 0 && callback && callback();
            });
        });
    };

    return exports;
});