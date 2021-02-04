<template>
    <div class="con" id='box'>
        <h1>{{title}}掉库设置</h1>
        <el-row>
            <el-col :lg="24" :sm="24" :xs="24">
                <div class="box">
                    <!-- <h2>配置天数</h2> -->
                    <div class="form">

                        <el-form ref="form" :label-position="'top'" label-width="130px">
                            <el-form-item :label="form.value ? '开启通知' : '关闭通知' ">
                                <el-switch v-model="form.value" active-color="#13ce66">
                                </el-switch>
                            </el-form-item>

                            <el-form-item label="天数设置" prop="corpsecret">
                                <el-input-number v-model="num" :min="1" :max="100" size='mini' label="描述文字"></el-input-number> / 天
                                <p class="tips">说明：系统间隔 <span> XX </span>天<span>{{title}}资源</span>没有添加最新备注内容，{{title}}资源将自动掉库： <span>资源池 -> 掉库资源池 -> {{title}}掉库池</span> </p>
                            </el-form-item>

                            <!-- <el-form-item label="提醒内容" prop="corpsecret">
                                <el-input type='textarea' v-model="form.remindContent" :disabled='!form.value ' />
                            </el-form-item> -->
                        </el-form>
                    </div>
                    <div class="text-left">
                        <el-button type="primary" size="mini" @click="submit">更新</el-button>
                    </div>
                </div>
            </el-col>

            <!-- <el-col :lg="12" :sm="24" :xs="24" class="left">
                <div class="box">
                    <h2>是否开启通知</h2>
                    <div class="form">
                        <el-form ref="form" :model="form" label-width="80px">
                            
                        </el-form>
                    </div>
                    <div class="text-right">
                        <el-button type="primary" size="mini" @click="submit(2)">更新</el-button>
                    </div>
                </div>

            </el-col> -->
        </el-row>
    </div>
</template>

<script>
import { outOfStockSet } from '@/api/system/set.js'
import { mapGetters } from 'vuex'

export default {
    props: {
        outType: {
            type: String | Number
        },

    },
    data() {
        return {
            num: 1,
            form: {
                value: true
            },
            openId: '',
            daysId: ''
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ]),
        title() {
            return this.outType == 1 ? '线索' : '商机'
        }
    },
    methods: {
        initDate(dataObj) {

            this.num = dataObj.days
            this.form.value = dataObj.isOpen
            this.openId = dataObj.openId
            this.daysId = dataObj.daysId
        },
        submit(type) {

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });

            //通知开通 1是开通，2是关闭

            Promise.all([
                outOfStockSet({ id: this.daysId, code: 'days_not_followed_up', value: this.num, type: this.outType }),
                outOfStockSet({ id: this.openId, code: 'no_follow_up_reminder', value: this.form.value ? 1 : 2, remindContent: this.form.remindContent, type: this.outType })
            ])
                .then(res => {
                    this.reset()
                    this.msgSuccess('更新成功')
                    loading.close();
                    this.$emit('finish')
                })
                .catch(res => {
                    loading.close();
                })
        },
        reset() {
            // this.num = 1
            // this.form = {
            //     value: true
            // }
        }
    }
}
</script>
<style lang="scss" scoped>
h1 {
    margin: 0 0 12px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 28px;
}
.left {
    border-left: 1px solid #f0f0f0;
}
.box {
    // width: 400px;
    h2 {
        margin: 0 0 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 14px;
        line-height: 28px;
    }
    .form {
        margin: 30px 0;
        min-height: 120px;
    }
}
.tips {
    line-height: 1.5;
    color: #999;
    margin-top: 15px;
    span {
        color: #000;
    }
}
</style>