<template>
    <div class="login" id='canvasBox'>
        <canvas id="myCanvas"></canvas>

        <!-- 头部 -->
        <div class="el-login-head">
            <img src="../assets/images/logo.png" alt="权发现" srcset="">
            <span>· 知产销售利器</span>
        </div>
        <!-- 表单盒子 -->
        <div class="formBox">

            <h1 class="title">权发现智能销售云平台</h1>
            <h2>用数据和技术为企业销售赋能</h2>
            <div class="box">
                <div class="l"></div>
                <div class="r">

                    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
                        <!-- <h3 class="title"></h3> -->
                        <el-form-item prop="username">
                            <el-input v-model="loginForm.username" class="login_ipt" type="text" auto-complete="off" placeholder="账号" maxLength='11'>
                                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="loginForm.password" class="login_ipt" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin" maxLength='31'>
                                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
                            </el-input>
                        </el-form-item>
                        <!-- <el-form-item prop="code">
                        <el-input
                            v-model="loginForm.code"
                            auto-complete="off"
                            placeholder="验证码"
                            style="width: 63%"
                            @keyup.enter.native="handleLogin"
                        >
                            <svg-icon
                                slot="prefix"
                                icon-class="validCode"
                                class="el-input__icon input-icon"
                            />
                        </el-input>
                        <div class="login-code">
                            <img
                                :src="codeUrl"
                                @click="getCode"
                                class="login-code-img"
                            />
                        </div>
                    </el-form-item> -->
                        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>

                        <el-form-item style="width: 100%">
                            <el-button :loading="loading" class="login_btn" size="medium" type="primary" style="width: 100%" @click.native.prevent="handleLogin">
                                <span v-if="!loading">登 录</span>
                                <span v-else>登 录 中...</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <p class="text-center goReg">没有账号?<router-link to="/register" class="ml10 col">立即注册</router-link>
                            </p>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2020-2021 成都权明星科技有限公司 版权所有</span>
        </div>
    </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { Constellationel } from "@/utils/constellation";
export default {
    name: "Login",
    data() {

        var validateUseName = (rule, value, callback) => {

            let emojiTest = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

            if (value === '') {
                callback(new Error('用户名不能为空'))
            }
            else if (emojiTest.test(value)) {
                callback(new Error('不能输入表情符号'))
            }
            else {
                callback()
            }
        }

        return {
            codeUrl: "",
            cookiePassword: "",
            loginForm: {
                username: "",
                password: "",
                rememberMe: false,
                code: "",
                uuid: ""
            },
            loginRules: {
                username: [
                    { validator: validateUseName, trigger: "none" },
                ],
                password: [
                    { required: true, trigger: "none", message: "密码不能为空" }
                ]
            },
            loading: false,
            redirect: undefined
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    created() {
        //this.getCode();
        //this.getCookie();
        if (process.env.NODE_ENV != 'production') {
            this.loginForm = {
                username: "admin",
                password: "123456",
            }
        }
    },
    mounted() {
        Constellationel('myCanvas', 'canvasBox')
    },
    methods: {
        getCode() {
            getCodeImg().then(res => {
                this.codeUrl = "data:image/gif;base64," + res.img;
                this.loginForm.uuid = res.uuid;
            });
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get('rememberMe')
            this.loginForm = {
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : decrypt(password),
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
            };
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {

                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("username", this.loginForm.username, { expires: 7 });
                        Cookies.set("password", encrypt(this.loginForm.password), { expires: 7 });
                        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 7 });
                    } else {
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove('rememberMe');
                    }


                    this.$store
                        .dispatch("Login", this.loginForm)
                        .then(() => {

                            this.$router.push({ path: this.redirect || "/" });
                        })
                        .catch((err) => {

                            this.loading = false;
                            // this.getCode();
                        });
                }
            });
        }
    },
    beforeDestroy() {
        window.CanvasStop && window.CanvasStop()
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    position: relative;
    display: flex;
    height: 100%;
    // background-image: url("../assets/images/login-background.jpg");
    // background-size: cover;
    background-color: #005b8e;
    background: -moz-linear-gradient(bottom, #bacada 0%, #086fda 100%);
    background: -webkit-gradient(
        linear,
        left top,
        left bottom,
        color-stop(0%, #bacada),
        color-stop(100%, #001529)
    );
    background: -webkit-linear-gradient(bottom, #bacada 0%, #001529 100%);
    background: -o-linear-gradient(bottom, #bacada 0%, #001529 100%);
    background: -ms-linear-gradient(bottom, #bacada 0%, #001529 100%);
    background: linear-gradient(to bottom, #bacada 0%, #001529 100%);
}
.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}
.formBox {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-55%);
    h1 {
        font-size: 60px;
        color: #ffffff;
        font-weight: 600;
        text-shadow: 1px 4px 10px #666;
        text-align: center;
        margin-bottom: 10px;
    }
    h2 {
        text-align: center;
        font-size: 22px;
        color: #ffffff;
        margin-bottom: 30px;
    }
    .box {
        display: flex;
        border-radius: 6px;
        overflow: hidden;
    }
    .r {
        padding: 30px 0 10px;
        position: relative;
        color: #fff;
        margin: 0 auto;
    }
}

.login-form {
    width: 360px;
    padding: 15px 40px 5px 40px;
    .el-input {
        height: 38px;
        input {
            height: 38px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
        color: #8db9e8;
    }
    .login_ipt {
        ::v-deep input {
            border-radius: 40px;
            // border: none;
            // border-bottom: 1px solid #dae5f1;
        }
    }
    .login_btn {
        border-radius: 300px;
        margin-top: 10px;
    }
    .goReg {
        color: #fff;
    }
    ::v-deep .el-checkbox__label {
        color: #ffffff;
    }
    ::v-deep .el-form-item__error {
        color: #ffffff;
    }
}
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-head {
    position: absolute;
    left: 0;
    top: 0;
    padding: 14px 14px 0;
    img {
        height: 42px;
    }
    span {
        font-size: 15px;
        color: #ffffff;
        font-family: KaiTi;
    }
}
.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 38px;
}
</style>
