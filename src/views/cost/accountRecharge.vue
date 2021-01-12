<template>
    <div class="app-container">
        <div class="back-fff full-height pad20" id='content'>

            <div class="formBox" v-if='active == 1'>
                <!-- <el-steps :active="active" align-center simple>
                    <el-step title="填写信息" icon="el-icon-edit"></el-step>
                    <el-step title="充值完成" icon="el-icon-circle-check"></el-step>
                </el-steps> -->
                <p class="tit">公司账号充值</p>
                <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent label-width="100px">
                    <el-form-item label="公司名称:" prop="name" class="el-form-item-j">
                        <el-input v-model="form.name" placeholder="请输入部门名称" maxLength='100' style="width:%" clearable size="small" disabled />
                    </el-form-item>
                    <el-form-item label="充值金额:" prop="money" class="el-form-item-j">
                        <el-input-number style="width:100%;" v-model="form.money" :min="1" :max="100000000" label="金额"></el-input-number>
                    </el-form-item>
                    <el-form-item label="充值备注:" prop="remark" class="el-form-item-j">
                        <el-input v-model="form.remark" type='textarea' placeholder="..." maxLength='250' style="width:100%" clearable size="small" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" @click="rechargeAcc">充值</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="successBox" v-if='active == 2'>
                <div class="icon">
                    <i class="el-icon-success"></i>
                </div>
                <p class="h2">充值成功</p>
                <p class="mini">提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。</p>
                <div class="mxbox">
                    <el-button type="primary" size="mini" @click="goListDetail">查看明细</el-button>
                </div>
            </div>
            <div class="tipsBox">
                <p class="info">说明</p>
                <p>转账到支付宝账户</p>
                <p>
                    如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
                </p>

            </div>
        </div>
    </div>
</template>

<script>
import { qmxCompanyList, qmxDetailDept } from "@/api/system/dept";
import { rechargeAccount } from "@/api/account";
import { deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'

export default {
    name: "Dept",
    components: {},
    data() {
        return {
            //步骤
            active: 1,
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            //列表数据
            deptList: [],
            // 查询参数
            form: {
                name: undefined,
                orgId: '',
                commonStatus: undefined,
                money: 1000
            },
            rules: {
                name: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                money: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            }
        };
    },
    computed: {
        ...mapGetters([
            'superAdmin'
        ])
    },
    created() {
        let optId = this.$route.query.id

        //列表跳转过来
        if (optId) {
            qmxDetailDept(optId).then(res => {
                this.form.name = res.data.name
                this.form.orgId = optId
            })
        }
        //获取当前用户的
        else {
            this.$store.dispatch('getUserOrgAndDep').then(res => {
                this.form.name = res.orgName
                this.form.orgId = res.orgId
            })
        }

        this.active = 1
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            this.loading = true;

            qmxCompanyList().then(res => {
                this.deptList = res.data
                this.loading = false;
            })
        },
        rechargeAcc() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const loading = this.$loading({
                        target: "#content"
                    });

                    rechargeAccount(this.form).then(res => {
                        // console.log('充值成功', res)
                        this.active = 2
                        loading.close()
                    })
                        .catch(res => {
                            console.log('失败信息', res)
                            loading.close()
                        })
                }
            })

        },
        goListDetail() {
            this.$router.push('/cost/accountRechargeList?id=' + this.form.orgId)
        },
    }
};
</script>
<style lang="scss" scoped>
.tit {
    padding: 50px 0 40px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
}
.formBox {
    width: 500px;
    margin: 0px auto 40px;
    .el-form-item-j {
        margin-bottom: 24px;
    }
}
.tipsBox {
    padding: 30px 10px 0;
    border-top: 1px solid #f0f0f0;
    color: rgba(0, 0, 0, 0.45);
    p {
        margin: 0 0 4px;
        font-size: 14px;
        line-height: 22px;
    }
    .info {
        margin: 0 0 12px;
        font-size: 16px;
        line-height: 32px;
    }
}
.successBox {
    padding: 10px 10px;
    margin-bottom: 24px;
    text-align: center;

    .icon {
        color: #52c41a;
        font-size: 80px;
    }
    .h2 {
        font-size: 24px;
        line-height: 1.8;
    }
    .mini {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 1.6;
    }
    .mxbox {
        margin-top: 20px;
    }
}
</style>