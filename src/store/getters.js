const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permissions: state => state.user.permissions,
    permission_routes: state => state.permission.routes,
    //用户信息
    userInfo: state => state.user.userInfo,
    //是否有管理权限
    whetherAdmin: state => state.user.userInfo.whetherAdmin === 1,
    //部门ID
    organizationId: state => state.user.userInfo.userOrganizationId || '',
    //角色ID
    rolesId: state => state.user.rolesId,
    //用户ID
    userId: state => state.user.userId,
    //是否主账号
    mainAccount: state => state.user.userInfo.accountType === 0,
    //是否管理员
    superAdmin: state => state.user.superAdmin,
    myMenuList: state => state.user.menuList
}
export default getters
