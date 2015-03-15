/**
 * @file dom.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @reference saber-dom by firede
 * @description
 * 个性化JS入口
 **/

define(function (require) {
    var slide1 = require('./slide1');

    var exports = {};

    exports.beforeLeave = function (slideIndex) {
        switch(slideIndex) {
            case 0:
                slide1.beforeLeave();
        }
    }

    exports.afterEnter = function (slideIndex) {
        switch(slideIndex) {
            case 0:
                slide1.afterEnter();
        }
    }

    return exports;
});