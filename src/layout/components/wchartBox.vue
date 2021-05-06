<template>

    <el-popover placement="bottom-end" trigger="click" @show='initWxCode'>
        <div class="showBox">
            <p class="t">关注获取站内实时信息</p>
            <div class="messBox" id='box'>
                <img :src="wxImg" alt="" sizes="" srcset="">
            </div>
            <p>微信扫码关注权发现公众号</p>
        </div>
        <div class="item-num" slot="reference">
            <svg-icon icon-class='gongzhonghao' />
        </div>
    </el-popover>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'msbBox',

    data() {
        return {
            wxImg: undefined
        }
    },
    computed: {
        ...mapGetters([
            'organizationId',
            'userId'
        ])
    },
    mounted() {


    },
    methods: {
        initWxCode(bool) {

            // if (wxImg) return

            let loading = this.$eleLoading('#box')

            this.$axios.get('wechat/join/createQrcode?userId=' + this.userId)
                .then(res => {
                    console.log('99999', res)
                    this.wxImg = res.data.qrcodeUrl

                    loading.close()
                })
                .catch(() => {
                    loading.close()
                })

        }
    }
}
</script>
<style lang="scss" scoped>
.item-num {
    font-size: 28px;
    vertical-align: inherit;
    color: #5ac724;
}
.showBox {
    text-align: center;
    font-size: 12px;
    .t {
        color: #333;
        padding: 6px;
        font-size: 13px;
        font-weight: bold;
    }
}
.messBox {
    width: 200px;
    height: 200px;
    border: 1px solid #f1f1f1;
    margin-bottom: 5px;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>