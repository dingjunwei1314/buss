import store from '@/store/index'

export default function (code) {
  let authList = store.getters.funcRoles
  return authList.includes(code)
}
