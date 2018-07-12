import { searchRechargeReason, searchUserRechargeType } from '@/api'

const select = {
  state: {
    rechargeReason: [],
    rechargeType: []
  },
  mutations: {
    SET_RECHARGE_REASON: (state, rechargeReason) => {
      state.rechargeReason = rechargeReason
    },
    SET_RECHARGE_TYPE: (state, rechargeType) => {
      state.rechargeType = rechargeType
    }
  },
  actions: {
    SetRechargeReason ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.rechargeReason && state.rechargeReason.length > 0) {
          resolve(state.rechargeReason)
        } else {
          searchRechargeReason({}).then(response => {
            const data = response
            if (data.status === 200) {
              commit('SET_RECHARGE_REASON', data.attachment)
              resolve(data.attachment)
            } else {
              resolve([])
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    SetRechargeType ({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.rechargeType && state.rechargeType.length > 0) {
          resolve(state.rechargeType)
        } else {
          searchUserRechargeType({}).then(response => {
            const data = response
            if (data.status === 200) {
              commit('SET_RECHARGE_TYPE', data.attachment)
              resolve(data.attachment)
            } else {
              resolve([])
            }
          }).catch(error => {
            reject(error)
          })
        }
      })
    }
  }
}

export default select
