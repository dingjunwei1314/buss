import { constantRouterMap } from '@/router'
import { getInfo } from '@/api'

function hasPermission (codes, route) {
  if (route.meta && route.meta.menuId) {
    return codes.includes(route.meta.menuId)
  } else {
    return true
  }
}

const permission = {
  state: {
    addRouters: [],
    menuRoles: [],
    funcRoles: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = state.addRouters.concat(routers)
    },
    SET_ROLES: (state, roles) => {
      state.menuRoles = roles
    },
    FUNC_ROLES: (state, roles) => {
      state.funcRoles = roles
    }
  },
  actions: {
    GenerateRoutes: ({ commit }, code) => {
      return new Promise(resolve => {
        const accessedRouters = constantRouterMap.filter(v => {
          if (hasPermission(code, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(code, child)) {
                  return child
                }
                return false
              })
              return v
            } else {
              return v
            }
          }
          return false
        })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    // 获取用户信息
    GetInfo: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response
          commit('SET_ROLES', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetFunc: ({ commit, state }, func) => {
      commit('FUNC_ROLES', func)
    }
  }
}

export default permission
