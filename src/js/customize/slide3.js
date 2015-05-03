/**
 * @file slide3.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 结婚照
 **/

define(function (require) {
    var dom = require('../tools/dom');
    var tap = require('../tools/tap');

    var PHOTO_NUM = 4; // 不包括最后一张重复的
    var WINDOW_WIDTH = window.innerWidth;
    var slideWrapper = dom.query('.slide-3 .rt-slide-real');
    var slideWrapperOffset = 0;
    var isMoving = false;
    var hasBindEvents = false;
    var exports = {};

    exports.afterEnter = function () {
        dom.setStyle('.our-story', 'animation', 'out-story 2.5s linear forwards');
        if (!hasBindEvents) {
            bindEvents();
        }
    };

    exports.beforeLeave = function () {
        resetAnimation('.our-story');
    };

    function bindEvents() {
        tap.register(slideWrapper, 'horizontal');
        slideWrapper.on('tap-left', function () {
            if (isMoving) {
                return;
            }
            isMoving = true;
            if (slideWrapperOffset === - PHOTO_NUM  * WINDOW_WIDTH) {
                dom.setStyle(slideWrapper, 'transition', 'none');
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'left', 0);
                }, 20);
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'transition', 'all 0.5s ease-in-out');
                }, 40);
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'left', - WINDOW_WIDTH + 'px');
                    slideWrapperOffset = - WINDOW_WIDTH;
                }, 60);
            } else {
                slideWrapperOffset -= WINDOW_WIDTH;
                dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
            }
            setTimeout(function () {
                isMoving = false;
            }, 600);
        });
        slideWrapper.on('tap-right', function () {
            if (isMoving) {
                return;
            }
            isMoving = true;
            if (slideWrapperOffset === 0) {
                dom.setStyle(slideWrapper, 'transition', 'none');
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'left', - PHOTO_NUM * WINDOW_WIDTH + 'px');
                }, 20);
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'transition', 'all 0.5s ease-in-out');
                }, 40);
                setTimeout(function () {
                    dom.setStyle(slideWrapper, 'left', - (PHOTO_NUM - 1) * WINDOW_WIDTH + 'px');
                    slideWrapperOffset = - (PHOTO_NUM - 1) * WINDOW_WIDTH;
                }, 60);
            } else {
                slideWrapperOffset += WINDOW_WIDTH;
                dom.setStyle(slideWrapper, 'left', slideWrapperOffset + 'px');
            }
            setTimeout(function () {
                isMoving = false;
            }, 600);
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