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
    var opacityTimeout;
    var exports = {};

    exports.afterEnter = function () {
        dom.setStyle('.pm', 'animation', 'rt-fade-in 0.5s linear forwards');
        dom.setStyle('.rd', 'animation', 'rt-fade-in 0.5s linear 0.5s forwards');
        dom.setStyle('.qa', 'animation', 'rt-fade-in 0.5s linear 1s forwards');
        dom.setStyle('.bd', 'animation', 'rt-fade-in 0.5s linear 1.5s forwards');
        dom.setStyle('.ts', 'animation', 'rt-fade-in 0.5s linear 2s forwards');
        dom.setStyle('.slide-4 .hint', 'animation', 'rt-fade-in 0.5s linear 2.5s forwards');
        dom.setStyle('.feedback', 'animation', 'rt-fade-in 0.5s linear 3s forwards');
        dom.setStyle('.feedback', 'animation', 'feedback 4s infinite linear 3.5s');
        opacityTimeout = setTimeout(function () {
            dom.setStyle('.feedback', 'opacity', '1');
        }, 3000);
    };

    exports.beforeLeave = function () {
        resetAnimation('.pm');
        resetAnimation('.rd');
        resetAnimation('.qa');
        resetAnimation('.bd');
        resetAnimation('.ts');
        resetAnimation('.slide-4 .hint');
        resetAnimation('.feedback');
        clearTimeout(opacityTimeout);
    };

    function bindEvents() {
        dom.query('.slide-4 .hint').addEventListener('touchend', function () {
            clickTimes++;
            if (clickTimes >= 5) {
                alert('https://github.com/easonyq/invitation');
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