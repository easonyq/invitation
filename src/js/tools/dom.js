/**
 * @file dom.js
 * @author wangyisheng@baidu.com (wangyisheng)
 * @reference saber-dom by firede
 * @description
 * dom工具类，解决dom基本需求
 **/

define(function (require) {

    var STYLE_PREFIX_KEY = ['animation', 'transition', 'transform', 'animation-play-state'];
    var BROWSER_PREFIX = ['-webkit-', '-moz-', '-ms-', '-o-'];
    var exports = {};

    /* ======================================选择器相关====================================== */

    /**
     * 根据id获取指定的DOM元素
     *
     * @public
     * @param {string|HTMLElement} id 元素的id或DOM元素
     * @return {HTMLElement|null} 获取的元素，找不到时返回null
     */
    exports.g = function (id) {
        if (!id) {
            return null;
        }

        return typeof id === 'string' ? document.getElementById(id) : id;
    };

    /**
     * 根据选择器获取指定DOM元素
     *
     * @public
     * @param {string} selector 元素的selector
     * @param {HTMLElement} context 上下文
     * @return {HTMLElement|null} 获取的元素，找不到时返回null
     */
    exports.query = function (selector, context) {
        if ('string' !== typeof selector) {
            return selector;
        }

        context = context || document.body;

        return context.querySelector(selector);
    };

    /**
     * 根据选择器选择DOM元素列表
     *
     * @public
     * @param {string} selector 元素的selector
     * @param {HTMLElement} context 上下文
     * @return {Array} 获取的元素列表，找不到时为空数组
     */
    exports.queryAll = function (selector, context) {
        if (Array.isArray(selector)) {
            return selector;
        }

        context = context || document.body;

        var nodeList = context.querySelectorAll(selector);

        return Array.prototype.slice.call(nodeList);
    };

    /* ======================================样式相关====================================== */

    /**
     * @inner
     * @param  {HTMLElement|string} element 需要获取的HTML元素或其query
     * @return {HTMLElement}
     */
    function getElement(element) {
        if (typeof element === 'undefined') {
            return;
        } else if (typeof element === 'string') {
            return document.querySelector(element);
        } else {
            return element;
        }
    }

    /**
     * 显示DOM元素
     *
     * @param {HTMLElement|string} ele 目标元素
     * @return {HTMLElement} 目标元素
     */
    exports.show = function (ele) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        if (exports.getStyle(element, 'display') === 'none') {
            element.style.display = 'block';
        }
        return element;
    };

    /**
     * 隐藏DOM元素
     *
     * @param {HTMLElement|string} ele 目标元素
     * @return {HTMLElement} 目标元素
     */
    exports.hide = function (ele) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        element.style.display = 'none';
        return element;
    };

    /**
     * 获取样式
     * 
     * @param {HTMLElement|string} ele 目标元素
     * @param {string} property 属性
     * @return {string|null}
     */
    exports.getStyle = function (ele, property) {
        var element = getElement(ele);
        if (!element) {
            return null;
        }
        return element.style[property]
            || document.defaultView.getComputedStyle(element).getPropertyValue(property);
    };

    /**
     * 设置样式
     * 针对特定属性(animation, transition, transform)增加前缀
     * @param {HTMLElement|string} ele 目标元素
     * @param {string} property 属性
     * @param {string} value 值
     */
    exports.setStyle = function (ele, property, value) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        element.style[property] = value;
        if (STYLE_PREFIX_KEY.indexOf(property) !== -1) {
            for (var i in BROWSER_PREFIX) {
                element.style[BROWSER_PREFIX[i] + property] = value;
            }
        }
    };

    /**
     * 批量设置样式
     * @param {HTMLElement|string} ele         目标元素
     * @param {object}             propertyObj 样式键值对
     */
    exports.setStyles = function (ele, propertyObj) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        for (var key in propertyObj) {
            exports.setStyle(element, key, propertyObj[key]);
        }
    };


    /**
     * 为目标元素添加className
     *
     * @public
     * @param {HTMLElement} ele 目标元素
     * @param {string} className 要添加的className
     *
     * @return {HTMLElement} 目标元素
     */
    exports.addClass = function (ele, className) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        // 优先使用classList. 在iOS 5, Android 3 之后开始支持
        if (element.classList) {
            element.classList.add(className);
        } else {
            var classes = element.className
                ? element.className.split(/\s+/) : [];

            for (var i = 0; i < classes.length; i++) {
                if (classes[i] === className) {
                    return element;
                }
            }

            classes.push(className);
            element.className = classes.join(' ');
        }

        return element;
    };


    /**
     * 为目标元素删除className
     *
     * @public
     * @param {HTMLElement} ele 目标元素
     * @param {string} className 要删除的className
     *
     * @return {HTMLElement} 目标元素
     */
    exports.removeClass = function (ele, className) {
        var element = getElement(ele);
        if (!element) {
            return;
        }
        // 优先使用classList. 在iOS 5, Android 3 之后开始支持
        if (element.classList) {
            element.classList.remove(className);
        } else {
            var classes = element.className
                ? element.className.split(/\s+/) : [];

            var keep = [];
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] !== className) {
                    keep.push(classes[i]);
                }
            }

            element.className = keep.join(' ');
        }

        return element;
    };




    /**
     *判断目标元素是否包含className
     *
     * @public
     * @param  {HTMLElement}  ele  目标元素
     * @param  {string}  className
     * @return {Boolean}
     */
    exports.hasClass = function (ele, className) {
        var element = getElement(ele);
        if (!element) {
            return false;
        }
        if (element.classList) {
            return element.classList.contains(className);
        }
        else {
            var classes = element.className ? element.className.split(/\s+/) : [];
            return classes.indexOf(className) >= 0 ? true : false;
        }
    };

    /**
     * 元素创建
     * @public
     * @param  {string} tagName 标签名
     * @return {HTMLElement}
     */
    exports.create = function (tagName) {
        return document.createElement(tagName);
    }

    /**
     * 在目标元素末端插入元素
     *
     * @public
     * @param  {string|HTMLElement} parent 父元素，如果是字符串直接使用query得到的第一个结果
     * @param  {HTMLElement} source 子元素
     * @return {HTMLElement} 返回父元素
     */
    exports.append = function (parent, source) {
        if (typeof parent === 'string') {
            parent = exports.query(parent);
        }
        parent.appendChild(source);
        return parent;
    }

    return exports;
});