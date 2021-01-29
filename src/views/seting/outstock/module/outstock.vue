<template>
    <div class="con" id='box'>
        <h1>{{title}}</h1>
        <el-row>
            <el-col :lg="12" :sm="24" :xs="24">
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
        }
    },
    data() {
        return {
            num: 1,
            form: {
                value: true
            }
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ]),
        title() {
            return this.outType == 1 ? '线索掉库设置' : '商机掉库设置'
        }
    },
    methods: {
        submit(type) {

            const loading = this.$loading({
                lock: true,
                target: '#box'
            });


            Promise.all([
                outOfStockSet({ code: 'days_not_followed_up', value: this.num, type: this.outType }),
                outOfStockSet({ code: 'no_follow_up_reminder', value: this.form.value ? 1 : 2, remindContent: this.form.remindContent, type: this.outType })
            ])
                .then(res => {
                    this.msgSuccess('更新成功')
                    loading.close();
                })
                .catch(res => {
                    loading.close();
                })
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
    width: 400px;
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
</style>