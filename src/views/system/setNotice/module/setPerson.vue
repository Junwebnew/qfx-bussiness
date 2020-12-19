<template>
    <div class="con">
        <div class="box">
            <h2>个人企业微信号设置</h2>
            <div class="form">
                <el-form ref="form" :model="user" :rules="rules" :label-position="'top'" label-width="130px">
                    <el-form-item label="企业微信号" prop="enterpriseMicroSignal">
                        <el-input v-model="user.enterpriseMicroSignal" />
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

import { qmxUserUpdate } from "@/api/system/user";
import { mapGetters } from 'vuex'
export default {
    name: 'personSet',
    data() {
        return {
            user: {},
            rules: {
                enterpriseMicroSignal: [
                    { required: true, message: "个人微信号不能为空", trigger: "blur" }
                ]
            },
            imgs: [require("@/assets/images/person.png")]
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    created() {
        this.user.id = this.userId
    },
    methods: {
        submit() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    qmxUserUpdate(this.user).then(res => {
                        this.msgSuccess('更新成功')
                    })
                }
            })
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