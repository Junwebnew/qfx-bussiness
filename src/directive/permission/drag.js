/**
* 自定义拖动
* Copyright (c) 2021 Jun
*/

export default {
    inserted(el, binding, vnode) {
        el.onmousedown = function (e) {
            var disx = e.pageX - el.offsetLeft;
            var disy = e.pageY - el.offsetTop;
            document.onmousemove = function (e) {
                el.style.left = e.pageX - disx + 'px';
                el.style.top = e.pageY - disy + 'px';
            }
            document.onmouseup = function () {
                document.onmousemove = document.onmouseup = null;
            }
        }
    }
}
