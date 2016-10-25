/**
 * 下拉插件
 */
;
(function(root, factory) {
    'use strict';
    if (typeof define === 'function' && define.cmd) {
        define(function() {
            return factory(jQuery);
        });
    } else if (typeof exports === 'object' && typeof require === 'function') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(this, function($) {
    //疯狂紫萧
    $.fn.autosearch = function(options) {
        var defaults = {
            placeholder: "搜索城市", //默认的提示文字
            searchClass: "", //附加的class
            height: 25, //下拉的高度
            width: 0, //下拉的宽度
            move: 0, //下拉的位移，left值
            text: "name", //搜索项的显示值
            val: "code", //搜索项的默认设置值
            onChange: null, //写入文字的时候默认执行的搜索方法
            onResult: null //返回结果的时候默认的操作
        }
        var options = $.extend({}, defaults, options);
        this.each(function() {
            var obj = $(this);
            var text = "";
            var curr_selected = -1;
            var queue = [];

            //创建结构
            //创建容器
            var container = $("<div>").addClass("autocomplete_container").addClass(options.searchClass).css({
                height: options.height,
            });
            //创建搜索框
            var search = $("<input type='text' name='query' />").attr("placeholder", options.placeholder);
            //创建下拉框
            var result = $("<div>").addClass("autocomplete_result").css({
                top: options.height + 2,
            });
            //单独设置下拉的宽度
            if (options.width != 0) {
                result.css("width", options.width);
            }
            //单独设置下拉的位置
            if (options.move) {
                result.css("left", options.move);
            }

            //下拉框父容器
            var result_container = $("<ul>");

            //添加动态结构
            result.append(result_container);
            container.append(search);
            container.append(result);

            //方法：等待加載
            function loading() {
                clear();
                result.show();
                result_container.addClass("load");
                result_container.text("加载中...");
            }
            //方法：清空
            function clear() {
                curr_selected = -1;
                result_container.empty().removeClass("load");
            }
            //方法：关闭
            function close() {
                setTimeout(function() {
                    text = "";
                    clear();
                    result.hide();
                }, 200);
            }
            //下拉列表点击事件
            result_container.on("click touchend ", "li", function(e) {
                e.preventDefault();
                search.val($(this).html());
                obj.val($(this).data()[options.val]);
                options.onResult && options.onResult($(this).data());
            }).on("mouseenter", "li", function() {
                $(this).addClass('selected');
            }).on("mouseleave", "li", function() {
                $(this).removeClass('selected');
            });;
            //监测上、下、回车、Esc事件
            search.keydown(function(e) {
                switch (e.which) {
                    case 38: //上
                        e.preventDefault();
                        if (curr_selected <= 0) return;
                        curr_selected--;
                        $("li", result_container).removeClass("selected").eq(curr_selected).addClass("selected");
                        break;
                    case 40: //下
                        e.preventDefault();
                        if (curr_selected >= $("li", result_container).length - 1) return;
                        curr_selected++;
                        $("li", result_container).removeClass("selected").eq(curr_selected).addClass("selected");
                        break;
                    case 13: //回车
                        e.preventDefault();
                        var item = $("li", result_container).eq(curr_selected);
                        search.val(item.html());
                        obj.val(item.data()[options.val]);
                        options.onResult && options.onResult(item.data());
                        close();
                        break;
                    case 27: //Esc
                        e.preventDefault();
                        close();
                        break;
                }
            });
            //正常的输入事件
            search.on("change paste keyup", function(e) {
                if (e.which != 13 && e.which != 27 && e.which != 38 && e.which != 40) {
                    if (text == search.val()) return;
                    text = search.val();
                    if (e.which == 8) obj.val('');
                    loading();
                    if (options.onChange) {
                        queue.push({});
                        options.onChange(search.val(), function(list) {
                            queue.pop();
                            if (queue.length > 0) return;
                            clear();
                            for (var i = 0; i < list.length; i++) {
                                var temp = $("<li>").text(list[i][options.text]).data(list[i]);
                                result_container.append(temp);
                            }
                        });

                    }
                }
            });
            //失去焦点事件
            search.blur(close);
            obj.append(container);
        });
    }
});
