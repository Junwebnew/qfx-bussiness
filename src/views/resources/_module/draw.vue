<template>
    <el-drawer :title="title" :visible.sync="drawer" :direction="direction" :size='size' style="overflow:auto" @close='closeDraw' :append-to-body="true">
        <div class="backcolor">
            <slot></slot>
        </div>
    </el-drawer>
</template>
<script>
export default {
    data() {
        return {
            drawer: false,
            title: "详情",
            direction: "rtl",
            size: "1100px"
        }
    },
    methods: {
        openDraw(obj = {}) {
            this.drawer = true

            obj.title && (this.title = obj.title)
            obj.direction && (this.direction = obj.direction)
            obj.size && (this.size = obj.size)
        },
        closeDraw() {
            this.$emit('close')
        }
    },
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer {
    background-color: #edf0f4;
    .el-drawer__header {
        padding: 15px 20px;
        margin-bottom: 10px;
        background-color: #ffffff;
        span {
            font-size: 18px;
            color: #000;
        }
    }
}
</style>