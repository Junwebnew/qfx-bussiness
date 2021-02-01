<template>
    <div class="app-container">
        <el-row>
            <!--部门数据-->
            <el-col :span="5" :xs="24" class="mb10">
                <div class="r back-fff full-height">
                    <div class="head-container">
                        <el-input ref='tree' v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                    </div>
                    <div class="tree-box">
                        <el-tree highlight-current :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick">
                            <div class="custom-tree-node text-delic" slot-scope="{ node}">
                                <span :title="node.label ">{{ node.label }}</span>
                            </div>
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <!--用户数据-->
            <el-col :span="19" :xs="24" class="">
                <div class="l-t back-fff pad20 mb10" v-show="showSearch">
                    <el-form :model="queryParams" ref="queryForm" label-width="80px">
                        <el-row :gutter="20">
                            <el-col :lg="8" :sm="12" :xs="24">
                                <el-form-item label="用户名称" prop="name" class="el-form-item-none">
                                    <el-input v-model="queryParams.name" placeholder="请输入用户名称" clearable size="small" style="width: 100%" @keyup.enter.native="handleQuery" />
                                </el-form-item>
                            </el-col>
                            <el-col :lg="8" :sm="12" :xs="24">

                                <el-form-item label="手机号码" prop="mobile" class="el-form-item-none">
                                    <el-input v-model="queryParams.mobile" placeholder="请输入手机号码" clearable size="small" style="width: 100%" @keyup.enter.native="handleQuery" />
                                </el-form-item>
                            </el-col>
                            <el-col :lg="8" :sm="12" :xs="24">
                                <el-form-item label="审核状态" prop="status" class="el-form-item-none">
                                    <el-select v-model="queryParams.checkStatusList" placeholder="用户状态" multiple clearable size="small" style="width: 100%">
                                        <el-option v-for="dict in statusOptions" :key="dict.value" :label="dict.key" :value="dict.value" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="8" :sm="12" :xs="24">
                                <el-form-item label="创建时间" class="el-form-item-none">
                                    <el-date-picker v-model="dateRange" size="small" style="width: 100%" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="{'span':10,'offset':6}" :sm="12" :xs="24" align='right'>
                                <el-form-item class="el-form-item-none">

                                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                                </el-form-item>
                            </el-col>

                        </el-row>

                    </el-form>
                </div>

                <div class="back-fff pad20">

                    <el-row :gutter="20">
                        <el-col :span="4" class="lin32">
                            <span class="f18">用户列表</span>
                        </el-col>
                        <el-col :span="18" :offset="2" align='right'>
                            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                            <el-button type="warning" icon="el-icon-plus" size="mini" @click="handleAdd('main')" v-hasPermi="['addmain-btn']">新增主账号</el-button>
                            <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                        </el-col>
                        <!-- <el-col :span="1.5">
                <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['system:user:edit']"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:user:remove']"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
                v-hasPermi="['system:user:import']"
                >导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['system:user:export']"
                >导出</el-button>
            </el-col> -->

                    </el-row>
                </div>

                <div class=" l-b back-fff">

                    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                        <el-table-column type="index" width="50" />
                        <!-- <el-table-column label="用户编号"  prop="id" /> -->
                        <el-table-column label="用户名称" prop="name">
                            <template slot-scope="scope">
                                <span class="mr5">{{scope.row.name}}</span>
                                <el-tag v-if="scope.row.accountType == 0" size="mini">主</el-tag>
                                <el-tag v-if="scope.row.whetherAdmin == 1" type="success" size="mini">管</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="部门" prop="organizationName" :show-overflow-tooltip="true" />
                        <el-table-column label="角色名称" prop="userRoleName" :show-overflow-tooltip="true" />

                        <el-table-column label="登录账号" prop="loginName" width="120" />
                        <el-table-column label="手机号码" prop="mobile" width="120" />
                        <el-table-column label="审核状态" width="80">
                            <template slot-scope="scope">
                                <!-- <span>{{returnStatusName(scope.row.checkStatus)}}</span> -->
                                <el-tag v-if="scope.row.checkStatus == 0" type='warning' size="mini">审核中</el-tag>
                                <el-tag v-else-if="scope.row.checkStatus == 1" type="success" size="mini">审核成功</el-tag>
                                <el-tag v-else-if="scope.row.checkStatus == 2" type="danger" size="mini">审核失败</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="left" width="80">
                            <template slot-scope="scope">
                                <!-- <el-switch disabled v-model="scope.row.commonStatus" :active-value="1" :inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch> -->
                                <span :class=" scope.row.commonStatus ? 'status-flag status-success' :  'status-flag status-err' "> {{ scope.row.commonStatus　? '正常' : '禁用'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="createTime" width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.createTime) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="left" width="170" class-name="small-padding fixed-width" fixed="right">
                            <template slot-scope="scope">
                                <el-button class="col-update" v-if="isShowBtn(scope.row)" size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['t-edit']">修改</el-button>
                                <el-button class="col-del" v-if="isShowBtn(scope.row)" size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['t-del']">删除</el-button>
                                <el-button class="col-add" v-if="isShowBtn(scope.row)" size="mini" type="text" @click="handleResetPwd(scope.row)" v-hasPermi="['t-rest']">重置</el-button>
                                <el-button class="col-other" v-if="isShowBtnCheck(scope.row)" size="mini" type="text" @click="handleCheck(scope.row)" v-hasPermi="['t-check']">审核</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
                </div>
            </el-col>

        </el-row>
        <!-- 审核用户 -->
        <el-dialog :title="checkParms.title" :visible.sync="checkParms.show" width="400px" append-to-body>
            <div style="min-height:150px">
                <el-form ref="checkParms" :model="checkParms" :rules="rules" label-width="90px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="审核状态" prop="status">
                                <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="checkParms.status"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="!checkParms.status">
                            <el-form-item label="失败原因" prop="failureReson">
                                <el-input v-model="checkParms.failureReson" type="textarea" placeholder="请输入失败内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitCheck">确 定</el-button>
                <el-button @click="checkParms.show = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">
                    <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                    <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 添加或修改参数配置对话框 -->
        <addUser ref='addUser' :deptOptions='deptOptions' @backGetList='handleQuery' />

        <!-- 添加或修改参数配置对话框 -->
        <addMainUser ref='addMainUser' :deptOptions='deptOptions' @backGetList='handleQuery' />

    </div>
</template>

<script>
import { qmxUserListAll, qmxUserUpdate, qmxUserDel, qmxUserReset, qmxUserCheck } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { qmxDept } from "@/api/system/dept";
import { qmxRoleList } from "@/api/system/role";

import addUser from './module/addUser'  //新增和修改用户

import addMainUser from './module/addMainUser'  //新增和修改 主用户

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { mapGetters } from 'vuex'


export default {
    name: "User",
    components: { Treeselect, addUser, addMainUser },
    computed: {
        ...mapGetters([
            'organizationId',
            'rolesId',
            'superAdmin'
        ])
    },
    data() {

        var validateUseName = (rule, value, callback) => {

            let emojiTest = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

            if (value === '') {
                callback(new Error('用户名不能为空'))
            }
            else if (emojiTest.test(value)) {
                callback(new Error('不能输入表情符号'))
            }
            else {

                callback()
            }
        }

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
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 部门树选项
            deptOptions: undefined,
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 性别状态字典
            sexOptions: [],
            //审核状态字典
            checkStatusEnumList: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            //审核弹框
            checkParms: {
                show: false,
                status: true,
                failureReson: ""
            },
            // 表单参数
            form: {
                'password': 123456,
                'commonStatus': 1,
                checkStatusList: []
            },
            defaultProps: {
                children: "treeVoList",
                label: "name"
            },
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/system/user/importData"
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: undefined,
                mobile: undefined,
                orgIds: undefined
            },
            // 表单校验
            rules: {
                name: [
                    { validator: validateUseName, trigger: "blur" },

                ],
                orgId: [
                    { required: true, message: "归属部门不能为空", trigger: "change" }
                ],
                roleIds: [
                    { required: true, message: "角色不能为空", trigger: "change" }
                ],
                password: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" }
                ],
                email: [
                    { message: "邮箱地址不能为空", trigger: "blur" },
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                mobile: [
                    { required: true, message: "手机号码不能为空", trigger: "blur" },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {

        this.queryParams.orgId = this.organizationId

        this.qmxDataKey().then(res => {

            // console.log(11,res)
            this.commonStatus = res['delFlagEnum']
            this.sexOptions = res['sexEnumList']
            this.statusOptions = res['checkStatusEnumList']
            this.checkStatusEnumList = res['checkStatusEnumList']

            this.getList();
        })


        this.getTreeselect()
        this.getRoleList()
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;


            qmxUserListAll(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.userList = response.data;
                this.total = response.total;
                this.loading = false;
            })

        },
        /*查询角色列表*/
        getRoleList() {
            qmxRoleList({ organizationId: this.organizationId, pageNum: 1, pageSize: 1000 }).then(response => {
                this.roleOptions = response.data;
            })
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            qmxDept({ 'name': '' }).then(response => {
                this.deptOptions = response.data;
            });
        },
        /** selectTree 转换部门数据结构 */
        normalizer(node) {
            if (node.treeVoList && !node.treeVoList.length) {
                delete node.treeVoList;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.treeVoList
            };
        },
        /** 是否显示  删除  修改 重置
         *  主账号不能删除（除了超级管理员） 
         **/
        isShowBtn(row) {

            if (row.accountType == 0) {
                return this.superAdmin
            }

            return true
        },
        /** 是否显示  审核
        *  超级管理员 审查所有 主账号审查所属机构
        **/
        isShowBtnCheck(row) {

            if (row.checkStatus != 1) {

                if (this.superAdmin) {
                    return true
                }

                if (row.accountType == 0) {
                    return false
                }

                return true
            }
            return false
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.orgId = data.id;
            this.getList();
        },
        //返回状态中文名
        returnStatusName(status) {

            let str = ''
            this.checkStatusEnumList.map(i => {
                if (i.value == status) {
                    str = i.key
                }
            })

            return str
        },
        //审核用户状态
        handleCheck(row) {

            this.checkParms.title = '审核 ' + row.name
            this.checkParms.status = row.checkStatus == 0 ? true : row.checkStatus
            this.checkParms.failureReson = ''
            this.checkParms.id = row.id
            this.checkParms.show = true
        },
        submitCheck() {

            if (!this.checkParms.status && !this.checkParms.failureReson) {

                this.msgError('请输入审核失败原因！')
                return
            }

            let obj = {
                status: this.checkParms.status ? 1 : 2,
                id: this.checkParms.id,
                failureReson: this.checkParms.failureReson
            }
            qmxUserCheck(obj).then(res => {
                this.checkParms.show = false
                this.getList();
            })

        },
        // 用户状态修改
        handleStatusChange(row) {
            let text = row.status === "0" ? "启用" : "停用";
            this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return changeUserStatus(row.id, row.status);
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
        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                orgId: undefined,
                name: undefined,
                password: undefined,
                mobile: undefined,
                email: undefined,
                gender: undefined,
                commonStatus: 1,
                password: 123456,
                roleIds: []
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd(type) {

            if (type == 'main') {
                this.$refs.addMainUser.showFunc({ orgId: this.organizationId, password: 123456, commonStatus: 1, whetherAdmin: 1 }, '添加主用户')
            }
            else {
                this.$refs.addUser.showFunc({ orgId: this.queryParams.orgId, password: 123456, commonStatus: 1, whetherAdmin: 0 }, '添加用户')
            }
        },
        /** 修改按钮操作 */
        handleUpdate(row) {

            row.orgId = row.organizationId

            if (row.accountType === 0) {
                this.$refs.addMainUser.showFunc(row, '修改主用户')
            }
            else {

                this.$refs.addUser.showFunc(row, '修改用户')
            }


        },
        /** 重置密码按钮操作 */
        handleResetPwd(row) {

            this.$confirm('是否确认重置名为"' + row.name + '"用户的密码? 重置后密码为：123456', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return qmxUserReset(row.id);
            }).then(() => {
                this.msgSuccess("重置成功，新密码是：123456");
            })
                .catch(() => { })

            //   this.$prompt('请输入"' + row.name + '"的新密码', "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消"
            //   }).then(({ value }) => {
            //       qmxUserReset(row.id, value).then(response => {
            //         this.msgSuccess("修改成功，新密码是：" + value);
            //       });
            //     }).catch(() => {});

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    let str = this.form.id != undefined ? '修改成功' : '新增成功'

                    console.log(111, this.form)

                    this.form.loginName = this.form.mobile

                    qmxUserUpdate(this.form).then(res => {
                        console.log(111, res)
                    })
                    //   if (this.form.id != undefined) {
                    //     updateUser(this.form).then(response => {
                    //       this.msgSuccess("修改成功");
                    //       this.open = false;
                    //       this.getList();
                    //     });
                    //   } else {
                    //     addUser(this.form).then(response => {
                    //       this.msgSuccess("新增成功");
                    //       this.open = false;
                    //       this.getList();
                    //     });
                    //   }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$confirm('是否确认删除名为"' + row.name + '"用户?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return qmxUserDel([ids]);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有用户数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportUser(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "用户导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            importTemplate().then(response => {
                this.download(response.msg);
            });
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
            this.getList();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        }
    }
};
</script>

<style lang="scss" scoped>
.lin29 {
    line-height: 29px;
}
.r {
    height: calc(100vh - 94px);
    padding: 20px 10px;
    margin-right: 10px;
    .tree-box {
        height: calc(100% - 54px);
        overflow-y: auto;
    }
}
.l-m,
.l-t {
    padding: 20px 20px 10px;
}
.l-b {
    padding: 0 20px 20px;
}
.status-flag {
    position: relative;
    display: inline-block;
    padding-left: 12px;
    font-size: 13px;
    &::before {
        position: absolute;
        left: 0;
        top: 50%;
        width: 6px;
        height: 6px;
        margin-top: -3px;
        background: #d9d9d9;
        border-radius: 50%;
        content: " ";
        color: rgba(0, 0, 0, 0.65);
    }
    &.status-success {
        &::before {
            background: #52c41a;
        }
    }
    &.status-err {
        &::before {
            background: #f5222d;
        }
    }
}
</style>