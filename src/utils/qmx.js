
import Vue from "vue"

import { baseImgUrl } from '../baseConfig'

import headerImg from '../assets/images/head.png'

export const $getImg = (id, type) => {

    if (id && id != 'null') {

        if (id.indexOf('tm_img') >= 0) {
            id = id.replace('.jpg', "")
        }

        if (type == 1) return `${baseImgUrl}${id}`   //最大的图
        if (type == 2) return `${baseImgUrl}${id}?x-oss-process=style/pc_trade_resize`   //商标图  100*100

        return `${baseImgUrl}${id}?x-oss-process=style/pc_news_resize` //新闻列表图 240*240

    }

    return ""
}

Vue.prototype.$getImg = $getImg


Vue.prototype.$headImg = {
    img: headerImg,
    error: 'this.src="' + headerImg + '"',
}

//打开新的页面
Vue.prototype.$openNewView = (url) => {
    var newTab = window.open();
    newTab.location = url
}