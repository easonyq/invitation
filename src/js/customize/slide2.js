/**
 * @file slide2.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 信息页脚本
 **/

define(function (require) {
    var dom = require('../tools/dom');
    var tap = require('../tools/tap');

    var leftButton = dom.query('.left-button');
    var rightButton = dom.query('.right-button');
    var slideWrapper = dom.query('.slide-2 .rt-slide-real');
    var WINDOW_WIDTH = window.innerWidth;
    var slideWrapperOffset = - WINDOW_WIDTH;
    var isMoving = false;
    var hasBindEvent = false;
    var buttonTimeout;
    var exports = {};

    exports.afterEnter = function () {
        dom.setStyle('.text h2', 'animation', 'rt-fade-in 0.5s linear forwards');
        dom.setStyle('.text .hint', 'animation', 'rt-fade-in 0.5s linear 0.5s forwards');
        dom.setStyle('.text .time', 'animation', 'rt-fade-in 0.5s linear 0.5s forwards');
        dom.setStyle('.text .timeCN', 'animation', 'rt-fade-in 0.5s linear 1s forwards');
        dom.setStyle('.text .other', 'animation', 'rt-fade-in 0.5s linear 1s forwards');
        buttonTimeout = setTimeout(function () {
            dom.setStyle(leftButton, 'left', 0);
            dom.setStyle(rightButton, 'right', 0)
        }, 1500);
        if (!hasBindEvent) {
            bindEvents();
        }
    };

    function bindEvents() {
        leftButton.addEventListener('touchend', function () {
            if (isMoving) {
                return;
            }
            dom.setStyle(slideWrapper, 'left', 0);
            slideWrapperOffset = 0;
            isMoving = true;
            setTimeout(function () {
                isMoving = false;
            }, 500);
        });
        rightButton.addEventListener('touchend', function () {
            if (isMoving) {
                return;
            }
            slideWrapperOffset = - WINDOW_WIDTH * 2;
            dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
            isMoving = true;
            setTimeout(function () {
                isMoving = false;
            }, 500);
        });
        tap.register(slideWrapper);
        slideWrapper.on('tap-left', function () {
            if (isMoving) {
                return;
            }
            if (slideWrapperOffset > - WINDOW_WIDTH * 2) {
                slideWrapperOffset -= WINDOW_WIDTH;
                isMoving = true;
                dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
                setTimeout(function () {
                    isMoving = false;
                }, 500);
            }
        });
        slideWrapper.on('tap-right', function () {
            if (isMoving) {
                return;
            }
            if (slideWrapperOffset < 0) {
                slideWrapperOffset += WINDOW_WIDTH;
                isMoving = true;
                dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
                setTimeout(function () {
                    isMoving = false;
                }, 500);
            }
        });
        hasBindEvent = true;
    }

    exports.beforeLeave = function () {
        clearTimeout(buttonTimeout);
        resetAnimation('.text h2');
        resetAnimation('.text .hint');
        resetAnimation('.text .time');
        resetAnimation('.text .timeCN');
        resetAnimation('.text .other');
        dom.setStyle(leftButton, 'left', '-130px');
        dom.setStyle(rightButton, 'right', '-130px');
    };

    function resetAnimation(element) {
        dom.setStyles(element, {
            'animation': 'none'
        });
    }

    return exports;
});