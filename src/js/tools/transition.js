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
    }

    /**
     * 展示某一页(没有过场动画)
     * 一般使用在刚进入文档时
     * @param  {number} index 目标幻灯片是第几张。这个数字是data.json中component的link的值，从1开始计数。
     */
    Transition.prototype.showPage = function(index) {
        index--;
        var slide = this.slideArr[index];
        slide.setBackground();
        dom.show(slide.main);
        slide.afterEnter();
        activeSlideIndex = index;
        this.slideArr.length > 1 && setDropIcon(slide.getConfig().direction);
        if (index === this.slideArr.length - 1) {
            dom.hide(dropIcon);
        }
        else {
            dom.show(dropIcon);
        }
    };

    Transition.prototype.next = function () {
        if (isMoving || activeSlideIndex >= this.slideArr.length - 1) {
            return;
        }
        var sourceSlide = this.slideArr[activeSlideIndex];
        activeSlideIndex++;
        switchTo.call(this, sourceSlide, this.slideArr[activeSlideIndex], true);
    };

    Transition.prototype.previous = function () {
        if (isMoving || activeSlideIndex <= 0) {
            return;
        }
        var sourceSlide = this.slideArr[activeSlideIndex];
        activeSlideIndex--;
        switchTo.call(this, sourceSlide, this.slideArr[activeSlideIndex], false);
    };

    /**
     * 跳转到某张幻灯片
     * @param  {number} index 目标幻灯片是第几张。这个数字是data.json中component的link的值，从1开始计数。
     * @return {[type]}       [description]
     */
    Transition.prototype.to = function (index) {
        index--;
        if (isMoving || index < 0 || index >= this.slideArr.length || index == activeSlideIndex) {
            return;
        }
        var sourceSlide = this.slideArr[activeSlideIndex];
        var isNext = index > activeSlideIndex;
        activeSlideIndex = index;
        switchTo.call(this, sourceSlide, this.slideArr[activeSlideIndex], isNext);
    };

    function initSlide(slide) {
        var components = dom.queryAll('.rt-component', slide.main);
        for (var i = 0, len = components.length; i < len; i++) {
            var component = components[i];
            var componentConf = util.getConfig(dom.query('.rt-component-config', component));
            if (componentConf && componentConf.animation && /fade/.test(componentConf.animation.name)) {
                dom.setStyle(component, 'opacity', 0);
            }
        }
    }

    function switchTo(sourceSlide, targetSlide, isNext) {
        initSlide(targetSlide);
        var finalConfig = targetSlide.getConfig();
        if (finalConfig.transition.name === 'fade') {
            fadeTo(sourceSlide, targetSlide);
        } else {
            // 目前仅有fade和move两类，因此这里是move
            if (finalConfig.direction === 'vertical') {
                moveVerticalTo(sourceSlide, targetSlide, isNext);
            } else {
                moveHorizontalTo(sourceSlide, targetSlide, isNext);
            }
        }
        // 如果是最后一张，隐藏滑动提示
        if (targetSlide === this.slideArr[this.slideArr.length - 1]) {
            dom.hide(dropIcon);
        }
        else {
            dom.show(dropIcon);
        }
    }

    function addCSSTransition(element, config) {
        var style = 'all ' + config.transition.duration + 'ms ' + util.camel2hyphen(config.transition.timingFunction);
        dom.setStyle(element, 'transition', style);
    }

    function removeCSSTransition(element) {
        dom.setStyle(element, 'transition', 'none');
    }

    function fadeTo(sourceSlide, targetSlide) {
        var config = targetSlide.getConfig();
        // 先设置背景属性（颜色，图片啥的）
        targetSlide.setBackground();

        // 进行fade
        isMoving = true;
        sourceSlide.setStyle('opacity', 1);
        targetSlide.setStyle('opacity', 0);
        dom.show(targetSlide.main);
        setTimeout(function () {
            addCSSTransition(sourceSlide.main, config);
            addCSSTransition(targetSlide.main, config);
        }, 20);
        // setTimeout确保执行顺序
        setTimeout(function () {
            sourceSlide.setStyle('opacity', 0);
            targetSlide.setStyle('opacity', 1);
        }, 40);

        // 还原
        setTimeout(function () {
            removeCSSTransition(sourceSlide.main);
            removeCSSTransition(targetSlide.main);
            dom.hide(sourceSlide.main);
            sourceSlide.setStyle('opacity', 1);
            sourceSlide.afterLeave();
            targetSlide.afterEnter();
        }, config.transition.duration);
        setTimeout(function () {
            isMoving = false;
        }, config.transition.duration + MOVING_DELAY);
    }

    function moveVerticalTo(sourceSlide, targetSlide, isNext) {
        var config = targetSlide.getConfig();

        // 设置背景
        targetSlide.setBackground();

        // 进行move
        isMoving = true;
        var height = window.innerHeight;
        var slidesInner = dom.query('.rt-slides-inner');
        dom.setStyle(slidesInner, 'height', height * 2 + 'px');
        var translateY = isNext ? - height : height;
        if (isNext) {
            targetSlide.setStyle('top', height + 'px');
        } else {
            sourceSlide.setStyle('top', height + 'px');
            dom.setStyle(slidesInner, 'top', - height + 'px');
        }
        dom.show(targetSlide.main);
        setTimeout(function () {
            addCSSTransition(slidesInner, config);
        }, 20);
        setTimeout(function () {
            dom.setStyle(slidesInner, 'transform', 'translate(0, ' + translateY + 'px)');
        }, 40);

        // 还原
        setTimeout(function () {
            removeCSSTransition(slidesInner);
            dom.hide(sourceSlide.main);
            dom.setStyles(slidesInner, {
                'height': height + 'px',
                'top': 0,
                'transform': 'none'
            });
            sourceSlide.setStyle('top', 0);
            targetSlide.setStyle('top', 0);
            sourceSlide.afterLeave();
            targetSlide.afterEnter();
        }, config.transition.duration);
        setTimeout(function () {
            isMoving = false;
        }, config.transition.duration + MOVING_DELAY);
    }

    function moveHorizontalTo(sourceSlide, targetSlide, isNext) {
        var config = targetSlide.getConfig();
        // 设置背景
        targetSlide.setBackground();

        // 进行move
        isMoving = true;
        var width = window.innerWidth;
        var slidesInner = dom.query('.rt-slides-inner');
        dom.setStyle(slidesInner, 'width', width * 2 + 'px');
        var translateX = isNext ? - width : width;
        if (isNext) {
            targetSlide.setStyle('left', width + 'px');
        } else {
            sourceSlide.setStyle('left', width + 'px');
            dom.setStyle(slidesInner, 'left', - width + 'px');
        }
        dom.show(targetSlide.main);
        setTimeout(function () {
            addCSSTransition(slidesInner, config);
        }, 20);
        setTimeout(function () {
            dom.setStyle(slidesInner, 'transform', 'translate(' + translateX + 'px, 0)');
        }, 40);

        setTimeout(function () {
            removeCSSTransition(slidesInner);
            dom.hide(sourceSlide.main);
            dom.setStyles(slidesInner, {
                'width': width + 'px',
                'left': 0,
                'transform': 'none'
            });
            sourceSlide.setStyle('left', 0);
            targetSlide.setStyle('left', 0);
            sourceSlide.afterLeave();
            targetSlide.afterEnter();
        }, config.transition.duration);
        setTimeout(function () {
            isMoving = false;
        }, config.transition.duration + MOVING_DELAY);
    }

    function setDropIcon(direction) {
        dropIcon = dom.create('div');
        if (direction === 'vertical') {
            dropIcon.className = 'drop-icon drop-up-icon';
        }
        else {
            dropIcon.className = 'drop-icon drop-left-icon'
        }
        document.body.appendChild(dropIcon);
    }


    return Transition;
});
