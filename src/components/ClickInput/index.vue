<!-- @author Shiyn/   huangmx 20200807优化-->
<template>
    <!-- <el-button :icon="showSwitch ?   'el-icon-arrow-up' : 'el-icon-arrow-down' " size="small" type="text" @click="toggleSearch()">{{showSwitch ? '收起' : '展开' }}</el-button> -->

    <div class="iptBox" v-on="$listeners">
        <div class="hoverBox">
            <span>{{iptValue}}</span>
        </div>
        <div class="clear-icon" @click.stop="clearValue">
            <i v-show='iptValue' class="el-icon-circle-close del" title="清空"></i>
        </div>
    </div>
</template>
<script>
export default {
    name: "ClickInput",
    data() {
        return {};
    },
    props: {
        iptValue: {
            type: String | Number,
            value: '',
        }
    },
    methods: {
        //切换
        toggleSearch() {
            this.$emit("update:showSwitch", !this.showSwitch);
        },
        clearValue() {
            // console.log(1111)
            this.$emit("update:iptValue", '');
        }
    },
};
</script>
<style scoped>
.iptBox {
    position: relative;
    -webkit-appearance: none;
    background-color: #ffffff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    min-height: 34px;
    line-height: 32px;
    outline: none;
    padding: 0 24px 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    cursor: pointer;
}
.hoverBox {
    width: 100%;
    height: 100%;
}
.clear-icon {
    position: absolute;
    z-index: 2;
    height: 100%;
    right: 5px;
    top: 0;
    text-align: center;
    color: #c0c4cc;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    cursor: pointer;
    display: none;
}
.iptBox:hover .clear-icon {
    display: block;
}
</style>
