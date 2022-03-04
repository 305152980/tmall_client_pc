// 用户模块

export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // QQ 登录后的回跳地址。
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息。
    setUser (state, userInfo) {
      state.profile = userInfo
    },
    // 修 QQ 登录后的回跳地址。
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
