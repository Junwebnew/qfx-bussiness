<template>
    <div class="app-container">
        <p class="tips">内测中...,敬请期待！</p>
    </div>
</template>

<script>
import { objectionAnalysisList } from "@/api/resources";
import { noticeNumList } from "@/api";
export default {

    data() {
        return {
            //显示搜索框
            showSearch: true,
            //显示loading
            loading: false,
            //数据列表 
            tableData: [],
            //总数
            total: 0,
            // 日期范围
            dateRange: [],
            //搜索条件 
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasPhone: true,
                preliNoticeTrademarkName: undefined,
                preliNoticeApplicationNameCn: undefined,
                preliNoticeApplicationDddrCn: undefined,
                preliNoticeAgencyName: undefined,
                preliNoticeAgencyNameDddrCn: undefined,
            },
            //初始时间
            initDate: [],
            //申请人类型
            aplicationTypeArr: [
                { name: '企业', value: "0" },
                { name: '个人', value: "1" }
            ],
            noticeNUm: [], //************* */
            activeNum: 0, //第多少期
        }
    },
    created() {

    },
    mounted() {

        // this.initNoticeNum()
    },
    methods: {


    },
    beforeDestroy() {
    }
}
</script>
<style lang="scss" scoped>
.tips {
    text-align: center;
    margin-top: 200px;
    font-size: 22px;
}
</style>