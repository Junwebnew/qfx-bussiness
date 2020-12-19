<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <!-- 
            <el-form :model="queryParams" ref="queryForm" label-width="120px">
                <el-row :gutter="20">
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="部门名称" prop="name" class="el-form-item-none">
                            <el-input v-model="queryParams.name" placeholder="请输入部门名称" style="width: 100%" clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24">
                        <el-form-item label="菜单名称" prop="commonStatus" class="el-form-item-none">
                            <el-select v-model="queryParams.commonStatus" placeholder="部门状态" clearable size="small" style="width:100%">
                                <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8" :sm="12" :xs="24" align='right'>
                        <el-form-item>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row> -->

            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" @submit.native.prevent>
                <el-form-item label="部门名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入部门名称" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <!-- <el-form-item label="状态" prop="commonStatus">
                    <el-select v-model="queryParams.commonStatus" placeholder="部门状态" clearable size="small">
                        <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <el-button type="primary" class="mr10" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            </el-row>

            <el-table v-loading="loading" :data="deptList" row-key="id" default-expand-all :tree-props="treePros">
                <el-table-column prop="name" label="部门名称"></el-table-column>
                <!-- <el-table-column prop="orderNum" label="排序" width="200"></el-table-column> -->
                <el-table-column prop="status" label="状态" :formatter="statusFormat"></el-table-column>
                <el-table-column prop="type" label="类型" :formatter="typeFormat"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="200">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width='150px'>
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUpdate(scope.row)" v-hasPermi="['t-edit']">修改</el-button>
                        <el-button size="mini" type="text" @click="handleAdd(scope.row)" v-hasPermi="['t-add']">新增</el-button>
                        <el-button v-if="scope.row.type != 1" size="mini" type="text" @click="handleDelete(scope.row)" v-hasPermi="['t-del']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 添加或修改部门对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="24" v-if="form.parentId !== 0">
                        <el-form-item label="上级部门" prop="parentId">
                            <treeselect v-model="form.parentId" :options="deptListTree" :normalizer="normalizer" placeholder="选择上级部门" noResultsText="暂无结果" :searchable="true" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门名称" prop="name">
                            <el-input v-model="form.name" placeholder="请输入部门名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="level">
                            <el-input-number v-model="form.level" controls-position="right" :min="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="leader">
                            <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="contact">
                            <el-input v-model="form.contact" placeholder="请输入联系电话" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门状态">
                            <el-radio-group v-model="form.commonStatus">
                                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { qmxDept, qmxAddDept, qmxUpdateDept, qmxDetailDept, qmxDelDept } from "@/api/system/dept";
import { deepClone } from '@/utils/index'

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from 'vuex'
export default {
    name: "Dept",
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //角色所拥有的树
            deptListTree: [],
            // 表格树数据
            deptList: [],
            // 部门树选项
            deptOptions: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态
            statusOptions: [{ 'dictValue': 1, 'dictLabel': '有效' }, { 'dictValue': 0, 'dictLabel': '无效' },],
            // 查询参数
            queryParams: {
                name: undefined,
                commonStatus: undefined
            },
            treePros: { 'children': 'children', 'hasChildren': 'hasChildren' },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                parentId: [
                    { required: true, message: "上级部门不能为空", trigger: "blur" }
                ],
                name: [
                    { required: true, message: "部门名称不能为空", trigger: "blur" }
                ],
                // orderNum: [
                //   { required: true, message: "显示排序不能为空", trigger: "blur" }
                // ],
                email: [
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                contact: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin'
        ])
    },
    created() {
        this.getList();
        // this.getDicts("sys_normal_disable").then(response => {
        //   this.statusOptions = response.data;
        // });
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            this.loading = true;

            qmxDept(this.queryParams).then(res => {

                let arr = this.changeDate(res.data)

                this.deptListTree = deepClone(arr)

                this.deptList = arr

                this.loading = false;
            })
        },
        //数据子集切换和删除
        changeDate(arr) {
            arr.map(i => {
                if (i.treeVoList && i.treeVoList.length > 0) {
                    let newArr = this.changeDate(i.treeVoList)
                    i.children = newArr
                }
                delete i.treeVoList
            })
            return arr
        },
        /** selectTree 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.id,
                label: node.name,
                children: node.children
            };
        },
        //前端进行名称搜索
        depArrfilter(arr, name) {

            if (!name || name == '') {

                return arr
            }

            return arr.filter(i => {

                if (i.children && i.children.length > 0) {
                    i.children = this.depArrfilter(i.children, name)
                }

                return (i.name.indexOf(name) != -1 || (i.children && i.children.length != 0))
            })

        },
        // 字典状态字典翻译
        statusFormat(row, column) {
            return row.status || '正常'
        },
        typeFormat(row, column) {
            return row.type == 1 ? '企业' : '部门'
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
                parentId: undefined,
                name: undefined,
                leader: undefined,
                contact: undefined,
                email: undefined,
                commonStatus: 1,
                type: 2,
                level: 1
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {

            this.deptList = this.depArrfilter(deepClone(this.deptListTree), this.queryParams.name)

            //this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            if (row != undefined) {
                this.form.parentId = row.id;
            }

            this.open = true;
            this.title = "添加部门";

        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();

            qmxDetailDept(row.id).then(response => {

                //console.log(111,response)
                this.form = deepClone(response.data);
                this.open = true;
                this.title = "修改部门";
            });

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    console.log(111, this.form)

                    if (this.form.id != undefined) {
                        qmxUpdateDept(this.form).then(response => {
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        qmxAddDept(this.form).then(response => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return qmxDelDept(row.id);
            }).then(() => {
                this.getList();
                //   this.msgSuccess("删除成功");
            })
        }
    }
};
</script>