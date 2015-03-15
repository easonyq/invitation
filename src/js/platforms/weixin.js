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
                        "appid": 'wxc07a8481c9282211',
                        "img_url": options.imgUrl,
                        "link": options.linkUrl,
                        "desc": options.description,
                        "title": options.title
                    }, function (res){
                        alert('error here');
                        alert(res.err_msg);
                    });
                });

                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function () {
                    WeixinJSBridge.invoke('shareTimeline',{
                        "appid": 'wxc07a8481c9282211',
                        "img_url": options.imgUrl,
                        "img_width": "150",
                        "img_height": "150",
                        "link": options.linkUrl,
                        "desc": options.description,
                        "title": options.title
                    }, function (res){
                        alert(res.err_msg);
                    });
                });
            }, false);
        }
    }
});