<template>
    <div class="app-container">
        <div class="back-fff full-height pad20" id='content'>
            <div class="formBox">
                <p class="tit">发布消息</p>
                <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent label-width="90px">

                    <el-form-item label="消息标题:" prop="name" class="el-form-item-j">
                        <div class="iptBox">
                            <el-input v-model="form.name" placeholder="请输入标题" maxLength='100' style="width:%" clearable />
                        </div>
                    </el-form-item>

                    <el-form-item label="消息类型:" prop="type" class="el-form-item-j">
                        <div class="iptBox">
                            <el-select v-model="form.type" clearable style="width: 100%">
                                <el-option v-for="dict in messageType" :key="dict.value" :label="dict.name" :value="dict.value" />
                            </el-select>
                        </div>

                    </el-form-item>

                    <el-form-item label="公司名称:" prop="orgId">
                        <div class="iptBox">
                            <el-select v-model="form.orgId" size="small" multiple clearable filterable placeholder="请选择" @keyup.enter.native="handleQuery" style="width:100%">
                                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>

                    <el-form-item label="消息内容:" prop="content" class="el-form-item-j">
                        <editor v-model="form.noticeContent" :min-height="192" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="mini" v-hasPermi="['recharge']" @click="rechargeAcc">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import { qmxCompanyList } from "@/api/system/dept";
import { deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'
import Editor from '@/components/Editor';

export default {
    name: "Dept",
    components: {
        Editor
    },
    data() {
        return {
            messageType: [{ name: "通知", value: 0 }, { name: "公告", value: 1 }, { name: "站内信", value: 2 }],
            deptList: [],
            form: {
                name: undefined,
                orgId: '',
                commonStatus: undefined,
                money: 1
            },
            rules: {
                name: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                type: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                content: [
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
        this.getList()
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            qmxCompanyList().then(res => {
                this.deptList = res.data
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
    max-width: 900px;
    margin: 0px auto 40px;
    .el-form-item-j {
        margin-bottom: 24px;
    }
}
.iptBox {
    max-width: 400px;
}
</style>