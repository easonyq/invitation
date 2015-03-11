/**
 * @file layout.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 全局脚本，根据全局属性设置动画等等。
 **/

define(function (require) {
    var dom = require('./tools/dom');
    var tap = require('./tools/tap');
    var util = require('./tools/util');
    var Transition = require('./tools/transition');
    var Slide = require('./slide');
    var Music = require('./music');
    var globalConfig = require('./globalConfig');
    var weixin = require('./platforms/weixin');

    // 这里先计算全局font-size。
    // 以iphone4为基准，320*480，基础font-size = 16px，因此width = 20rem, height = 30rem
    var fontSizePercentage = 100;
    var winWidth = document.documentElement.clientWidth;
    var winHeight = document.documentElement.clientHeight;
    if (winWidth != 320 || winHeight != 480) {
        fontSizePercentage = Math.min(winWidth / 20, winHeight / 30) / 16 * 100;
        dom.setStyle('html', 'font-size', fontSizePercentage.toFixed(2) + '%');
        var isVertical = winWidth / 20 > winHeight / 30;
        var slideRealArr = dom.queryAll('.rt-slide-real');
        if (isVertical) {
            var currentWidth = parseInt(dom.getStyle(slideRealArr[0], 'width'), 10);
            var left = (winWidth - currentWidth) / 2;
            for (var i in slideRealArr) {
                dom.setStyle(slideRealArr[i], 'left', left + 'px');
            }
        } else {
            var currentHeight = parseInt(dom.getStyle(slideRealArr[0], 'height'), 10);
            var top = (winHeight - currentHeight) / 2;
            for (var i in slideRealArr) {
                dom.setStyle(slideRealArr[i], 'top', top + 'px');
            }
        }
    }

    // 读取配置
    globalConfig.init();
    var globalConfigContent = globalConfig.get();

    // 给slides设置一些宽高，并读取每个幻灯片的配置
    var slidesInner = dom.query('.rt-slides-inner');
    dom.setStyles(slidesInner, {
        'width': winWidth + 'px',
        'height': winHeight + 'px'
    });
    var slideArr = [];
    var slideDomArr = dom.queryAll('.rt-slide', slidesInner);
    var transition = new Transition(slideArr);
    var resources = [];
    for (var i in slideDomArr) {
        var slide = new Slide(slideDomArr[i]);
        slide.setStyles({
            'width': winWidth + 'px',
            'height': winHeight + 'px'
        });
        slideArr.push(slide);

        var slideConfig = slide.getConfig();
        slideConfig.backgroundImage && resources.push([slideConfig.backgroundImage]);
    }

    // 设置第一页
    var firstPageIndex = 1;
    if (location.hash && !isNaN(location.hash.substr(1))) {
        firstPageIndex = location.hash.substr(1);
    }
    transition.showPage(firstPageIndex);

    // 滑动事件绑定
    tap.register(slidesInner, globalConfigContent.direction);
    if (globalConfigContent.direction === 'vertical') {
        slidesInner.on('tap-bottom', function (e) {
            transition.previous();
        });
        slidesInner.on('tap-top', function (e) {
            transition.next();
        });
    } else {
        slidesInner.on('tap-right', function (e) {
            transition.previous();
        });
        slidesInner.on('tap-left', function (e) {
            transition.next();
        });
    }

    // 处理component链接
    var links = dom.queryAll('.rt-link');
    for (var i in links) {
        // touchend模拟click
        links[i].addEventListener('touchend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = this.getAttribute('data-target');
            if (target && !isNaN(target)) {
                transition.to(parseInt(target, 10));
            }
        });
    }

    // 设置背景音乐
    if (globalConfigContent.backgroundMusic && globalConfigContent.backgroundMusic.url) {
        var music = new Music(document.body);
        music.init();
    }

    weixin.register({
        title: globalConfigContent.pName,
        imgUrl: globalConfigContent.pImage,
        description: globalConfigContent.description,
        linkUrl: location.href
    });

    // 所有准备工作完成，展现
    util.load(resources[firstPageIndex], function () {
        dom.hide('.rt-loading');
        dom.show('.rt-slides');
        resources.forEach(function (resource) {
            util.load(resource);
        });
    });
});