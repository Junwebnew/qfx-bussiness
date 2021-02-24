import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect", "/bind", "/register"];

router.beforeEach((to, from, next) => {
    NProgress.start();
    // console.log(888,to)
    if (getToken()) {

        /* has token*/
        if (to.path === "/login") {

            next({ path: "/" });
            NProgress.done();
        } else {

            if (!store.getters.userId) {
                // 用户ID不存在  判断当前用户是否已拉取完user_info信息
                store
                    .dispatch("GetInfo")
                    .then(res => {
                        // 拉取user_info

                        store.dispatch("GenerateRoutes", { menuList: res.menuList }).then(accessRoutes => {
                            // 测试 默认静态页面
                            // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
                            // 根据roles权限生成可访问的路由表
                            router.addRoutes(accessRoutes); // 动态添加可访问路由表
                            next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
                        });
                    })
                    .catch(err => {
                        store.dispatch("FedLogOut").then(() => {
                            Message.error(err);
                            next({ path: "/" });
                        });
                    });
            } else {

                // if (to.path.indexOf('/resources/') === 0) {
                //     console.log('进入了', to.path)
                // }
                next();
                // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                // if (hasPermission(store.getters.roles, to.meta.roles)) {
                //   next()
                // } else {
                //   next({ path: '/401', replace: true, query: { noGoBack: true }})
                // }
                // 可删 ↑
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next();
        } else {
            next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    NProgress.done();
});

//进入资源前需要查询此资源是否会员才能进入，并且用户是会员，并且会员未过期

function beforeEnterResourse() {

}