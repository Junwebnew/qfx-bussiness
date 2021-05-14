<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="100px">
                <el-row :gutter="5">
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="商标名称" prop="trademarkName">
                            <el-input v-model="queryParams.trademarkName" @keyup.enter.native="handleQuery" clearable placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="类别" prop="intclass">
                            <el-input v-model="queryParams.intclass" @keyup.enter.native="handleQuery" clearable placeholder="请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24">
                        <el-form-item label="注册号" prop="regNum">
                            <el-input v-model="queryParams.regNum" @keyup.enter.native="handleQuery" clearable placeholder="请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="类似群组" prop="similargroup">
                            <el-input v-model="queryParams.similargroup" @keyup.enter.native="handleQuery" clearable placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商品服务项" prop="goods">
                            <el-input v-model="queryParams.goods" @keyup.enter.native="handleQuery" clearable placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="是否取证" prop="hasCertificate">
                            <el-input v-model="queryParams.hasCertificate" @keyup.enter.native="handleQuery" clearable placeholder="模糊匹配:请输入..." size='small'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="同行价(元)" prop="price">
                            <Count v-model="queryParams.price"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="客户价(元)" prop="customerPrice">
                            <Count v-model="queryParams.customerPrice"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标字数" prop="trademarkNameWordnum">
                            <Count v-model="queryParams.trademarkNameWordnum"></Count>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="标源来源" prop="sourceType">
                            <el-select v-model="queryParams.sourceType" size='small' clearable style="width:100%;">
                                <el-option v-for="item in tmresourceArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标结构" prop="trademarkStructure">
                            <el-select v-model="queryParams.trademarkStructure" size='small' clearable style="width:100%;">
                                <el-option v-for="item in structureArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="注册公告时间" prop="regDateTime">
                            <el-select v-model="queryParams.regDateTime" size='small' clearable style="width:100%;">
                                <el-option v-for="item in yearArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标共有类" prop="commonCategories">
                            <el-select v-model="queryParams.commonCategories" multiple placeholder="请选择" clearable size='small' style="width:100%;">
                                <el-option v-for="item in classifyArr" :key="item" :label="item +'类'" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标区域" prop="areaName">
                            <el-select v-model="queryParams.areaName" placeholder="请选择" clearable size='small' style="width:100%;">
                                <el-option v-for="item in tmCountry" :key="item" :label="item" :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="商标状态" prop="saleStatus">
                            <el-select v-model="queryParams.saleStatus" placeholder="请选择" clearable size='small' style="width:100%;">
                                <el-option v-for="item in tmStatusArr" :key="item.value" :label="item.name" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="申请人类型" prop="applicationType">
                            <el-select v-model="queryParams.applicationType" placeholder="请选择" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in applicantTypeEnum" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" v-show="showSwitch">
                        <el-form-item label="图形要素">
                            <el-button :type=" eleSelected.length == 0 ? 'info' : 'success'" @click="getElementTree" size='mini'>
                                {{ eleSelected.length == 0 ? '点击选择' : '修改选择' }}
                            </el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="6" :sm="12" :xs="24" class="el-form-item-none mt2">
                        <div class="text-right">
                            <el-button size='small' icon='el-icon-refresh' @click="resetQuery('reset')">重置</el-button>
                            <el-button type="primary" size='small' icon="el-icon-search" class="ml10" @click="handleQuery">搜索</el-button>
                            <SwitchForm :showSwitch.sync="showSwitch" />
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="back-fff pad20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="12" class="lin32">
                    <span class="f18">{{$route.meta.title}}</span>
                    <span class="page_recourse_desc">{{$route.meta.desc}}</span>
                </el-col>
                <el-col :span="12" align='right'>
                    <el-button type="info" icon="el-icon-upload2" size="small" @click="handleImport">导入</el-button>
                    <el-button type="info" icon="el-icon-download" class="mr10" size="small" @click="handleDownload">导出</el-button>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="tableData">
                <el-table-column label="商标图样" width='100' align='center'>
                    <template slot-scope="scope">
                        <div class="resourse-img-box">
                            <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col">
                                <img :src="$getImg(scope.row.osmark,2) || scope.row.originalGraphicStyle || ''">
                            </a>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="注册号" width='100' prop='regNum' align='center'></el-table-column>
                <el-table-column label="商标名称" width='100' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a @click="checkDetail(scope.row)" href="javascript:void(0)" class="col">
                            {{scope.row.trademarkName || '--'}}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column label="类别" width='100' align='center'>
                    <template slot-scope="scope">
                        <span>{{scope.row.intclass || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品服务项" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goods || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="同行价(元)" width='100' align='center'>
                    <template slot-scope="scope">
                        <span>{{scope.row.price == 0 ? '--' : scope.row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户价(元)" width='100' align='center'>
                    <template slot-scope="scope">
                        <span>{{scope.row.customerPrice == 0 ? '--' : scope.row.customerPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="共用类别" width='100' show-overflow-tooltip align='center'>
                    <template slot-scope="scope">
                        <span>{{scope.row.commonCategories || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="标源来源" width='100' align='center'>
                    <template slot-scope="scope">
                        <span>{{macthCn( scope.row.sourceType )}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商标状态" width='80' align='center'>
                    <template slot-scope="scope">
                        <el-tag v-if=' scope.row.saleStatus === 0 ' type="success" size='small'>在售</el-tag>
                        <el-tag v-else-if=' scope.row.saleStatus == 1 ' type="warning" size='small'>已售</el-tag>
                        <el-tag v-else-if=' scope.row.saleStatus == 2 ' type="info" size='small'>无效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width='60' align='center' fixed="right">
                    <template slot-scope="scope">
                        <div class='operation'>
                            <el-button size="mini" type="text" @click="checkDetail(scope.row)">详情</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </div>
        <!-- 上传 -->

        <!-- //图形要素 -->
        <el-dialog title="请选择图形要素" :visible.sync="elementShow" append-to-body class="eleBoxIm" :close-on-click-modal=" false " width="1150px">
            <div class="treeBox">
                <div class="tree-search">
                    <el-input v-model="eleTreeName" placeholder="请输入要素关键字" clearable size="small" prefix-icon="el-icon-search" style="width:240px;margin-right:30px" />
                    <el-button type="primary" @click="resetChecked" size='small'>清空已选项</el-button>
                </div>
                <div class="treeBox-container">
                    <el-tree :data="elementTree" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" node-key="graphicCode" show-checkbox ref="tree">
                    </el-tree>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="elementShow = false">取 消</el-button>
                <el-button type="primary" @click="sureCheck()">确 定</el-button>
                <el-button class="ml20" type="primary" plain @click="sureCheck(true)">确定并查询</el-button>
            </span>
        </el-dialog>

        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <el-form label-width="80px" :model="uploadData" ref="uploadForm">
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="标源来源" prop="sourceType" :rules="[{ required: true, message: '来源不能为空', trigger: 'blur' }]">
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
            </el-form>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" with-credentials :headers="upload.headers" action="#" :disabled="upload.isUploading" :auto-upload="false" :name='upload.name' :data="uploadData" drag :http-request="myUploadFile">
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
            <detail ref='myDetail' @reload='getList' :tmresourceArr='tmresourceArr' />
        </draw>
    </div>
</template>

<script>
import { sellTrademarkList } from "@/api/resources";
import { draw, resourseMixin } from '../_module'
import detail from './detail'
import Count from '@/components/Count'
import { getToken } from '@/utils/auth'
import { DownFile } from '@/utils'

export default {
    name: "recentApply",
    components: {
        draw, detail, Count
    },
    mixins: [resourseMixin],
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
                pageNo: 1,
                pageSize: 10,
                trademarkName: undefined,
                intclass: undefined,
                regNum: undefined,
                similargroup: undefined,
                goods: undefined,
                hasCertificate: undefined,
                price: undefined,
                customerPrice: undefined,
                trademarkNameWordnum: undefined,
                sourceType: undefined,
                trademarkStructure: undefined,
                regDateTime: undefined,
                areaName: undefined,
                commonCategories: undefined,
                saleStatus: undefined,
                applicationType: undefined,
            },
            // 标源来源
            tmresourceArr: [
                { name: '全部', value: "" },
                { name: 'A类', value: "2" },
                { name: 'B类', value: "0" },
                { name: 'C类', value: "1" }
            ],
            tmresourceSelect: [
                { name: 'A类', value: "2" },
                { name: 'B类', value: "0" },
                { name: 'C类', value: "1" }
            ],
            tmStatusArr: [
                { name: '全部', value: "" },
                { name: '在售', value: "0" },
                { name: '已售', value: "1" },
                { name: '无效', value: "2" }
            ],
            applicantArr: [
                { name: '全部', value: "" },
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            structureArr: [
                { name: '全部', value: "" },
                { name: '纯中文', value: "1" },
                { name: '纯英文(拼音)', value: "2" },
                { name: '纯数字', value: "3" },
                { name: '中文+英文（拼音）', value: "4" },
                { name: '图形', value: "5" },
                { name: '中文+数字', value: "6" },
                { name: '图形+中文', value: "8" },
                { name: '图形+英文', value: "9" }
            ],
            yearArr: [
                { name: '全部', value: "" },
                { name: '一年内', value: "1" },
                { name: '1-2年内', value: "2" },
                { name: '2-3年内', value: "3" },
                { name: '3年以上', value: "4" }
            ],
            classifyArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
            tmCountry: ['全部', '中国', '美国', '日本', '欧盟', '德国', '英国', '法国', '香港', '澳大利亚'],
            //图形元素
            elementShow: false,
            elementTree: [],
            defaultProps: {
                children: "children",
                label: "graphicName"
            },
            eleTreeName: '',
            eleSelected: [],
            //上传的
            upload: {
                title: '',
                open: false,
                name: 'file',
                // headers: {
                //     'x-access-token': getToken()
                // }
            },
            uploadData: { sourceType: "", sourceExplain: "" },
        }
    },
    watch: {
        // 根据名称筛选部门树
        eleTreeName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {

    },
    mounted() {

        this.getList()
    },
    methods: {
        //组合get请求参数
        assUrlParams() {

            let requireStr = ''

            for (let key in this.queryParams) {

                let keysValue = this.queryParams[key]

                if (keysValue && (keysValue + '').length) {

                    if (key == 'price') {
                        requireStr += 'priceMin=' + keysValue[0] + '&priceMax=' + keysValue[1] + '&'
                    }
                    else if (key == 'customerPrice') {
                        requireStr += 'customerPriceMin=' + keysValue[0] + '&customerPriceMax=' + keysValue[1] + '&'
                    }
                    else if (key == 'trademarkNameWordnum') {
                        requireStr += 'trademarkNameWordnumMin=' + keysValue[0] + '&trademarkNameWordnumMax=' + keysValue[1] + '&'
                    }
                    else {
                        if (keysValue == '全部') keysValue = ''
                        requireStr += key + '=' + keysValue + '&'
                    }
                }
            }

            if (this.eleSelected.length > 0) {
                requireStr += ('imagesElementCode=' + this.eleSelected.join('@'))
            }

            return requireStr
        },
        //获取table表单的数据**************************************
        getList() {

            this.tableData = []

            this.loading = true;

            sellTrademarkList(this.assUrlParams()).then(response => {

                this.total = response.data.totalElements - 1 + 1;
                this.tableData = response.data.content;
                this.loading = false

            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNo = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {
            this.eleSelected = []
            this.$refs.tree.setCheckedKeys([]);
            this.resetForm("queryForm");
            this.handleQuery();
        },
        //匹配标源来源中文
        macthCn(code) {
            code += ''
            for (let item of this.tmresourceArr) {
                if (item.value == code) {
                    return item.name
                }
            }
            return this.tmresourceArr[1].name
        },
        checkDetail(obj) {

            this.$refs.myDraw.openDraw({ title: obj.trademarkName + ' 详情' })

            this.$nextTick(() => {
                this.$refs.myDetail.initPage(obj.id)
            })
        },
        /* 图形要素弹框 */
        //获取树
        getElementTree() {

            if (this.elementTree && this.elementTree.length) {

                this.elementShow = true

                return
            }


            this.$axios.get('/API/api-com/tmGraphicElements/front/tree?loading')
                .then(res => {
                    console.log(res)
                    this.elementTree = res.data
                    this.elementShow = true
                })
                .catch(res => {

                })
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.graphicName.indexOf(value) !== -1;
        },
        //清空所选项
        resetChecked() {
            this.$refs.tree.setCheckedKeys([]);
        },
        sureCheck(bool) {
            // console.log(1,this.$refs.tree.getCheckedNodes());
            // console.log(2,this.$refs.tree.getCheckedKeys());
            this.eleSelected = this.$refs.tree.getCheckedKeys()
            this.elementShow = false
            if (bool) {
                this.handleQuery()
            }
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "导入资源";
            this.upload.open = true;

            this.$nextTick(() => {
                this.$refs.upload.clearFiles();
            })
        },
        // 文件上传中处理
        // handleFileUploadProgress(event, file, fileList) {
        //     this.upload.isUploading = true;
        // },
        // // 文件上传成功处理
        // handleFileSuccess(response, file, fileList) {
        //     this.upload.open = false;
        //     this.upload.isUploading = false;
        //     this.$refs.upload.clearFiles();
        //     this.$alert(response.msg || response.message, "导入结果", { dangerouslyUseHTMLString: true });
        //     this.handleQuery();
        // },
        // //上传时间
        // handleFileError(response, file, fileList) {
        //     console.log('失败', response)
        //     this.$message.error("上传失败！")
        // },
        // 提交上传文件
        submitFileForm() {


            this.$refs["uploadForm"].validate(valid => {
                if (valid) {
                    this.$refs.upload.submit();
                }
            })
        },
        //自定义上传
        myUploadFile(params) {

            let form = new FormData();
            form.append("file", params.file);
            form.append("sourceExplain", params.data.sourceExplain);
            form.append("sourceType", params.data.sourceType);

            let loading = this.$loading()

            this.$axios.post('transaction/sellTrademark/importExcel', form, { timeout: 120000 })
                .then(res => {
                    //console.log('成功1', res)

                    loading.close()

                    if (res.code == 200) {
                        this.$message.success('上传成功！');
                        this.upload.open = false;
                    }
                    else {
                        this.$message.error('上传失败,' + res.msg);
                    }
                })
                .catch(res => {
                    loading.close()
                    console.log('失败1', res)
                    this.$message.error("上传失败！")
                })

        },
        //导出数据文件
        handleDownload() {
            this.$confirm(`是否导出当前页面数据?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((btn) => {

                this.$axios.get('transaction/sellTrademark/exportExcel?loading?' + this.assUrlParams(), { 'responseType': 'blob' })
                    .then(res => {

                        // console.log('999999', res)
                        DownFile(res, '客户出售数据.xls')
                    })
                    .catch(msg => {
                        console.error(msg)
                    })
            })
                .catch(res => { console.log('错误22222', res) })

        },
        //下载模板文件
        importTemplate() {

            this.$axios.get('transaction/sellTrademark/downloadTemplateFile', { 'responseType': 'blob' })
                .then(res => {
                    DownFile(res, '客户出售文件模板.xls')
                })
                .catch(msg => {
                    console.error(msg)
                })
        },
    },
    beforeDestroy() {
    }
}
</script>
<style scoped>
.treeBox {
    height: 600px;
    max-height: 70vh;
    overflow: hidden;
}
.treeBox-container {
    overflow: auto;
    height: 91%;
    margin-top: 20px;
}
</style>