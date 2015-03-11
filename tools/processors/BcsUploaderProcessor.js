/**
 * @file BcsUploaderProcessor.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * 将文件上传至bcscdn的的构建处理器
 **/

var bcs = require('../util/BcsSdk');
var path = require('path');

function defineBcsUploaderProcessor() {

    /**
     * 上传bcs的processor
     *
     * @constructor
     * @param {Object} options 初始化参数
     * @param {string} options.entryExtnames 页面入口扩展名列表，`,`分隔的字符串
     */
    function BcsUploaderProcessor(options) {
        // 默认的入口文件配置
        this.entryFiles = [
            '*.html',
            '*.htm',
            '*.phtml',
            '*.tpl',
            '*.vm',
            '*.js'
        ];

        this.files = ['*.js', '*.css', '*.less'];

        AbstractProcessor.call(this, options);

        this.maxSize = 10 * 1024 * 1024;
        this.autoUri = false;

        this.sdk = new bcs.BaiduCloudStorage(this.ak, this.sk, this.maxSize, this.autoUri);
    }

    BcsUploaderProcessor.prototype = new AbstractProcessor();

    /**
     * 处理器名称
     *
     * @type {string}
     */
    BcsUploaderProcessor.prototype.name = 'BcsUploaderProcessor';


    /**
     * 构建处理
     *
     * @param {FileInfo} file 文件信息对象
     * @param {ProcessContext} processContext 构建环境对象
     * @param {Function} callback 处理完成回调函数
     */
    BcsUploaderProcessor.prototype.process = function (file, processContext, callback) {
        var objectName = ''
            + '/'
            + this.prefix
            + '/'
            + file.outputPath;

        try {
            var def = this.sdk.realUpload(file.data, this.bucket, objectName);
            def.done(
                function (url) { 
                    callback();
                }
           );

            def.fail(
                function (ex) {
                    console.info('Upload bcs failed, ' +
                        'file = [%s], msg = [%s]',
                        file.path, ex.toString());
                    callback();
                }
           );

        }
        catch (ex) {
            console.error('Upload bcs failed, file = [%s], msg = [%s]',
                file.path, ex.toString());
            console.error(ex)
            callback();
        }
    };


    return BcsUploaderProcessor;
}


module.exports = defineBcsUploaderProcessor;
