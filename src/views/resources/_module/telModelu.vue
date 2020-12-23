<template>
    <el-table :data="phoneList" row-key="id" class="table" v-loading='loading'>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="联系方式" prop="phone"></el-table-column>
        <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
                <div class='operation'>
                    <el-button size="mini" type="text" @click="getResourse(scope.row)">领取</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { changeDetail } from "@/api/resources";

export default {
    props: {
        phoneList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            loading: false
        }
    },
    methods: {
        getResourse(row) {

            let that = this
            this.$confirm('确定是否领取此资源?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {

                that.loading = true
                setTimeout(() => {
                    that.loading = false
                }, 2000);

            }).catch(response => {
                console.log('4534', response)
            })

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