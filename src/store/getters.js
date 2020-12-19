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
    userInfo: state => state.user.userInfo,
    organizationId: state => state.user.userInfo.userOrganizationId || '',
    rolesId: state => state.user.rolesId,
    userId: state => state.user.userId,
    superAdmin: state => state.user.superAdmin,
    myMenuList: state => state.user.menuList
}
export default getters
