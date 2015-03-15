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
    // var Music = require('./music');
    // var weixin = require('./platforms/weixin');

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

    // 给slides设置一些宽高，并读取每个幻灯片的配置
    var slidesInner = dom.query('.rt-slides-inner');
    // dom.setStyles(slidesInner, {
    //     'width': winWidth + 'px',
    //     'height': winHeight + 'px'
    // });
    var slideArr = [];
    var slideDomArr = dom.queryAll('.rt-slide', slidesInner);
    var resources = [];
    for (var i in slideDomArr) {
        var slide = slideDomArr[i];
        dom.setStyles(slide, {
            'width': winWidth + 'px',
            'height': winHeight + 'px'
        });
        slideArr.push(slide);
    }
    var transition = new Transition(slideArr);

    // 滑动事件绑定
    tap.register(slidesInner);
    slidesInner.on('tap-bottom', function (e) {
        transition.previous();
    });
    slidesInner.on('tap-top', function (e) {
        transition.next();
    });

    // 设置背景音乐
    // if (globalConfigContent.backgroundMusic && globalConfigContent.backgroundMusic.url) {
    //     var music = new Music(document.body);
    //     music.init();
    // }

    // weixin.register({
    //     title: '王轶盛&杨追燕的新婚请帖',
    //     imgUrl: 'http://img1.2345.com/duoteimg/qqTxImg/2012/04/09/13339423112520.jpg',
    //     description: '王轶盛&杨追燕的新婚请帖',
    //     linkUrl: location.href
    // });

    // 所有准备工作完成，展现
    setTimeout(function () {
        dom.hide('.rt-loading');
        dom.show('.rt-slides');
    }, 1000);
});