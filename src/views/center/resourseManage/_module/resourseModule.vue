<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
        <div class="pad0-20">
            <el-form ref="form" :model="form" :rules="rules" label-width="96px">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-input v-model="form.customerName" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contactsName">
                            <el-input v-model="form.contactsName" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="mobilePhone">
                            <el-input v-model="form.mobilePhone" :disabled='disabled' placeholder="" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="微信号" prop="wechatNumber">
                            <el-input v-model="form.wechatNumber" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="QQ" prop="qq">
                            <el-input v-model="form.qq" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户来源" prop="customerSource">
                            <el-select v-model="form.customerSource" :disabled='disabled' clearable size="small" style="width: 100%">
                                <el-option v-for="dict in customerSourceEnumList" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">

                    <el-col :span="12">
                        <el-form-item label="申请人类型" prop="applicationType">
                            <el-select v-model="form.applicationType" :disabled='disabled' clearable size="small" style="width: 100%">
                                <el-option v-for="dict in applicantTypeEnum" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务类型" prop="vocId">
                            <el-cascader v-model='form.vocId' :props="seProps" :options="vocIdArr" style="width:100%;" :size='"small"' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <!-- <el-col :span="12">
                        <el-form-item label="商机状态" prop="followStatus">
                            <el-select v-model="form.followStatus" :disabled='disabled' clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="12">
                        <el-form-item label="资源类型" prop="resourceType">
                            <el-cascader v-model='form.resourceType' :props="seProps" :options="resourceTypeArr" :disabled='disabled' style="width:100%;" :size='"small"' clearable></el-cascader>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-row :gutter="20">

                    <el-col :span="24">
                        <el-form-item label="分配部门" prop="allocationDept">
                            <el-cascader-panel v-model='form.allocationDept' :props="seProps" :options="deptList" style="width:100%;" :size='"small"' clearable></el-cascader-panel>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="form.remark" placeholder="" maxlength="500" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button v-show='modeType !=  "check"' type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { resourseManage } from "@/api/center"
import { qmxDetailDept, qmxDept } from "@/api/system/dept";
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index'

export default {
    data() {

        var validateUseName = (rule, value, callback) => {

            let emojiTest = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

            if (!value) {
                callback(new Error('用户名不能为空'))
            }
            else if (emojiTest.test(value)) {
                callback(new Error('不能输入表情符号'))
            }
            else {
                callback()
            }
        }

        var validateCompanyName = (rule, value, callback) => {

            if (this.form.applicationType === 0 && !value) {
                callback(new Error('企业名称不能为空'))
            }
            else {
                callback()
            }
        }

        var validateMobilePhone = (rule, value, callback) => {

            if (this.form.applicationType === 1 && !value) {
                callback(new Error('手机号码不能为空'))
            }
            else {
                callback()
            }
        }

        return {
            // 遮罩层
            loading: true,
            // 弹出层标题
            title: "资源管理",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                customerName: undefined,
                contactsName: undefined,
                mobilePhone: undefined,
                wechatNumber: undefined,

                qq: undefined,
                remark: undefined,
                customerSource: undefined,
                applicationType: undefined,
                // resourceType: undefined,
                vocId: undefined,
                allocationDept: undefined
            },
            seProps: { value: 'id', label: "name" },
            //客户来源枚举
            customerSourceEnumList: [],
            //申请人类型枚举
            applicantTypeEnum: [],
            //禁用
            disabled: false,
            //打开类型 
            modeType: undefined,
            //商机状态
            clueStatueArr: [],
            //资源状态
            resourceTypeArr: [],
            //业务状态
            vocIdArr: [],
            //部门列表
            deptList: [],
            // 表单校验
            rules: {
                customerName: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                customerSource: [
                    { required: true, message: "来源不能为空", trigger: "blur" }
                ],
                applicationType: [
                    { required: true, message: "申请人类型不能为空", trigger: "blur" }
                ],
                // followStatus: [
                //     { required: true, message: "商机状态不能为空", trigger: "blur" }
                // ],
                // resourceType: [
                //     { required: true, message: "资源类型不能为空", trigger: "blur" }
                // ],
                vocId: [
                    { required: true, message: "业务类型不能为空", trigger: "blur" }
                ],
                allocationDept: [
                    { required: true, message: "分配部门不能为空", trigger: "blur" }
                ],
                companyName: [
                    { validator: validateCompanyName, trigger: "blur" }
                ],
                mobilePhone: [
                    { validator: validateMobilePhone, trigger: "blur" },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            },
            //资源领取的类型  先到线索clue  还是直接到商机buss
            receiveOppWay: 'buss'
        };
    },
    computed: {
        ...mapGetters([
            'mainAccount',
            'companyId'
        ]),
    },
    created() {


        this.initEnumList()
    },
    methods: {
        showFunc(obj, tit, modeType) {

            this.reset()
            this.modeType = modeType
            this.tit = tit
            if (obj.id) {
                this.form = deepClone(obj)
            }
            this.open = true
        },
        //获取相关枚举
        initEnumList() {
            this.qmxDataKey().then(res => {
                // console.log('0000', res)
                this.customerSourceEnumList = res['customerSourceEnumList']
                this.applicantTypeEnum = res['applicantTypeEnumList']
            })

            this.$store.dispatch('getCenterType', 1).then(res => {
                this.vocIdArr = res
            })
            // this.$store.dispatch('getCenterType', 2).then(res => {
            //     this.resourceTypeArr = res

            //     console.log('123', res)
            // })

            qmxDetailDept(this.companyId).then(response => {

                this.receiveOppWay = response.data.receiveClueOppWay == 1 ? 'clue' : 'buss'

                // this.$store.dispatch('getBussStatus', receiveOppWay == 'buss' ? 4 : 2).then(res => {
                //     this.clueStatueArr = res
                //     this.form.followStatus = res[0].id
                // })

            });

            qmxDept({}).then(res => {
                this.deptList = this.changeDate(res.data)[0].children
            })

            return

            //buss
            this.$store.dispatch('getBussStatus', 4).then(res => {
                this.clueStatueArr = res
            })

            //culb


            this.$store.dispatch('getBussStatus', 2).then(res => {
                this.clueStatueArr = res
            })

            this.$store.dispatch('getCenterType', 1).then(res => {
                this.vocIdArr = res
            })
            this.$store.dispatch('getCenterType', 2).then(res => {
                this.resourceTypeArr = res
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
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                customerName: undefined,
                contactsName: undefined,
                mobilePhone: undefined,
                wechatNumber: undefined,
                fixedTel: undefined,
                email: undefined,
                officialWebsite: undefined,
                qq: undefined,
                remark: undefined,
                customerSource: undefined,
                applicationType: undefined,
            }
            this.resetForm("form");
            this.disabled = false
        },

        /** 提交按钮 新增用户*/
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {


                    console.log('9999', this.form)

                    let newObj = deepClone(this.form)

                    // //资源类型
                    // if (typeof newObj.resourceType != "string") {
                    //     newObj.resourceType = newObj.resourceType[newObj.resourceType.length - 1]
                    // }

                    //业务类型
                    if (typeof newObj.vocId != "string") {
                        newObj.vocId = newObj.vocId[newObj.vocId.length - 1]
                    }

                    //部门
                    if (typeof newObj.allocationDept != "string") {
                        newObj.allocationDept = newObj.allocationDept[newObj.allocationDept.length - 1]
                    }

                    // businessBelong   1 是线索 2 是商机  
                    newObj.businessBelong = this.receiveOppWay == 'buss' ? 2 : 1

                    //1手动分配 2 自动分配
                    newObj.allocationType = 1



                    let str = newObj.id ? '修改成功' : '新增成功'

                    // console.log('9999',this.form, newObj)

                    // return

                    resourseManage(newObj).then(res => {

                        // console.log(111, res)

                        this.msgSuccess(str)
                        this.open = false
                        this.$emit('finish', res.data)
                    })

                }
            });
        },
    }
};
</script>