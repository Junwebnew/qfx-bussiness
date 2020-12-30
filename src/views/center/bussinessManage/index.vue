<template>
    <div class="app-container">
        <h1>商机管理</h1>
    </div>
</template>

<script>

export default {

    data() {
        return {
            userList: []
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

        getList() {   //获取table表单的数据**************************************

            this.loading = true;
            clueMyList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {

                this.tableData = response.data;
                this.total = response.total;
                this.loading = false;
            })
        },
        formatterStatus(row) {

            let item = this.clueStatueArr.filter(i => i.code == row.followStatus)[0]

            return (item && item.name) || row.followStatus
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        //重置表单
        resetQuery() {
            this.dateRange = []
            this.resetForm("queryForm");
            this.handleQuery();
        },
        checkDetail(obj) {

            let key = this.$route.name + obj.id

            this.$router.push('/center/clue/detail?id=' + obj.id)
        },
        //新增线索
        handleAdd() {
            this.$refs.clubModule.showFunc({}, '新增线索')
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.$refs.clubModule.showFunc({}, '修改线索')
        },
        /** 删除按钮操作 */
        // handleDelete(row) {
        //     const ids = row.id
        //     this.$confirm('是否删除客户"' + row.customerName + '"的线索?', "警告", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning"
        //     }).then(function () {
        //         return clueDel([ids]);
        //     }).then(() => {
        //         this.getList();
        //         this.msgSuccess("删除成功");
        //     })
        // },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
        },
        //分配
        handleDistribution(obj) {
            let tit = '线索批量分配'
            if (obj) {
                this.ids = [obj.id]
                tit = obj.customerName + "线索分配"
            }
            this.$refs.distribution.show({}, tit)
        }
    },
    beforeDestroy() {
    }
}


</script>