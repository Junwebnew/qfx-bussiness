<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
        <div class="pad0-20">
            <el-form ref="form" :model="form" :rules="rules" label-width="96px">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="商标名" prop="trademarkName">
                            <el-input v-model="form.trademarkName" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="注册号" prop="regNum">
                            <el-input v-model="form.regNum" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="申请人名称" prop="applicationNameCn">
                            <el-input v-model="form.applicationNameCn" :disabled='disabled' placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="代理机构" prop="agency">
                            <el-input v-model="form.agency" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="国际分类" prop="bigTypeCode">
                            <el-input v-model="form.bigTypeCode" placeholder="" type="text" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="国际分类名称" prop="bigTypeName">
                            <el-input v-model="form.bigTypeName" :disabled='disabled' placeholder="" maxlength="11" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
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

import { holderCreated } from "@/api/resources"
import { deepClone } from '@/utils/index'

export default {
    data() {
        return {
            // 遮罩层
            loading: true,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                trademarkName: undefined,
                regNum: undefined,
                applicationNameCn: undefined,
                agency: undefined,
                bigTypeCode: undefined,
                bigTypeName: undefined,
                remark: undefined,
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
                regNum: [
                    { required: true, message: "注册号不能为空", trigger: "blur" },
                ],
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

                    holderCreated(newObj).then(res => {

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