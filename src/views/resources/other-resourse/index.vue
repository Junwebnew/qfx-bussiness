<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="20">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="企业名称" prop="applicantName" class="el-form-item-none">
                            <el-input v-model="queryParams.applicantName" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系人" prop="address" class="el-form-item-none">
                            <el-input v-model="queryParams.address" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="联系电话" prop="address" class="el-form-item-none">
                            <el-input v-model="queryParams.address" placeholder="模糊:请输入..." clearable size="small" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                    </el-col>

                    <el-col :lg="6" :sm="12" :xs="24" align='right'>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="18" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                    <span class="page_recourse_desc">{{$route.meta.desc}}</span>
                </el-col>
                <el-col :span="6" align='right'>
                    <el-button type="info" class="mr10" size="mini" @click="handleImport()" v-hasPermi="['add-btn']">导入资源</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData">
                <el-table-column label="企业名称" prop="applicantName" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class='col pointer' @click="checkDetail(scope.row)">{{scope.row.applicantName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" prop="address" show-overflow-tooltip></el-table-column>
                <el-table-column label="地址" prop="industry" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系人" prop="businessState" show-overflow-tooltip></el-table-column>
                <el-table-column label="联系电话" prop="regDate" width='100'></el-table-column>
                <el-table-column label="所属公司" prop="regDate" width='100'></el-table-column>
                <el-table-column label="操作" width='70' align='center'>
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <!-- <el-form label-width="70px">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="标源来源">
                            <el-select v-model="uploadData.sourceType" size='small' style="width:100%;" placeholder="必选：选择标源">
                                <el-option v-for="item in tmresourceSelect" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="来源备注">
                            <el-input v-model="uploadData.sourceExplain" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form> -->
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" action='#' with-credentials :name='upload.name' drag :http-request="myUploadFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip text-right" slot="tip">
                    <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
                    <el-link type="info" class="col " style="font-size:14px" @click="importTemplate">下载模板</el-link>
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="upload.open = false">取 消</el-button>
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- ****************************************详情弹窗************************************** -->
        <draw ref='myDraw'>
            <detail ref='myDetail' />
        </draw>
    </div>
</template>

<script>
import { companyWhiteList } from "@/api/resources";
import { draw } from '../_module'
import detail from './detail'
export default {
    name: "recentApply",
    components: {
        draw, detail
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
            // 日期范围
            dateRange: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasPhone: true,
                applicantName: undefined,
                address: undefined
            },
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            //上传
            upload: {
                title: '',
                open: false,
                name: 'file',
                headers: {
                    'Authorization': 'Bearer '
                },
                sourceType: '',
                remark: ''
            },
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
            companyWhiteList(this.addDateRange(this.queryParams, this.dateRange, { start: 'startRegDate', end: 'endRegDate' })).then(response => {
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
            this.dateRange = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.applicantName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "导入资源";
            this.upload.open = true;


            this.$nextTick(() => {
                this.$refs.upload.clearFiles();
            })
        },
        // 自定义上传 提交上传文件
        submitFileForm() {

            if (!this.uploadData.sourceType) {
                this.$message.warning("请先选择来源")
                return
            }

            this.$refs.upload.submit();
        },
        myUploadFile(params) {
            //console.log('111', params)

            let form = new FormData();
            form.append("file", params.file);
            form.append("sourceExplain", params.data.sourceExplain);
            form.append("sourceType", params.data.sourceType);


            this.$axios.post('zuul/api-qfx/transaction/sellTrademark/importExcel', form, { timeout: 120000 })
                .then(res => {
                    //console.log('成功1', res)

                    if (res.code == 200) {
                        this.$message.success('上传成功！');
                        this.upload.open = false;
                    }
                    else {
                        this.$message.error('上传失败,' + res.msg);
                    }
                })
                .catch(res => {
                    console.log('失败1', res)
                    this.$message.error("上传失败！")
                })

        },
        //下载模板文件
        importTemplate() {

            let froms = this.$refs.dowmLoadFrom
            froms.action = this.$BaseUrl + 'api-qfx/transaction/sellTrademark/downloadTemplateFile'

            froms.access_token.value = Cookies.get('TOKEN')

            froms.submit()
        },
    },
    beforeDestroy() {
    }
}


</script>