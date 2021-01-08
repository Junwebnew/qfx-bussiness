<template>
    <!-- 新增备注 -->
    <el-dialog :title="addTitle" :visible.sync="open" width="520px" append-to-body>
        <div class="pad0-30">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-form-item label="业务类型" prop="vocId">
                    <!-- <ul class="tagsBox">
                        <li v-for="dict in clueStatueArr" :key="dict.id" :class="{'active':form.vocId == dict.id}" @click=" form.vocId = dict.id">
                            {{dict.name}}
                        </li>
                    </ul> -->
                    <el-cascader :props="seProps" :options="vocIdArr" style="width:100%;" :size='"small"' v-model='form.vocId' clearable></el-cascader>
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

import { clueChangToOpp } from "@/api/center";

export default {
    props: {
        /*类型  1：线索必传 2：商机不传）*/
        type: {
            type: String | Number,
            default: 1
        },
        vocIdArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            seProps: { value: 'id', label: "name" },
            //备注弹框
            businessId: '',
            open: false,
            addTitle: '业务类型',
            form: { vocId: '' },
            subForm: {},
            // 表单校验
            rules: {
                vocId: [
                    { required: true, message: "业务类型不能为空", trigger: "blur" }
                ]
            }
        }
    },
    methods: {
        show(obj, tit) {

            this.addTitle = tit || '选择业务类型'

            this.subForm = { id: obj.id, vocId: obj.vocId }
            this.form.vocId = obj.vocId

            this.open = true

        },
        /** 提交按钮 */
        submitForm: function () {
            this.$refs["form"].validate(valid => {
                if (valid) {

                    if (typeof this.form.vocId != "string") {
                        this.subForm.vocId = this.form.vocId[this.form.vocId.length - 1]
                    }

                    clueChangToOpp(this.subForm).then(response => {
                        this.msgSuccess('转为商机成功');
                        this.open = false;
                        this.$emit('finish');
                    });
                }
            })
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