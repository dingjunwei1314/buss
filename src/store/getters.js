const getters = {
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.tagsView.visitedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    menuRoles: state => state.permission.menuRoles,
    funcRoles: state => state.permission.funcRoles,
    addRouters: state => state.permission.addRouters,
    // ticket
    couponType: state => state.ticket.couponType,
    cities: state => state.ticket.cities,
    // action
    counter: state => state.action.counter
}
export default getters