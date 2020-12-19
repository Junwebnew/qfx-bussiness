/**
* 操作权限处理
* Copyright (c) 2019 ruoyi
*  let btnPermissions = vnode.context.$route.meta.btnPermissions.split(",");
*/

import store from '@/store'

export default {
    inserted(el, binding, vnode) {
        const { value } = binding
        const all_permission = "*:*:*";

        let permissions = vnode.context.$route.meta.btns,

            rolesIdAll = (store.getters && store.getters.rolesId) < 10  //管理员

        if (!rolesIdAll) {

            if (!permissions || (permissions && permissions.length == 0)) {

                el.parentNode && el.parentNode.removeChild(el)
            }
            else if (value && value instanceof Array && value.length > 0) {
                const permissionFlag = value

                const hasPermissions = permissions.some(permission => {
                    return permissionFlag.includes(permission)
                })

                if (!hasPermissions) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
            else {
                throw new Error(`请设置操作权限标签值`)
            }
        }
    }
}
