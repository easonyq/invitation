/**
 * @file edp-webserver-config.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * edp-ws配置
 **/

var epr = require('edp-provider-rider');
var stylusPlugin = epr.plugin();

// rider配置
exports.stylus = epr.stylus;

// 端口
exports.port = 8828;

// 静态文件根目录
exports.documentRoot = process.cwd();

// 当路径为目录时，是否显示文件夹内文件列表
exports.directoryIndexes = true;

// less 包含文件存放地址，可以是绝对路径，也可以是相对路径(相对于网站根目录)
exports.lessIncludePaths = [];


/* handlers
 * 支持expressjs的path的写法，可以通过request.parameters来获取url中的参数
 * 如: 
 *  {
 *      location: '/lib/:filename',
 *      handler: function(context) {
 *          console.log(context.request.parameters);
 *      }
 *  }
 *
 * 如果访问http://127.0.0.1:8848/lib/config.js
 *  handler将打印出{"filename": "config.js"}
 */
exports.getLocations = function () {
    return [
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss({
                    stylus: {
                        stylus: epr.stylus,
                        use: stylusPlugin
                    }
                })
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file()
            ]
        },
        {
            location: /^.*$/, 
            handler: [
                file()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
