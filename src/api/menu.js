import request from '@/utils/request'


/**
 * {
 *  memo  菜单描述   (对应 name)
 *  url  菜单页面地址 (对应 path)
 *  isShow  是否显示  (对应 hidden)
 *  viewName  视图名称 (对应 component)
 *  
 *  name  菜单名称  (对应 meta.title)
 *  iconClass: //对应title (对应 meta.icon)
 *  isSaveCache 是否需要保存缓存 (对应 meta.noCache)
 * 
 *  commonStatus //状态,可以为空
 *  parentId  上级菜单
 *  treeVoList 子菜单集合
 * 
 *  没有子集并且有路径
 * }
 * 
 * 
 *  name: "System",
 *  path: "/system",
 *  hidden: false,
 *  redirect: "noRedirect",
 *  component: "Layout",
 *  alwaysShow: true,
 *  meta: { title: "系统管理", icon: "system", noCache: false },
 *  children: [}
 */

export const assRouter = (arr) => {
    var newArr = []
    arr.map(item => {
        let children = null

        if (item.treeVoList && item.treeVoList.length > 0) {
            children = assRouter(item.treeVoList)
        }
        let newObj = {
            name: item.memo,
            path: item.url,
            hidden: !item.isShow,
            component: item.viewName,
            meta: { title: item.name, icon: item.iconClass, noCache: !item.isSaveCache, btns: item.functionList.map(i => i.functionKey), desc: item.ext1 || undefined, unit: item.ext2 || undefined }
        }
        children && (newObj.children = children)
        newArr.push(newObj)
    })
    return newArr
}

// 获取路由
export const getRouters = () => {
    return request({
        url: '/getRouters',
        method: 'get'
    })
}