<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
    <div class="top-right-btn">
        <el-row>
            <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
                <el-button size="mini" circle icon="el-icon-search" :class="{showSearch:!showSearch}" @click="toggleSearch()" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
                <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
            </el-tooltip>
        </el-row>
    </div>
</template>
<script>
export default {
    name: "RightToolbar",
    data() {
        return {};
    },
    props: {
        showSearch: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {

    },
    methods: {
        //搜索
        toggleSearch() {
            this.$emit("update:showSearch", !this.showSearch);
        },
        //刷新
        refresh() {
            this.$emit("queryTable");
        },
    },
};
</script>
<style lang="scss" scoped>
.showSearch {
    color: #1890ff;
    border-color: #badeff;
    background-color: #e8f4ff;
}
</style>
