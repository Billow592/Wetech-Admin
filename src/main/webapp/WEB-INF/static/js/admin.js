/**
 * author: cjbi
 * date: 2016/9/20
 * mail: cjbi@outlook.com
 */
var tableName = 'example',
    basePath = $('#basePath').val();

/**
 * 常用的插件封装.
 * @author cjbi
 */
(function ($) {

    /**
     * 封装datatables、layer弹出层，简化操作
     * @type {{initDatatables: $.mytables.initDatatables, getSelectedData: $.mytables.getSelectedData, fillEditFormData: $.mytables.fillEditFormData, deleteBatch: $.mytables.deleteBatch, openDialog: $.mytables.openDialog}}
     */
    $.mytables = {
        /**
         * 初始化datatables
         * @param ajax
         * @param gridTable
         * @param ServerParams
         * @param initComplete
         * @param tableNames
         * @returns {jQuery}
         */
        initDatatables : function(ajax, gridTable, tableNames, ServerParams, initComplete) {
            tableName = (tableNames||'example');
            var table = $('#' + tableName).DataTable({
                    'aLengthMenu': [10, 15, 20, 40, 60],
                    'searching': false,// 开启搜索框
                    'lengthChange': true,
                    'paging': true,// 开启表格分页
                    'bProcessing': true,
                    'bServerSide': true,
                    'bAutoWidth': true,
                    'sort': 'position',
                    'deferRender': true,// 延迟渲染
                    'bStateSave': true, // 刷新时保存表格状态
                    'iDisplayLength': 15,
                    'iDisplayStart': 0,
                    'ordering': false,// 全局禁用排序
                    'scrollX': false,
                    'ajax': ajax,
                    //		表格开启scrollX row会覆盖bProcessing样式，算是个BUG，"am-padding am-padding-horizontal-0"
                    "dom": '<"am-g am-g-collapse"rt<<"am-datatable-hd am-u-sm-4"l><"am-u-sm-4 am-text-center"i><"am-u-sm-4"p>><"clear">>',
                    // "dom" : '<"am-g am-g-collapse"<"am-g
                    // am-datatable-hd"<"am-u-sm-6"<"#btnPlugin">><"am-u-sm-4"<"#regexPlugin">><"am-u-sm-2"f>>rt<<"am-datatable-hd
                    // am-u-sm-4"l><"am-u-sm-4"i><"am-u-sm-4"p>><"clear">>',
                    'responsive': true,
                    'columns': gridTable,
                    "fnServerData": ServerParams,
                    'oLanguage': { // 国际化配置
                        'sProcessing': '正在获取数据，请稍后...',
                        // 'sLengthMenu' : ' 显示 _MENU_ 项结果',
                        'sZeroRecords': '没有找到数据',
                        // 显示第 1 至 10 项结果，共 12 项
                        'sInfo': '显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项',
                        'sInfoEmpty': '记录数为0',
                        'sInfoFiltered': '(全部记录数 _MAX_ 条)',
                        'sInfoPostFix': '',
                        'sSearch': '搜索:',
                        'sUrl': '',
                        'oPaginate': {
                            'sFirst': '第一页',
                            'sPrevious': '«',
                            'sNext': '»',
                            'sLast': '最后一页'
                        }
                    },
                    initComplete: initComplete
                }),
                /**
                 * checkbox全选,必须用prop方法设置
                 */
                checkAll = function() {
                    if ($('input[id="checkAll"]').is(':checked')) {
                        $('input[name="checkList"]').parent().parent().addClass('selected');
                        $('input[name="checkList"]').prop('checked', true);
                    } else {
                        $('input[name="checkList"]').parent().parent().removeClass('selected');
                        $('input[name="checkList"]').prop('checked', false);
                    }
                },
                rowActive = function () {
                    $('input[name="checkList"]').each(function () {
                        if ($(this).is(':checked')) {
                            $(this).parent().parent().addClass('selected');
                        } else {
                            $(this).parent().parent().removeClass('selected');
                        }
                    });
                };
            // checkbox全选
            $('div').on('click', 'th input[type="checkbox"]', function () {
                checkAll();
            });

            // 选中行触发事件
            $('div').on('click', 'td input[type="checkbox"]', function () {
                rowActive();
            });
            return table;
        },
        /**
         * 返回选中的行
         */
        getSelectedData: function () {
            var table = $('#' + tableName).DataTable();
            return table.rows('.selected').data()[0];
        },
        /**
         * 填充表单
         * @returns {boolean}
         */
        fillEditFormData: function() {
            // 将值填充到表单中
            var table = $('#' + tableName).DataTable(),
                rowLength = table.rows('.selected').data().length;
            if (rowLength == 0) {
                layer.msg('请选择一条记录！', {
                    time: '2000',
                    icon: 0
                });
                return false;
            } else if (rowLength > 1) {
                layer.msg('最多可选一条记录！', {
                    time: '2000',
                    icon: 0
                });
                return false;
            }
            var data = table.rows('.selected').data()[0];
            $.each(data, function (key, value) {
                // 如果类型为单选框
                if ($('#edit-form [name="' + key + '"]').attr('type') == 'radio') {
                    $('#edit-form [name="' + key + '"][value="' + value + '"]').prop('checked', true);
                } else {
                    $("#edit-form [name='" + key + "']").val(value);
                }

            });
            return true;
        },
        /**
         * 批量删除
         * @param url 链接地址
         * @param pk 主键
         * @returns {boolean}
         */
        deleteBatch: function (url, pk) {
            var table = $('#' + tableName).DataTable(),
                rowData = {},
                array = [],
                dictType = table.rows('.selected').data(),
                str = $('#' + tableName + ' tbody tr[class="even selected"]').length + $('#' + tableName + ' tbody tr[class="odd selected"]').length;

            if (dictType[0] == undefined) {
                layer.msg('请选择一条记录！', {
                    time: '2000',
                    icon: 0
                });
                return false;
            }
            function obj(tkey, tval) { // 动态生成类变量方法
                this[tkey] = tval;
            }
            $.each(dictType[0], function (key, value) {
                key = new obj(key, []);
                array.push(key);
            });
            for (var i = 0; i < dictType.length; i++) {
                $.each(dictType[i], function (key, value) {
                    for (var j = 0; j < array.length; j++) {
                        $.each(array[j], function (key2, value2) {
                            if (key == key2) {
                                value2.push(value);
                            }
                        });
                    }
                });
            }
            $.each(array, function (key, value) {
                $.each(value, function (key2, value2) {
                    rowData[key2] = value2;
                });
            });
            if (str == 0) {
                layer.msg('请选择一条记录！', {
                    time: '2000',
                    icon: 0
                });
            } else {
                layer.confirm('确定要删除这' + str + '条数据吗？', {
                    icon: 3,
                    title: '系统提示',
                    yes: function (index, layero) {
                        // 从rowData中获得主键id数组
                        $.ajax({
                            type: 'post',
                            url: url,
                            dataType: 'json',
                            data: 'ids=' + rowData[pk].join(),
                            success: function (data) {
                                if (data.success == false) {
                                    layer.msg(data.msg, {
                                        time: '2000',
                                        icon: 0
                                    });
                                } else {
                                    layer.msg(data.msg, {
                                        time: '2000',
                                        icon: 6
                                    });
                                }
                                layer.close(index);
                                table.ajax.reload();
                            },
                            error: function (data) {
                                layer.msg('操作失败', {
                                    time: 2000,
                                    icon: 5
                                });
                            }
                        });
                    }
                });
            }
        },
        /**
         * layer封装
         * @param opts 配置参数
         * @param $dom jquery dom对象
         */
        openDialog: function (opts,$dom) {
            var $form = $dom.children("form"),
                _title = $.extend({}, opts ? (opts.title || {}) : {}),
                _yes = $.extend({}, opts ? (opts.yes || function (index, layero) {
                    $.msg('请定义参数yes');
                }) : {}),
                _end = $.extend(function (index, layero) {
                    // 无论是确认还是取消，只要层被销毁了，end都会执行
                    // 重置表单
                    $form.clear();
                    // 销毁表格验证
                    $form.validator('destroy');
                }, opts ? (opts.yes || {}) : {}),
                editable = (opts.editable || false),
                before = (opts.before || function () {}),
                after = (opts.after || function () {}),
                defaultOpts = $.extend({
                    title: _title,
                    type: 1,
                    /*
                     * shift : 5, moveType : 1,
                     */
                    // 此参数开启最大化最小化
                    // maxmin: true,
                    area: ['600px', 'auto'],
                    content: $dom,
                    btn: ['确定', '关闭'],
                    // 按钮一【确定】的回调
                    // index 当前层索引 layero 当前层DOM对象
                    yes: _yes,
                    end: _end,
                    cancel: function (index) {
                        // 按钮二【关闭】和右上角关闭的回调
                    },
                    // 层弹出后的成功回调方法
                    success: after //function(layero, index){}
                }, opts || {});
            if (editable == true) {
                var success = this.fillEditFormData();
                if (!success) return;
            }
            before(this.getSelectedData());
            layer.open(defaultOpts);
        }
    };

    /**
     * admin相关方法封装
     * @type {{refresh: jQuery.myadmin.refresh, loadContent: jQuery.myadmin.loadContent}}
     */
    $.myadmin = {

        /**
         * 如果参数是 false，它就会用 HTTP 头 If-Modified-Since 来检测服务器上的文档是否已改变,否则就绕过缓存刷新页面
         * @param forceget 是否绕过缓存
         */
        refresh: function(forceget) {
            window.location.reload(forceget);
        },
        /**
         * 加载content区域
         * @param href #锚点
         * @param callback 回调
         */
        loadContent: function loadContent(href, callback) {
            //重写url，定位 admin-content
            history.pushState('', 0, href);
            var url = location.href;
            // document.title ='测试';
            if (url.indexOf('#') > 0 && url.substr(url.indexOf('#') + 1).length > 0) {
                url = url.replace("#", "/");
                $('#admin-content').load(url, function () {
                    reloadComponent();
                    if (callback != undefined)
                        callback();

                });
            }

            /**
             * jQuery因为删除dom事件也会失效，所以页面需要注册下部分依赖jQuery的组件
             */
            function reloadComponent() {
                // 重新注册amaze ui下拉组件
                $('[data-am-selected]').selected();
                initInputTooltip();
            }

            function initInputTooltip() {
                //重新注册验证tooltip事件
                var $form = $('form');
                var $tooltip = $('#vld-tooltip');
                if($('#vld-tooltip').length==0) {
                    $tooltip = $('<div id="vld-tooltip">提示信息！</div>');
                    $tooltip.appendTo(document.body);
                }
                $form.on('focusin focusout', '.am-form-error input', function (e) {
                    if (e.type === 'focusin') {
                        var $this = $(this);
                        var offset = $this.offset();
                        var msg = $this.data('foolishMsg') || $form.validator('getValidationMessage', $this.data('validity'));
                        $tooltip.text(msg).show().css({
                            left: offset.left + 10,
                            top: offset.top + $(this).outerHeight() + 10
                        });
                    } else {
                        $tooltip.hide();
                    }
                });
                //关闭tooltip临时解决方案
                $form.on('focusin focusout', '.am-form-success input', function (e) {
                    $tooltip.hide();
                });
            }
        }
    };

    $.mydialog = {
        dialog_self: null,
        alert: function (content, options, yes) {
            return layer.alert(content, options, yes)
        },

        confirm: function (content, options, yes, cancel) {
            return layer.confirm(content, options, yes, cancel);
        },

        closeDialog: function (index) {
            return layer.close(index);
        },

        closeAll: function (type) {
            return layer.closeAll(type);
        },

        prompt: function (options, yes) {
            return layer.prompt(options, yes);
        },

        msg: function (content, options, end) {
            return layer.msg(content, options, end);
        },

        photos: function (options) {
            return layer.photos(options);
        },
    };

    //文本对话框
    $.fn.openDialog = function (opts) {
        var $form = $(this).children("form"),
            _title = $.extend({}, opts ? (opts.title || {}) : {}),
            _yes = $.extend({}, opts ? (opts.yes || function (index, layero) {
                $.msg('请定义参数yes');
            }) : {}),
            _end = $.extend(function (index, layero) {
                // 无论是确认还是取消，只要层被销毁了，end都会执行
                // 重置表单
                $form.clear();
                // 销毁表格验证
                $form.validator('destroy');
            }, opts ? (opts.yes || {}) : {}),
            editable = (opts.editable || false),
            before = (opts.before || function () {}),
            after = (opts.after || function () {}),
            defaultOpts = $.extend({
                title: _title,
                type: 1,
                /*
                 * shift : 5, moveType : 1,
                 */
                // 此参数开启最大化最小化
                // maxmin: true,
                area: ['600px', 'auto'],
                content: $(this),
                btn: ['确定', '关闭'],
                // 按钮一【确定】的回调
                // index 当前层索引 layero 当前层DOM对象
                yes: _yes,
                end: _end,
                cancel: function (index) {
                    // 按钮二【关闭】和右上角关闭的回调
                },
                // 层弹出后的成功回调方法
                success: after //function(layero, index){}
            }, opts || {});
        if (editable == true) {
            var success = initFormData();
            if (!success) return;
        }
        before();
        layer.open(defaultOpts);
    };
    // 重置表单
    $.fn.clear = function () {
        $(this).get(0).reset();
    };
    /**
     * 异步表单序列化提交
     * $('#form').submit({
     *      url:'http://www.baidu.com',
     *      callback:function() {
     *
     * })
     * @param opts
     */
    // url 链接地址
    $.fn.submit = function (opts, callback) {
        var $form = $(this),
            _url = opts.url,
            _data = (opts.data || $form.serialize()),
            _dataType = (opts.dataType || 'json'),
            callback = (opts.callback || function () {});
        $.ajax({
            type: 'post',
            url: _url,
            dataType: _dataType,
            data: _data,
            success: function (data) {
                layer.msg(data.msg, {
                    time: '2000',
                    icon: data.success == true ? 6 : 5
                });
                callback(data);
            },
            error: function (data) {
                /*layer.msg('操作失败', {
                 time: 2000,
                 icon: 5
                 });*/
                callback(data);
            }
        });
    };
    //处理异步验证结果
    $.fn.isFormValid = function () {
        var $form = $(this);
        return $form.validator('isFormValid');
    }
})(jQuery);
// 相当于定义了一个参数为$的匿名函数，并且将jQuery作为参数来调用这个匿名函数
//var $ = 123;
//(function($){
//    console.log($("p"));//$仍能正常使用
//})(jQuery)

(function ($) {
    'use strict';

    $(function () {
        var $fullText = $('.admin-fullText');
        $('#admin-fullscreen').on('click', function () {
            $.AMUI.fullscreen.toggle();
        });

        $(document).on($.AMUI.fullscreen.raw.fullscreenchange, function () {
            $fullText.text($.AMUI.fullscreen.isFullscreen ? '退出全屏' : '开启全屏');
        });
    });

    // sidebar绑定事件
    $('a[class="am-cf"]').on('click', function (e) {
        var href = $(this).attr('href');
        if (href != undefined && href != "" && href != "#") {
            // 加载Content
            $.myadmin.loadContent(href);
            e.preventDefault();
        }
    });

    //出错提示
    $(document).ajaxError(function(event, request, settings) {
        debugger;
        layer.alert(request.status + '  (' + request.statusText + ')', {
            title : '出错',
            icon : 5,
            closeBtn : 0, // 关闭滚动条
            scrollbar : false
            // 屏蔽浏览器滚动条
            // 动画类型
        });
    });

    // 加载Content
    $.myadmin.loadContent();

    // 加载进度条动画
    $(document).ajaxStart(function() {
        $.AMUI.progress.start();
    });
    $(document).ajaxStop(function() {
        $.AMUI.progress.done();
    });

})(jQuery);