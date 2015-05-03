/**
 * @file transition.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 处理幻灯片之间的过场动画
 **/

define(function (require) {

    var Emitter = require('./emitter');
    var dom = require('./dom');
    var util = require('./util');
    var customize = require('../customize/index');

    var isMoving = false;
    var MOVING_DELAY = 300;
    var activeSlideIndex = 0;

    function Transition(slideArr) {
        this.slideArr = slideArr;
        setDropIcon();
    }

    Transition.prototype.next = function () {
        if (isMoving || activeSlideIndex >= this.slideArr.length - 1) {
            return;
        }
        move(true);
        if (activeSlideIndex === this.slideArr.length - 1) {
            dom.hide('.drop-icon');
        }
    };

    Transition.prototype.previous = function () {
        if (isMoving || activeSlideIndex <= 0) {
            return;
        }
        move(false);
        dom.show('.drop-icon');
    };

    Transition.prototype.start = function () {
        customize.afterEnter(0);
    };

    function move(isNext) {
        isMoving = true;
        customize.beforeLeave(activeSlideIndex);
        if (isNext) {
            activeSlideIndex++;
        } else {
            activeSlideIndex--;
        }
        var slidesInner = dom.query('.rt-slides-inner');
        dom.setStyle(slidesInner, 'top', - activeSlideIndex * window.innerHeight + 'px');
        setTimeout(function () {
            isMoving = false;
            customize.afterEnter(activeSlideIndex);
        }, 500);
    }

    function setDropIcon() {
        var dropIcon = dom.create('div');
        dropIcon.className = 'drop-icon drop-up-icon';
        document.body.appendChild(dropIcon);
    }


    return Transition;
});
