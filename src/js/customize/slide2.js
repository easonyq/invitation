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
    var slideWrapperOffset = -320;
    var isMoving = false;
    var exports = {};

    exports.afterEnter = function () {
        dom.setStyle('.text h2', 'opacity', 1);
        setTimeout(function () {
            dom.setStyle('.text .hint', 'opacity', 1);
            dom.setStyle('.text .time', 'opacity', 1);
        }, 500);
        setTimeout(function () {
            dom.setStyle('.text .timeCN', 'opacity', 1);
            dom.setStyle('.text .other', 'opacity', 1);
        }, 1000);
        setTimeout(function () {
            dom.setStyle(leftButton, 'left', 0);
            dom.setStyle(rightButton, 'right', 0)
        }, 1500);
        bindEvents();
    };

    function bindEvents() {
        leftButton.addEventListener('touchend', function () {
            if (isMoving) {
                return;
            }
            dom.setStyle(slideWrapper, 'left', '0');
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
            dom.setStyle(slideWrapper, 'left', '-640px');
            slideWrapperOffset = -640;
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
            if (slideWrapperOffset > -640) {
                slideWrapperOffset -= 320;
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
                slideWrapperOffset += 320;
                isMoving = true;
                dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
                setTimeout(function () {
                    isMoving = false;
                }, 500);
            }
        });
    }

    exports.beforeLeave = function () {

    };

    // function resetAnimation(element) {
    //     dom.setStyles(element, {
    //         'animation': 'none'
    //     });
    // }

    return exports;
});