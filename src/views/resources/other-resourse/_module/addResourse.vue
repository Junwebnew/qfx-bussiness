<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
        <div class="pad0-20">
            <el-form ref="form" :model="form" :rules="rules" label-width="96px">

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="企业名称" prop="companyName">
                            <el-input v-model="form.companyName" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人" prop="contactPeople">
                            <el-input v-model="form.contactPeople" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="企业地址" prop="companyAddress">
                            <el-input v-model="form.companyAddress" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号" prop="contactPhone">
                            <el-input v-model="form.contactPhone" :disabled='disabled' placeholder="" maxlength="11" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="联系情况" prop="contactSituation">
                            <el-input v-model="form.contactSituation" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请人类型" prop="applicationType">
                            <el-select v-model="form.applicationType" :disabled='disabled' clearable size="small" style="width: 100%">
                                <el-option v-for="dict in applicantTypeEnum" :key="dict.value" :label="dict.key" :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
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

import { externalResourceManage } from "@/api/resources"
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
        return {
            // 遮罩层
            loading: true,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                companyName: undefined,
                contactPeople: undefined,
                contactPhone: undefined,
                companyAddress: undefined,
                remark: undefined,
                contactSituation: undefined,
                applicationType: undefined,
            },
            //客户来源枚举
            customerSourceEnumList: [],
            //申请人类型枚举
            applicantTypeEnum: [],
            //禁用
            disabled: false,
            //打开类型 
            modeType: undefined,
            // 表单校验
            rules: {
                companyName: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                contactPeople: [
                    { required: true, message: "联系人不能为空", trigger: "blur" },
                ],
                applicationType: [
                    { required: true, message: "申请人类型不能为空", trigger: "blur" }
                ],
                contactPhone: [
                    { required: true, message: "手机号不能为空", trigger: "blur" },
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {

        this.qmxDataKey().then(res => {
            // console.log('0000', res)
            this.applicantTypeEnum = res['applicantTypeEnumList']
        })
    },
    methods: {
        showFunc(obj, tit, modeType) {

            this.reset()

            this.title = tit
            this.modeType = modeType
            if (obj.id) {
                this.form = deepClone(obj)
            }
            this.open = true
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                companyName: undefined,
                contactPeople: undefined,
                contactPhone: undefined,
                companyAddress: undefined,
                remark: undefined,
                contactSituation: undefined,
                applicationType: undefined,
            }
            this.resetForm("form");
            this.disabled = false
        },

        /** 提交按钮 新增用户*/
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    let newObj = deepClone(this.form)

                    let str = newObj.id ? '修改成功' : '新增成功'

                    let loading = this.$loading()

                    externalResourceManage(newObj).then(res => {

                        this.msgSuccess(str)
                        this.open = false
                        this.$emit('finish', res.data)
                        loading.close()
                    })
                        .catch(res => {
                            loading.close()
                        })
                }
            });
        },
    }
};
</script>