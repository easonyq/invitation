/**
 * @file edp-build-config.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @description
 * runtime build
 **/

var epr = require( 'edp-provider-rider' );
var stylusPlugin = epr.plugin();

exports.stylus = epr.stylus;
exports.input = __dirname;

var path = require( 'path' );
exports.output = path.resolve( __dirname, 'output' );

var moduleEntries = 'html,htm,phtml,tpl,vm,js';
var pageEntries = 'html,htm,phtml,tpl,vm';
var defineBcsUploaderProcessor = require('./tools/processors/BcsUploaderProcessor');

exports.getProcessors = function () {
    var outputDir = 'maliang-runtime-' + getDate();
    var BcsUploaderProcessor = defineBcsUploaderProcessor();

    return [ 
        new StylusCompiler({
            stylus: epr.stylus,
            compileOptions: {
                use: stylusPlugin
            }
        }),
        new CssCompressor(),
        new ModuleCompiler( {
            exclude: [],
            configFile: 'module.conf',
            entryExtnames: moduleEntries
        }),
        new JsCompressor(),
        new PathMapper( {
            replacements: [
                { type: 'html', tag: 'link', attribute: 'href', extnames: pageEntries },
                { type: 'html', tag: 'img', attribute: 'src', extnames: pageEntries },
                { type: 'html', tag: 'script', attribute: 'src', extnames: pageEntries },
                { extnames: moduleEntries, replacer: 'module-config' },
                { extnames: 'css,less', replacer: 'css' }
            ],
            from: 'src',
            to: outputDir
        }),
        new BcsUploaderProcessor({
            ak: '706zo65P60XgVEo',
            sk: 'N4acnuUfJ1Z5xwDuw9jb5eq1dDWyIArV5Hy',

            bucket: 'weigou-baidu-com',
            prefix: outputDir,

            files: [
                'index.js',
                'index.styl'
            ]
        })
    ];
};

exports.exclude = [
    'node_modules',
    'test',
    'tools',
    'module.conf',
    'data.json',
    'README.md',
    'package.json',
    'edp-*',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp',
    '*.log'
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

function getDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();

    month < 10 ? month = '0' + month : null;
    day < 10 ? day = '0' + day : null;
    hour < 10 ? hour = '0' + hour : null;
    min < 10 ? min = '0' + min : null;

    return '' + date.getFullYear() + month + day + hour + min;
}