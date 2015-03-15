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

    var isMoving = false;
    var MOVING_DELAY = 300;
    var activeSlideIndex = 0;

    var dropIcon;

    function Transition(slideArr) {
        this.slideArr = slideArr;
        setDropIcon();
    }

    Transition.prototype.next = function () {
        if (isMoving || activeSlideIndex >= this.slideArr.length - 1) {
            return;
        }
        activeSlideIndex++;
        move();
    };

    Transition.prototype.previous = function () {
        if (isMoving || activeSlideIndex <= 0) {
            return;
        }
        activeSlideIndex--;
        move();
    };

    function move() {
        isMoving = true;
        var slidesInner = dom.query('.rt-slides-inner');
        dom.setStyle(slidesInner, 'top', - activeSlideIndex * window.innerHeight + 'px');
        setTimeout(function () {
            isMoving = false;
        }, 500);
    }

    function setDropIcon() {
        dropIcon = dom.create('div');
        dropIcon.className = 'drop-icon drop-up-icon';
        document.body.appendChild(dropIcon);
    }


    return Transition;
});
