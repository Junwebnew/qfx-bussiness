<template>
    <div class="app-container">
        <div class="content back-fff">
            <div class="l navBox">
                <div class="item" :class="{'active':active == 0}" @click="active = 0">
                    <span>线索掉库设置</span>
                </div>
                <div class="item" :class="{'active':active == 1}" @click="active = 1">
                    <span>商机掉库设置</span>
                </div>
            </div>
            <div class="r">
                <outstock :outType='active == 1 ? 2 : 1' />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

import outstock from './module/outstock'
export default {
    components: { outstock },
    data() {
        return {
            active: 0
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId',
            'mainAccount'
        ])
    },
    created() {
        // this.initList('n1', () => {
        //     this.initList('n2')
        // })
    },
    methods: {


    }
}
</script>
<style lang="scss" scoped>
.content {
    min-height: 500px;
    overflow: hidden;
    display: flex;
    padding: 10px 0;
    .l {
        width: 224px;
        border-right: 1px solid #f0f0f0;
        font-size: 14px;
        min-height: 200px;
        .item {
            height: 40px;
            line-height: 40px;
            margin: 8px 0;
            border-right: 3px solid #fff;
            padding-left: 24px;
            cursor: pointer;
            &.active {
                background-color: #e6f7ff;
                font-weight: 700;
                border-color: #1890ff;
                color: #1890ff;
            }
        }
    }
    .r {
        flex: 1;
        padding: 8px 40px;
    }
}
</style>