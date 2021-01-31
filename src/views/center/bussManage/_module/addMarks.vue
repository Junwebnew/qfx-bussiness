<template>
    <!-- 新增备注 -->
    <el-dialog :title="addTitle" :visible.sync="open" width="500px" append-to-body>
        <div class="pad0-30">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row :gutter="10" class="mb8">
                    <el-col :span='24'>
                        <el-form-item label="提醒时间" prop="remindDate">
                            <el-date-picker v-model="form.remindDate" type="datetime" size='small' style="width:100%" value-format='yyyy-MM-dd HH' :picker-options="pickerOptions0" placeholder="选择日期时间">
                            </el-date-picker>
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

import { clueMarksUpdate, clueTipsUpdate } from "@/api/center";

export default {
    props: {
        /*类型  1：线索必传 2：商机不传）*/
        type: {
            type: String | Number,
            default: 2
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
                remarkContent: [
                    { required: true, message: "备注不能为空", trigger: "blur" }
                ]
            },
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
                },
                selectableRange: '08:00:00 - 22:00:00'
            }
        }
    },
    methods: {
        show(obj, tit) {

            this.businessId = obj.id
            this.addTitle = tit || '新增备注'

            // this.form = { businessStatusId: obj.followStatus, remindDate: this.parseTime(new Date().getTime() + 24 * 60 * 60 * 1000) }
            this.form = { businessStatusId: obj.followStatus, remindDate: this.parseTime(new Date().getTime(), '{y}-{m}-{d}') + ' 09:00:00' }
            this.open = true

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    this.form.businessId = this.businessId
                    this.form.type = this.type
                    this.form.remindContent = this.form.remarkContent
                    let that = this

                    function isNeedTips() {
                        if (that.form.remindDate) {
                            if (that.form.remindDate.indexOf('00:00') == -1) {
                                that.form.remindDate = that.form.remindDate + ':00:00'
                            }
                            return clueTipsUpdate(that.form)
                        }
                        return []
                    }

                    Promise.all([
                        isNeedTips(),
                        clueMarksUpdate(this.form)
                    ]).then(res => {
                        this.msgSuccess('新增成功');
                        this.open = false;
                        this.$emit('finish');
                    })
                }
            });
        },
    }
}
</script>
