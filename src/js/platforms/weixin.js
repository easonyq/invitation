/**
 * @file weixin.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @options.description
 * 处理微信相关的设置
 **/

define(function () {
    return {
        register: function () {
            wx.config({
                // debug: true,
                appId: 'wx853fd2be754191a3',
                timestamp: 1426490767,
                nonceStr: 'Wm3WZYTPz0wzccnW',
                signature: '4755708a44aad5f5ca2516006c40eae9f8de40bb',
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo'
                ]
            });
            wx.ready(function () {
                wx.onMenuShareAppMessage({
                    title: '王轶盛&杨追燕的新婚请帖',
                    imgUrl: 'http://bs.baidu.com/weigou-baidu-com/8bd286127a41addd4a4a43d4ee9b0713.jpg',
                    desc: '诚意邀请您参加我们的婚礼！2015年5月23日晚17:38于东骏海鲜酒家5楼',
                    link: 'http://bs.baidu.com/weigou-baidu-com/wangyisheng/invitation.html'
                });
                wx.onMenuShareTimeline({
                    title: '王轶盛&杨追燕的新婚请帖',
                    imgUrl: 'http://bs.baidu.com/weigou-baidu-com/8bd286127a41addd4a4a43d4ee9b0713.jpg',
                    link: 'http://bs.baidu.com/weigou-baidu-com/wangyisheng/invitation.html'
                });
            });
        }
    }
});