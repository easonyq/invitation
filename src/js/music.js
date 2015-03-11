/**
 * @file music.js
 * @author huanghuiquan@baidu.com (huanghuiquan)
 * @description
 * 背景音乐的处理
 **/

define(function (require) {

    var dom = require('./tools/dom');
    var util = require('./tools/util');
    var globalConfig = require('./globalConfig');

    function Music(root) {
        this.main = root;
        this.config = globalConfig.get();
    }

    Music.prototype.init = function () {
        var audio = dom.create('audio');
        audio.src = this.config.backgroundMusic.url;
        audio.loop = this.config.backgroundMusic.repeat === 'infinite' ? true : false;

        var backgroundMusic = dom.create('div');
        dom.addClass(backgroundMusic, 'rt-background-music');
        this.main.appendChild(backgroundMusic);

        var musicAnimation = createMusicAnimation();
        musicAnimation.pause();
        backgroundMusic.appendChild(musicAnimation.main);
        dom.show('.rt-background-music');


        var musicReady = false;
        window.addEventListener('touchstart', function (event) {
            if (musicReady) {
                return false;
            }
            musicReady = true;
            window.removeEventListener('touchstart', arguments.callee);
            if (!dom.hasClass(event.target, 'music-animation')) {
                musicAnimation.play();
                audio.play();
            }
        }, false);

        musicAnimation.main.addEventListener('touchend', function (event) {
            if (musicAnimation.isPlaying()) {
                musicAnimation.pause();
                audio.pause();
            }
            else {
                musicAnimation.play();
                audio.play();
            }
        }, false);

    }

    function createMusicAnimation () {
        var main = dom.create('div');
        main.className = 'music-animation';
        var units = [];
        for (var i = 0; i < 4; i++) {
            units[i] = dom.create('span');
            dom.setStyle(units[i], 'left', (7/16 + i * 7/16) + 'rem')
            dom.setStyle(units[i], 'animation', 'music-unit-' + i + ' .6s alternate infinite');
            main.appendChild(units[i]);
        }

        var musicAnimation = {
            main: main,
            units: units,
            play: function () {
                dom.addClass(this.main, 'on');
                this.units.forEach(function (ele, index) {
                    dom.setStyle(ele, 'animation-play-state', 'running');
                });
            },
            pause: function () {
                dom.removeClass(this.main, 'on');
                this.units.forEach(function (ele, index) {
                    dom.setStyle(ele, 'animation-play-state', 'paused');
                });
            },
            isPlaying: function () {
                return dom.hasClass(this.main, 'on');
            }
        };
        return musicAnimation;
    }

    return Music;
});
