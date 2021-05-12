<template>

    <transition name="sidebarLogoFade">

        <div class="phoneBox" v-show="phoneShow" v-drag>
            <span class="el-icon-close close" @click=" phoneShow = false"></span>
            <div class="tit"> 拨打电话 <span class="status" :class="{'green':status}"></span></div>
            <div class="iptBox">
                <input type="text" v-model="telNum" maxlength="11">
                <span class="iptclose claearOne" v-show="telNum" @click="delOne"></span>
                <span class="el-icon-circle-close iptclose" v-show="telNum" @click="clearNum"></span>
            </div>
            <ul class="numBox">
                <li class="btn" v-for="(item,idx) in numArr" :key='idx' @click="dialNum(item)">{{item}}</li>
            </ul>
            <div class="btnBox">
                <div class="btn button" @click="ringout">拨打</div>
            </div>

            <div class="loadingBox" v-show='isConnection'>
                <div class="topBox">
                    <div class="icon_loading" v-show="showWave">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="text-center mt20" :class="showWave ? 'col-green' : 'col-red' ">{{connectionText}}</p>
                    <p class="text-center mt20" v-show='connentTime'>{{connentTime}}</p>
                </div>

                <div class="btnBox">
                    <div class="btn button hangup" @click="hangup">挂断</div>
                </div>
            </div>

            <video id="remoteVideo" name="remoteVideo" class="hide" style=" background:#0C6"></video>
            <video id="localVideo" name="localVideo" class='hide' muted="muted" style="background:#f00"></video>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDate, preventRepeatClick } from '@/utils/index'
import SIP from './webphone.js'
import Global from "@/layout/components/global.js";
import $axios from '@/utils/http'
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
            //显示拨打层
            isConnection: false, //是否拨打
            //连接中
            connectioning: 0, //0 正在连接 1 接通 2 未接通

            // 音浪效果
            showWave: true,
            // 连接状态
            connectionstatus: 0, //0 正在连接 1 接通 2 未接通 3 挂断
            connectionText: '', //文字状态
            timer: undefined, //通话定时器
            connentTime: '', //通话时长
            //电话相关配置
            status: false,//连接状态
            UA: {},
            SSS: {},
        }
    },
    mounted() {

        // console.log('999', this.$store.state.user.userInfo.seatNumber)

        //开发环境，暂时不能使用


        return

        this.initPhoneSet('init')

        let that = this
        //
        Global.$on("takePhone", (telePhone) => {

            that.showTakeBox(true)
            // console.error('执行好多次111111&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')
            if (telePhone) {
                that.telNum = telePhone
                that.ringout()
            }

        });
    },
    methods: {
        //展开
        showTakeBox(bool) {
            if (!this.phoneShow && !this.status) {

                this.phoneShow = true

                this.initPhoneSet()
            }
            else

                this.phoneShow = bool || !this.phoneShow

        },
        initPhoneSet(type) {

            //坐席号
            let seatNumber = this.$store.state.user.userInfo.seatNumber || ''

            console.log('9999', seatNumber)

            if (!seatNumber && !seatNumber.trim()) {

                if (type != 'init') {
                    this.$confirm('您还未设置自己的坐席号，请联系管理员设置', "警告", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        showCancelButton: false,
                        type: "warning"
                    }).then(function () { })
                        .catch(msg => {
                            // console.log(11111, msg)
                        })
                }

                this.phoneShow = false

                return
            }

            var that = this

            $axios.post('callPhoneConfig/page/list', { "pageNum": 1, "pageSize": 10 })
                .then(res => {
                    //console.log('999', res.data[0])

                    if (res.data && res.data.length) {

                        let config = res.data[0]

                        let numberConfig = {
                            uri: seatNumber + config.uri,
                            wsServers: [config.wsServers],
                            authorizationUser: seatNumber,
                            password: config.password + seatNumber,
                            hackIpInContact: true,
                            rtcpMuxPolicy: config.rtcpMuxPolicy,
                            hackWssInTransport: true,
                        }

                        // console.log('123123', numberConfig)


                        // return


                        var ua = this.UA = new SIP.UA(numberConfig);

                        //连接成功
                        ua.on('registered', function () {
                            that.status = true
                        });
                        //连接失败
                        ua.on('unregistered', function () {
                            that.status = false
                        });

                        //接听电话（暂时不知道这块干什么）
                        ua.on('invite', function (session) {
                            console.error(111, session)
                            var sss = this.SSS = session;

                        });

                    }
                })
        },
        //点击拨打
        ringout() {
            // console.error('执行好多次222222222&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&')


            preventRepeatClick(() => {


                if (!this.status) {
                    this.msgError('电话连接失败，请稍后再试！')
                    return
                }

                if (this.telNum) {

                    this.connectionText = '正在接通'
                    this.showWave = true
                    this.isConnection = true
                    this.call_events()
                }
            })

        },
        //挂断电话
        hangup() {
            this.SSS.terminate();
            this.showWave = false
            this.isConnection = false
            this.connentTime = ''
            clearInterval(this.timer)
        },
        //开始拨打电话
        call_events() {

            this.connentTime = ''

            var options = {
                media: {
                    constraints: {
                        audio: true,
                        video: false
                    },
                    render: {
                        remote: document.getElementById('remoteVideo'),
                        local: document.getElementById('localVideo')
                    }
                }
            };
            var sss = this.SSS = this.UA.invite('sip:' + this.telNum + '@cc.666vps.xyz', options);

            var that = this

            sss.on('accepted', function (data) {//接听

                that.showWave = true
                that.connectionText = '接听中'

                var num = 1

                that.timer = setInterval(() => {

                    num++

                    let hours = Math.floor(num / 3600 % 24),
                        minni = Math.floor(num / 60 % 60),
                        sec = Math.floor(num % 60);

                    that.connentTime = (hours ? ((hours < 10 ? ('0' + hours) : "") + ":") : '') + (minni ? ((minni < 10 ? ('0' + minni) : "") + ":") : '00:') + (sec < 10 ? ('0' + sec) : sec)

                }, 1000)


            });
            sss.on('cancel', function () {//取消呼叫

                that.showWave = false
                that.connectionText = '取消呼叫'
            });
            sss.on('failed', function (response, cause) {//呼叫失败

                that.showWave = false
                that.connectionText = '呼叫失败'
            });
            sss.on('rejected', function (response, cause) {//无法接通

                that.showWave = false
                that.connectionText = '无法接通'
            });
            sss.on('bye', function (request) {//挂机

                clearInterval(that.timer)

                that.showWave = false
                that.connectionText = '挂机'
            })
            sss.on('terminated', function (message, cause) {//结束

                clearInterval(that.timer)

                that.showWave = false
                that.connectionText = '结束'

            });


            sss.on('progress', function (response) {
                that.showWave = true
                that.connectionText = '拨号中'
                if (response.status_code === 183 && response.body && this.hasOffer && !this.dialog) {
                    if (!response.hasHeader('require') || response.getHeader('require').indexOf('100rel') === -1) {
                        if (this.mediaHandler.hasDescription(response)) {
                            if (!this.createDialog(response, 'UAC')) return
                            this.hasAnswer = true
                            this.dialog.pracked.push(response.getHeader('rseq'))
                            this.status = 11;
                            this.mute()
                            this.mediaHandler.setDescription(response).catch((reason) => {
                                this.logger.warn(reason)
                                this.failed(response, C.causes.BAD_MEDIA_DESCRIPTION)
                                this.terminate({ status_code: 488, reason_phrase: 'Bad Media Description' })
                            })
                        }
                    }
                }
            });
        },
        delOne() {
            this.telNum = this.telNum.substr(0, this.telNum.length - 1)
        },
        clearNum() {
            this.telNum = ''
        },
        dialNum(num) {
            if (this.telNum.length < 30) {
                this.telNum += num
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
}
</script>

<style lang="scss" scoped>
.hide {
    display: none;
}
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
.phoneBox {
    position: fixed;
    left: 50%;
    top: 20px;
    z-index: 88888;
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
        cursor: move;
        .status {
            display: inline-block;
            // vertical-align: top;
            width: 8px;
            height: 8px;
            margin-left: 4px;
            background-color: #ff0000;
            border-radius: 50%;
            overflow: hidden;
            &.green {
                background-color: #0c6;
            }
        }
    }
    .iptBox {
        height: 40px;
        padding-top: 10px;
        position: relative;
        input {
            border: none;
            background-color: transparent;
            width: 100%;
            padding: 0 40px 0 14px;
            color: #ffffff;
            font-size: 28px;
            outline: none;
        }
        .iptclose {
            position: absolute;
            cursor: pointer;
            right: 6px;
            top: 2px;
            color: #ff0000;
            font-size: 16px;
            &.claearOne {
                right: 14px;
                top: 20px;
                width: 20px;
                height: 20px;
                background: url("../../assets/images/del-one.png") center center
                    no-repeat;
                background-size: 100% auto;
            }
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
            font-size: 22px;
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
    padding-top: 16px;
    div {
        overflow: hidden;
        display: inline-block;
        cursor: pointer;
        width: 140px;
        height: 36px;
        border-radius: 4px;
        text-align: center;
        line-height: 36px;
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
    height: 194px;
    padding: 15px 0 0;
}
.icon_loading {
    width: 48px;
    height: 30px;
    margin: 0px auto;
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
