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

            if (routeName == 'reject') {
                this.$store.dispatch('getOrgMsg', this.companyId).then(res => {

                    this.lock = res.num <= 0
                    // orgAccount.num
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