import { constantRoutes, asyncAllRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView';
import ResourseLayout from '@/layout/resourseLayout';

const permission = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit }, params) {
            return new Promise(resolve => {

                var accessedRoutes = []

                if (params.menuList) {

                    // console.log('子账号')
                    accessedRoutes = filterAsyncRouter(params.menuList)

                }
                else {

                    // console.log('主账号和管理员')

                    accessedRoutes = filterAsyncRouter(asyncAllRoutes)


                }
                //暂时写在前端
                // const accessedRoutes = filterAsyncRouter(asyncAllRoutes)
                accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)

                // 向后端请求路由数据
                // getRouters().then(res => {
                //   const accessedRoutes = filterAsyncRouter(res.data)
                //   accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
                //   commit('SET_ROUTES', accessedRoutes)
                //   resolve(accessedRoutes)
                // })
            })
        }
    }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        if (route.component) {
            // Layout ParentView 组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            }
            else if (route.component === 'ResourseLayout') {
                route.component = ResourseLayout
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
}

export const loadView = (view) => { // 路由懒加载
    return (resolve) => require([`@/views/${view}`], resolve)
}

export default permission
