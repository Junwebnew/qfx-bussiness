<template>
    <div class="app-container">
        <div class="content back-fff full-height">
            <div class="l navBox">
                <div class="item" :class="{'active':active == 0}" @click="active = 0">
                    <span>公告数据</span>
                </div>
            </div>
            <div class="r">
                <div class="box">
                    <h2>公告数据清洗</h2>
                    <div class="form">
                        <el-form ref="form" :model="form" :rules="rules" :label-position="'top'" label-width="130px">
                            <el-form-item label="公告期号" prop="noticeNum">
                                <el-input v-model="form.noticeNum" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini" @click="submitClean">开始清洗</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { clearNoticeData } from '@/api/system/set.js'
export default {
    components: {},
    data() {
        return {
            active: 0,
            form: {},
            rules: {
                noticeNum: [
                    { required: true, message: "请输入期号", trigger: "blur" }
                ]
            },
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId',
            'mainAccount'
        ])
    },
    created() {

    },
    methods: {
        submitClean() {

            this.$refs["form"].validate(valid => {
                if (valid) {
                    clearNoticeData(this.form.noticeNum).then(res => {
                        this.msgSuccess('设置清洗成功！')
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    overflow: hidden;
    display: flex;
    padding: 10px 0;
    .l {
        width: 224px;
        border-right: 1px solid #f0f0f0;
        font-size: 14px;
        min-height: 200px;
        .item {
            height: 40px;
            line-height: 40px;
            margin: 8px 0;
            border-right: 3px solid #fff;
            padding-left: 24px;
            cursor: pointer;
            &.active {
                background-color: #e6f7ff;
                font-weight: 700;
                border-color: #1890ff;
                color: #1890ff;
            }
        }
    }
    .r {
        flex: 1;
        padding: 8px 40px;
    }
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
</style>