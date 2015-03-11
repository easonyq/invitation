/**
 * @file slide.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 幻灯片相关处理
 **/

define(function (require) {

    var dom = require('./tools/dom');
    var util = require('./tools/util');
    var globalConfig = require('./globalConfig');

    function Slide(root) {
        this.main = root;
        this.config = util.merge(util.getConfig(dom.query('.rt-slide-config', root)), globalConfig.get());
        this.animationTimeouts = [];
        this.animationDoms = [];
    }

    // 获取merge后的config
    Slide.prototype.getConfig = function () {
        return this.config;
    };

    Slide.prototype.setStyle = function (style, value) {
        dom.setStyle(this.main, style, value);
    };

    Slide.prototype.setStyles = function (styles) {
        dom.setStyles(this.main, styles);
    };

    // 因为现在slide的模板中，背景也是写在conf而不是直接style，因此切换时候还要JS来设置的。但只要设置一次就够了
    Slide.prototype.setBackground = function () {
        // 防止每次切换都要设置
        if (this.rtSetBackground) {
            return;
        }
        if (this.config.backgroundColor) {
            this.setStyle('background-color', this.config.backgroundColor);
        }
        if (this.config.backgroundImage) {
            this.setStyle('backgroundImage', 'url("' + this.config.backgroundImage + '")');
            if (this.config.backgroundRepeat) {
                this.setStyle('backgroundRepeat', this.config.backgroundRepeat);
            } else {
                this.setStyle('backgroundRepeat', 'no-repeat');
            }
            if (this.config.backgroundSize) {
                this.setStyle('backgroundSize', this.config.backgroundSize);
            }
        }
    };

    // 执行在转场动画结束后，用以运行所有组件的动画
    Slide.prototype.afterEnter = function () {
        var components = dom.queryAll('.rt-component', this.main);
        var me = this;
        for (var i in components) {
            (function () {
                var component = components[i];
                if (!dom.query('.rt-config', component)) {
                    return;
                }
                var config = util.getConfig(dom.query('.rt-config', component),
                    globalConfig.DEFAULT_COMPONENT_ANIMATION_CONFIG);
                if (config.animation.name === ''
                    || isNaN(config.animation.duration)
                    || parseInt(config.animation.duration) === 0) {
                    return;
                }
                if (config.animation.name === 'fade') {
                    // fade比较特殊，单独处理
                    // 特殊点在于：最开始必须是隐藏的。
                    // 如果设置了opacity:0加上animation会导致animation跑完了渐现后又隐藏；
                    // 而如果直接animation，会导致转场动画时已经显示了，转场结束后突然隐藏然后开始播动画，也很破相
                    // 不知道我解释清楚没有…… by wangyisheng
                    dom.setStyle(component, 'opacity', 0);
                    var style = 'opacity ' + config.animation.duration + 'ms ' + util.camel2hyphen(config.animation.timingFunction);
                    me.animationTimeouts.push(setTimeout(function () {
                        dom.setStyle(component, 'transition', style);
                    }, 20));
                    me.animationTimeouts.push(setTimeout(function () {
                        dom.setStyle(component, 'opacity', 1);
                    }, Math.max(40, config.animation.delay)));
                    me.animationTimeouts.push(setTimeout(function () {
                        dom.setStyle(component, 'transition', 'none');
                    }, config.animation.delay + config.animation.duration));
                    component.rtIsFade = true;
                } else {
                    // 其余用animation
                    var style = 'rt-' + config.animation.name + ' ' + config.animation.duration + 'ms '
                        + util.camel2hyphen(config.animation.timingFunction) + ' ' + config.animation.delay + 'ms '
                        + config.animation.iterationCount;

                    dom.setStyle(component, 'animation', style);
                }
                me.animationDoms.push(component);
            })();
        }
    };

    // 执行在转场动画结束后，用以重置所有组件的transition
    // 避免出现退场的幻灯片再次进入时组件还在播上次动画的情况
    Slide.prototype.afterLeave = function () {
        if (this.animationTimeouts.length) {
            for (var i in this.animationTimeouts) {
                clearTimeout(this.animationTimeouts[i]);
            }
        }
        this.animationTimeouts = [];
        if (this.animationDoms.length) {
            for (var i in this.animationDoms) {
                var component = this.animationDoms[i];
                dom.setStyles(component, {
                    'animation': 'none',
                    'transition': 'none'
                });
                if (component.rtIsFade) {
                    dom.setStyle(component, 'opacity', 0);
                }
            }
        }
        this.animationDoms = [];
    };

    return Slide;
});