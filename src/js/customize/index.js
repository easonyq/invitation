/**
 * @file dom.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @reference saber-dom by firede
 * @description
 * 个性化JS入口
 **/

define(function (require) {
    var slide1 = require('./slide1');
    var slide2 = require('./slide2');
    var slide3 = require('./slide3');

    var exports = {};

    exports.beforeLeave = function (slideIndex) {
        switch(slideIndex) {
            case 0:
                slide1.beforeLeave();
                break;
            case 1:
                slide2.beforeLeave();
                break;
            case 2:
                slide3.beforeLeave();
                break;
        }
    }

    exports.afterEnter = function (slideIndex) {
        switch(slideIndex) {
            case 0:
                slide1.afterEnter();
                break;
            case 1:
                slide2.afterEnter();
                break;
            case 2:
                slide3.afterEnter();
                break;
        }
    }

    return exports;
});