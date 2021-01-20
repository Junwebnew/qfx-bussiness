<template>
    <div class="resourse-flag">
        <div class="flag-topright"></div>
        <div class="coin"><span>{{price}}</span>
            <br>星/次
        </div>
    </div>
</template>

<script>
export default {
    props: {
        /*资源类型 1:近日申请,2:异议分析,3:商标续展,4:代理注销,5:商标变更,6:商标驳回,7:商标求购,8:企业白名单,9:送达公告*/
        resourcesModule: {
            type: String | Number
        },
        applicationType: {
            type: String | Number
        }
    },
    data() {
        return {
            ids: [
                { 'person': '13', 'com': '5' }, { 'person': '14', 'com': '6' }, { 'person': '15', 'com': '7' }, { 'person': '16', 'com': '8' },
                { 'person': '17', 'com': '9' }, { 'person': '18', 'com': '10' }, { 'person': '19', 'com': '11' }, { 'person': '20', 'com': '12' },
                { 'person': '22', 'com': '21' }
            ],
            price: ''
        }
    },
    created() {
        this.getPrice()
    },
    methods: {
        //获取扣费
        getPrice() {

            let types = this.ids[this.resourcesModule - 1]

            this.$store.dispatch('getResoursePrice', this.applicationType ? types.com : types.person).then(res => {
                // console.log('0000', res)
                this.price = res.value
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.resourse-flag {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 2;
    .flag-topright {
        width: 0;
        height: 0;
        border-bottom: 70px solid #2d8cf0;
        border-left: 70px solid transparent;
    }
    .coin {
        position: absolute;
        right: 0px;
        bottom: 6px;
        text-align: center;
        width: 42px;
        line-height: 1.2;
        font-size: 12px;
        color: #fff;
        span {
            font-size: 18px;
            font-weight: bold;
        }
        // line-height: 70px;
        // transform: rotate(45deg);
    }
}
</style>