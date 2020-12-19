<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
                <!-- <el-form-item label="系统模块" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入系统模块" clearable style="width: 240px;" size="small" @keyup.enter.native="handleQuery" />
            </el-form-item> -->
                <el-form-item label="操作人员" prop="loginName">
                    <el-input v-model="queryParams.loginName" placeholder="请输入操作人员" clearable style="width: 240px;" size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="操作类型" prop="eventTypeList">
                    <el-select v-model="queryParams.eventTypeList" placeholder="操作类型" multiple clearable size="small" style="width: 240px">
                        <el-option v-for="dict in typeOptions" :key="dict.value" :label="dict.key" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="操作状态" clearable size="small" style="width: 240px">
                    <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item> -->
                <el-form-item label="操作时间">
                    <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['monitor:operlog:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleClean" v-hasPermi="['monitor:operlog:remove']">清空</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:config:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row> -->
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb20">
                <el-col :span="4" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                </el-col>
                <el-col :span="20" align='right'>

                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>

                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd()" v-hasPermi="['add-btn']">新增</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
            </el-row>

            <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                <el-table-column type="type" width="55" align="center" />
                <el-table-column label="系统模块" align="center" prop="eventModule" />
                <el-table-column label="事件类型" align="center" prop="eventType" :formatter="eventFormat" />
                <!-- <el-table-column label="请求方式" align="center" prop="requestMethod" /> -->
                <el-table-column label="操作URL" align="center" prop="operUrl" :show-overflow-tooltip="true" />
                <el-table-column label="操作人员" align="center" prop="creatorName" />
                <el-table-column label="操作IP" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
                <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
                <el-table-column label="操作状态" align="center" prop="status" :formatter="statusFormat" />
                <el-table-column label="操作日期" align="center" prop="happenTime" width="180" />

                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row,scope.index)" v-hasPermi="['monitor:operlog:query']">详细</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="操作人：">{{ form.creatorName }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作模块：">{{ form.eventModule }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发生时间：">{{ form.happenTime }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作IP：">{{ form.operIp }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="系统编号：">{{ form.businessDataId }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="机构ID：">{{ form.orgId }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作地点：">{{ form.operLocation }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态:">{{ statusFormat( form )}}</el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="事件类型：">{{ eventFormat(form) }}</el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="操作URL：">{{form.operUrl}}</el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="事件内容：">{{ form.eventContent }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="响应结果:">{{ form.jsonResult }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注：">{{ form.memo ||'无'}}</el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="错误信息：">{{ form.error_msg ||'无'}}</el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="open = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { list, delOperlog, cleanOperlog, exportOperlog } from "@/api/monitor/operlog";

import { qmxLogList } from "@/api/system/log";

export default {
    name: "Operlog",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表格数据
            list: [],
            // 是否显示弹出层
            open: false,
            // 类型数据字典
            typeOptions: [],
            //事件类型字典
            eventTypeStatus: [],
            // 类型数据字典
            statusOptions: [],
            // 日期范围
            dateRange: [],
            // 表单参数
            form: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 50,
                eventTypeList: [],
                loginName: undefined
            }
        };
    },
    created() {

        this.qmxDataKey().then(res => {
            // console.log(123, res)
            let none = ['登录', '退出登录', '退出']

            this.typeOptions = res['logEventTypeEnumList'].filter(i => none.includes(i.key))

            this.eventTypeStatus = res['businessModuleList']

            this.statusOptions = res['businessStatusList']

            this.getList();

        })

    },
    methods: {
        /** 查询登录日志 */
        getList() {

            this.loading = true;

            this.queryParams.onlyLoginLog = 0

            qmxLogList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

                this.list = response.data;
                this.total = response.total;
                this.loading = false;
            })

        },
        // 操作日志状态字典翻译
        statusFormat(row, column) {

            let arr = this.statusOptions.filter(i => i.value == row.status)

            return (arr && arr[0] && arr[0].key) || '未知'
        },
        //事件类型翻译
        eventFormat(row) {

            let arr = this.eventTypeStatus.filter(i => i.value == row.eventType)

            return (arr && arr[0] && arr[0].key) || '未知'

        },
        // 操作日志类型字典翻译
        typeFormat(row, column) {
            return this.selectDictLabel(this.typeOptions, row.businessType);
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
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.operId)
            this.multiple = !selection.length
        },
        /** 详细按钮操作 */
        handleView(row) {
            this.open = true;
            this.form = row;
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const operIds = row.operId || this.ids;
            this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return delOperlog(operIds);
            }).then(() => {
                this.getList();
                this.msgSuccess("删除成功");
            })
        },
        /** 清空按钮操作 */
        handleClean() {
            this.$confirm('是否确认清空所有操作日志数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return cleanOperlog();
            }).then(() => {
                this.getList();
                this.msgSuccess("清空成功");
            })
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return exportOperlog(queryParams);
            }).then(response => {
                this.download(response.msg);
            })
        }
    }
};
</script>

