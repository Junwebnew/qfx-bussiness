<template>
    <!-- 新增备注 -->
    <el-dialog :title="addTitle" :visible.sync="open" width="520px" append-to-body>
        <div class="pad0-30">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-form-item label="线索状态" prop="followStatus">
                    <!-- <el-select v-model="form.followStatus" clearable size="small" style="width: 100%">
                        <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                    </el-select> -->
                    <ul class="tagsBox">
                        <!-- 不展示 已成单 -->
                        <li v-for="dict in clueStatueArr" v-show=" dict.id != '13' " :key="dict.id" :class="{'active':form.followStatus == dict.id}" @click="selectStatus(dict)">
                            {{dict.name}}
                        </li>
                    </ul>
                </el-form-item>

            </el-form>
        </div>

        <div slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>

import { bussUpdate } from "@/api/center";

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
            addTitle: '跟进状态',
            form: { businessStatusId: '' },
            followStatus: '',//选中的状态
            // 表单校验
            rules: {
                followStatus: [
                    // { required: true, message: "状态不能为空", trigger: "blur" }
                    { required: true, validator: this.validStatus, trigger: "blur" },
                ]
            }
        }
    },
    methods: {
        show(obj, tit) {

            this.addTitle = tit || '跟进状态'

            this.form = obj
            this.followStatus = obj.followStatus

            this.open = true

        },
        selectStatus(item) {
            this.form.followStatus = item.id
            this.form.followStatusName = item.name
        },
        validStatus(rule, value, callback) {

            if (value == this.followStatus) {
                callback(new Error('请先改变线索状态'))
            }
            else {

                callback()
            }
        },
        /** 提交按钮 */
        submitForm: function () {

            this.$refs["form"].validate(valid => {
                if (valid) {

                    bussUpdate(this.form).then(response => {
                        this.msgSuccess('变更成功');
                        this.open = false;
                        this.$emit('finish');
                    });
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
.tagsBox {
    overflow: hidden;
    li {
        display: inline-block;
        cursor: pointer;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        line-height: 30px;
        min-width: 90px;
        height: 32px;
        border-radius: 3px;
        text-align: center;
        margin: 6px 10px;
        transition: all 0.3s;
        &:hover {
            color: $col;
            border-color: $col;
        }
        &.active {
            color: $col;
            border-color: $col;
        }
    }
}
</style>