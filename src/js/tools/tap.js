/**
 * @file tap.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 处理tap事件，用以判断滑动方向
 **/

 define(function (require) {
    
    var Emitter = require('./emitter');
    var exports = {};

    var MIN_OFFSET = 30; // 最小滑动阈值

    /**
     * 注册tap事件，会自动触发tap-left, tap-right, tap-bottom, tap-top事件。
     * @param  {HTMLElement} element   需要注册的元素
     * @param  {string} direction 'vertical'/'horizontal' 限制方向，不传表示均可。
     *                            如传入vertical，则不会触发tap-left或者tap-right。
     */
    exports.register = function (element, direction) {
        Emitter.mixin(element);
        element.addEventListener('touchstart', function (e) {
            // e.preventDefault();
            element._tapStartX = e.touches[0].pageX;
            element._tapStartY = e.touches[0].pageY;
        }, false);

        element.addEventListener('touchmove', function (e) {
            e.preventDefault();
            element._tapOffsetX = e.touches[0].pageX - element._tapStartX;
            element._tapOffsetY = e.touches[0].pageY - element._tapStartY;
            trigger(element, e, direction);
        }, false);

        element.addEventListener('touchend', function (e) {
            // e.preventDefault();
            e.stopPropagation();
            trigger(element, e, direction);
        }, false);
    }

    function trigger(element, e, direction) {
        var offsetX = element._tapOffsetX;
        var offsetY = element._tapOffsetY;
        var eventType;
        if (isNaN(offsetX) || isNaN(offsetY)) {
            return;
        }
        if (direction === 'vertical') {
            if (Math.abs(offsetY) <= MIN_OFFSET) {
                return;
            }
            eventType = offsetY > 0 ? 'tap-bottom' : 'tap-top';
        } else if (direction === 'horizontal') {
            if (Math.abs(offsetX) <= MIN_OFFSET) {
                return;
            }
            eventType = offsetX > 0 ? 'tap-right' : 'tap-left';
        } else {
            if (Math.abs(offsetX) <= MIN_OFFSET && Math.abs(offsetY) <= MIN_OFFSET) {
                return;
            }
            if (Math.abs(offsetX) >= Math.abs(offsetY)) {
                eventType = offsetX > 0 ? 'tap-right' : 'tap-left';
            } else {
                eventType = offsetY > 0 ? 'tap-bottom' : 'tap-top';
            }
        }
        element.emit(eventType, e);
        delete element._tapOffsetX;
        delete element._tapOffsetY;
    }

    return exports;
 });
