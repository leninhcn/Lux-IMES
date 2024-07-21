import { login, logout, getInfo, oauthCallback } from '@/api/system/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import useTagsViewStore from './tagsView'
import defAva from '@/assets/images/profile.jpg'
import cache from '@/plugins/cache'
import crypto from 'crypto-js'
import md5 from 'crypto-js/md5'

const keyGen = (salt) => {
  const key = crypto.enc.Latin1.parse('1b3d5f7h9j2l4n6p8r0t1v2x3z').concat(salt)

  const h1 = md5(key).toString()
  const h2 = md5(crypto.enc.Hex.parse(h1).concat(key)).toString()
  const h3 = md5(crypto.enc.Hex.parse(h2).concat(key))
  const fk = crypto.enc.Hex.parse(h1).concat(crypto.enc.Hex.parse(h2))
  const iv = h3

  return { fk, iv }
}

const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: '',
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    userId: 0,
    authSource: '',
    userName: '',
    clientId: cache.local.get('clientId'),
    site:'',
  }),
  actions: {
    setAuthSource(source) {
      this.authSource = source
    },
    // 登录
    login(userInfo) {
      const site = userInfo.site
      const username = userInfo.username.trim()

      const salt = crypto.lib.WordArray.random(6)
      const { fk, iv } = keyGen(salt)

      const password = crypto.AES.encrypt(userInfo.password, fk, {
        iv: iv,
      }).toString()


      // const password = md5(userInfo.password).toString()
      const code = userInfo.code
      const uuid = userInfo.uuid
      const clientId = this.clientId

      return new Promise((resolve, reject) => {
        login(site, username, password, code, uuid, clientId, salt.toString(crypto.enc.Base64))
          .then((res) => {
            if (res.code == 200) {
              setToken(res.data)
              this.token = res.data
              resolve() //then处理
            } else {
              console.log('login error ', res)
              reject(res) //catch处理
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * 三方授权登录
     * @param {*} data
     * @param {*} param { authSource : ''}
     * @returns
     */
    oauthLogin(data, param) {
      return new Promise((resolve, reject) => {
        oauthCallback(data, param)
          .then((res) => {
            const { code, data } = res
            if (code == 200) {
              setToken(data.token)
              this.token = data.token
              // Cookies.set('username', data.userName, { expires: 30 })
              // Cookies.set('password', encrypt(data.password), { expires: 30 })
              // Cookies.set('rememberMe', true, { expires: 30 })
              resolve(res) //then处理
            } else {
              console.log('login error ', res)
              reject(res) //catch处理
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 扫码登录
    scanLogin(data) {
      return new Promise((resolve, reject) => {
        setToken(data.token)
        this.token = data.token
        resolve(data.token) //then处理
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const data = res.data
            const avatar = data.user.avatar == '' ? defAva : data.user.avatar
            if (data.roles && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = data.roles
              this.permissions = data.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = data.user.nickName
            this.avatar = avatar
            this.userInfo = data.user //新加
            this.userId = data.user.userId //新加
            this.userName = data.user.userName //新加
            this.site=data.user.site//增加厂区
            resolve(res)
          })
          .catch((error) => {
            console.warn(error)
            reject('获取用户信息失败')
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise((resolve, reject) => {
        logout(this.token)
          .then((res) => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            useTagsViewStore().visitedViews = []
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 前端 登出
    fedLogOut() {
      return new Promise((resolve) => {
        this.token = ''
        removeToken()
        resolve()
      })
    },
    setClientId(clientId) {
      this.clientId = clientId
      cache.local.set('clientId', clientId)
    },
    refreshToken(token) {
      setToken(token)
      this.token = token
    }
  }
})
export default useUserStore
