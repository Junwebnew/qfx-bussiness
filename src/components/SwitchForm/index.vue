<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
    <el-button size="mini" :icon=" showSwitch ? 'el-icon-upload2' : 'el-icon-download' " @click="toggleSearch()"></el-button>
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
