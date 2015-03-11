/**
 * @file weixin.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @options.description
 * 处理微信相关的设置
 **/

define(function () {
    return {
        register: function (options) {
            // 发送给好友
            document.addEventListener('WeixinJSBridgeReady', function () {
                if (typeof WeixinJSBridge !== 'object'
                    || typeof WeixinJSBridge.on !== 'function') {
                    return;
                }
                WeixinJSBridge.on('menu:share:appmessage', function () {
                    WeixinJSBridge.invoke('sendAppMessage',{
                        "img_url": options.imgUrl,
                        "link": options.linkUrl,
                        "desc": options.description,
                        "title": options.title
                    }, function (){});
                });

                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function () {
                    WeixinJSBridge.invoke('shareTimeline',{
                        "img_url": options.imgUrl,
                        "img_width": "150",
                        "img_height": "150",
                        "link": options.linkUrl,
                        "desc": options.description,
                        "title": options.title
                    }, function (){});
                });

                // 分享到微博
                WeixinJSBridge.on('menu:share:weibo', function () {
                    WeixinJSBridge.invoke('shareWeibo',{
                        "content": options.description,
                        "url": options.linkUrl,
                    }, function (){});
                });
            }, false);
        }
    }
});