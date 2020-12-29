<template>
    <!-- 新增备注 -->
    <el-dialog :title="addTitle" :visible.sync="open" width="500px" append-to-body>
        <div class="pad0-30">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row :gutter="10" class="mb8">
                    <el-col :span='24'>
                        <el-form-item label="线索状态" prop="businessStatusId">
                            <el-select v-model="form.businessStatusId" clearable size="small" style="width: 100%">
                                <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="线索备注" prop="remarkContent">
                            <el-input v-model="form.remarkContent" type="textarea" maxLength='200' placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>

import { clueMarksUpdate } from "@/api/center";

export default {
    props: {
        /*类型  1：线索必传 2：商机不传）*/
        type: {
            type: String | Number,
            default: 1
        },
        clueStatueArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            //备注弹框
            businessId: '',
            open: false,
            addTitle: '新增备注',
            form: { businessStatusId: '' },
            // 表单校验
            rules: {
                businessStatusId: [
                    { required: true, message: "状态不能为空", trigger: "blur" }
                ],
                remarkContent: [
                    { required: true, message: "备注不能为空", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
        show(obj, tit) {

            this.businessId = obj.id
            this.addTitle = tit || '新增备注'
            this.form = { businessStatusId: '' }
            this.open = true

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    this.form.businessId = this.businessId
                    this.form.type = this.type

                    clueMarksUpdate(this.form).then(response => {

                        this.msgSuccess('新增成功');
                        this.open = false;
                        this.$emit('finish');

                    });
                }
            });
        },
    }
}
</script>
