<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
    <div class="top-right-btn">
        <el-row>
            <el-button size="mini" type="primary" plain :icon=" showSwitch ? 'el-icon-upload2' : 'el-icon-download' " @click="toggleSearch()">{{ showSwitch ? '收起' : '展开' }} </el-button>
        </el-row>
    </div>
</template>
<script>
export default {
    name: "SwitchSHowBtn",
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
