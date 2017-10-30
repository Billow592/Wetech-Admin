<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="wetechfn" uri="http://wetech.tech/admin/tags/wetech-functions" %>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<div class="admin-content">
    <div class="admin-content-body">
        <div class="am-cf am-padding">
            <ol class="am-breadcrumb">
                <li><a href="#" class="am-icon-home">首页</a></li>
                <%--<li><a href="#">用户管理</a></li>--%>
                <li class="am-active">系统用户</li>
            </ol>
        </div>

        <div class="am-g">
            <div class="am-u-sm-12 am-u-md-6">
                <div class="am-btn-toolbar">
                    <div class="am-btn-group am-btn-group-xs">
                        <shiro:hasPermission name="user:create">
                            <button type="button" class="am-btn am-btn-default am-btn-primary" onclick="create();"><span class="am-icon-plus"></span> 新增</button>
                        </shiro:hasPermission>
                        <shiro:hasPermission name="user:update">
                            <button type="button" class="am-btn am-btn-default am-btn-primary" onclick="update();"><span class="am-icon-edit"></span> 修改</button>
                        </shiro:hasPermission>
                        <shiro:hasPermission name="user:delete">
                            <button type="button" class="am-btn am-btn-default am-btn-primary" onclick="del();"><span class="am-icon-trash-o"></span> 删除</button>
                        </shiro:hasPermission>
                        <button type="button" class="am-btn am-btn-default am-btn-primary" onclick="reset();"><span class="am-icon-refresh"></span> 重置</button>
                    </div>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-3">
                <div class="am-form-group">
                    <select data-am-selected="{btnSize: 'sm'}">
                        <option value="option1">全部</option>
                        <option value="option2">文章</option>
                        <option value="option3">合作文章</option>
                        <option value="option3">未审核</option>
                    </select>
                </div>
            </div>
            <div class="am-u-sm-12 am-u-md-3">
                <div class="am-input-group am-input-group-sm">
                    <input type="text" class="am-form-field">
                    <span class="am-input-group-btn">
            <button class="am-btn am-btn-primary" type="button">搜索</button>
          </span>
                </div>
            </div>
        </div>

        <div class="am-u-sm-12">
            <table class="am-table am-table-striped  am-table-hover table-main am-table-bordered am-text-nowrap" width="100%" id="example_user">
                <thead>
                <tr>
                    <th><input type="checkbox" id='checkAll'></th>
                    <th>用户名</th>
                    <th>所属组织</th>
                    <th>角色列表</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
    <%-- footer start --%>
    <jsp:include page="footer.jsp"/>
    <%-- footer end --%>
</div>
<div id="add-dialog">
    <form class="am-form am-form-horizontal am-padding-top am-padding-bottom-0" id="add-form">
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">用户名<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="text" name="username" placeholder="输入用户名" minlength="3" data-foolish-msg="请输入英文，至少3个字符" required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">密码<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="password" name="password" id="addpassword" placeholder="输入密码" data-foolish-msg="必须输入密码" required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">确认密码<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="password" name="chkpassowrd" placeholder="确认密码" data-equal-to="#addpassword" data-foolish-msg="确认密码一致" required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">所属组织<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="hidden" id="organizationId" name="organizationId" readonly required>
                <input type="text" id="organizationName" name="organizationName" readonly required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">角色列表<span class="asterisk">*</span></label>
            <div class="am-u-sm-6">
                <select name="roleIds" multiple <%--data-am-selected--%>>
                    <c:forEach items="${roleList}" var="role">
                        <option value="${role.id}">${role.description}</option>
                    </c:forEach>
                </select>
            </div>
            <div class="am-u-sm-4">(按住shift键多选)</div>
        </div>
    </form>
</div>

<div id="edit-dialog">
    <form class="am-form am-form-horizontal am-padding-top" id="edit-form">
        <input type="hidden" name="id"/>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">用户名<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="text" name="username" placeholder="输入用户名" minlength="3" data-foolish-msg="请输入英文，至少3个字符" required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">所属组织<span class="asterisk">*</span></label>
            <div class="am-u-sm-10">
                <input type="hidden" id="edit-organizationId" name="organizationId" readonly required>
                <input type="text" id="edit-organizationName" name="organizationName" readonly required>
            </div>
        </div>
        <div class="am-form-group">
            <label class="am-u-sm-2 am-form-label">角色列表<span class="asterisk">*</span></label>
            <div class="am-u-sm-6">
                <select name="roleIds" style="z-index:19891016;" multiple <%--data-am-selected--%>>
                    <c:forEach items="${roleList}" var="role">
                        <option value="${role.id}">${role.description}</option>
                    </c:forEach>
                </select>
            </div>
            <div class="am-u-sm-4">(按住shift键多选)</div>
        </div>
    </form>
</div>
<div id="menuContent" class="menuContent" style="display:none;z-index:1989101600;position: absolute;border: 1px solid #ccc; background-color: #fff;">
    <ul id="tree" class="ztree"></ul>
</div>
<script type="text/javascript">
    $(function () {

        var pathURL = basePath + '/user/',
            listURL = pathURL + 'list',
            createURL = pathURL + 'create',
            updateURL = pathURL + 'update',
            deleteURL = pathURL + 'delete';

        var gridTable = [
            {
                'data': 'id',
                'sWidth': '2%',
                'fnCreatedCell': function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<input type="checkbox" name="checkList" title="' + sData + '" value="' + sData + '">');
                }
            },
            {
                'data': 'username'
            },
            {
                'data': 'organizationName'
            },
            {
                'data': 'roleNames'
            }
        ];
        var table = $.mytables.initDatatables(listURL, gridTable,'example_user');

        /**
         * 新增
         */
        create = function () {
            var $form = $('#add-form');
            var opts = {
                title: '添加用户',
                yes: function (index, layero) {
                    if ($form.isFormValid()) {
                        $form.submit({
                            url: createURL,
                            callback: function (data) {
                                if (data.success == true) {
                                    $.mydialog.closeDialog(index);
                                    table.ajax.reload();
                                }
                            }
                        });
                    }
                }
            };
            $.mytables.openDialog(opts,$('#add-dialog'));
        }

        /**
         * 修改
         */
        update = function () {
            var $form = $('#edit-form');
            var opts = {
                title: '修改用户',
                editable: true,
                yes: function (index, layero) {
                    if ($form.isFormValid()) {
                        $form.submit({
                            url: updateURL,
                            callback: function (data) {
                                if (data.success == true) {
                                    $.mydialog.closeDialog(index);
                                    table.ajax.reload();
                                }
                            }
                        });
                    }
                }
            };
            $.mytables.openDialog(opts,$('#edit-dialog'));
        }

        del = function () {
            $.mytables.deleteBatch(deleteURL, 'id');
        }

        /**
         * 重置
         */
        reset = function () {
            $.myadmin.loadContent('#user');
        }

        var setting = {
            view: {
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: onClick
            }
        };

        var zNodes = [
            <c:forEach items="${organizationList}" var="o">
            <c:if test="${not o.rootNode}">
            {id:${o.id}, pId:${o.parentId}, name: "${o.name}"},
            </c:if>
            </c:forEach>
        ];

        function onClick(e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj("tree"),
                nodes = zTree.getSelectedNodes(),
                id = "",
                name = "";
            nodes.sort(function compare(a, b) {
                return a.id - b.id;
            });
            for (var i = 0, l = nodes.length; i < l; i++) {
                id += nodes[i].id + ",";
                name += nodes[i].name + ",";
            }
            if (id.length > 0) id = id.substring(0, id.length - 1);
            if (name.length > 0) name = name.substring(0, name.length - 1);
            $("#organizationId").val(id);
            $("#organizationName").val(name);
            $("#edit-organizationId").val(id);
            $("#edit-organizationName").val(name);
            hideMenu();
        }

        function showMenu() {
            var cityObj = $("#organizationName");
            var cityOffset = $("#organizationName").offset();
            $("#menuContent").css({left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() - 60 + "px"}).slideDown("fast");

            $("body").bind("mousedown", onBodyDown);
        }

        function showMenuOfEdit() {
            var cityObj = $("#edit-organizationName");
            var cityOffset = $("#edit-organizationName").offset();
            $("#menuContent").css({left: cityOffset.left + "px", top: cityOffset.top + cityObj.outerHeight() - 60 + "px"}).slideDown("fast");

            $("body").bind("mousedown", onBodyDown);
        }

        function hideMenu() {
            $("#menuContent").fadeOut("fast");
            $("body").unbind("mousedown", onBodyDown);
        }

        function onBodyDown(event) {
            if (!(event.target.id == "organizationName" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                hideMenu();
            }
        }

        $.fn.zTree.init($("#tree"), setting, zNodes);
        $("#organizationName").click(showMenu);
        $("#edit-organizationName").click(showMenuOfEdit);
    });
</script>