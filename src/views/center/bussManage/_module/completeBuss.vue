<template>
    <el-dialog :title="title" :visible.sync="open" width="400px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="客户名称" prop="customerName">
                        <el-input v-model="customerName" disabled />
                        <!-- <span>{{customerName}}</span> -->
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label="成单金额" prop="orderformPrice">
                        <el-input-number v-model="form.orderformPrice" :min="1" :max="100000000" label="金额"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label="合同上传">
                        <el-upload ref='uploadBox' class="upload-demo" :action="qmxOnlineUrl+'zuul/api-f/files/upload'" :on-exceed="handleExceed" :limit='1' :disabled="isUploading" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleFileSuccess" :data="{'fileSource':'ALIYUN'}">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">(可选，可上传图片、word、excel等文件)</div>
                        </el-upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>

import { bussFinishSuccess } from "@/api/center";
import { qmxOnlineUrl } from '@/utils/baseConfig'

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
            /*oppId:商机ID  orderformContract:成单合同附件ID   orderformPrice:成单价格 */
            open: false,
            title: '恭喜成单',
            qmxOnlineUrl: qmxOnlineUrl,
            customerName: '', //商机名称
            form: { oppId: '', orderformContract: '', orderformPrice: 1 },
            // 表单校验
            rules: {
                orderformPrice: [
                    { required: true, message: "金额不能为空", trigger: "blur" }
                ]
            },
            //正在上传
            isUploading: false,
        }
    },
    methods: {
        show(obj, tit) {

            this.customerName = obj.customerName

            this.form.oppId = obj.id

            this.open = true

        },
        submitFileForm() {

            bussFinishSuccess(this.form).then(res => {

                this.msgSuccess("操作成功");
                this.$emit('finish')
                this.close()
            })

        },
        //关闭
        close() {
            this.$refs.uploadBox.clearFiles();
            this.open = false
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
        },
    }
}
</script>
<style lang="scss" scoped>
.el-upload__tip {
    line-height: 1;
    color: #999;
}
</style>