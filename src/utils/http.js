
import axios from "axios";
import { Message, MessageBox, Loading, Notification } from 'element-ui';
import Cookies from 'js-cookie'
import { getToken, removeToken } from '@/utils/auth'
import { publicUrl, qmxOnlineUrl } from '../baseConfig'
import errorCode from '@/utils/errorCode'


var isNotifi = null  //是否已通知过期


const http = axios.create({
    baseURL: publicUrl, //请求url
    timeout: 30000, //超时处理
    headers: {
        'Content-Type': 'application/json'
    }
});

var loading = null;

// 添加请求拦截器
http.interceptors.request.use(
    function (config) {

        let url = config.url

        if (url.indexOf('/API/') >= 0) {   //需要更换根目录地址

            config.baseURL = qmxOnlineUrl

            url = url.replace('/API/', '')
        }

        if (url.indexOf('?loading') > 0 && !loading) {   //判断是否需要loading
            loading = Loading.service()
            url = url.replace('?loading', '')
        }

        if (url.indexOf('?form') > 0) {   //切换Content-Type
            config.headers.['Content-Type'] = 'application/x-www-form-urlencoded'
            url = url.replace('?form', '')
        }

        if (url.indexOf('?token') > 0) {   //判断是否需要token
            url = url.replace('?token', '')
        }
        else {
            config.headers.['x-access-token'] = getToken()
        }

        config.url = url

        return config;
    },
    function (error) {
        // 对请求错误做些什么
        console.error("失败了1111", error)
        return Promise.reject(error);
    }
);

// 添加响应拦截器
http.interceptors.response.use(
    function (res) {


        if (loading) {
            loading.close()
            loading = null
        }

        const code = res.data.code || 200;

        const msg = errorCode[code] || res.data.msg || res.data.data || errorCode['default']

        if (code === 500) {
            Message({
                message: msg,
                type: 'error'
            })
            return Promise.reject(new Error(msg))
        } else if (code !== 200) {

            if (isNotifi) return

            Notification.error({
                title: msg
            })

            if (msg == '该账号已经重新登录,Token信息已失效' || msg == 'token已经失效') {

                isNotifi = true

                setTimeout(() => {
                    removeToken()
                    Cookies.remove('TOKEN');
                    Cookies.remove('userInfo');
                    Cookies.remove('tagsList')
                    window.location.replace('/')
                    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
                    isNotifi = false
                }, 1000)

            }
            return Promise.reject('error')
        } else {

            return res.data
        }

    },
    function (error) {

        // console.error(error.response)

        if (loading) {
            loading.close()
            loading = null
        }

        if (error && error.message && (error.message.indexOf('timeout') >= 0)) {
            Message({
                message: '请求超时，请重试',
                type: 'error',
                duration: 2000
            })

        }
        else if (error.response) {
            if (error.response.data && error.response.data.error == 'invalid_token') {

                MessageBox.confirm('登录凭证过期，请重新登录', '温馨提示', {
                    confirmButtonText: '确定',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    showCancelButton: false,
                    type: 'error'
                }).then(() => {
                    Cookies.remove('TOKEN');
                    Cookies.remove('userInfo');
                    window.location.replace('/')
                }).catch(() => {

                });
            }
            else {
                let errorStr = error.response.data.message ? error.response.data.message : error.response.data.error_description ? error.response.data.error_description : '获取失败，请稍后再试'

                Notification.error({
                    title: errorStr
                })

            }
        }
        return Promise.reject(error);
    }
);

export default http
