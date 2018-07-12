import { getCity } from '@/api'
import Cookie from 'js-cookie'

const ticket = {
  state: {
    couponType: '',
    cities: []
  },
  mutations: {
    SET_COUPON_TYPE: (state, type) => {
      state.couponType = type
    },
    SET_CITY: (state, cities) => {
      state.cities = cities
    }
  },
  actions: {
    CouponType: ({ commit }, type) => {
      commit('SET_COUPON_TYPE', type)
    },
    getCity: ({commit}) => {
      const params = {
        role_id: Cookie.get('roleId')
      }
      getCity(params).then((res) => {
        commit('SET_CITY', res)
      })
    }
  }
}

export default ticket
