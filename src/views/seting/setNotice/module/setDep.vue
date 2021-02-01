<template>
    <div class="con">
        <div class="box">
            <h2>企业微信设置</h2>
            <div class="form">
                <el-form ref="form" :model="dept" :rules="rules" :label-position="'top'" label-width="130px">
                    <el-form-item label="微信应用ID" prop="agentid">
                        <el-input v-model="dept.agentid" maxlength='100' />
                    </el-form-item>
                    <el-form-item label="微信公司ID" prop="corpid">
                        <el-input v-model="dept.corpid" maxlength='100' />
                    </el-form-item>
                    <el-form-item label="企业微信密钥" prop="corpsecret">
                        <el-input v-model="dept.corpsecret" maxlength='100' />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click="submit">更新</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="imgBox">
            <el-image style="width: 80%" :src="imgs[0]" :preview-src-list="imgs">
            </el-image>
        </div>

    </div>
</template>

<script>
import { qmxdDeptMsgSet, getQmxdDeptMsgSet } from '@/api/system/dept.js'
import { mapGetters } from 'vuex'

export default {
    name: 'personSet',
    data() {
        return {
            dept: {
                agentid: "",
                corpid: "",
                corpsecret: ""
            },
            rules: {
                agentid: [
                    { required: true, message: "企业微信应用ID不能为空", trigger: "blur" }
                ],
                corpid: [
                    { required: true, message: "企业微信公司ID不能为空", trigger: "blur" }
                ],
                corpsecret: [
                    { required: true, message: "企业微信公司密钥不能为空", trigger: "blur" }
                ]
            },
            imgs: [require("@/assets/images/dept.png")]
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'companyId',
            'userId'
        ])
    },
    created() {
        this.dept.userId = this.userId
        this.dept.companyId = this.companyId


    },
    methods: {
        initPage() {
            getQmxdDeptMsgSet(this.companyId).then(res => {

                if (res.data.id) {
                    this.dept = res.data
                }

            })
        },
        submit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    qmxdDeptMsgSet(this.dept).then(res => {
                        this.msgSuccess('更新成功')
                        this.initPage()
                    })
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.con {
    display: flex;
}
.box {
    width: 400px;
    h2 {
        margin: 0 0 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        line-height: 28px;
    }
    .form {
        margin: 30px 0;
    }
}
.imgBox {
    flex: 1;
    padding: 0 30px;
    text-align: center;
}
</style>