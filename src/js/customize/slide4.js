/**
 * @file slide4.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 末页
 **/

define(function (require) {
    var dom = require('../tools/dom');

    var clickTimes = 0;
    var hasBindEvents = false;
    var exports = {};

    exports.afterEnter = function () {
        dom.setStyle('.pm', 'animation', 'rt-fade-in 0.25s linear forwards');
        dom.setStyle('.rd', 'animation', 'rt-fade-in 0.25s linear 0.25s forwards');
        dom.setStyle('.qa', 'animation', 'rt-fade-in 0.25s linear 0.5s forwards');
        dom.setStyle('.bd', 'animation', 'rt-fade-in 0.25s linear 0.75s forwards');
        dom.setStyle('.ts', 'animation', 'rt-fade-in 0.25s linear 1s forwards');
        dom.setStyle('.hint', 'animation', 'rt-fade-in 0.5s linear 1.25s forwards');
        dom.setStyle('.feedback', 'animation', 'rt-fade-in 0.5s linear 1.75s forwards');
    };

    exports.beforeLeave = function () {
        resetAnimation('.pm');
        resetAnimation('.rd');
        resetAnimation('.qa');
        resetAnimation('.bd');
        resetAnimation('.ts');
        resetAnimation('.hint');
        resetAnimation('.feedback');
    };

    function bindEvents() {
        dom.query('.hint').addEventListener('touchend', function () {
            clickTimes++;
            if (clickTimes >= 5) {
                alert('你以为这里会有什么惊喜吗？其实没有，只是为了好玩儿而已哈哈哈哈！');
            }
        });
        hasBindEvents = true;
    }

    function resetAnimation(element) {
        dom.setStyles(element, {
            'animation': 'none'
        });
    }

    return exports;
});