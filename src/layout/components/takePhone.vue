<template>
    <div class="box" @click.stop>
        <div class="takePhone" @click=" phoneShow = !phoneShow">
            <img src="../../assets/images/phone.png" alt="" srcset="">
        </div>
        <transition name="sidebarLogoFade">
            <div class="phoneBox" v-show="phoneShow">
                <span class="el-icon-close close" @click=" phoneShow = false"></span>
                <div class="tit">拨打电话</div>
                <div class="iptBox">
                    <input type="text" v-model="telNum" maxlength="11">
                    <span class="el-icon-circle-close iptclose" v-show="telNum" @click="delOne"></span>
                </div>
                <ul class="numBox">
                    <li class="btn" v-for="(item,idx) in numArr" :key='idx' @click="dialNum(item)">{{item}}</li>
                </ul>
                <div class="btnBox">
                    <div class="btn button" @click="isConnection = true">拨打</div>
                </div>

                <div class="loadingBox" v-show='isConnection'>
                    <div class="topBox">
                        <div class="icon_loading">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <p class="text-center" v-show='connectioning === 0'>接通中...</p>
                        <p class="text-center col-green" v-show='connectioning === 1'>{{connentTime}}</p>
                        <p class="text-center col-red" v-show='connectioning === 2'>未接通</p>
                    </div>

                    <!-- <p>{{connentTime}}</p> -->
                    <div class="btnBox">
                        <div class="btn button hangup" @click="isConnection = false">挂断</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDate } from '@/utils/index'
export default {
    components: {
    },
    computed: {
        ...mapGetters([
            'device',
        ]),
    },
    data() {
        return {
            phoneShow: false,
            numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'],
            telNum: '',
            isConnection: false, //是否拨打
            //连接中
            connectioning: 0, //0 正在连接 1 接通 2 未接通
            connentTime: 'XXXX'
        }
    },
    mounted() {
        // this.connentTime = formatDate(11298765, true).dayTime

        let old = new Date().getTime()

        // this.connentTime = formatDate(old, true).dayTime

        // setInterval(() => {
        //     let last = new Date().getTime() - old

        //     this.connentTime = formatDate(last, true).dayTime

        // }, 1000)
    },
    methods: {
        delOne() {
            this.telNum = this.telNum.substr(0, this.telNum.length - 1)
        },
        dialNum(num) {

            if (this.telNum.length < 11) {
                this.telNum += num
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
    transition: opacity 0.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
    opacity: 0;
}
.box {
    display: inline-block;
    vertical-align: top;
}
.takePhone {
    display: inline-block;
    margin-top: -2px;
    cursor: pointer;
    img {
        width: 36px;
    }
}
.phoneBox {
    position: fixed;
    left: 50%;
    top: 20px;
    z-index: 100;
    border-radius: 6px;
    background-color: #272b31;
    width: 240px;
    height: 360px;
    overflow: hidden;
    .close {
        position: absolute;
        right: 10px;
        height: 40px;
        line-height: 40px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    }
    .tit {
        height: 40px;
        line-height: 40px;
        background-color: #3a3e44;
        color: #ffffff;
        padding: 0 20px;
    }
    .iptBox {
        height: 40px;
        padding-top: 10px;
        position: relative;
        input {
            border: none;
            background-color: transparent;
            width: 100%;
            padding: 0 20px;
            color: #ffffff;
            font-size: 28px;
            outline: none;
        }
        .iptclose {
            position: absolute;
            cursor: pointer;
            right: 10px;
            top: 16px;
            color: #f1f1f1;
            font-size: 16px;
        }
    }
    .numBox {
        text-align: center;
        margin-top: 10px;
        li {
            overflow: hidden;
            display: inline-block;
            vertical-align: top;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            text-align: center;
            line-height: 42px;
            color: #ffffff;
            background-color: #040404;
            margin: 2px 12px;
            font-size: 26px;
            cursor: pointer;
        }
    }
}

.btn:after {
    background-color: #1579fa;
    content: " ";
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
}
.btn:active:after {
    opacity: 0.3;
}
.btnBox {
    text-align: center;
    padding-top: 6px;
    div {
        overflow: hidden;
        display: inline-block;
        cursor: pointer;
        width: 46px;
        height: 46px;
        border-radius: 50%;
        text-align: center;
        line-height: 46px;
        background-color: #19be6b;
    }
    .hangup {
        background-color: #ff0000;
    }
}
//loading层
.loadingBox {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 11;
    background: rgba(0, 0, 0, 0.5);
    padding-top: 80px;
    color: #fff;
}
.topBox {
    height: 195px;
}
.icon_loading {
    width: 48px;
    height: 30px;
    margin: 15px auto 15px;
}

.icon_loading span {
    display: inline-block;
    width: 4px;
    height: 100%;
    border-radius: 4px;
    background: #84d8ff;
    animation: load 1s ease infinite;
    -webkit-animation: load 1s ease infinite;
    margin: 0 2px;
}

@-webkit-keyframes load {
    0%,
    100% {
        height: 20px;
        background: #84d8ff;
    }
    50% {
        height: 50px;
        margin: -15px 2px;
        background: #44a0f2;
    }
}
@keyframes load {
    0%,
    100% {
        height: 20px;
        background: #84d8ff;
    }
    50% {
        height: 50px;
        margin: -15px 2px;
        background: #44a0f2;
    }
}

.icon_loading span:nth-child(2) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.icon_loading span:nth-child(3) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.icon_loading span:nth-child(4) {
    -webkit-animation-delay: 0.6s;
    animation-delay: 0.6s;
}

.icon_loading span:nth-child(5) {
    -webkit-animation-delay: 0.8s;
    animation-delay: 0.8s;
}
.icon_loading span:nth-child(6) {
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
}
</style>
