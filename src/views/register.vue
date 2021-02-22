<template>
    <div class="reg">
        <header>
            <div class="tungee-head-bar">
                <div class="logo inline">
                    <router-link to='/' class="logo-link"><img src="../assets/images/logo.png" alt="个人中心" height="42px"></router-link>
                    <router-link to='/' class="col fr f16">返回登录</router-link>
                </div>
            </div>
        </header>
        <div class="content">
            <p class="title">注册权发现，让销售更智能</p>
            <input type="hidden" class="hide"> <input type="hidden" class="hide"> <input type="hidden" class="hide">
            <input type="hidden" class="hide"> <input type="hidden" class="hide"> <input type="hidden" class="hide">

            <div class="nav">
                <div class="nav-item" :class="{'navItemActive':navStep == 0 }" @click="swaitchNav(0)"><a href="javascript:void(0)">填写信息</a></div>
                <div class="nav-item" :class="{'navItemActive':navStep == 1 }" @click="swaitchNav(1)"><a href="javascript:void(0)">填写账密码</a></div>
                <div class="nav-item" :class="{'navItemActive':navStep == 2 }"><a href="javascript:void(0)">注册成功</a></div>
            </div>

            <div class="step stepOne" v-if='navStep == 0'>
                <!-- 表单 1   开始 -->
                <el-form ref="regForm" :model="regForm" :rules="regRules" class="login-form">
                    <el-form-item prop="companyName">
                        <div class="stepItem">
                            <el-input v-model="regForm.companyName" maxLength='40' auto-complete="off" clearable placeholder="请输入企业全称（或个人名称）">
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="name">
                        <div class="stepItem">
                            <el-input v-model="regForm.name" maxLength='20' auto-complete="off" clearable placeholder="请输入联系人">
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="mobile">
                        <div class="stepItem">
                            <el-input v-model="regForm.mobile" maxLength='11' auto-complete="off" clearable placeholder="请输入联系电话">
                            </el-input>
                        </div>
                    </el-form-item>

                    <el-form-item prop="code">
                        <div class="stepItem">
                            <div class="codeBox">
                                <el-input v-model="regForm.code" auto-complete="off" maxLength='6' placeholder="短信验证码">
                                </el-input>
                            </div>
                            <div class="getCodeBox btn" @click="clickGetCode" :class="{'unUse':!isClick}">
                                {{btnStr}}
                            </div>
                        </div>
                    </el-form-item>

                    <div class="stepItem btnDIv">
                        <div @click="netxStep(0)" class="btn mt10">下一步</div>
                    </div>
                </el-form>
            </div>

            <div class="step stepOne" v-if='navStep == 1'>
                <!-- 表单 2   开始 -->
                <el-form ref="passFrom" :model="passFrom" :rules="passRules" class="login-form">
                    <el-form-item prop="loginName">
                        <div class="stepItem">
                            <el-input v-model="passFrom.loginName" maxlength="11" auto-complete="off" clearable placeholder="请输入您的登录账号">
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <div class="stepItem">
                            <el-input v-model="passFrom.password" type='password' maxLength='20' auto-complete="off" show-password clearable placeholder="请输入您的密码">
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="rePass">
                        <div class="stepItem">
                            <el-input v-model="passFrom.rePass" type='password' maxLength='20' auto-complete="off" show-password clearable placeholder="重复您的密码">
                            </el-input>
                        </div>
                    </el-form-item>
                    <div class="stepItem btnDIv">
                        <div @click="netxStep(1)" class="btn">下一步</div>
                    </div>
                </el-form>
            </div>
            <div class="step lastStep" v-if='navStep == 2'>
                <div class="cssImg">
                    <div class="gou"></div>
                </div>
                <div class="words">
                    <h1>提交成功，等待审核</h1>
                    <small>（审核周期为2-5个工作日,请注意短信接收）</small>
                </div>
                <div class="linkBox">
                    <a href="/login" class="col">登录</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { sendMsg, userReg, checkExists } from "@/api/login";


export default {
    data() {

        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
                // password 是表单上绑定的字段
            } else if (value !== this.passFrom.rePass) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }

        var validateUsed = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('手机号码不能为空'))

            } else if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
                callback(new Error('请输入正确的手机号码'))
            }
            else {
                checkExists(value).then(res => {
                    if (res.data) {
                        callback(new Error('此电话号码已注册，请更换号码注册'))
                    }
                    else {
                        callback()
                    }
                })
                // callback()
            }
        }

        var validateUseName = (rule, value, callback) => {

            let emojiTest = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

            if (value === '') {
                callback(new Error('登录用户名不能为空'))
            }
            else if (emojiTest.test(value)) {
                callback(new Error('不能输入表情符号'))
            }
            else {
                checkExists(value).then(res => {
                    if (res.data) {
                        callback(new Error('此用户名已注册，请更换用户名'))
                    }
                    else {
                        callback()
                    }
                })
                // callback()
            }
        }

        return {
            navStep: 0,
            nowStep: 0, //当前已进行得步骤
            btnStr: "获取验证码",
            isClick: true, //短信btn是否可以点击
            //新增
            regForm: {
                companyName: "",
                mobile: "",
                code: '',
                name: "",
                key: ''
            },
            regRules: {
                companyName: [
                    { required: true, trigger: "blur", message: "公司(个人)名称不能为空" }
                ],
                name: [
                    { required: true, trigger: "blur", message: "联系人不能为空" }
                ],
                code: [
                    { required: true, trigger: "blur", message: "验证码不能为空" }
                ],
                mobile: [
                    { validator: validateUsed, trigger: "blur" },
                ]
            },
            passFrom: {
                loginName: "",
                password: "",
                rePass: ""
            },
            passRules: {
                loginName: [
                    { required: true, validator: validateUseName, trigger: "blur" },
                ],
                password: [
                    { required: true, trigger: "blur", message: "密码不能为空" },
                    { pattern: /.{6,20}$/, trigger: "blur", message: "长度至少为6个字符" }
                ],
                rePass: [
                    { required: true, validator: validatePass2, trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    created() {
        // this.switchImg()

    },
    mounted() {

    },
    methods: {
        swaitchNav(idx) {
            if (idx <= this.navStep && this.nowStep == 1) {
                this.navStep = idx
            }
        },
        clickGetCode() {

            this.$refs.regForm.validateField('mobile', (err) => {

                if (!err && this.isClick) {
                    this.isClick = false
                    sendMsg(this.regForm.mobile)
                        .then(res => {

                            this.msgSuccess("短信发送成功，请注意查收!");

                            this.regForm.key = res.key

                            let min = 60;

                            let timer = setInterval(() => {
                                if (min == 1) {
                                    this.isClick = true;
                                    clearInterval(timer);
                                    this.btnStr = "重新获取";
                                } else {
                                    min--;
                                    if (min < 10) min = "0" + min;
                                    this.btnStr = "稍后获取( " + min + " )";
                                }
                            }, 1000);
                        })
                        .catch(() => {
                            this.isClick = true
                        })
                }
            })
        },

        netxStep(step) {

            if (step === 0) {


                this.$refs["regForm"].validate(valid => {
                    if (valid) {

                        if (!this.regForm.key) {
                            this.msgError("请获取验证码信息");
                            return
                        }
                        this.navStep = 1
                        this.nowStep = 1
                    }
                })

                return

            }
            if (step === 1) {

                this.$refs["passFrom"].validate(valid => {
                    if (valid) {
                        this.assFrom()
                    }
                })
                return
            }
        },

        assFrom() {

            let obj = Object.assign({ accountType: 0 }, this.regForm, this.passFrom)

            userReg(obj).then(res => {
                this.navStep = 2
                // console.log(111, res)
            }).catch(res => {
                this.navStep = 0
            })
        },

        userIsHas() {  //判断用户是否注册
            if (!/^1(3|4|5|7|8|9)\d{9}$/.test(this.userPhone)) {
                this.$message({
                    message: '手机号码格式错误，请重新输入',
                    type: 'warning'
                });
                this.$refs.userPhone.focus();
                return;
            }
            if (this.isClick) {
                return;
            }
            this.isClick = true;

            this.$axios.get(`/api-u/users-anon/isUserExist?loading?token?username=${this.userPhone}&extensionParams=2`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    if (res.data.isExist === '0') {
                        this.getCode()
                    } else {
                        this.$message({
                            message: '此电话号码已注册，请更换号码注册',
                            type: 'warning',
                            duration: 2000
                        });
                        this.isClick = false;
                    }
                })
                .catch(res => {
                    this.isClick = false;
                    this.$message({
                        message: res.response.data.message,
                        type: 'error',
                        duration: 2500
                    });
                });

        }
    },
    destroyed() {

        let a = 0
        while (a < 10) {
            clearInterval(a++)
        }
    }
}
</script>

<style lang="scss" scoped>
header {
    width: 100%;
    height: 64px;
    background: #1d2327;
    line-height: 64px;
    padding: 0 32px 0 14px;
}

.reg {
    position: fixed;
    width: 100%;
    height: 100%;
    background: url("../assets/images/register.jpg");
    background-size: cover;
}

.content {
    width: 520px;
    background: #fff;
    border-radius: 3px;
    text-align: center;
    margin: auto;
    margin-top: 5%;
    padding: 0 40px 20px;
    transition: all 0.2s;

    .title {
        font-size: 30px;
        color: #333;
        padding: 40px 0 30px 0;
    }

    .nav {
        display: inline-block;
        width: 100%;

        .nav-item {
            position: relative;
            width: 33.3%;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            font-size: 14px;
            color: #5a5a5a;
            text-align: center;
            padding-right: 20px;
            background-color: #eef6fc;
            vertical-align: top;
            cursor: pointer;

            &.navItemActive {
                background-color: #3da4ff;

                a {
                    color: #fff;
                }
            }

            a {
                color: #5a5a5a;
                display: inline-block;
                width: 100%;
                text-decoration: none;
            }

            &:not(:last-child)::after {
                content: " ";
                position: absolute;
                top: 0;
                right: -19px;
                z-index: 1;
                width: 40px;
                height: 40px;
                background: url("../assets/images/icon-arrow-white.png")
                    no-repeat center center;
                background-size: contain;
            }
        }
    }

    .step {
        // width: 422px;
        margin: auto;
        padding: 24px 0;
        margin-top: 20px;

        input {
            height: 44px;
            width: 100%;
            padding: 0 20px;
            font-size: 14px;
            line-height: 44px;
            border: 1px solid #ddd;
            outline: 0;
        }

        .stepItem {
            padding: 0px 0;
            position: relative;
            ::v-deep .el-input--medium .el-input__inner {
                height: 44px;
                line-height: 44px;
                border-radius: 2px;
                // border: 1px solid #ddd;
            }
            &.btnDIv {
                margin-top: 40px;
            }

            .btn {
                background-color: #0098fe;
                color: #fff;
                cursor: pointer;
                width: 100%;
                height: 44px;
                text-align: center;
                line-height: 44px;
            }

            .codeBox {
                float: left;
                width: 44%;
                display: inline-block;
                height: 44px;
                line-height: 44px;
            }
            .getCodeBox {
                float: right;
                width: 44%;
                display: inline-block;
                height: 44px;
                line-height: 44px;
                border-radius: 2px;
                &.unUse {
                    background: #999;
                    position: static;
                }
            }
        }
    }

    .lastStep {
        padding: 80px 0;

        .cssImg {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #6cce51;
            position: relative;
            margin: 30px auto 10px;

            .gou {
                width: 30px;
                height: 14px;
                border-bottom: 5px solid #fff;
                border-left: 5px solid #fff;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                position: absolute;
                top: 33%;
                left: 26%;
            }
        }
        .words {
            text-align: center;
            h1 {
                font-size: 24px;
                font-weight: 400;
                margin-bottom: 20px;
            }
            small {
                color: #999;
            }
        }
        .linkBox {
            margin-top: 30px;
            font-size: 14px;
            margin-bottom: 20px;
        }
    }
}

@media screen and (max-width: 1360px) {
    .content {
        width: 480px;
        background: #fff;
        border-radius: 3px;
        text-align: center;
        margin: auto;
        margin-top: 2%;

        .title {
            font-size: 24px;
            padding: 25px 0 18px 0;
        }
        .nav .nav-item {
            font-size: 12px;
        }
        .step {
            // width: 422px;
            margin: auto;
            padding: 22px 0 8px;

            .stepItem {
                padding: 0px 0;
            }

            input {
                height: 36px;
                line-height: 36px;
            }
        }
    }
}
</style>
