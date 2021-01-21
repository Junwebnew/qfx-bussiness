import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
    {
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "/redirect/:path(.*)",
                component: (resolve) => require(["@/views/redirect"], resolve),
            },
        ],
    },
    {
        path: "/login",
        component: (resolve) => require(["@/views/login"], resolve),
        hidden: true,
    },
    {
        path: "/register",
        component: (resolve) => require(["@/views/register"], resolve),
        hidden: true,
    },
    {
        path: "/404",
        component: (resolve) => require(["@/views/error/404"], resolve),
        hidden: true,
    },
    {
        path: "/401",
        component: (resolve) => require(["@/views/error/401"], resolve),
        hidden: true,
    },
    {
        path: "",
        component: Layout,
        redirect: "index",
        children: [
            {
                path: "index",
                hidden: true,
                component: (resolve) => require(["@/views/index"], resolve),
                name: "首页",
                meta: { title: "首页", icon: "dashboard", noCache: true, affix: true },
            },
        ],
    },
    {
        path: "/user",
        component: Layout,
        hidden: true,
        redirect: "noredirect",
        children: [
            {
                path: "profile",
                component: (resolve) =>
                    require(["@/views/system/user/profile/index"], resolve),
                name: "Profile",
                meta: { title: "个人中心", icon: "user" },
            },
        ],
    },
    {
        path: "/dict",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "type/data/:dictId(\\d+)",
                component: (resolve) => require(["@/views/system/dict/data"], resolve),
                name: "Data",
                meta: { title: "字典数据", icon: "" },
            },
        ],
    },
    {
        path: "/job",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "log",
                component: (resolve) => require(["@/views/monitor/job/log"], resolve),
                name: "JobLog",
                meta: { title: "调度日志" },
            },
        ],
    },
    {
        path: "/gen",
        component: Layout,
        hidden: true,
        children: [
            {
                path: "edit",
                component: (resolve) =>
                    require(["@/views/tool/gen/editTable"], resolve),
                name: "GenEdit",
                meta: { title: "修改生成配置" },
            },
        ],
    },
];

//自定义路由

export const asyncAllRoutes = [
    {
        name: "System",
        path: "/system",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "系统管理", icon: "system", noCache: false },
        children: [
            {
                name: "User",
                path: "user",
                hidden: false,
                component: "system/user/index",
                meta: { title: "用户管理", noCache: true },
            },
            {
                name: "Role",
                path: "role",
                hidden: false,
                component: "system/role/index",
                meta: { title: "角色管理", noCache: true },
            },
            {
                name: "Menu",
                path: "menu",
                hidden: false,
                component: "system/menu/index",
                meta: { title: "菜单管理", noCache: true },
            },
            {
                name: "Dept",
                path: "dept",
                hidden: false,
                component: "system/dept/index",
                meta: { title: "部门管理", noCache: true },
            },
            // {
            //     name: "Post",
            //     path: "post",
            //     hidden: false,
            //     component: "system/post/index",
            //     meta: { title: "岗位管理", icon: "post", noCache: true },
            // },
            // {
            //     name: "Dict",
            //     path: "dict",
            //     hidden: false,
            //     component: "system/dict/index",
            //     meta: { title: "字典管理", icon: "dict", noCache: true },
            // },
            // {
            //     name: "Config",
            //     path: "config",
            //     hidden: false,
            //     component: "system/config/index",
            //     meta: { title: "参数设置", icon: "edit", noCache: false },
            // },
            {
                name: "Phone",
                path: "phone",
                hidden: false,
                redirect: "noRedirect",
                component: "ParentView",
                alwaysShow: true,
                meta: { title: "电话管理", noCache: false },
                children: [
                    {
                        name: "phoneSet",
                        path: "phoneSet",
                        hidden: false,
                        component: "system/phone/index",
                        meta: { title: "电话设置", noCache: false },
                    },
                    {
                        name: "companyPhone",
                        path: "companyPhone",
                        hidden: false,
                        component: "system/phone/companyPhone",
                        meta: { title: "公司与电话设置", noCache: false },
                    },
                ],
            },
            {
                name: "Log",
                path: "log",
                hidden: false,
                redirect: "noRedirect",
                component: "ParentView",
                alwaysShow: true,
                meta: { title: "日志管理", noCache: false },
                children: [
                    {
                        name: "Operlog",
                        path: "operlog",
                        hidden: false,
                        component: "monitor/operlog/index",
                        meta: { title: "操作日志", noCache: false },
                    },
                    {
                        name: "Logininfor",
                        path: "logininfor",
                        hidden: false,
                        component: "monitor/logininfor/index",
                        meta: { title: "登录日志", noCache: false },
                    },
                ],
            },
        ],
    },
    {
        name: "cost",
        path: "/cost",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "费用模块", icon: "system", noCache: false },
        children: [
            {
                name: "accountList",
                path: "accountList",
                hidden: false,
                component: "cost/accountList",
                meta: { title: "账号列表", noCache: true },
            },
            {
                name: "accountRecharge",
                path: "accountRecharge",
                hidden: false,
                component: "cost/accountRecharge",
                meta: { title: "账号充值", noCache: true },
            },
            {
                name: "accountRechargeList",
                path: "accountRechargeList",
                hidden: false,
                component: "cost/accountRechargeList",
                meta: { title: "充值明细", noCache: true },
            },
            {
                name: "accountDeductionList",
                path: "accountDeductionList",
                hidden: false,
                component: "cost/accountDeductionList",
                meta: { title: "抵扣明细", noCache: true },
            },
            {
                name: "accountConsume",
                path: "accountConsume",
                hidden: false,
                component: "cost/accountConsume",
                meta: { title: "抵扣统计", noCache: true },
            }
        ]
    },
    {
        name: "seting",
        path: "/seting",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "配置中心", icon: "message", noCache: true },
        children: [
            {
                name: "cleanData",
                path: "cleanData",
                hidden: false,
                component: "seting/cleanData/index",
                meta: { title: "数据清洗", noCache: true },
            },
            {
                name: "setNotice",
                path: "setNotice",
                hidden: false,
                component: "seting/setNotice/index",
                meta: { title: "消息配置", noCache: true },
            },
            {
                name: "outstock",
                path: "outstock",
                hidden: false,
                component: "seting/outstock/index",
                meta: { title: "掉库配置", noCache: true },
            },
            {
                name: "setResources",
                path: "setResources",
                hidden: false,
                component: "seting/setResources",
                meta: { title: "资源配置", noCache: true },
            },
        ]
    },
    {
        name: "center",
        path: "/center",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "个人中心", icon: "user", noCache: true },
        children: [
            {
                name: "clueManage",
                path: "clueManage",
                hidden: false,
                component: "ParentView",
                redirect: "clueStatistics",
                meta: { title: "线索管理", noCache: true },
                children: [
                    {
                        name: "clueStatistics",
                        path: "clueStatistics",
                        hidden: false,
                        component: "center/clueManage/clueStatistics",
                        meta: { title: "线索统计", noCache: true }
                    },
                    {
                        name: "clue",
                        path: "clue",
                        hidden: false,
                        component: "center/clueManage/clue/index",
                        meta: { title: "我的线索", noCache: true },
                    },
                    {
                        name: "clue-all",
                        path: "clue-all",
                        hidden: false,
                        component: "center/clueManage/clue-all/index",
                        meta: { title: "所有线索", noCache: true },
                    },
                    {
                        name: "clue-detail",
                        path: "clue/detail",
                        hidden: true,
                        component: "center/clueManage/clue/detail",
                        meta: { title: "线索详情", noCache: true },
                    },
                    {
                        name: "today",
                        path: "today",
                        hidden: false,
                        component: "center/clueManage/today/index",
                        meta: { title: "今日待跟进", noCache: true },
                    },
                ]
            },
            {
                name: "bussManage",
                path: "bussManage",
                hidden: false,
                component: "ParentView",
                redirect: "bussStatistics",
                meta: { title: "商机管理", noCache: true },
                children: [
                    {
                        name: "bussStatistics",
                        path: "bussStatistics",
                        hidden: false,
                        component: "center/bussManage/bussStatistics",
                        meta: { title: "商机统计", noCache: true }
                    },
                    {
                        name: "buss",
                        path: "buss",
                        hidden: false,
                        component: "center/bussManage/buss/index",
                        meta: { title: "我的商机", noCache: true },
                    },
                    {
                        name: "buss-all",
                        path: "buss-all",
                        hidden: false,
                        component: "center/bussManage/buss-all/index",
                        meta: { title: "所有商机", noCache: true },
                    },
                    {
                        name: "buss-detail",
                        path: "buss/detail",
                        hidden: true,
                        component: "center/bussManage/buss/detail",
                        meta: { title: "商机详情", noCache: true },
                    },
                    {
                        name: "today",
                        path: "today",
                        hidden: false,
                        component: "center/bussManage/today/index",
                        meta: { title: "今日待跟进", noCache: true },
                    },
                ]
            },
            {
                name: "finishManage",
                path: "finishManage",
                hidden: false,
                component: "ParentView",
                redirect: "finishList",
                meta: { title: "成单管理", noCache: true },
                children: [
                    {
                        name: "finishList",
                        path: "finishList",
                        hidden: false,
                        component: "center/finishManage/list",
                        meta: { title: "成单列表", noCache: true },
                    },
                    {
                        name: "finishStatistics",
                        path: "finishStatistics",
                        hidden: false,
                        component: "center/finishManage/statistics",
                        meta: { title: "成单统计", noCache: true },
                    }
                ]
            },
            {
                name: "Notice",
                path: "notice",
                hidden: false,
                component: "center/notice/index",
                meta: { title: "通知公告", noCache: true },
            }
        ]
    },
    {
        name: "pool",
        path: "/pool",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "资源池", icon: "log", noCache: true },
        children: [
            {
                name: "resourseStatistics",
                path: "resourseStatistics",
                hidden: false,
                component: "pool/statistics",
                meta: { title: "资源统计", noCache: true },
            },
            {
                name: "cluepool",
                path: "cluepool",
                hidden: false,
                component: "ParentView",
                meta: { title: "线索资源池", noCache: true },
                children: [
                    {
                        name: "cluepooldep",
                        path: "dep",
                        hidden: false,
                        component: "pool/clue/dep",
                        meta: { title: "线索部门池", noCache: true },
                    },
                    {
                        name: "cluepoolpublic",
                        path: "public",
                        hidden: false,
                        component: "pool/clue/public",
                        meta: { title: "线索公共池", noCache: true },
                    }
                ]
            },
            {
                name: "busspool",
                path: "busspool",
                hidden: false,
                component: "ParentView",
                meta: { title: "商机资源池", noCache: true },
                children: [
                    {
                        name: "busspooldep",
                        path: "dep",
                        hidden: false,
                        component: "pool/buss/dep",
                        meta: { title: "商机部门池", noCache: true },
                    },
                    {
                        name: "busspoolpublic",
                        path: "public",
                        hidden: false,
                        component: "pool/buss/public",
                        meta: { title: "商机公共池", noCache: true },
                    }
                ]
            }
        ],
    },
    {
        name: "resources",
        path: "/resources",
        hidden: false,
        redirect: "noRedirect",
        component: "Layout",
        alwaysShow: true,
        meta: { title: "资源模块", icon: "example", noCache: true },
        children: [
            {
                name: "recent-apply",
                path: "recent-apply",
                hidden: false,
                component: "resources/recent-apply/index",
                meta: { title: "近日申请", noCache: false },
            },
            {
                name: "recent-apply-detail",
                path: "recent-apply/detail",
                hidden: true,
                component: "resources/recent-apply/detail",
                meta: { title: "近日申请-详情", noCache: true },
            },

            {
                name: "renewal",
                path: "renewal",
                hidden: false,
                component: "resources/renewal/index",
                meta: { title: "商标续展", noCache: false },
            },
            {
                name: "renewal-detail",
                path: "renewal/detail",
                hidden: true,
                component: "resources/renewal/detail",
                meta: { title: "商标续展-详情", noCache: true },
            },

            {
                name: "change",
                path: "change",
                hidden: false,
                component: "resources/change/index",
                meta: { title: "商标变更", noCache: false },

            },
            {
                name: "change-detail",
                path: "change/detail",
                hidden: true,
                component: "resources/change/detail",
                meta: { title: "商标变更-详情", noCache: true },
            },
            {
                name: "agency-cancel",
                path: "agency-cancel",
                hidden: false,
                component: "resources/agency-cancel/index",
                meta: { title: "代理机构注销", noCache: false },

            },
            {
                name: "agency-cancel-detail",
                path: "agency-cancel/detail",
                hidden: true,
                component: "resources/agency-cancel/detail",
                meta: { title: "代理机构注销-详情", noCache: true },
            },
            {
                name: "reject",
                path: "reject",
                hidden: false,
                component: "resources/reject/index",
                meta: { title: "疑似驳回", noCache: false },

            },
            {
                name: "reject-detail",
                path: "reject/detail",
                hidden: true,
                component: "resources/reject/detail",
                meta: { title: "疑似驳回-详情", noCache: true },
            },
            {
                name: "objection-analysis",
                path: "objection-analysis",
                hidden: false,
                component: "resources/objection-analysis/index",
                meta: { title: "异议分析", noCache: false },

            },
            {
                name: "objection-analysis-detail",
                path: "objection-analysis/detail",
                hidden: true,
                component: "resources/objection-analysis/detail",
                meta: { title: "异议分析-详情", noCache: true },
            },
            {
                name: "white-list",
                path: "white-list",
                hidden: false,
                component: "resources/white-list/index",
                meta: { title: "企业白名单", noCache: false },

            },
            {
                name: "white-list-detail",
                path: "white-list/detail",
                hidden: true,
                component: "resources/white-list/detail",
                meta: { title: "企业白名单-详情", noCache: true },
            },
            {
                name: "resource-buy",
                path: "resource-buy",
                hidden: false,
                component: "resources/resource-buy/index",
                meta: { title: "客户求购", noCache: true },
            },
            {
                name: "resource-buy-detail",
                path: "resource-buy/detail",
                hidden: true,
                component: "resources/resource-buy/detail",
                meta: { title: "客户求购-详情", noCache: true },
            },
            {
                name: "serving-notice",
                path: "serving-notice",
                hidden: false,
                component: "resources/serving-notice/index",
                meta: { title: "送达公告", noCache: true },
            },
            {
                name: "serving-notice-detail",
                path: "serving-notice/detail",
                hidden: true,
                component: "resources/serving-notice/detail",
                meta: { title: "送达公告-详情", noCache: true },
            }
        ],
    },
    // {
    //     name: "Monitor",
    //     path: "/monitor",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: "Layout",
    //     alwaysShow: true,
    //     meta: { title: "系统监控", icon: "monitor", noCache: false },
    //     children: [
    //         {
    //             name: "Online",
    //             path: "online",
    //             hidden: false,
    //             component: "monitor/online/index",
    //             meta: { title: "在线用户", icon: "online", noCache: false },
    //         },
    //         {
    //             name: "Job",
    //             path: "job",
    //             hidden: false,
    //             component: "monitor/job/index",
    //             meta: { title: "定时任务", icon: "job", noCache: false },
    //         },
    //         {
    //             name: "Druid",
    //             path: "druid",
    //             hidden: false,
    //             component: "monitor/druid/index",
    //             meta: { title: "数据监控", icon: "druid", noCache: false },
    //         },
    //         {
    //             name: "Server",
    //             path: "server",
    //             hidden: false,
    //             component: "monitor/server/index",
    //             meta: { title: "服务监控", icon: "server", noCache: false },
    //         },
    //         {
    //             name: "Cache",
    //             path: "cache",
    //             hidden: false,
    //             component: "monitor/cache/index",
    //             meta: { title: "缓存监控", icon: "redis", noCache: false },
    //         },
    //     ],
    // },
    // {
    //     name: "Tool",
    //     path: "/tool",
    //     hidden: false,
    //     redirect: "noRedirect",
    //     component: "Layout",
    //     alwaysShow: true,
    //     meta: { title: "系统工具", icon: "tool", noCache: false },
    //     children: [
    //         {
    //             name: "Build",
    //             path: "build",
    //             hidden: false,
    //             component: "tool/build/index",
    //             meta: { title: "表单构建", icon: "build", noCache: false },
    //         },
    //         {
    //             name: "Gen",
    //             path: "gen",
    //             hidden: false,
    //             component: "tool/gen/index",
    //             meta: { title: "代码生成", icon: "code", noCache: false },
    //         },
    //         {
    //             name: "Swagger",
    //             path: "swagger",
    //             hidden: false,
    //             component: "tool/swagger/index",
    //             meta: { title: "系统接口", icon: "swagger", noCache: false },
    //         },
    //     ],
    // },
    // {
    //     name: "Http://ruoyi.vip",
    //     path: "http://ruoyi.vip",
    //     hidden: false,
    //     component: "Layout",
    //     meta: { title: "若依官网", icon: "guide", noCache: false },
    // },

];

export default new Router({
    mode: "history", // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
});
