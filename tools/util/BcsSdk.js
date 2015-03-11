/**
 * lib/sdk.js ~ 2013/05/11 19:30:50
 * @author leeight(liyubei@baidu.com)
 * @ignore
 * 封装bcs的api
 **/
var edp = require( 'edp-core' );

/* jshint camelcase: false */

/**
 * @constructor
 * @param {string} ak The AccessKey.
 * @param {string} sk The SecretKey.
 * @param {number} maxSize The max file size.
 * @param {boolean=} opt_autoUri 是否自动添加md5的后缀.
 */
function BaiduCloudStorage(ak, sk, maxSize, opt_autoUri) {
    this.ak = ak;
    this.sk = sk;
    this.maxSize = maxSize;
    this.autoUri = !!opt_autoUri;
}

/**
 * @see http://dev.baidu.com/wiki/bcs/index.php?title=sign
 * 只返回MBO的签名（Method, Bucket Name, Object Name），对于上传的
 * 应用足够了.
 * @param {string} method The request method.
 * @param {string} bucketName The bucket name.
 * @param {string} objectName The object name.
 *
 * @return {string} The url with signature.
 */
BaiduCloudStorage.prototype.sign = function(method, bucketName, objectName) {
    // base64_encode(hash_hmac('sha1', Content, SecretKey,true))
    var flag = 'MBO';
    var body = [
        'Method=' + method,
        'Bucket=' + bucketName,
        'Object=' + objectName
    ].join('\n');

    var content = flag + '\n' + body + '\n';

    var hmac = require('crypto').createHmac('sha1', this.sk);
    hmac.update(new Buffer(content, 'utf-8'));
    var digest = encodeURIComponent(hmac.digest('base64')).replace(/%2F/g, '/');

    var signature = [flag, this.ak, digest].join(':');
    var url = this._getBcsHost() + '/' + bucketName + '/' +
        encodeURIComponent(objectName.substr(1)) + '?sign=' + signature;
    return url;
};

/**
 * 需要针对开发机单独处理一下，因为开发机可能没有外网的权限，无法
 * 直接访问bs.baidu.com，但是如果直接设置成s3.bae.baidu.com，那么
 * 不再公司的时候也无法访问，所以呢，也是挺纠结的一个事情。
 * @return {string}
 */
BaiduCloudStorage.prototype._getBcsHost = function() {
    var os = require('os');
    var fs = require('fs');

    if (os.platform() === 'linux') {
        if (fs.existsSync('/etc/redhat-release')) {
            var version = fs.readFileSync('/etc/redhat-release', 'utf-8');
            if (version.indexOf('Nahant Update 3') != -1) {
                return 'http://s3.bae.baidu.com';
            }
        }
    }
    return 'http://bs.baidu.com';
};

/**
 * @return {string}
 */
BaiduCloudStorage.prototype._getBaseName = function(localFile) {
    var path = require('path');
    var fs = require('fs');
    var crypto = require('crypto');

    if (this.autoUri) {
        var basename = path.basename(localFile);
        var extname = path.extname(basename);

        var md5sum = crypto.createHash('md5');
        md5sum.update(fs.readFileSync(localFile));
        return basename.replace(extname, '') + '-' +
            md5sum.digest('hex').substring(0, 8) + extname;
    } else {
        return path.basename(localFile);
    }
};

/**
 * @param {string} localFile The local file path.
 * @param {string=} opt_prefix The target prefix path.
 */
BaiduCloudStorage.prototype._getObjectName = function(localFile, opt_prefix) {
    var fs = require('fs');
    var path = require('path');
    var stat = fs.statSync(localFile);

    var objectName;

    if (opt_prefix) {
        if (stat.isFile()) {
            var ext = path.extname(localFile);
            if (ext && ext == path.extname(opt_prefix)) {
                // edp bcs lib/bcs.js bs://adtest/hello/world/my-bcs.js
                // objectName = '/my-bcs.js'
                objectName = '/' + opt_prefix;
            } else {
                // edp bcs lib/bcs.js bs://adtest/hello/world
                // objectName = '/hello/world/bcs.js'
                objectName = '/' + opt_prefix + '/' +
                    this._getBaseName(localFile);
            }
        }
    } else {
        objectName = '/' + this._getBaseName(localFile);
    }

    return objectName.replace(/\/+/g, '/');
};

/**
 * 发送http请求，上传文件.
 * @param {Object} options 请求的参数.
 * @param {Buffer} data 文件的内容.
 * @param {string} targetUrl 上传到服务器上面的路径.
 * @param {er.Deferred} Deferred对象.
 */
BaiduCloudStorage.prototype._sendRequest = function( options, data, targetUrl, def ) {
    var http = require( 'http' );

    var req = http.request(options, function(res) {
        if (res.statusCode === 200) {
            var bcsUrl = decodeURIComponent( targetUrl.replace(/\?.*/g, '') );
            edp.log.info( bcsUrl );

            def.resolve( bcsUrl );
        } else {
            res.setEncoding('utf8');
            res.on('data', function( chunk ) {
                var msg = chunk.toString();
                edp.log.warn( msg );
                def.reject( new Error( msg ) );
            });
        }
    });
    req.on('error', function(e) {
        edp.log.error('Problem with request: %s', e.message);
        def.reject( e );
    });

    process.nextTick(function(){
        req.write(data);
        req.end();
    });
};

/**
 * 批量上传多个文件，不应该一次发起太多的请求，否则可能会挂掉
 * @param {string} bucketName Bucket name.
 * @param {string} dir 文件所处的目录.
 * @param {Array.<string>} files 文件列表.
 * @param {string} prefix 上传路径的前缀.
 *
 * @return {er.Deferred}
 */
BaiduCloudStorage.prototype._batchUpload = function( bucketName, dir, files, prefix ) {
    var path = require( 'path' );
    var d = new edp.Deferred();

    var me = this;
    var activeCount = 0;

    var success = [];
    var failure = [];

    function startTask() {
        if ( !files.length ) {
            if ( activeCount <= 0 ) {
                d.resolve({
                    success: success,
                    failure: failure
                });
            }
            return;
        }

        var item = files.pop();
        var def = me.upload( bucketName,
            path.join( dir, item ),
            path.join( prefix, item ) );
        activeCount ++;
        def.ensure(function(){ activeCount --; });
        def.done(function( url ){
            if ( typeof url === 'object' &&
                 Array.isArray( url.success ) &&
                 Array.isArray( url.failure ) ) {
                success = success.concat( url.success );
                failure = failure.concat( url.failure );
            }
            else {
                success.push({
                    item: path.join( dir, item ),
                    url: url
                });
            }
            startTask();
        });
        def.fail(function( e ){
            failure.push({
                item: path.join( dir, item ),
                error: e.toString()
            });
            startTask();
        });
    }

    // 并发5个请求
    var max = Math.min( 5, files.length );
    for ( var i = 0; i < max; i ++ ) {
        startTask();
    }

    return d;
};

/**
 * @param {string} bucketName Bucket Name.
 * @param {string} localFile The local file path.
 * @param {string=} opt_prefix The target prefix path.
 *
 * @return {edp.Deferred}
 */
BaiduCloudStorage.prototype.upload = function(bucketName,
                                              localFile,
                                              opt_prefix) {
    var fs = require('fs');
    var stat = fs.statSync(localFile);

    var prefix = opt_prefix || '';

    var def = new edp.Deferred();

    if ( stat.isDirectory() ) {
        var files = fs.readdirSync( localFile ).filter(function( item ){
            return ( item.indexOf( '.' ) !== 0 && item !== 'CVS' );
        });
        return this._batchUpload( bucketName, localFile, files, prefix );
    } else if ( stat.isFile() ) {
        if ( stat.size > this.maxSize ) {
            edp.log.error( '%s size = [%s], maxSize = [%s], ignore it.',
                localFile, stat.size, this.maxSize );
            def.reject( 'File size [' + stat.size +
                '] is larger than the maximum [' + this.maxSize + ']' );
            return def;
        }
    }

    var objectName = this._getObjectName( localFile, prefix );
    var data = fs.readFileSync( localFile );

    var realUploadDef = this.realUpload( data, bucketName, objectName);
    realUploadDef.done(function ( url ) {
        def.resolve( url );
    });
    realUploadDef.fail(function (e) {
        def.reject( e );
    });

    return def;
};

/**
 * @param {string | Buffer} data 上传文件的内容
 * @param {string} bucketName The Bucket Name
 * @param {string=} objectName the Object Name
 *
 * @return {edp.Deferred}
 */
BaiduCloudStorage.prototype.realUpload = function(data,
                                              bucketName,
                                              objectName) {
    var def = new edp.Deferred();

    objectName = objectName.replace(/\/+/g, '/');

    var targetUrl = this.sign( 'PUT', bucketName, objectName );

    var options = require( 'url' ).parse( targetUrl );
    options.method = 'PUT';
    options.headers = {
        'Connection': 'close',
        'Content-Length': Buffer.isBuffer( data )
            ? data.length
            : Buffer.byteLength( data )
    };

    this._sendRequest( options, data, targetUrl, def );

    return def;
};


/**
 * @ignore
 */
exports.BaiduCloudStorage = BaiduCloudStorage;
