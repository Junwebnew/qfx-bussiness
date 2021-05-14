<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
        <div class="pad0-20">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-row :gutter="10">
                    <!-- <el-col :span="12">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-input v-model="form.customerName" :disabled='disabled' placeholder="请输入..." maxlength="50" />
                        </el-form-item>
                    </el-col>
                     -->

                    <el-col :sm="16" :xs="24">
                        <el-form-item label="客户名称" :rules="{ required: true}">
                            <el-select v-model="form.customerId" filterable remote placeholder="请输入关键词搜索" :remote-method="searchName" size='small' @change='changeName' style="width:100%" ref='customerId' :disabled=" type == 'again'" :loading="nameLoading">
                                <el-option v-for="item in nameOptions" :key="item.id" :label="item.assName" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :sm="3" :xs="24" class="text-right">
                        <el-button type="primary" v-if="type != 'again'" size='small' class="ml10" @click="addCustomer">新增客户</el-button>
                    </el-col>

                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contactName">
                            <el-input v-model="form.contactName" placeholder="请输入..." type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="contactPhone">
                            <el-input v-model="form.contactPhone" placeholder="请输入..." maxlength="11" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="联系QQ" prop="contactQq">
                            <el-input v-model="form.contactQq" placeholder="请输入..." type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系微信" prop="contactWx">
                            <el-input v-model="form.contactWx" placeholder="请输入..." maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="商机状态" prop="followStatus">
                            <el-select v-model="form.followStatus" :disabled='disabled' clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资源类型" prop="resourceType">
                            <el-cascader :props="seProps" :options="resourceTypeArr" :disabled='disabled' style="width:100%;" :size='"small"' v-model='form.resourceType' clearable></el-cascader>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="10" v-show='whetherAdmin'>
                    <el-col :span="12">
                        <el-form-item label="业务类型" prop="vocId">
                            <el-cascader :props="seProps" :options="vocIdArr" style="width:100%;" :size='"small"' v-model='form.vocId' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属商务" prop="counselorId">
                            <!-- <el-input v-model="form.counselorId" :disabled='disabled' placeholder="请输入..." type="text" maxlength="50" /> -->
                            <el-select v-model="form.counselorId" filterable size='small' style="width:100%;" :disabled='disabled' clearable>
                                <el-option v-for="item in depUserList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
        <!-- 增加修改用户框 -->
        <customerModule ref='customerModule' @finish='finish' />
    </el-dialog>
</template>

<script>

import { bussUpdate, customerList } from "@/api/center"
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index'
import customerModule from '../../customer/_module/customerModule'
export default {
    components: { customerModule },
    props: {
        clueStatueArr: {
            type: Array,
            default: () => []
        },
        resourceTypeArr: {
            type: Array,
            default: () => []
        },
        vocIdArr: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId',
            'whetherAdmin'
        ])
    },
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
        return {
            // 遮罩层
            loading: true,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                customerId: undefined,
                contactName: undefined,
                contactPhone: undefined,
                contactQq: undefined,
                contactWx: undefined,
                followStatus: undefined,
                resourceType: undefined,
                counselorId: undefined,
                vocId: undefined
            },
            //用户列表
            depUserList: [],
            //禁用
            disabled: false,
            seProps: { value: 'id', label: "name" },
            // 表单校验
            rules: {
                customerName: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                contactName: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                followStatus: [
                    { required: true, message: "商机状态不能为空", trigger: "blur" }
                ],
                resourceType: [
                    { required: true, message: "商机类型不能为空", trigger: "blur" }
                ],
                vocId: [
                    { required: true, message: "业务类型不能为空", trigger: "blur" }
                ],
                email: [
                    { message: "邮箱地址不能为空", trigger: "blur" },
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                contactPhone: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            },
            //客户搜索的一些设置
            type: undefined,
            nameLoading: false,
            nameOptions: []
        };
    },
    created() {
        if (this.whetherAdmin) {
            this.$store.dispatch('getDepUser').then(res => {
                this.depUserList = res
            })
        }
    },
    methods: {
        showFunc(obj, tit) {

            this.reset()

            this.title = tit

            this.form.counselorId = this.userId

            console.log(999, obj)

            if (obj.id) {

                this.form = obj
                this.disabled = true

                this.searchName(obj.customerName)
            }

            this.open = true
        },
        //输入框的搜索
        searchName(query) {
            if (query !== '') {
                this.nameLoading = true;
                customerList({ customerName: query })
                    .then(res => {
                        let arr = res.data
                        if (arr && arr.length > 0) {
                            for (let i of arr) {
                                i.assName = i.customerName + (i.mobilePhone ? (' / ' + i.mobilePhone) : '') + ' / ' + (i.applicationType != '1' ? '企业' : '个人')
                            }
                        }
                        this.nameOptions = arr
                    })
                    .finally(() => {
                        this.nameLoading = false;
                    })
            }
            else {
                this.nameOptions = [];
            }
        },
        //改变后，拉出相关信息
        changeName(value) {

            for (let i of this.nameOptions) {
                if (i.id == value) {
                    this.form.contactName = i.contactsName
                    this.form.contactPhone = i.mobilePhone
                    this.form.contactQq = i.qq
                    this.form.contactWx = i.wechatNumber
                }
            }
        },
        //新增用户
        addCustomer() {
            this.$refs.customerModule.showFunc({}, '新增客户')
        },
        //新增后
        finish(obj) {

            obj.assName = obj.customerName
            this.nameOptions = [obj]
            this.form.customerId = obj.id

            this.changeName(obj.id)
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                resourceType: "",
                vocId: "",
                followStatus: ""
            };
            this.disabled = false
            this.resetForm("form");
        },

        /** 提交按钮 新增用户*/
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {


                    if (!this.form.contactPhone && !this.form.contactQq && !this.form.contactWx) {

                        this.msgError('电话、QQ、微信需要至少完善一项！')
                        return
                    }
                    let newObj = deepClone(this.form)

                    if (typeof newObj.resourceType != "string") {
                        newObj.resourceType = newObj.resourceType[newObj.resourceType.length - 1]
                    }

                    if (typeof newObj.vocId != "string") {
                        newObj.vocId = newObj.vocId[newObj.vocId.length - 1]
                    }

                    let str = newObj.id ? '修改成功' : '新增成功'

                    bussUpdate(newObj).then(res => {

                        this.msgSuccess(str)
                        this.open = false
                        this.$emit('backGetList')

                    })
                }
            });
        },
    }
};
</script>