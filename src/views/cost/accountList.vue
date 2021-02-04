<template>
    <div class="app-container">
        <div class="back-fff form-box mb10" v-show="showSearch">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" @submit.native.prevent>
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入部门名称" maxLength='100' clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
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
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-col>
            </el-row>

            <el-table v-loading="loading" :data="deptList">
                <el-table-column prop="name" label="公司名称"></el-table-column>
                <el-table-column prop="status" label="状态" width='80'>
                    <div slot-scope="scope">
                        <el-tag v-if="scope.row.commonStatus" type="success" size='mini'>正常</el-tag>
                        <el-tag v-else type="danger" size='mini'>取消</el-tag>
                    </div>
                </el-table-column>
                <el-table-column prop="subAccountNumber" label="人员限制" width="80">
                    <div slot-scope="scope">
                        <span>{{scope.row.subAccountNumber || '--'}}人</span>
                    </div>
                </el-table-column>
                <el-table-column label="剩余星数" prop="accountNum" width="80">
                    <div slot-scope="scope">
                        <span>{{scope.row.accountNum || '--'}}</span>
                    </div>
                </el-table-column>
                <el-table-column label="试用星数" prop="originalTimes" width="80">
                    <div slot-scope="scope">
                        <span>{{scope.row.originalTimes || '--'}}</span>
                    </div>
                </el-table-column>
                <!-- <el-table-column label="试用天数" prop="days" width="80">
                    <div slot-scope="scope">
                        <span>{{scope.row.days || '--'}}天</span>
                    </div>
                </el-table-column> -->
                <el-table-column label="充值时间" prop="rechargeTime" width="180"></el-table-column>
                <el-table-column label="到期日期" prop="termOfValidityDate" width="180"></el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width='180px' fixed="right">
                    <template slot-scope="scope">

                        <el-button class="col-del" size="mini" type="text" @click="costDetail(scope.row)">充值详情</el-button>

                        <el-dropdown class="ml10">
                            <el-button type="text" size='mini'>
                                相关操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button class="col-del" size="mini" type="text" @click="costRecharge(scope.row)">账号充值</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button class="col-del" size="mini" type="text" v-hasPermi="['user']" @click="handleUpdate(scope.row,'form')">人员限制</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button class="col-del" size="mini" type="text" @click="showSetBox(scope.row,'formNum')">增加试用星数</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button class="col-del" size="mini" type="text" @click="showSetBox(scope.row,'formDays')">增加试用天数</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button class="col-del" size="mini" type="text" @click="handleUpdate(scope.row,'resourseSet')">资源流程配置</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        </div>
        <!-- //人员限制 -->
        <el-dialog title="人员数量设置" :visible.sync="form.open" width="500px">
            <el-form ref="form" :model="form" label-width="110px" :rules='rules'>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="客户名称" prop="name">
                            <el-input v-model="form.name" disabled style="width:250px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="最大人员数量" prop="subAccountNumber">
                            <el-input-number v-model="form.subAccountNumber" :min="1" :max="100000" label="数量" style="width:250px"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
            </div>
        </el-dialog>
        <!-- //试用天数 -->
        <el-dialog title="试用天数设置" :visible.sync="formDays.open" width="500px">
            <el-form ref="formDays" :model="formDays" label-width="110px" :rules='rules'>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="客户名称" prop="name">
                            <el-input v-model="formDays.name" disabled style="width:250px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="试用天数" prop="days">
                            <el-input-number v-model="formDays.days" :min="1" :max="100000" label="数量" style="width:250px"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="setDeptMsg('formDays')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- //试用星数设置 -->
        <el-dialog title="试用星数设置" :visible.sync="formNum.open" width="500px">
            <el-form ref="formNum" :model="formNum" label-width="110px" :rules='rules'>
                <el-row>
                    <el-col :span='24'>
                        <el-form-item label="客户名称" prop="name">
                            <el-input v-model="formNum.name" disabled style="width:250px" />
                        </el-form-item>
                    </el-col>
                    <el-col :span='24'>
                        <el-form-item label="试用星数" prop="num">
                            <el-input-number v-model="formNum.num" :min="1" :max="100000" label="数量" style="width:250px"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="setDeptMsg('formNum')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- //试用星数设置 -->
        <el-dialog title="资源流程配置" :visible.sync="resourseSet.open" width="500px">
            <el-form ref="resourseSet" :model="{}" label-width="110px" :rules='rules'>
                <el-row>
                    <el-col :span='24'>
                        <el-radio v-model="resourseSet.receiveClueOppWay" label="1">资源 -> 线索 -> 商机 ->成单</el-radio>
                    </el-col>
                    <el-col :span='24' class="mt20">
                        <el-radio v-model="resourseSet.receiveClueOppWay" label="2">资源 -> 商机 ->成单</el-radio>
                    </el-col>
                    <el-col :span='24' class="mt20">
                        <p class="f12 col-hui">说明：系统默认支持其中一种资源领取方式</p>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearForm">取 消</el-button>
                <el-button type="primary" @click="resourseSetfunc">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { qmxCompanyList, qmxUpdateDept, setDeptDaysAndNum } from "@/api/system/dept";
import { deepClone } from '@/utils/index'

import { mapGetters } from 'vuex'
export default {
    name: "Dept",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //列表数据
            deptList: [],
            //总数
            total: 1,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                name: undefined,
                level: 2
            },
            //表单
            form: {
                open: false,
                name: "",
                subAccountNumber: 1,
            },
            formDays: {
                open: false,
                name: "",
                days: 1,
            },
            formNum: {
                open: false,
                name: "",
                num: 1,
            },
            resourseSet: {
                open: false,
                receiveClueOppWay: "1",
            },
            rules: {
                subAccountNumber: [
                    { required: true, trigger: "blur", message: "数量不能为空" },
                ],
                days: [
                    { required: true, trigger: "blur", message: "数量不能为空" },
                ],
                num: [
                    { required: true, trigger: "blur", message: "数量不能为空" },
                ]
            },
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin',
        ])
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            this.loading = true;

            qmxCompanyList(this.queryParams).then(res => {
                this.deptList = res.data

                this.total = res.total
                this.loading = false;

            })
        },
        /** 搜索按钮操作 */
        handleQuery() {

            this.getList();
        },
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
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
        //关闭
        clearForm() {
            this.form = { open: false }
            this.formDays = { open: false }
            this.formNum = { open: false }
            this.resourseSet = { open: false }
        },
        //人员数量限制
        handleUpdate(row, key) {

            this[key] = deepClone(row)
            this[key].receiveClueOppWay = this[key].receiveClueOppWay || '1'
            this[key].open = true
        },
        //提交
        submitFileForm() {
            let that = this
            this.$refs.form.validate(valid => {
                if (valid) {
                    qmxUpdateDept(this.form).then(response => {
                        that.msgSuccess("修改成功");
                        that.clearForm();
                        that.getList();
                    })
                }
            })
        },
        //显示设置
        showSetBox(row, key) {
            this[key] = {
                name: row.name,
                id: row.costId,
                open: true
            }
        },
        //设置公司试用信息
        setDeptMsg(key) {

            let that = this
            this.$refs[key].validate(valid => {
                if (valid) {
                    setDeptDaysAndNum(this[key]).then(response => {
                        that.msgSuccess("修改成功");
                        that.clearForm();
                        that.getList();
                    })
                }
            })
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
        //去充值
        costRecharge(row) {
            this.$router.push('/cost/accountRecharge?id=' + row.id)
        },
        /** 修改按钮操作 */
        costDetail(row) {
            this.$router.push('/cost/accountRechargeList?id=' + row.id)
        },
        //修改资源领取方式
        resourseSetfunc() {
            qmxUpdateDept(this.resourseSet).then(response => {
                this.msgSuccess("修改成功");
                this.clearForm();
                this.getList();
            })
        }
    }
};
</script>