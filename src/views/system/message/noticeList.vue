<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="公告标题" prop="title" class="el-form-item-none">
                            <el-input v-model="queryParams.title" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="公告类型" prop="type" class="el-form-item-none">
                            <el-select v-model="queryParams.type" clearable style="width: 100%">
                                <el-option v-for="dict in typeArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="公告状态" prop="isRelease" class="el-form-item-none">
                            <el-select v-model="queryParams.isRelease" clearable style="width: 100%">
                                <el-option v-for="dict in releaseArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" align='right'>
                        <el-form-item class="el-form-item-none ml20">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- <el-form-item label="申请/共有人" prop="applicationNameAndGyr" class="el-form-item-none">
                    <el-input v-model="queryParams.applicationNameAndGyr" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item> -->

            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()">新增</el-button>
                    <el-button type="warning" size="mini" @click="handleEliminate()" :disabled="!ids.length">批量剔除</el-button>
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type='selection'></el-table-column>
                <el-table-column label="公告标题" width='100' prop='title'> </el-table-column>
                <el-table-column label="公告类型" width='90px' prop='type'> </el-table-column>
                <el-table-column label="公告状态" width='90px' prop='isRelease'> </el-table-column>
                <el-table-column label="创建时间" prop='applicationName'> </el-table-column>
                <el-table-column label="操作" width='70' align='center'>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">删除</el-button>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">修改</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- 添加或修改公告对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body :close-on-click-modal='false'>
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="公告标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入公告标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公告类型" prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio v-for="dict in typeArr" :key="dict.value" :label="dict.value">{{dict.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公告状态" prop='isRelease'>
                            <el-radio-group v-model="form.isRelease">
                                <el-radio v-for="dict in releaseArr" :key="dict.value" :label="dict.value">{{dict.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容" prop='content'>
                            <editor v-model="form.content" :min-height="192" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { qmxMsgList, qmxMsgDel, qmxMsgUpdate } from '@/api/system/msg.js'

import Editor from '@/components/Editor';
export default {
    name: "recentApply",
    components: {
        Editor
    },
    data() {
        return {
            //显示搜索框
            showSearch: true,
            //显示loading
            loading: false,
            //数据列表 
            tableData: [],
            //总数
            total: 0,
            //查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //发布状态
            releaseArr: [{ name: "暂存", value: 0 }, { name: "发布", value: 1 }],
            //类型
            typeArr: [{ name: "通知", value: 0 }, { name: "公告", value: 1 }],
            //添加消息
            form: {
                type: 1,
                isRelease: 1
            },
            //表单规则
            rules: {
                title: [
                    { required: true, message: "公告标题不能为空", trigger: "blur" }
                ],
                type: [
                    { required: true, message: "公告标题不能为空", trigger: "blur" }
                ],
                isRelease: [
                    { required: true, message: "公告标题不能为空", trigger: "blur" }
                ],
                content: [
                    { required: true, message: "公告内容不能为空", trigger: "blur" }
                ]
            },
            //选中的
            ids: []
        }
    },
    created() {

    },
    mounted() {

        // this.getList()
    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            qmxMsgList(this.queryParams).then(response => {
                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {

            this.rejectdateRange = []
            this.applydateRange = []

            this.resetForm("queryForm");
            this.handleQuery();
        },
        //新增
        handleAdd() {
            this.open = true
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //删除
        handleEliminate() {

        },
        cancel(obj) {

            this.open = false
        },
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    qmxMsgUpdate(this.form).then(res => {

                        this.msgSuccess("修改成功");
                        this.open = false;
                        this.getList();
                    })
                        .catch(res => {
                            console.log('失败信息', res)
                            loading.close()
                        })
                }
            })
        }
    },
    beforeDestroy() {
    }
}


</script>