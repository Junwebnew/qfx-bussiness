<template>
    <div class="app-container">

        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
                <el-form-item label="角色名称" prop="name" class="el-form-item-none">
                    <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <!-- <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
                <el-form-item>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb20">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <el-button type="primary" class="mr10" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['add-btn']">新增</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

                </el-col>
                <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button> -->
                <!-- </el-col> -->
            </el-row>

            <el-table v-loading="loading" :data="roleList">
                <!-- <el-table-column type="selection" width="55" align="center" /> -->
                <el-table-column type="index" width="50"></el-table-column>
                <!-- <el-table-column label="角色编号" prop="id"/> -->
                <el-table-column label="角色名称" prop="name" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" /> -->
                <el-table-column label="组织机构名称" prop="organizationName" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="memo" :show-overflow-tooltip="true" />
                <!-- <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column> -->
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="col-update" size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['t-edit']">修改</el-button>
                        <el-button class="col-del" v-if=" scope.row.id != '1' && scope.row.id != '11' " size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['t-del']">删除</el-button>
                        <el-button class="col-other" size="mini" type="text" @click="showSideMenu(scope.row)" v-hasPermi="['t-auts']">授权</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row :gutter="10" class="mb8">
                    <el-col :span='24'>
                        <el-form-item label="角色名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入角色名称" />
                        </el-form-item>
                        <!-- <el-form-item label="权限字符" prop="roleKey">
                    <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                    </el-form-item> -->
                        <!-- <el-form-item label="角色顺序" prop="roleSort">
                    <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
                    </el-form-item> -->
                        <!-- <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio
                        v-for="dict in statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictValue"
                        >{{dict.dictLabel}}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                        <el-form-item label="备注">
                            <el-input v-model="form.memo" type="textarea" maxLength='200' placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span='12'>
                <el-form-item label="菜单权限">
                    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
                    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
                    <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
                    <div class="treeBox">
                        <el-tree
                            class="tree-border"
                            :data="menuOptions"
                            show-checkbox
                            ref="menu"
                            node-key="id"
                            :check-strictly="!form.menuCheckStrictly"
                            empty-text="加载中，请稍后"
                            :props="defaultProps"
                        >
                            <span class="custom-tree-node" slot-scope="{ node,data }">
                                <span>{{data.isFunction == 1 ? '按钮_' : ''}} {{node.label }}</span>
                            </span>
                        </el-tree>
                    </div>
                </el-form-item>

            </el-col> -->
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 求购详情 -->
        <roleTree ref='roleTreeMo' />

    </div>
</template>

<script>
import { qmxRoleList, qmxDelRole, qmxUpdateRole, qmxRoleDetail } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect, qmxRoleTree } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";

import { mapGetters } from 'vuex'

import roleTree from './module/roleTree'

export default {
    name: "Role",
    components: {
        roleTree
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'rolesId'
        ])
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 角色表格数据
            roleList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 是否显示弹出层（数据权限）
            menuExpand: false,
            menuNodeAll: false,
            deptExpand: true,
            deptNodeAll: false,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 菜单列表
            menuOptions: [],
            // 部门列表
            deptOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: undefined,
            },
            // 表单参数
            form: {},
            defaultProps: {
                children: "menuFunctionTreeVoList",
                label: "name"
            },
            // 表单校验
            rules: {
                name: [
                    { required: true, message: "角色名称不能为空", trigger: "blur" }
                ]
            }
        };
    },
    created() {

        this.queryParams.organizationId = this.organizationId

        this.getList();

    },
    methods: {
        /** 查询角色列表 */
        getList() {

            this.loading = true;
            qmxRoleList(this.queryParams).then(response => {

                this.roleList = response.data;
                this.total = response.total;

                this.loading = false;
            })

            return

            listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.roleList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            );
        },
        /** 查询部门树结构 */
        getDeptTreeselect() {
            deptTreeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        // 所有菜单节点数据
        getMenuAllCheckedKeys() {
            // 目前被选中的菜单节点
            let checkedKeys = this.$refs.menu.getCheckedKeys();
            // 半选中的菜单节点
            let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        // 所有部门节点数据
        getDeptAllCheckedKeys() {
            // 目前被选中的部门节点
            let checkedKeys = this.$refs.dept.getCheckedKeys();
            // 半选中的部门节点
            let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
            checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
            return checkedKeys;
        },
        /** 根据角色ID查询菜单树结构 */
        getRoleMenuTreeselect(roleId) {
            return roleMenuTreeselect(roleId).then(response => {
                this.menuOptions = response.menus;
                return response;
            });
        },
        // 角色状态修改
        handleStatusChange(row) {
            let text = row.status === "0" ? "启用" : "停用";
            this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return changeRoleStatus(row.roleId, row.status);
            }).then(() => {
                this.msgSuccess(text + "成功");
            }).catch(function () {
                row.status = row.status === "0" ? "1" : "0";
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 取消按钮（数据权限）
        cancelDataScope() {
            this.openDataScope = false;
            this.reset();
        },
        // 表单重置
        reset() {
            if (this.$refs.menu != undefined) {
                this.$refs.menu.setCheckedKeys([]);
            }
            this.menuExpand = false,
                this.menuNodeAll = false,
                this.deptExpand = true,
                this.deptNodeAll = false,
                this.form = {
                    name: undefined,
                    memo: undefined,
                    organizationId: undefined
                };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.queryParams.organizationId = this.organizationId

            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            //this.getMenuTreeselect();
            this.open = true;
            this.title = "添加角色";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.form = row
            this.open = true;
            this.title = "修改角色";
        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    let str = this.form.id != undefined ? '修改成功' : '新增成功'

                    if (!this.form.id) {
                        this.form.organizationId = this.organizationId
                    }

                    qmxUpdateRole(this.form).then(response => {
                        this.msgSuccess(str);
                        this.open = false;
                        this.getList();
                    });

                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {

            this.$confirm('是否确认删除角色"' + row.name + '"?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return qmxDelRole([row.id]);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /*打开侧边框菜单树*/
        showSideMenu(row) {
            this.$refs.roleTreeMo.showFunc(row)
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有角色数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportRole(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>
<style scoped>
.treeBox {
    width: 100%;
    min-height: 300px;
    max-height: 400px;
    overflow: auto;
}
</style>