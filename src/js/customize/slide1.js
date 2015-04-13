/**
 * @file dom.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 封面脚本
 **/

define(function (require) {
    var dom = require('../tools/dom');

    var exports = {};
    var snowInterval;
    var snowArr;
    var snowTimeoutArr;

    function generateSnow() {
        var snowDiv = dom.create('div');
        snowDiv.className = 'snow snow-' + (parseInt(Math.random() * 4) + 1);
        var initLeft = Math.random() * window.innerWidth;
        dom.setStyles(snowDiv, {
            'left': initLeft + 'px',
            'transform': 'rotateZ(' + Math.random() * 360 + 'deg)',
            'opacity': 1
        });
        setTimeout(function () {
            dom.setStyle(snowDiv, 'transition', 'all ' + (Math.random() * 5 + 5).toFixed(2) + 's linear');
        }, 20);
        setTimeout(function () {
            dom.setStyles(snowDiv, {
                'top': window.innerHeight + 'px',
                'left': initLeft + (Math.random() - 0.5) * 100 + 'px',
                'transform': 'rotateZ(' + Math.random() * 1080 + 'deg)',
                'opacity': 0.2
            });
        }, 40);
        snowTimeoutArr.push(setTimeout(function () {
            dom.query('.slide-1').removeChild(snowDiv);
            snowArr.splice(0, 1);
            snowTimeoutArr.splice(0, 1);
        }, 10000));
        dom.query('.slide-1').appendChild(snowDiv);
        snowArr.push(snowDiv);
    }

    exports.afterEnter = function () {
        dom.setStyle('.back', 'animation', 'rt-fade-in 0.5s linear forwards');
        dom.setStyle('.name-wrapper', 'animation', 'rt-fade-in 0.5s linear 0.5s forwards');
        dom.setStyle('.date-wrapper', 'animation', 'rt-fade-in 0.5s linear 1s forwards');
        snowInterval = setInterval(function () {
            generateSnow();
        }, 1000);
        snowArr = [];
        snowTimeoutArr = [];
    };

    function resetAnimation(element) {
        dom.setStyles(element, {
            'animation': 'none'
        });
    }

    exports.beforeLeave = function () {
        setTimeout(function () {
            resetAnimation('.back');
            resetAnimation('.name-wrapper');
            resetAnimation('.date-wrapper');
            var slideDiv = dom.query('.slide-1');
            for (var i = 0; i < snowArr.length; i++) {
                slideDiv.removeChild(snowArr[i]);
                clearTimeout(snowTimeoutArr[i]);
            }
            clearInterval(snowInterval);
        }, 500);
    };

    return exports;
});