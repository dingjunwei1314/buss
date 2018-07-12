import { login } from '@/api'
import { getToken, removeToken, setUserId } from '@/utils/auth'
import md5 from '@/utils/md5'
import Cookie from 'js-cookie'

const user = {
  state: {
    token: getToken(),
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, info) => {
      state.userInfo = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = md5(userInfo.password)
      return new Promise((resolve, reject) => {
        login(username, password).then(response => {
          const data = response
          commit('SET_USER_INFO', data)
          setUserId(data.user_id)
          Cookie.set('roleId', data.role_id)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
