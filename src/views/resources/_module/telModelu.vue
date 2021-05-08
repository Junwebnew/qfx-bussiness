<template>
    <div>
        <el-table :data="phoneList" row-key="id" class="table" v-loading='loading'>
            <!-- <el-table-column type="index" width="40"></el-table-column> -->
            <el-table-column label="联系方式" prop="phone"></el-table-column>
            <el-table-column label="操作" align='center'>
                <template slot-scope="scope">
                    <div class='operation'>
                        <el-button size="mini" type="text" @click="getResourse(scope.row)">领取</el-button>
                        <el-button size="mini" class="col-green" type="text" @click="getNewNumber(scope.row)">拨打</el-button>
                        <el-button size="mini" v-show='scope.row.businessId' class="col-red" type="text" @click="addMarksFunc(scope.row)">备注</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!-- 新增备注 -->
        <addMarks ref='addMarks' @finish='finish' />
    </div>

</template>

<script>
import { qmxDept } from "@/api/system/dept";
import { receiveResource, getResourcePhoneNumber } from "@/api/resources";
import Global from "@/layout/components/global.js";
import addMarks from "./addMarks";
import { mapGetters } from 'vuex'
export default {
    components: { addMarks },
    props: {
        phoneList: {
            type: Array,
            default: () => []
        },
        /*资源Id*/
        resourceId: {
            type: String | Number
        },
        /*类型不能为空 1：分配 2：领取 3：拨打电话*/
        type: {
            type: String | Number,
            default: 2
        },

        /*资源类型 1:近日申请,2:异议分析,3:商标续展,4:代理注销,5:商标变更,6:疑似驳回,7:企业白名单,8:送达公告,9:到期未续展,10:外部资源的导入*/

        resourcesModule: {
            type: String | Number
        },
    },
    computed: {
        ...mapGetters([
            'mainAccount',
            'companyId'
        ]),
    },
    computed: {
        urlTypeStr() {
            let arr = ['resource/trademark', 'objectionanalysis', 'resource/continues', 'resource/agencyCancel', 'resource/change', 'resource/reject', 'resource/whiteList/', 'notice/arrive/noticeArrive', 'resource/notContinues', 'externalResourceInput']

            return arr[this.resourcesModule - 1]
        },
        resourcesModuleType() {

            let arr = ['1344173032301821954', '1344241701388201986', '1344173049066455042', '1344173216280772609', '1344173201047060482', '1344241701266567170', '1344241701484670977', '1344241701484670978', '1344241701547586666', '外部资源无']
            return arr[this.resourcesModule - 1]
        }
    },
    data() {
        return {
            loading: false,
            /*分配给谁*/
            distributionToUserId: '',
            /*所属业务（1：线索 2：商机）*/
            businessBelong: 2,
        }
    },
    mounted() {
        qmxDetailDept(this.companyId).then(response => {

            this.businessBelong = response.data.receiveClueOppWay == 1 ? 1 : 2

        });
    },
    methods: {
        getResourse(row) {

            this.$confirm('确定是否领取此资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {

                this.formationBussiness(row, (data) => {

                    this.msgSuccess('领取成功')
                    this.$emit('reload', 'all')

                })

            }).catch(error => {
                console.log('4534', error)
            })

        },
        //领取形成商机 ，返回新的商机Id和  msg:1 是线索 2 是商机  
        formationBussiness(row, cb) {

            let that = this
            that.loading = true

            //如果是10 外部资源形成商机

            if (this.resourcesModule == 10) {

                this.$axios.get(this.urlTypeStr + '/receive?id=' + row.id)
                    .then(res => {

                        that.loading = false
                        cb && cb(res)
                    })
                    .catch(res => {
                        that.loading = false
                    })

                return
            }

            //其他资源
            let obj = {
                businessBelong: this.businessBelong,
                distributionToUserId: this.distributionToUserId,
                phoneId: row.id,
                phoneNumber: row.phone,
                resourceId: this.resourceId,
                resourcesModule: this.resourcesModuleType,
                type: this.type
            }

            // console.log(this.urlTypeStr, obj)

            receiveResource(this.urlTypeStr, obj)
                .then(res => {

                    that.loading = false
                    cb && cb(res)
                })
                .catch(res => {
                    that.loading = false
                })
        },
        //获取真实的号码号码
        getNewNumber(row) {


            //坐席号
            let seatNumber = this.$store.state.user.userInfo.seatNumber || ''

            if (!seatNumber && !seatNumber.trim()) {

                this.$confirm('您还未设置自己的坐席号，请联系管理员设置', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    showCancelButton: false,
                    type: "warning"
                }).then(function () { })
                    .catch(msg => {
                        // console.log(11111, msg)
                    })
                return
            }


            let that = this

            this.formationBussiness(row, (data) => {



                that.$set(row, 'businessId', data.data)

                that.$set(row, 'type', data.msg)

                that.$emit('reload')

                that.getRealPhone(row)
                    .then(phone => {


                        that.$set(row, 'phone', phone)

                        Global.$emit("takePhone", phone)

                    })
                    .catch(error => {
                        console.log('错误：', error)
                    })

            })
        },
        //区分是否需要真实的号码 如果是10 外部资源不需要拉取
        getRealPhone(row) {
            return new Promise((resolve) => {

                if (this.resourcesModule == 10) {
                    resolve(row.phone)
                    return
                }
                getResourcePhoneNumber(row.id)
                    .then(res => {
                        // console.log('电话', res.data.phone)
                        resolve(res.data.phone)
                        // let phone = res.data.phone
                    })
            })
        },
        //添加备注
        addMarksFunc(row) {
            // console.log('9999', row)
            this.$refs.addMarks.show(row.businessId, row.type)
        },
        finish() {

        }
    }
}
</script>
<style lang="scss" scoped>
.table {
    // border: 1px solid #dfe6ec;
    // border-bottom: none;
}
</style>