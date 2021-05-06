<template>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal='false'>
        <div class="pad20">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-input v-model="form.customerName" :disabled='disabled' placeholder="请输入..." maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成单金额" prop="orderformPrice">
                            <el-input-number style="width:100%;" v-model="form.orderformPrice" :min="1" :max="100000000" label="金额"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
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
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="资源类型" prop="resourceType">
                            <el-cascader :props="seProps" :options="resourceTypeArr" :disabled='disabled' style="width:100%;" :size='"small"' v-model='form.resourceType' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务类型" prop="vocId">
                            <el-cascader :props="seProps" :options="vocIdArr" style="width:100%;" :size='"small"' v-model='form.vocId' clearable></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12" v-show='whetherAdmin'>
                        <el-form-item label="所属商务" prop="counselorId">
                            <el-select v-model="form.orderformUserId" filterable size='small' style="width:100%;" clearable>
                                <el-option v-for="item in depUserList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同上传">
                            <el-upload ref='uploadBox' class="upload-demo" :action="qmxOnlineUrl" :on-exceed="handleExceed" :limit='1' :disabled="isUploading" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleFileSuccess" :data="{'fileSource':'ALIYUN'}">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">(可选，可上传图片、word、excel等文件)</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>

import { bussFinishAgain, bussFinishUpdate } from "@/api/center"
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils/index'
import { qmxOnlineUrl } from '@/baseConfig'

export default {
    props: {
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
            // 1 再次成单 2 编辑成单
            type: 1,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {
                resourceType: "",
                vocId: ""
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
                orderformPrice: [
                    { required: true, message: "金额不能为空", trigger: "blur" },
                ],
                resourceType: [
                    { required: true, message: "线索类型不能为空", trigger: "blur" }
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
                ]
            },
            //上传地址
            qmxOnlineUrl: qmxOnlineUrl + 'zuul/api-f/files/upload',
            //正在上传
            isUploading: false,
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

            this.type = tit == '编辑成单' ? 2 : 1

            this.form.counselorId = this.userId

            this.form = obj
            this.disabled = true

            this.open = true

        },
        //级联查出上级的id
        findParentAssId(moId, moArr) {

            let assArr = []

            function findItem(id, arr) {

                for (let item of arr) {
                    if (item.id == id) {
                        assArr.unshift(id)
                        return true
                    }
                    if (item.children && item.children.length) {
                        let findBool = findItem(id, item.children)

                        if (findBool) {
                            assArr.unshift(item.id)
                            return true
                        }
                    }
                }
            }

            findItem(moId, moArr)

            return assArr
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.$refs.uploadBox.clearFiles();
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

                    let str = this.type == 1 ? '成单成功！' : '编辑成功'

                    if (this.type == 2) {

                        bussFinishUpdate(newObj).then(res => {

                            this.msgSuccess(str)
                            this.open = false
                            this.$emit('finish')

                        })

                        return
                    }

                    this.form.dataSoure = 2

                    bussFinishAgain(newObj).then(res => {

                        this.msgSuccess(str)
                        this.open = false
                        this.$emit('finish')

                    })
                }
            });
        },
        //文件上传
        handleRemove(file, fileList) {
            // console.log('删除', file, fileList);
            this.form.orderformContract = ''
        },
        handlePreview(file) {
            // console.log('Preview', file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`文件只能单选上传，请删除后再上传`);
        },

        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            // console.log(111, response)
            this.isUploading = false
            this.form.orderformContract = response.id
        }
    }
};
</script>
<style lang="scss" scoped>
.el-upload__tip {
    line-height: 1;
    color: #999;
}
</style>