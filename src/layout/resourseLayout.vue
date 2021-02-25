<template>
    <section class="resourseLayout">
        <Layout />
        <div class="isLock" v-if="lock">
            <div class="msgBox">
                <img src="../assets/images/lock-b.png" alt="加锁">
                <p class="msg">此资源为扣次资源，如需查看，请联系商务人员！</p>
            </div>
        </div>
    </section>
</template>
<script>
import Layout from "./index";
import { mapGetters } from 'vuex'
import { resourseConfig } from '@/utils/baseConfig'
export default {
    name: 'resourseLayout',
    components: { Layout },
    computed: {
        ...mapGetters([
            'companyId'
        ]),
    },
    data() {
        return {
            lock: false
        }
    },
    watch: {
        $route(now, befor) {

            this.isShowData(now.name)
        }
    },
    mounted() {
        this.isShowData(this.$route.name)
    },
    methods: {
        isShowData(routeName) {

            this.lock = false

            // console.log('key', routeName)
            let arr = resourseConfig.filter(i => i.key == routeName)

            if (arr.length) {

                //判断用户有没有次数
                this.$store.dispatch('getOrgMsg', this.companyId).then(res => {

                    if (res.num > 0) {
                        this.lock = false
                        return
                    }

                    this.$store.dispatch('getYearResourse').then(res => {

                        let arr2 = res.filter(i => i.id == arr[0].id)
                        //获取到相对应的资源，并且是false
                        if (arr2.length && !arr2[0].supportYearPay) {

                            this.lock = true
                        }
                    })
                })

            }


        }
    },
}
</script>
<style lang="scss" scoped>
.isLock {
    position: fixed;
    left: 0;
    top: 92px;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: rgba(255, 255, 255, 1);
    text-align: center;
    .msgBox {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        .msg {
            margin-top: 20px;
        }
    }
}
</style>