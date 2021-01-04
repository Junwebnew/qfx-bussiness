<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
    <el-button :icon="showSwitch ?   'el-icon-arrow-up' : 'el-icon-arrow-down' " size="small" type="text" @click="toggleSearch()">{{showSwitch ? '收起' : '展开' }}</el-button>
</template>
<script>
export default {
    name: "SwitchForm",
    data() {
        return {};
    },
    props: {
        showSwitch: {
            type: Boolean,
            default: true,
        },
    },

    methods: {
        //切换
        toggleSearch() {
            this.$emit("update:showSwitch", !this.showSwitch);
        }
    },
};
</script>
