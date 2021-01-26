<template>
    <!-- 新增备注 -->
    <el-dialog :title="addTitle" :visible.sync="open" width="520px" append-to-body>
        <div class="pad0-30">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-form-item label="线索状态" prop="businessStatusId">
                    <!-- <el-select v-model="form.businessStatusId" clearable size="small" style="width: 100%">
                        <el-option v-for="dict in clueStatueArr" :key="dict.id" :label="dict.name" :value="dict.id" />
                    </el-select> -->
                    <ul class="tagsBox">
                        <li v-for="dict in clueStatueArr" :key="dict.id" :class="{'active':form.businessStatusId == dict.id}" @click=" form.businessStatusId = dict.id">
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
            addTitle: '跟进状态',
            form: { businessStatusId: '' },
            // 表单校验
            rules: {
                businessStatusId: [
                    { required: true, message: "状态不能为空", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
        show(obj, tit) {

            this.businessId = obj.id
            this.addTitle = tit || '跟进状态'

            this.form = { businessStatusId: obj.followStatus }
            this.open = true

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    this.form.businessId = this.businessId
                    this.form.type = 1
                    this.form.remarkContent = '状态变更为 ' + this.returnStatusName(this.form.businessStatusId)

                    clueMarksUpdate(this.form).then(response => {
                        this.msgSuccess('变更成功');
                        this.open = false;
                        this.$emit('finish');
                    });
                }
            });
        },
        returnStatusName(businessStatusId) {
            return this.clueStatueArr.filter(i => i.id == businessStatusId)[0].name
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