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
                        <el-form-item label="备注内容" prop="remarkContent">
                            <el-input v-model="form.remarkContent" type="textarea" maxLength='200' placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' class="f12" v-if="type != 2">

                        <p class="fl mr10" style="line-height:2;margin-left:15px">
                            <i class="el-icon-warning col-warn" style=""></i>
                            提示：
                        </p>
                        <p style="overflow:hidden;color:#888;line-height:2">
                            点击转为商机备注，此条资源会由线索转为商机，<br>转为商机备注后请在<span class="col-warn">我的商机</span>中查看此条资源。<br>
                        </p>
                    </el-col>
                </el-row>
            </el-form>

        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="open = false" size='small' class="fl">取 消</el-button>
            <el-button type="primary" size='small' @click="submitForm(1)">{{type != 2 ? '线索' : '商机' }}备注</el-button>
            <el-button type="warning" size='small' @click="submitForm(2)" v-if="type != 2">转为商机备注</el-button>
        </div>
    </el-dialog>
</template>
<script>

import { clueMarksUpdate, clueTipsUpdate } from "@/api/center";
import { clueChangToOpp } from "@/api/center";

export default {
    data() {
        return {
            type: 1,  /*类型  1：线索必传 2：商机不传）*/
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
        show(id, type, tit) {

            this.businessId = id
            this.type = type
            this.addTitle = tit || '新增备注'

            // this.form = { businessStatusId: obj.followStatus, remindDate: '' }
            this.open = true

            // document.body.appendChild(this.$el);
        },
        /** 提交按钮 */
        submitForm: function (type) {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    this.form.businessId = this.businessId
                    this.form.type = this.type
                    this.form.remindContent = this.form.remarkContent
                    let that = this

                    //线索再转一次商机
                    if (type == 2) {

                        this.form.type = 2

                        clueChangToOpp({ id: that.businessId })
                            .then(res => {
                                that.form.businessId = res.data
                                that.addMarksFunc()
                            })
                        return
                    }
                    this.addMarksFunc()
                }
            });
        },
        addMarksFunc() {

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
                clueMarksUpdate(that.form)
            ]).then(res => {
                this.msgSuccess('新增成功');
                this.open = false;
                this.$emit('finish');
            })
        }
    }
}
</script>
