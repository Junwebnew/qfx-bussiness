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
import { receiveResource } from "@/api/resources";
import Global from "@/layout/components/global.js";
import addMarks from "./addMarks";
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

        /*所属业务（1：线索 2：商机）*/
        businessBelong: {
            type: String | Number,
            default: 1
        },
        /*类型不能为空 1：分配 2：领取 3：拨打电话*/
        type: {
            type: String | Number,
            default: 2
        },

        /*资源类型 1:近日申请,2:异议分析,3:商标续展,4:代理注销,5:商标变更,6:疑似驳回,7:企业白名单,8:送达公告,9:到期未续展*/

        resourcesModule: {
            type: String | Number
        },
    },
    computed: {
        urlTypeStr() {
            let arr = ['resource/trademark', 'objectionanalysis', 'resource/continues', 'resource/agencyCancel', 'resource/change', 'resource/reject', 'resource/whiteList/', 'notice/arrive/noticeArrive', 'resource/notContinues']

            return arr[this.resourcesModule - 1]
        },
        resourcesModuleType() {

            let arr = ['1344173032301821954', '1344241701388201986', '1344173049066455042', '1344173216280772609', '1344173201047060482', '1344241701266567170', '1344241701484670977', '1344241701484670978', '1344241701547586666']
            return arr[this.resourcesModule - 1]
        }
    },
    data() {
        return {
            loading: false,
            /*分配给谁*/
            distributionToUserId: '',
        }
    },
    methods: {
        getResourse(row) {

            let that = this
            this.$confirm('确定是否领取此资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {

                that.loading = true

                let obj = {
                    businessBelong: this.businessBelong,
                    distributionToUserId: this.distributionToUserId,
                    phoneId: row.id,
                    phoneNumber: row.phone,
                    resourceId: this.resourceId,
                    resourcesModule: this.resourcesModuleType,
                    type: this.type
                }

                console.log(this.urlTypeStr, obj)

                receiveResource(this.urlTypeStr, obj)
                    .then(res => {

                        this.msgSuccess('领取成功')

                        that.loading = false

                        that.$emit('reload')
                    })
                    .catch(res => {
                        that.loading = false
                    })

            }).catch(error => {
                console.log('4534', error)
            })

        },
        //获取真实的号码，返回新的商机Id和号码
        getNewNumber(json) {
            Global.$emit("takePhone");
            setTimeout(() => {
                this.$set(json, 'businessId', '85563423523235234')
            }, 1000)
        },
        //添加备注
        addMarksFunc(json) {
            console.log('9999', json.businessId)
            this.$refs.addMarks.show({})
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