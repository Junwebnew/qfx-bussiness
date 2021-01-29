<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">

            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">

                    <el-col :lg="12" :sm="24" :xs="24">
                        <el-form-item label="公司名称:" prop="orgId">
                            <el-select v-model="queryParams.orgId" size="small" multiple clearable filterable placeholder="请选择" @keyup.enter.native="handleQuery" style="width:100%">
                                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="消息标题" prop="title" class="el-form-item-none">
                            <el-input v-model="queryParams.title" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="消息类型" prop="type" class="el-form-item-none">
                            <el-select v-model="queryParams.type" size="small" clearable style="width: 100%">
                                <el-option v-for="dict in typeArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="消息状态" prop="isRelease" class="el-form-item-none">
                            <el-select v-model="queryParams.isRelease" size="small" clearable style="width: 100%">
                                <el-option v-for="dict in releaseArr" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" align='right'>
                        <div class=" mb10">
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        </div>
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
                    <el-button type="warning" size="mini" @click="delHandler()" :disabled="!ids.length">批量删除</el-button>
                    <right-toolbar class="ml10" :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData" row-key="id" @selection-change="handleSelectionChange">
                <el-table-column type='selection'></el-table-column>
                <el-table-column label="消息标题" prop='title'> </el-table-column>
                <!-- <el-table-column label="消息类型" width='90px' prop='type' :formatter="filterTypeHandler"> </el-table-column> -->
                <el-table-column label="消息状态" width='90px'>
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isRelease == 1" type="success" size="mini">已发布</el-tag>
                        <el-tag v-else type="danger" size="mini">未发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width='180' prop='createTime'> </el-table-column>
                <el-table-column label="操作" width='130'>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="updateHandler(scope.row)">修改</el-button>
                            <el-button size="mini" type="text" @click="delHandler(scope.row)">删除</el-button>
                            <el-button v-if="scope.row.isRelease == 0" size="mini" type="text" @click="releaseFunc(scope.row)">发布</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>

        <!-- 添加或修改消息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body :close-on-click-modal='false'>
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="消息标题" prop="title">
                            <el-input v-model="form.title" placeholder="请输入消息标题" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="公司名称:" prop="orgId">
                            <el-select v-model="form.orgId" size="small" multiple clearable filterable placeholder="请选择" style="width:100%">
                                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="消息类型" prop="type">
                            <el-radio-group v-model="form.type">
                                <el-radio v-for="dict in typeArr" :key="dict.value" :label="dict.value">{{dict.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="消息状态" prop='isRelease'>
                            <el-radio-group v-model="form.isRelease">
                                <el-radio v-for="dict in releaseArr" :key="dict.value" :label="dict.value">{{dict.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="消息内容" prop='content'>
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
import { conMsgList, conMsgDel, conMsgUpdate } from '@/api/system/msg.js'
import { qmxCompanyList } from "@/api/system/dept";
import { deepClone } from '@/utils/index'
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
            //机构列表
            deptList: [],
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
                type: '',
                isRelease: ''
            },
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            //发布状态
            releaseArr: [{ name: "未发布", value: 0 }, { name: "已发布", value: 1 }],
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
                    { required: true, message: "消息标题不能为空", trigger: "blur" }
                ],
                type: [
                    { required: true, message: "消息类型不能为空", trigger: "blur" }
                ],
                isRelease: [
                    { required: true, message: "消息状态不能为空", trigger: "blur" }
                ],
                content: [
                    { required: true, message: "消息内容不能为空", trigger: "blur" }
                ]
            },
            //选中的
            ids: []
        }
    },
    created() {

    },
    mounted() {
        this.getCompanyList()
        this.getList()
    },
    methods: {
        /** 查询机构列表 */
        getCompanyList() {
            qmxCompanyList().then(res => {
                this.deptList = res.data
            })
        },
        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            conMsgList(this.queryParams).then(response => {
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
            this.form = {
                type: 1,
                isRelease: 1
            }
            this.open = true
            this.title = '新增消息'
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //类型匹配
        filterTypeHandler(value, row) {

            let arr = this.typeArr.filter(i => i.value == value.type)

            return arr.length ? arr[0].name : '--'
        },
        //发布
        releaseFunc(row) {

            let newRow = deepClone(row)
            newRow.isRelease = 1
            conMsgUpdate(newRow)
                .then(res => {
                    this.msgSuccess("发布成功");
                    row.isRelease = 1
                })
        },
        //修改
        updateHandler(row) {
            this.form = row
            this.open = true
            this.title = '修改消息'
        },
        //删除
        delHandler(obj) {

            let tit = '是否批量删除商机？'
            let that = this

            if (obj) {
                this.ids = [obj.id]
                tit = '是否删除 ' + obj.title + " ？"
            }

            this.$confirm(tit, "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                return conMsgDel(that.ids);

            }).then(() => {

                this.getList();
                this.msgSuccess("剔除成功");

            })
                .catch(msg => {
                    console.log(11111, msg)
                })
        },
        cancel(obj) {

            this.resetForm("form");
            this.open = false
        },
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    conMsgUpdate(this.form).then(res => {

                        this.msgSuccess(this.form.id ? "修改成功" : '新增成功');
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